import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// GET and POST handler
export async function POST(req) {
  try {
    const data = await req.json();
    const {
      partName,
      date,
      rawMaterial,
      rawMaterialSize,
      rawMaterialCompany,
      rawMaterialDrawing,
      fileBase64,
      fileName
    } = data;

    if (!partName || !date || !rawMaterial || !rawMaterialSize || !rawMaterialCompany || !rawMaterialDrawing || !fileBase64 || !fileName) {
      return NextResponse.json({ success: false, message: 'All fields including file are required' }, { status: 400 });
    }

    // Save file
    const uploadsDir = path.join(process.cwd(), '/public/uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, fileBase64.replace(/^data:.*;base64,/, ''), 'base64');

    // Insert into DB
    const pool = await getConnection();
    const sql = `
      INSERT INTO NewRequirements
      (PartName, Date, RawMaterial, RawMaterialSize, RawMaterialCompany, RawMaterialDrawing, FileUpload)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [partName, date, rawMaterial, rawMaterialSize, rawMaterialCompany, rawMaterialDrawing, `/uploads/${fileName}`];
    const [result] = await pool.query(sql, values);

    if (!result.insertId) {
      return NextResponse.json({ success: false, message: 'Failed to insert record into database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Requirement submitted successfully', id: result.insertId }, { status: 200 });

  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM NewRequirements ORDER BY Date DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}