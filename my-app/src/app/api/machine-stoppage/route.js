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

// ✅ POST new record
export async function POST(request) {
  try {
    const body = await request.json();

    // 🔹 Validate
    const validationError = validateBody(body, ["date"]);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    const [result] = await pool.query(
      `INSERT INTO MachineStoppage 
       (Date, MachinesAllotted, Running, NotRunning, UnderSetting, Maintenance, Remarks, NewProcess)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.date,
        Number(body.machinesAllotted) || 0,
        Number(body.running) || 0,
        Number(body.notRunning) || 0,
        Number(body.underSetting) || 0,
        body.maintenance || null,
        body.remarks || null,
        body.newProcess || null,
      ]
    );

    // ✅ Return the inserted row with formatted date
    const [newRow] = await pool.query(
      `SELECT 
         Id,
         DATE_FORMAT(Date, '%d-%m-%Y') AS Date,
         MachinesAllotted,
         Running,
         NotRunning,
         UnderSetting,
         Maintenance,
         Remarks,
         NewProcess
       FROM MachineStoppage
       WHERE Id = ?`,
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: "Record inserted successfully",
      data: newRow[0],
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to insert record", details: err.message },
      { status: 500 }
    );
  }
}


// Helper: check if date is within 30 days
function isWithin30Days(dateStr) {
  const recordDate = new Date(dateStr);
  const now = new Date();
  return (now - recordDate) / (1000 * 60 * 60 * 24) <= 30;
}

// ✅ GET with pagination
export async function GET(request) {
  let connection;
  try {
    connection = await getConnection();
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    // ✅ Format date to 'YYYY-MM-DD' before sending
    let query = `
      SELECT 
        Id, 
        DATE_FORMAT(Date, '%Y-%m-%d') AS Date,
        MachinesAllotted,
        Running,
        NotRunning,
        UnderSetting,
        Maintenance,
        Remarks,
        NewProcess
      FROM MachineStoppage
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      query += " AND Date = ?";
      params.push(date);
    }

    // Count total
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM MachineStoppage 
      WHERE 1=1 ${date ? "AND Date = ?" : ""}
    `;
    const countParams = date ? [date] : [];
    const [countResult] = await connection.execute(countQuery, countParams);
    const total = countResult[0].total;
    const pages = Math.ceil(total / limit);

    query += ` ORDER BY Date DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await connection.execute(query, params);

    return NextResponse.json({ success: true, data: rows, total, pages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


// ✅ PUT (update with 30-day restriction)
export async function PUT(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    // First, fetch the record to check date
    const [existing] = await pool.query("SELECT Date FROM MachineStoppage WHERE Id=?", [body.id]);
    if (!existing.length) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    if (!isWithin30Days(existing[0].Date)) {
      return NextResponse.json({ success: false, message: "You can only edit records from the last 30 days." }, { status: 403 });
    }

    const [result] = await pool.query(
      `UPDATE MachineStoppage
       SET MachinesAllotted=?, Running=?, NotRunning=?, 
           UnderSetting=?, Maintenance=?, Remarks=?, NewProcess=?
       WHERE Id=?`,
      [
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

    return NextResponse.json({ success: true, message: "Record updated" });
  } catch (err) {
    console.error("Error updating MachineStoppage:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update record", details: err.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE (delete with 30-day restriction)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "Id is required" }, { status: 400 });

    const pool = await getConnection();

    // Check date before deleting
    const [existing] = await pool.query("SELECT Date FROM MachineStoppage WHERE Id=?", [id]);
    if (!existing.length) return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });

    if (!isWithin30Days(existing[0].Date)) {
      return NextResponse.json({ success: false, message: "You can only delete records from the last 30 days." }, { status: 403 });
    }

    const [result] = await pool.query("DELETE FROM MachineStoppage WHERE Id=?", [id]);

    return NextResponse.json({ success: true, message: "Record deleted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to delete record", details: err.message },
      { status: 500 }
    );
  }
}
