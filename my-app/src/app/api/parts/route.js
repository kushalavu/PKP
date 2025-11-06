import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    const conn = await getConnection();

    let query = 'SELECT id, part_name, drawing_no FROM parts';
    let params = [];

    if (companyId) {
      query += ' WHERE company_id = ?';
      params.push(companyId);
    }

    const [parts] = await conn.execute(query, params);

    return NextResponse.json(parts); // Always returns [{id, part_name, drawing_no}, ...]
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
