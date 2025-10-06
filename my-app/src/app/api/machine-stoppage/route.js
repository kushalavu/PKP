import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ Utility: Validate required fields
function validateBody(body, requiredFields = []) {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `${field} is required`;
    }
  }
  return null;
}

// ✅ GET all records
export async function GET() {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM MachineStoppage ORDER BY Date DESC");

    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch records", details: err.message },
      { status: 500 }
    );
  }
}

// ✅ POST new record
export async function POST(request) {
  try {
    const body = await request.json();

    // 🔹 Validate
    const validationError = validateBody(body, ["date", "part"]);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const pool = await getConnection();

    await pool.query(
      `INSERT INTO MachineStoppage 
       (Date, Part, MachinesAllotted, Running, NotRunning, UnderSetting, Maintenance, Remarks, NewProcess)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.date,
        body.part,
        Number(body.machinesAllotted) || 0,
        Number(body.running) || 0,
        Number(body.notRunning) || 0,
        Number(body.underSetting) || 0,
        body.maintenance || null,
        body.remarks || null,
        body.newProcess || null,
      ]
    );

    return NextResponse.json({ success: true, message: "Record inserted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to insert record", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    // Removed validation for id, date, part

    const pool = await getConnection();
    const [result] = await pool.query(
      `UPDATE MachineStoppage
       SET Date=?, Part=?, MachinesAllotted=?, Running=?, NotRunning=?, 
           UnderSetting=?, Maintenance=?, Remarks=?, NewProcess=?
       WHERE Id=?`,
      [
        body.date,
        body.part,
        Number(body.machinesAllotted) || 0,
        Number(body.running) || 0,
        Number(body.notRunning) || 0,
        Number(body.underSetting) || 0,
        body.maintenance || null,
        body.remarks || null,
        body.newProcess || null,
        body.id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Record updated" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update record", details: err.message },
      { status: 500 }
    );
  }
}


// ✅ DELETE (Delete by ID)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Id is required" }, { status: 400 });
    }

    const pool = await getConnection();
    const [result] = await pool.query("DELETE FROM MachineStoppage WHERE Id=?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Record deleted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to delete record", details: err.message },
      { status: 500 }
    );
  }
}
