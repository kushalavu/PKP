// /api/new-requirement-filters.js
import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = await getConnection();

    const [parts] = await pool.query('SELECT DISTINCT PartName FROM NewRequirements');
    const [materials] = await pool.query('SELECT DISTINCT RawMaterial FROM NewRequirements');
    const [drawings] = await pool.query('SELECT DISTINCT RawMaterialDrawing FROM NewRequirements');
    const [industries] = await pool.query('SELECT DISTINCT RawMaterialCompany FROM NewRequirements');

    return NextResponse.json({
      success: true,
      filters: {
        parts: parts.map(p => p.PartName),
        materials: materials.map(m => m.RawMaterial),
        drawings: drawings.map(d => d.RawMaterialDrawing),
        industries: industries.map(i => i.RawMaterialCompany),
      }
    });
  } catch (err) {
    console.error('Filter GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}
