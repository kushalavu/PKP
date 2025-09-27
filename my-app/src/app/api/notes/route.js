import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET all notes
export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Notes ORDER BY Date DESC');
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error('GET Notes Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - create new note
export async function POST(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    const result = await pool.request()
      .input('Date', body.date)
      .input('ForPlating', body.forPlating || '')
      .input('Note', body.note)
      .query(`
        INSERT INTO Notes (Date, ForPlating, Note)
        OUTPUT INSERTED.*
        VALUES (@Date, @ForPlating, @Note)
      `);

    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('POST Notes Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - update a note
export async function PUT(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    const result = await pool.request()
      .input('Id', body.id)
      .input('Date', body.date)
      .input('ForPlating', body.forPlating || '')
      .input('Note', body.note)
      .query(`
        UPDATE Notes
        SET Date=@Date, ForPlating=@ForPlating, Note=@Note, UpdatedAt=GETDATE()
        OUTPUT INSERTED.*
        WHERE Id=@Id
      `);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('PUT Notes Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - delete a note
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', id)
      .query('DELETE FROM Notes WHERE Id=@Id');

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE Notes Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
