import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // make sure this returns MySQL connection

// POST - create new record
export async function POST(req) {
  try {
    const body = await req.json();
    const { date, partName, coreCSKDone, coreVisualDone, magneticDrill, magneticVisual, pivotPin } = body;

    if (!date || !partName) {
      return NextResponse.json({ message: "Date & Part Name required" }, { status: 400 });
    }

    const conn = await getConnection();

    const sql = `
      INSERT INTO SecondaryOperation
      (Date, PartName, CoreCSKDone, CoreVisualDone, MagneticDrill, MagneticVisual, PivotPin)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await conn.execute(sql, [
      date,
      partName,
      coreCSKDone || 0,
      coreVisualDone || 0,
      magneticDrill || 0,
      magneticVisual || 0,
      pivotPin || 0
    ]);

    return NextResponse.json({ message: "Secondary operation submitted successfully" }, { status: 201 });

  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

// GET - fetch records
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const partName = searchParams.get("partName");

    const conn = await getConnection();

    let sql = "SELECT * FROM SecondaryOperation WHERE 1=1";
    const params = [];

    if (date) {
      sql += " AND Date = ?";
      params.push(date);
    }

    if (partName) {
      sql += " AND PartName LIKE ?";
      params.push(`%${partName}%`);
    }

    const [rows] = await conn.execute(sql, params);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PUT - update record
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, date, partName, coreCSKDone, coreVisualDone, magneticDrill, magneticVisual, pivotPin } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const conn = await getConnection();

    const sql = `
      UPDATE SecondaryOperation SET
        Date = ?,
        PartName = ?,
        CoreCSKDone = ?,
        CoreVisualDone = ?,
        MagneticDrill = ?,
        MagneticVisual = ?,
        PivotPin = ?
      WHERE Id = ?
    `;

    await conn.execute(sql, [
      date,
      partName,
      coreCSKDone || 0,
      coreVisualDone || 0,
      magneticDrill || 0,
      magneticVisual || 0,
      pivotPin || 0,
      id
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE - delete record
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const conn = await getConnection();
    await conn.execute("DELETE FROM SecondaryOperation WHERE Id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
