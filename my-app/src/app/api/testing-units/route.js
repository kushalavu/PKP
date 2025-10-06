import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // MySQL pool connection

// POST: Insert new TestingUnit
export async function POST(req) {
  try {
    const data = await req.json();
    const { date, partName, osmNumber, accepted, rejected, total } = data;

    if (!date || !partName || !osmNumber) {
      return NextResponse.json(
        { message: 'Date, Part Name, and OSM Number are required' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const sql = `
      INSERT INTO TestingUnits (Date, PartName, OSMNumber, Accepted, Rejected, Total)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      date,
      partName,
      osmNumber,
      accepted || 0,
      rejected || 0,
      total || 0
    ];

    const [result] = await pool.query(sql, values);

    return NextResponse.json(
      { message: 'Testing Unit submitted successfully', id: result.insertId },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}

// GET: Fetch TestingUnits with optional filters
export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const date = searchParams.get('date'); // YYYY-MM-DD
    const partName = searchParams.get('partName');

    const pool = await getConnection();

    let sql = 'SELECT * FROM TestingUnits WHERE 1=1';
    const values = [];

    if (date) { sql += ' AND DATE(Date) = ?'; values.push(date); }
    if (partName) { sql += ' AND PartName = ?'; values.push(partName); }

    const [rows] = await pool.query(sql, values);

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}

// PUT: Update TestingUnits
export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, accepted, rejected, total } = data;

    if (!id) {
      return NextResponse.json({ message: 'Id is required' }, { status: 400 });
    }

    const pool = await getConnection();
    const sql = 'UPDATE TestingUnits SET Accepted=?, Rejected=?, Total=? WHERE Id=?';
    const values = [accepted, rejected, total, id];

    await pool.query(sql, values);

    return NextResponse.json({ message: 'Updated successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Update failed', error: err.message }, { status: 500 });
  }
}

// DELETE: Delete TestingUnit
export async function DELETE(req) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Id required' }, { status: 400 });

    const pool = await getConnection();
    const sql = 'DELETE FROM TestingUnits WHERE Id = ?';
    await pool.query(sql, [id]);

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Delete failed', error: err.message }, { status: 500 });
  }
}
