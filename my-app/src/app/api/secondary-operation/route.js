import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";


export async function POST(req) {
  try {
    const body = await req.json();
    const { date, partName, coreCSKDone, coreVisualDone, magneticDrill, magneticVisual, pivotPin } = body;

    if (!date || !partName) {
      return NextResponse.json({ message: "Date & Part Name required" }, { status: 400 });
    }

    const pool = await getConnection();

    // Convert date to INT YYYYMMDD if your column is INT
    const dateInt = parseInt(date.replace(/-/g, ''));

    await pool.request()
      .input("date", dateInt)
      .input("partName", partName)
      .input("coreCSKDone", coreCSKDone ? parseInt(coreCSKDone) : 0)
      .input("coreVisualDone", coreVisualDone ? parseInt(coreVisualDone) : 0)
      .input("magneticDrill", magneticDrill ? parseInt(magneticDrill) : 0)
      .input("magneticVisual", magneticVisual ? parseInt(magneticVisual) : 0)
      .input("pivotPin", pivotPin ? parseInt(pivotPin) : 0)
      .query(`
        INSERT INTO [dbo].[SecondaryOperation]
        ([Date], PartName, CoreCSKDone, CoreVisualDone, MagneticDrill, MagneticVisual, PivotPin)
        VALUES (@date, @partName, @coreCSKDone, @coreVisualDone, @magneticDrill, @magneticVisual, @pivotPin)
      `);

    return NextResponse.json({ message: "Secondary operation submitted successfully" }, { status: 201 });

  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}




export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const partName = searchParams.get("partName");

    const conn = await getConnection();
    let query = "SELECT * FROM SecondaryOperation WHERE 1=1";
    const requestDB = conn.request();

    if (date) requestDB.input("date", date);
    if (partName) requestDB.input("partName", `%${partName}%`);

    if (date) query += " AND [Date] = @date";
    if (partName) query += " AND PartName LIKE @partName";

    const result = await requestDB.query(query);
    return NextResponse.json(result.recordset); // MSSQL returns recordset
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}




// PUT update
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, date, partName, coreCSKDone, coreVisualDone, magneticDrill, magneticVisual, pivotPin } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const conn = await getConnection();
    const query = `
      UPDATE SecondaryOperation SET
        [Date] = @date,
        PartName = @partName,
        CoreCSKDone = @coreCSKDone,
        CoreVisualDone = @coreVisualDone,
        MagneticDrill = @magneticDrill,
        MagneticVisual = @magneticVisual,
        PivotPin = @pivotPin
      WHERE Id = @id
    `;
    const requestDB = conn.request();
    requestDB.input("id", id);
    requestDB.input("date", date);
    requestDB.input("partName", partName);
    requestDB.input("coreCSKDone", coreCSKDone || 0);
    requestDB.input("coreVisualDone", coreVisualDone || 0);
    requestDB.input("magneticDrill", magneticDrill || 0);
    requestDB.input("magneticVisual", magneticVisual || 0);
    requestDB.input("pivotPin", pivotPin || 0);

    await requestDB.query(query);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const conn = await getConnection();
    const requestDB = conn.request();
    requestDB.input("id", id);

    await requestDB.query("DELETE FROM SecondaryOperation WHERE Id = @id");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

