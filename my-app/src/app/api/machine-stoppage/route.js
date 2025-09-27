import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ GET all records
export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM MachineStoppage ORDER BY Date DESC");
    return NextResponse.json(result.recordset);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ POST new record
export async function POST(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    const sql = require('mssql');

await pool
  .request()
  .input("Date", sql.Date, body.date) // DATE
  .input("Part", sql.NVarChar(100), body.part) // NVARCHAR(100)
  .input("MachinesAllotted", sql.Int, Number(body.machinesAllotted) || 0) // INT
  .input("Running", sql.Int, Number(body.running) || 0) // INT
  .input("NotRunning", sql.Int, Number(body.notRunning) || 0) // INT
  .input("UnderSetting", sql.Int, Number(body.underSetting) || 0) // INT
  .input("Maintenance", sql.NVarChar(100), body.maintenance || null) // NVARCHAR(100)
  .input("Remarks", sql.NVarChar(255), body.remarks || null) // NVARCHAR(255)
  .input("NewProcess", sql.NVarChar(100), body.newProcess || null) // NVARCHAR(100)
  .query(`
    INSERT INTO MachineStoppage
    (Date, Part, MachinesAllotted, Running, NotRunning, UnderSetting, Maintenance, Remarks, NewProcess)
    VALUES (@Date, @Part, @MachinesAllotted, @Running, @NotRunning, @UnderSetting, @Maintenance, @Remarks, @NewProcess)
  `);


    return NextResponse.json({ success: true, message: "Record inserted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PUT (Update existing record)
export async function PUT(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    await pool
      .request()
      .input("Id", body.id)
      .input("Date", body.date)
      .input("Part", body.part)
      .input("MachinesAllotted", body.machinesAllotted)
      .input("Running", body.running)
      .input("NotRunning", body.notRunning)
      .input("UnderSetting", body.underSetting)
      .input("Maintenance", body.maintenance)
      .input("Remarks", body.remarks)
      .input("NewProcess", body.newProcess)
      .query(`
        UPDATE MachineStoppage
        SET Date=@Date, Part=@Part, MachinesAllotted=@MachinesAllotted, Running=@Running,
            NotRunning=@NotRunning, UnderSetting=@UnderSetting, Maintenance=@Maintenance,
            Remarks=@Remarks, NewProcess=@NewProcess
        WHERE Id=@Id
      `);

    return NextResponse.json({ success: true, message: "Record updated" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE (Delete by ID)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const pool = await getConnection();
    await pool.request().input("Id", id).query("DELETE FROM MachineStoppage WHERE Id=@Id");

    return NextResponse.json({ success: true, message: "Record deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
