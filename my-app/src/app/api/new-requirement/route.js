import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const data = await req.json();
    const { partName, date, rawMaterial, rawMaterialSize, rawMaterialCompany, rawMaterialDrawing, fileBase64, fileName } = data;

    if (!partName || !date || !rawMaterial || !rawMaterialSize || !rawMaterialCompany || !rawMaterialDrawing || !fileBase64) {
      return NextResponse.json({ message: 'All fields including file are required' }, { status: 400 });
    }

    // Save file to /public/uploads
    const base64Data = fileBase64.replace(/^data:.*;base64,/, '');
    const uploadsDir = path.join(process.cwd(), '/public/uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Save to DB
    const pool = await getConnection();
    await pool.request()
      .input('partName', partName)
      .input('date', date)
      .input('rawMaterial', rawMaterial)
      .input('rawMaterialSize', rawMaterialSize)
      .input('rawMaterialCompany', rawMaterialCompany)
      .input('rawMaterialDrawing', rawMaterialDrawing)
      .input('fileUpload', `/uploads/${fileName}`)
      .query(`
        INSERT INTO NewRequirements 
        (PartName, Date, RawMaterial, RawMaterialSize, RawMaterialCompany, RawMaterialDrawing, FileUpload)
        VALUES 
        (@partName, @date, @rawMaterial, @rawMaterialSize, @rawMaterialCompany, @rawMaterialDrawing, @fileUpload)
      `);

    return NextResponse.json({ message: 'Requirement submitted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
