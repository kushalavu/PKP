import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(request) {
  const connection = await getConnection();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const date = searchParams.get("date"); // optional filter

    // Query: fetch records with formatted date, descending order (recent → old)
    let query = `
      SELECT *, DATE_FORMAT(date, '%Y-%m-%d') as formatted_date
      FROM predayworkallotment
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      query += " AND date = ?";
      params.push(date);
    }

    query += ` ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await connection.execute(query, params);

    // Count total records for pagination
    let countQuery = "SELECT COUNT(*) as total FROM predayworkallotment WHERE 1=1";
    const countParams = [];
    if (date) {
      countQuery += " AND date = ?";
      countParams.push(date);
    }
    const [countResult] = await connection.execute(countQuery, countParams);

    return NextResponse.json({
      data: rows.map(r => ({ ...r, date: r.formatted_date })), // return YYYY-MM-DD
      total: countResult[0].total,
      pages: Math.ceil(countResult[0].total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const connection = await getConnection();
  try {
    const body = await request.json();
    const {
      date,
      coreDrilling = 0,
      coreVisual = 0,
      magneticCoreDrilling = 0,
      magneticCoreVisual = 0,
      pip = 0,
      sortingOut = 0,
      platedVisual = 0,
      poleTap = 0,
      osm
    } = body;

    // ✅ Validation
    if (!date) {
      return NextResponse.json(
        { success: false, message: "Date is required" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO predayworkallotment 
      (date, coreDrilling, coreVisual, magneticCoreDrilling, magneticCoreVisual, pip, sortingOut, platedVisual, poleTap, osm)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const params = [
      date,
      coreDrilling,
      coreVisual,
      magneticCoreDrilling,
      magneticCoreVisual,
      pip,
      sortingOut,
      platedVisual,
      poleTap,
      osm
    ];

    await connection.execute(query, params);

    return NextResponse.json({
      success: true,
      message: "Record added successfully",
    });
  } catch (err) {
    console.error("❌ Error adding PreDayWorkAllotment record:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


// ✅ PUT: Update an existing record
export async function PUT(request) {
  const connection = await getConnection();
  try {
    const body = await request.json();
    const { id, date, coreDrilling, coreVisual, magneticCoreDrilling, magneticCoreVisual, pip, sortingOut, platedVisual, poleTap, osm } = body;

    await connection.execute(
      `UPDATE predayworkallotment 
       SET coreDrilling=?, coreVisual=?, magneticCoreDrilling=?, magneticCoreVisual=?, pip=?, sortingOut=?, platedVisual=?, poleTap=?, osm=? 
       WHERE id=?`,
      [coreDrilling, coreVisual, magneticCoreDrilling, magneticCoreVisual, pip, sortingOut, platedVisual, poleTap, osm, id]
    );

    return NextResponse.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}


export async function DELETE(request) {
  const connection = await getConnection();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Record ID is required" }, { status: 400 });
    }

    // Check 30 days
    const [existing] = await connection.execute("SELECT date FROM predayworkallotment WHERE id = ?", [id]);
    if (existing.length === 0) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }
    const recordDate = new Date(existing[0].date);
    const now = new Date();
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 30) {
      return NextResponse.json({ message: "Cannot delete records older than 30 days" }, { status: 400 });
    }

    await connection.execute("DELETE FROM predayworkallotment WHERE id = ?", [id]);

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
