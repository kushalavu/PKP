import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(req) {
  try {
    const data = await req.json();
    const { date, partName, osmNumber, accepted, rejected, total } = data;

    // Validate required fields
    if (!date || !partName || !osmNumber) {
      return NextResponse.json(
        { message: 'Date, Part Name, and OSM Number are required' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    await pool.request()
      .input('date', date)
      .input('partName', partName)
      .input('osmNumber', osmNumber)
      .input('accepted', accepted || 0)
      .input('rejected', rejected || 0)
      .input('total', total || 0)
      .query(`
        INSERT INTO TestingUnits
        (Date, PartName, OSMNumber, Accepted, Rejected, Total)
        VALUES
        (@date, @partName, @osmNumber, @accepted, @rejected, @total)
      `);

    return NextResponse.json(
      { message: 'Testing Unit submitted successfully' },
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
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');        // YYYY-MM-DD
    const partName = searchParams.get('partName');

    const pool = await getConnection();
    let query = 'SELECT * FROM TestingUnits WHERE 1=1';
    
    if (date) query += ` AND CAST(Date AS DATE) = @date`;
    if (partName) query += ` AND PartName = @partName`;

    const request = pool.request();
    if (date) request.input('date', date);
    if (partName) request.input('partName', partName);

    const result = await request.query(query);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, accepted, rejected, total } = data;

    const pool = await getConnection();
    await pool.request()
      .input('id', id)
      .input('accepted', accepted)
      .input('rejected', rejected)
      .input('total', total)
      .query('UPDATE TestingUnits SET Accepted=@accepted, Rejected=@rejected, Total=@total WHERE Id=@id');

    return NextResponse.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Update failed', error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Id required' }, { status: 400 });

    const pool = await getConnection();
    await pool.request()
      .input('id', id)
      .query('DELETE FROM TestingUnits WHERE Id=@id');

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Delete failed', error: err.message }, { status: 500 });
  }
}
