import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const partName = searchParams.get("partName");

    const pool = await getConnection();
    let query = "SELECT * FROM PresentDayDispatch WHERE 1=1";
    const params = [];

    if (date) {
      query += " AND date = ?";
      params.push(date);
    }
    if (partName) {
      query += " AND partName = ?";
      params.push(partName);
    }

    const [rows] = await pool.query(query, params);

    if (rows.length > 0) {
      return NextResponse.json({ success: true, data: rows });
    } else {
      return NextResponse.json({ success: false, message: "No records found" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
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
    const [result] = await pool.query("DELETE FROM PresentDayDispatch WHERE id = ?", [id]);

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
