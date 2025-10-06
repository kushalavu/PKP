import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // MySQL connection pool

// GET all notes
export async function GET() {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT * FROM Notes ORDER BY Date DESC');

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'No notes found', data: [] });
    }

    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET Notes Error:', err);
    return NextResponse.json({ success: false, message: err.message, data: [] }, { status: 500 });
  }
}

// POST - create new note
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.date || !body.note) {
      return NextResponse.json({ success: false, message: 'Date and Note are required' }, { status: 400 });
    }

    const pool = await getConnection();
    const [result] = await pool.execute(
      'INSERT INTO Notes (Date, ForPlating, Note) VALUES (?, ?, ?)',
      [body.date, body.forPlating || '', body.note]
    );

    const [newRow] = await pool.query('SELECT * FROM Notes WHERE Id = ?', [result.insertId]);
    return NextResponse.json({ success: true, message: 'Note created successfully', data: newRow[0] });
  } catch (err) {
    console.error('POST Notes Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
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
