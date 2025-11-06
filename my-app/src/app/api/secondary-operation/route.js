import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // make sure this returns MySQL connection

// POST - create new record
export async function POST(req) {
  try {
    const body = await req.json();
    const { date, coreCSKDone, coreVisualDone, magneticDrill, magneticVisual, pivotPin } = body;

    if (!date) {
      return NextResponse.json({ message: "Date required" }, { status: 400 });
    }

    const conn = await getConnection();

    const sql = `
      INSERT INTO SecondaryOperation
      (Date, CoreCSKDone, CoreVisualDone, MagneticDrill, MagneticVisual, PivotPin)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await conn.execute(sql, [
      date,
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

// Utility: Check if record is within 30 days
function isWithin30Days(dateStr) {
  const recordDate = new Date(dateStr);
  const now = new Date();
  const diff = (now - recordDate) / (1000 * 60 * 60 * 24);
  return diff <= 30;
}

// ✅ GET (with pagination)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const conn = await getConnection();

    let sql = "SELECT * FROM SecondaryOperation WHERE 1=1";
    const params = [];

    if (date) {
      sql += " AND DATE(Date) = ?";
      params.push(date);
    }

    // ✅ Inject limit/offset directly — no placeholders
    sql += ` ORDER BY Date DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await conn.execute(sql, params);

    const [[{ total }]] = await conn.execute(
      "SELECT COUNT(*) AS total FROM SecondaryOperation"
    );

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({ success: true, data: rows, totalPages });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

// ✅ PUT (Update record, restrict >30 days)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, date, coreCSKDone, coreVisualDone, magneticDrill, magneticVisual, pivotPin } = body;

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    if (!isWithin30Days(date)) {
      return NextResponse.json(
        { success: false, message: "Edit not allowed after 30 days." },
        { status: 403 }
      );
    }

    const conn = await getConnection();

    const sql = `
      UPDATE SecondaryOperation SET
        CoreCSKDone = ?, CoreVisualDone = ?,
        MagneticDrill = ?, MagneticVisual = ?, PivotPin = ?
      WHERE Id = ?
    `;

    await conn.execute(sql, [
      coreCSKDone || 0,
      coreVisualDone || 0,
      magneticDrill || 0,
      magneticVisual || 0,
      pivotPin || 0,
      id
    ]);

    return NextResponse.json({ success: true, message: "Record updated successfully" });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

// ✅ DELETE (Delete record, restrict >30 days)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    const conn = await getConnection();

    const [[record]] = await conn.execute("SELECT Date FROM SecondaryOperation WHERE Id = ?", [id]);
    if (!record)
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });

    if (!isWithin30Days(record.Date)) {
      return NextResponse.json(
        { success: false, message: "Delete not allowed after 30 days." },
        { status: 403 }
      );
    }

    await conn.execute("DELETE FROM SecondaryOperation WHERE Id = ?", [id]);
    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}

