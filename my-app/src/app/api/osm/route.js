import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    // Select only the osm_number column
    const [rows] = await connection.execute('SELECT osm_number FROM osm_numbers');
    
    // Return as JSON
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching OSM numbers:', error);
    return NextResponse.json({ message: 'Error fetching OSM numbers' }, { status: 500 });
  }
}
