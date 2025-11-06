import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const partName = searchParams.get("partName");
    const customer = searchParams.get("customer");

    const pool = await getConnection();
    let query = "SELECT * FROM PresentDayDispatch WHERE 1=1";
    const params = [];

    if (date) {
      query += " AND DATE(Date) = ?";
      params.push(date);
    }
    if (partName) {
      query += " AND PartName LIKE ?";
      params.push(`%${partName}%`);
    }
    if (customer) {
      query += " AND Customer LIKE ?";
      params.push(`%${customer}%`);
    }

    query += " ORDER BY Date DESC";

    const [rows] = await pool.query(query, params);

    // Get unique dropdown data
    const [partRows] = await pool.query("SELECT DISTINCT PartName FROM PresentDayDispatch");
    const [custRows] = await pool.query("SELECT DISTINCT Customer FROM PresentDayDispatch");

    return NextResponse.json({
      success: true,
      data: rows,
      partOptions: partRows.map(r => r.PartName),
      customerOptions: custRows.map(r => r.Customer)
    });
  } catch (err) {
    console.error("Dispatch GET error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    const [result] = await pool.query(
      `INSERT INTO PresentDayDispatch (date, customer, partName, quantity, newProcess)
       VALUES (?, ?, ?, ?, ?)`,
      [body.date, body.customer, body.partName, body.quantity, body.newProcess || null]
    );

    if (result.affectedRows > 0) {
      const [rows] = await pool.query(
        "SELECT * FROM PresentDayDispatch WHERE id = ?",
        [result.insertId]
      );
      return NextResponse.json({ success: true, data: rows[0], message: "Record added successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Failed to add record" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}

// PUT
export async function PUT(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    // Fetch existing record to check date
    const [existingRows] = await pool.query(
      "SELECT date FROM PresentDayDispatch WHERE id = ?",
      [body.id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ success: false, message: "Record not found" });
    }

    const recordDate = new Date(existingRows[0].date);
    const today = new Date();
    const diffDays = (today - recordDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {
      return NextResponse.json({ success: false, message: "Edit limit exceeded: cannot edit records older than 30 days" });
    }

    // Proceed with update
    const [result] = await pool.query(
      `UPDATE PresentDayDispatch
       SET date = ?, customer = ?, partName = ?, quantity = ?, newProcess = ?
       WHERE id = ?`,
      [body.date, body.customer, body.partName, body.quantity, body.newProcess || null, body.id]
    );

    if (result.affectedRows > 0) {
      const [rows] = await pool.query(
        "SELECT * FROM PresentDayDispatch WHERE id = ?",
        [body.id]
      );
      return NextResponse.json({ success: true, data: rows[0], message: "Record updated successfully" });
    } else {
      return NextResponse.json({ success: false, message: "No changes or record not found" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const pool = await getConnection();

    // Fetch existing record to check date
    const [existingRows] = await pool.query(
      "SELECT date FROM PresentDayDispatch WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ success: false, message: "Record not found" });
    }

    const recordDate = new Date(existingRows[0].date);
    const today = new Date();
    const diffDays = (today - recordDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {
      return NextResponse.json({ success: false, message: "Delete limit exceeded: cannot delete records older than 30 days" });
    }

    // Proceed with delete
    const [result] = await pool.query(
      "DELETE FROM PresentDayDispatch WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true, message: "Record deleted successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Record not found" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}

