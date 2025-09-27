import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db"; // your existing DB connection

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const partName = searchParams.get("partName");

    const pool = await getConnection();
    let query = "SELECT * FROM PresentDayDispatch WHERE 1=1";
    if (date) query += ` AND date = @date`;
    if (partName) query += ` AND partName = @partName`;

    const result = await pool
      .request()
      .input("date", date)
      .input("partName", partName)
      .query(query);

    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("date", body.date)
      .input("customer", body.customer)
      .input("partName", body.partName)
      .input("quantity", body.quantity)
      .input("newProcess", body.newProcess || "")
      .query(
        "INSERT INTO PresentDayDispatch (date, customer, partName, quantity, newProcess) OUTPUT INSERTED.* VALUES (@date, @customer, @partName, @quantity, @newProcess)"
      );

    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", body.id)               // lowercase matches @id
      .input("date", body.date)           // lowercase matches @date
      .input("customer", body.customer)
      .input("partName", body.partName)
      .input("quantity", body.quantity)
      .input("newProcess", body.newProcess)
      .query(
        `UPDATE PresentDayDispatch
         SET Date=@date,
             Customer=@customer,
             PartName=@partName,
             Quantity=@quantity,
             NewProcess=@newProcess
         OUTPUT INSERTED.*
         WHERE id=@id`
      );

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const pool = await getConnection();
    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM PresentDayDispatch WHERE id=@id");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
