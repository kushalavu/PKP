import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
    try {
        const connection = await getConnection();
        // Select id, name, and location
        const [companies] = await connection.query('SELECT id, name, location FROM companies');
        return NextResponse.json(companies);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
