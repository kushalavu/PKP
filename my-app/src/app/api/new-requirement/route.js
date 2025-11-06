import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import fs from 'fs';
import path from 'path';


export async function POST(req) {
  try {
    const data = await req.json();
    const {
      customer,
      customerLocation,
      partName,
      date,
      rawMaterial,
      rawMaterialSize,
      rawMaterialCompany,
      rawMaterialDrawing,
      fileBase64,
      fileName,
      drawingNo // <- Add this to support parts table
    } = data;

    // ✅ Validate required fields
    if (
      !customer ||
      !customerLocation ||
      !partName ||
      !date ||
      !rawMaterial ||
      !rawMaterialSize ||
      !rawMaterialCompany ||
      !rawMaterialDrawing
    ) {
      return NextResponse.json(
        { success: false, message: 'All fields except file are required' },
        { status: 400 }
      );
    }

    let filePath = null;

    // ✅ Save file only if provided
    if (fileBase64 && fileName) {
      const uploadsDir = path.join(process.cwd(), '/public/uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, fileBase64.replace(/^data:.*;base64,/, ''), 'base64');
      filePath = `/uploads/${fileName}`;
    }

    const pool = await getConnection();

    // ✅ Step 1: Find or Insert Company
    const [companyRows] = await pool.query(
      'SELECT id FROM companies WHERE name = ? AND location = ?',
      [customer, customerLocation]
    );

    let companyId;
    if (companyRows.length > 0) {
      companyId = companyRows[0].id;
    } else {
      const [companyResult] = await pool.query(
        'INSERT INTO companies (name, location) VALUES (?, ?)',
        [customer, customerLocation]
      );
      companyId = companyResult.insertId;
    }

    // ✅ Step 2: Find or Insert Part
    if (drawingNo) {
      const [partRows] = await pool.query(
        'SELECT id FROM parts WHERE company_id = ? AND part_name = ? AND drawing_no = ?',
        [companyId, partName, drawingNo]
      );

      if (partRows.length === 0) {
        await pool.query(
          'INSERT INTO parts (company_id, part_name, drawing_no, item_code) VALUES (?, ?, ?, ?)',
          [companyId, partName, drawingNo, null] // Add itemCode if available
        );
      }
    }

    // ✅ Step 3: Insert into newrequirements table
    const [result] = await pool.query(
      `INSERT INTO newrequirements 
       (Customer, CustomerLocation, PartName, Date, RawMaterial, RawMaterialSize, RawMaterialCompany, RawMaterialDrawing, FileUpload) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer,
        customerLocation,
        partName,
        date,
        rawMaterial,
        rawMaterialSize,
        rawMaterialCompany,
        rawMaterialDrawing,
        filePath
      ]
    );

    if (!result.insertId) {
      return NextResponse.json(
        { success: false, message: 'Failed to insert record into newrequirements' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Requirement submitted successfully', id: result.insertId },
      { status: 200 }
    );

  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);

    const date = searchParams.get('date'); // YYYY-MM-DD
    const part = searchParams.get('part');
    const material = searchParams.get('material');
    const drawing = searchParams.get('drawing');
    const industry = searchParams.get('industry');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    // Base query
    let query = "SELECT * FROM NewRequirements WHERE 1=1";
    const params = [];

    if (date) {
      query += " AND Date = ?";
      params.push(date);
    }
    if (part) {
      query += " AND PartName = ?";
      params.push(part);
    }
    if (material) {
      query += " AND RawMaterial = ?";
      params.push(material);
    }
    if (drawing) {
      query += " AND RawMaterialDrawing = ?";
      params.push(drawing);
    }
    if (industry) {
      query += " AND RawMaterialCompany = ?";
      params.push(industry);
    }

    // Total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) AS countTable`;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;
    const pages = Math.ceil(total / limit);

    // Add LIMIT & OFFSET
    query += ` ORDER BY Date DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await pool.execute(query, params);

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      pages,
      page
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}