// src/app/api/workinprogress/route.js
export const runtime = 'nodejs'; // ✅ Ensure Node.js runtime for mysql2

import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db"; // MySQL pool


export async function GET(request) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const date = searchParams.get("date");
    const formattedDate = date ? new Date(date).toISOString().slice(0, 10) : null;

    let query = `
      SELECT id, date, partName, packed, forPacking, underPacking,
             forPlating, underHeatTreatment, underPTFE, forPTFE,
             forHeatTreatment, sortedOK, sortedRejected, totalSorted
      FROM WorkInProgress
    `;

    const params = [];
    if (formattedDate) {
      query += " WHERE date = ?";
      params.push(formattedDate);
    }

    query += ` ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await pool.execute(query, params);

    // Total count for pagination
    const countQuery = formattedDate
      ? "SELECT COUNT(*) as total FROM WorkInProgress WHERE date = ?"
      : "SELECT COUNT(*) as total FROM WorkInProgress";

    const [countResult] = await pool.execute(
      countQuery,
      formattedDate ? [formattedDate] : []
    );

    return NextResponse.json({
      success: true,
      data: rows,
      page,
      pages: Math.ceil(countResult[0].total / limit),
      total: countResult[0].total,
    });
  } catch (error) {
    console.error("Error fetching WorkInProgress data:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


// ------------------- POST -------------------
export async function POST(request) {
  try {
    const pool = await getConnection();
    const body = await request.json();

    const {
      date,
      partName,
      packed = 0,
      forPacking = 0,
      underPacking = 0,
      forPlating = 0,
      underHeatTreatment = 0,
      underPTFE = 0,
      forPTFE = 0,
      forHeatTreatment = 0,
      sortedOK = 0,
      sortedRejected = 0,
      totalSorted = 0,
    } = body;

    if (!date || !partName) {
      return NextResponse.json(
        { success: false, message: "Date and partName are required" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO WorkInProgress 
      (date, partName, packed, forPacking, underPacking, forPlating, underHeatTreatment, underPTFE, forPTFE, forHeatTreatment, sortedOK, sortedRejected, totalSorted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      date, partName, packed, forPacking, underPacking, forPlating, 
      underHeatTreatment, underPTFE, forPTFE, forHeatTreatment, 
      sortedOK, sortedRejected, totalSorted
    ];

    await pool.execute(query, params);

    return NextResponse.json({ success: true, message: "Record added successfully" });
  } catch (error) {
    console.error("Error adding WorkInProgress record:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ------------------- PUT -------------------
export async function PUT(request) {
  try {
    const pool = await getConnection();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Record ID is required" },
        { status: 400 }
      );
    }

    const fields = [
      "date", "partName", "packed", "forPacking", "underPacking",
      "forPlating", "underHeatTreatment", "underPTFE", "forPTFE",
      "forHeatTreatment", "sortedOK", "sortedRejected", "totalSorted"
    ];

    const updates = fields
      .filter(f => body[f] !== undefined)
      .map(f => `${f} = ?`)
      .join(", ");

    const params = fields.filter(f => body[f] !== undefined).map(f => body[f]);
    params.push(id);

    const query = `UPDATE WorkInProgress SET ${updates} WHERE id = ?`;
    await pool.execute(query, params);

    return NextResponse.json({ success: true, message: "Record updated successfully" });
  } catch (error) {
    console.error("Error updating WorkInProgress record:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ------------------- DELETE -------------------
export async function DELETE(request) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Record ID is required" },
        { status: 400 }
      );
    }

    const query = "DELETE FROM WorkInProgress WHERE id = ?";
    await pool.execute(query, [id]);

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting WorkInProgress record:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
