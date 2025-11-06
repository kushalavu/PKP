import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(request) {
  try {
    const connection = await getConnection();
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // 🔹 Keep sorting by real date, not formatted string
    let query = `
      SELECT 
        Id, 
        DATE_FORMAT(Date, '%d-%m-%Y') AS Date, 
        ForPlating, 
        Note 
      FROM Notes 
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      query += " AND Date = ?";
      params.push(date);
    }

    // 🔹 ORDER by actual date column (not formatted)
    query += ` ORDER BY Notes.Date DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await connection.execute(query, params);

    // Pagination count
    let countQuery = "SELECT COUNT(*) as total FROM Notes WHERE 1=1";
    const countParams = [];
    if (date) {
      countQuery += " AND Date = ?";
      countParams.push(date);
    }
    const [countResult] = await connection.execute(countQuery, countParams);
    const total = countResult[0].total;

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      pages: Math.ceil(total / limit),
      page
    });

  } catch (err) {
    console.error("GET Notes Error:", err);
    return NextResponse.json(
      { success: false, message: err.message, data: [] },
      { status: 500 }
    );
  }
}


// POST - create new note
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.date || !body.note) {
      return NextResponse.json(
        { success: false, message: 'Date and Note are required' },
        { status: 400 }
      );
    }

    // Ensure date is in "YYYY-MM-DD" format
    const dateOnly = body.date.split('T')[0];

    const pool = await getConnection();

    // Insert note into DB
    const [result] = await pool.execute(
      'INSERT INTO Notes (Date, ForPlating, Note) VALUES (?, ?, ?)',
      [dateOnly, body.forPlating || '', body.note]
    );

    // Fetch the newly created note, with Date formatted as string
    const [newRow] = await pool.query(
      'SELECT Id, DATE_FORMAT(Date, "%Y-%m-%d") AS Date, ForPlating, Note FROM Notes WHERE Id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: 'Note created successfully',
      data: newRow[0], // Date will now be "YYYY-MM-DD"
    });
  } catch (err) {
    console.error('POST Notes Error:', err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// PUT - update a note
export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id || !body.date || !body.note) {
      return NextResponse.json({ success: false, message: 'Id, Date, and Note are required' }, { status: 400 });
    }

    const pool = await getConnection();
    const [result] = await pool.execute(
      'UPDATE Notes SET Date=?, ForPlating=?, Note=?, UpdatedAt=NOW() WHERE Id=?',
      [body.date, body.forPlating || '', body.note, body.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    }

    const [updatedRow] = await pool.query('SELECT * FROM Notes WHERE Id=?', [body.id]);
    return NextResponse.json({ success: true, message: 'Note updated successfully', data: updatedRow[0] });
  } catch (err) {
    console.error('PUT Notes Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE - delete a note
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Id is required' }, { status: 400 });
    }

    const pool = await getConnection();
    const [result] = await pool.execute('DELETE FROM Notes WHERE Id=?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Note deleted successfully' });
  } catch (err) {
    console.error('DELETE Notes Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
