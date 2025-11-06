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

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;

    const date = searchParams.get('date');          // YYYY-MM-DD
    const partName = searchParams.get('partName');  
    const osmNumber = searchParams.get('osmNumber');
    const status = searchParams.get('status');      // Accepted / Rejected
    const deleted = searchParams.get('deleted');    // Yes / No
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const pool = await getConnection();

    let sql = 'SELECT * FROM TestingUnits WHERE 1=1';
    const values = [];

    if (date) { 
      sql += ' AND DATE(Date) = ?'; 
      values.push(date); 
    }
    if (partName) { 
      sql += ' AND PartName = ?'; 
      values.push(partName); 
    }
    if (osmNumber) { 
      sql += ' AND OSMNumber = ?'; 
      values.push(osmNumber); 
    }
    if (status) {
      if (status.toLowerCase() === 'accepted') sql += ' AND Accepted > 0';
      else if (status.toLowerCase() === 'rejected') sql += ' AND Rejected > 0';
    }
    if (deleted) {
      if (deleted.toLowerCase() === 'yes') sql += ' AND Deleted = 1';
      else if (deleted.toLowerCase() === 'no') sql += ' AND Deleted = 0';
    }

    // Count total for pagination
    const [countRows] = await pool.query(
      'SELECT COUNT(*) as total FROM (' + sql + ') AS t', 
      values
    );
    const totalRecords = countRows[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Add pagination
    sql += ' ORDER BY Date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.query(sql, values);

    return NextResponse.json({
      success: true,
      message: 'Fetched testing units successfully',
      data: {
        items: rows,
        totalRecords,
        totalPages,
        currentPage: page
      }
    }, { status: 200 });

  } catch (err) {
    console.error('Testing Units Error:', err);
    // Server-side errors return 500
    return NextResponse.json({
      success: false,
      message: 'Server error',
      data: null,
      error: err.message
    }, { status: 500 });
  }
}

// Helper function to check if date is within 30 days
function isWithin30Days(dateString) {
  const recordDate = new Date(dateString);
  const now = new Date();
  const diffTime = now - recordDate; // difference in ms
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
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

    // Fetch the record date first
    const [rows] = await pool.query('SELECT Date FROM TestingUnits WHERE Id=?', [id]);
    if (!rows.length) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 });
    }

    const recordDate = rows[0].Date;
    if (!isWithin30Days(recordDate)) {
      return NextResponse.json({ message: 'Time limit is complete. Editing not allowed.' }, { status: 403 });
    }

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

    // Fetch the record date first
    const [rows] = await pool.query('SELECT Date FROM TestingUnits WHERE Id=?', [id]);
    if (!rows.length) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 });
    }

    const recordDate = rows[0].Date;
    if (!isWithin30Days(recordDate)) {
      return NextResponse.json({ message: 'Time limit is complete. Deletion not allowed.' }, { status: 403 });
    }

    const sql = 'DELETE FROM TestingUnits WHERE Id = ?';
    await pool.query(sql, [id]);

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Delete failed', error: err.message }, { status: 500 });
  }
}
