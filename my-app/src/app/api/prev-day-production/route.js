// import { NextResponse } from 'next/server';
// import { getConnection } from '@/lib/db'; // make sure this returns MySQL connection

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
//       productionAchieved, productionTarget, inspectedQuantity, sortedOK,
//       sortedRejected, totalSorted, sortingOut
//     } = body;

//     const pool = await getConnection();
//     const sql = `INSERT INTO PrevDayProduction 
//       (Date, PartName, MachineNumber, Capacity, Shift1, Shift2, TotalNumbers,
//         ProductionAchieved, ProductionTarget, InspectedQuantity, SortedOK,
//         SortedRejected, TotalSorted, SortingOut)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     await pool.execute(sql, [
//       date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
//       productionAchieved, productionTarget, inspectedQuantity, sortedOK,
//       sortedRejected, totalSorted, sortingOut
//     ]);

//     return NextResponse.json({ message: 'Production submitted successfully' }, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const date = searchParams.get('date');
//     const partName = searchParams.get('partName');
//     const osmNumber = searchParams.get('osmNumber');

//     const pool = await getConnection();
//     let sql = `SELECT * FROM PrevDayProduction WHERE 1=1`;
//     const params = [];
//     if (date) { sql += ' AND Date = ?'; params.push(date); }
//     if (partName) { sql += ' AND PartName = ?'; params.push(partName); }
//     if (osmNumber) { sql += ' AND MachineNumber = ?'; params.push(osmNumber); }
//     sql += ' ORDER BY Date DESC';

//     const [rows] = await pool.execute(sql, params);
//     return NextResponse.json({ success: true, data: rows });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const {
//       id, date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
//       productionAchieved, productionTarget, inspectedQuantity, sortedOK,
//       sortedRejected, totalSorted, sortingOut
//     } = body;

//     if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });

//     const pool = await getConnection();
//     const sql = `UPDATE PrevDayProduction SET 
//       Date=?, PartName=?, MachineNumber=?, Capacity=?, Shift1=?, Shift2=?,
//       TotalNumbers=?, ProductionAchieved=?, ProductionTarget=?, InspectedQuantity=?,
//       SortedOK=?, SortedRejected=?, TotalSorted=?, SortingOut=?
//       WHERE Id=?`;

//     await pool.execute(sql, [
//       date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
//       productionAchieved, productionTarget, inspectedQuantity, sortedOK,
//       sortedRejected, totalSorted, sortingOut, id
//     ]);

//     return NextResponse.json({ message: 'Record updated successfully' });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');
//     if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });

//     const pool = await getConnection();
//     await pool.execute(`DELETE FROM PrevDayProduction WHERE Id=?`, [id]);

//     return NextResponse.json({ message: 'Record deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db"; // adjust based on your project path

// ✅ POST — Create new record
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      date,
      partName,
      machineNumber,
      capacity,
      shift1,
      shift2,
      totalNumbers,
      productionAchieved,
      inspectedQuantity,
      sortedOK,
      sortedRejected,
      totalSorted,
      forSorting,
    } = body;

    if (!date) {
      return NextResponse.json({ success: false, message: "Date is required" }, { status: 400 });
    }

    const conn = await getConnection();
    const sql = `
      INSERT INTO prevdayproduction
      (Date, PartName, MachineNumber, Capacity, Shift1, Shift2, TotalNumbers,
       ProductionAchieved, InspectedQuantity, SortedOK, SortedRejected, TotalSorted, ForSorting)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await conn.execute(sql, [
      date,
      partName || null,
      machineNumber || null,
      capacity || 0,
      shift1 || 0,
      shift2 || 0,
      totalNumbers || 0,
      productionAchieved || 0,
      inspectedQuantity || 0,
      sortedOK || 0,
      sortedRejected || 0,
      totalSorted || 0,
      forSorting || 0,
    ]);

    return NextResponse.json({ success: true, message: "Record added successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ GET — Fetch records with filters
export async function GET(request) {
  try {
    const conn = await getConnection();
    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");
    const partName = searchParams.get("partName");
    const machineNumber = searchParams.get("machineNumber");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Base query
    let query = `
      SELECT SQL_CALC_FOUND_ROWS 
             Id, Date, PartName, MachineNumber, Capacity, Shift1, Shift2,
             TotalNumbers, ProductionAchieved, InspectedQuantity, SortedOK,
             SortedRejected, TotalSorted, ForSorting
      FROM prevdayproduction
      WHERE 1=1
    `;

    const params = [];

    // Apply filters
    if (date) {
      query += " AND Date = ?";
      params.push(date);
    }
    if (partName) {
      query += " AND PartName = ?";
      params.push(partName);
    }
    if (machineNumber) {
      query += " AND MachineNumber = ?";
      params.push(machineNumber);
    }

query += ` ORDER BY Date DESC LIMIT ${limit} OFFSET ${offset}`;
const [rows] = await conn.execute(query, params);

    const [[{ total }]] = await conn.execute("SELECT FOUND_ROWS() as total");

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


// ✅ PUT — Update record
export async function PUT(request) {
  const conn = await getConnection();

  try {
    const body = await request.json();
    const {
      id,
      partName,
      machineNumber,
      capacity,
      shift1,
      shift2,
      productionAchieved,
      forSorting,
      inspectedQuantity,
      sortedOK,
      sortedRejected,
      totalSorted,
    } = body;

    if (!id) {
      return NextResponse.json({ message: "Record ID required" }, { status: 400 });
    }

    // ✅ Check if record is older than 30 days
    const [rows] = await conn.execute(
      "SELECT Date FROM prevdayproduction WHERE Id = ?",
      [id]
    );
    if (!rows.length) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    const recordDate = new Date(rows[0].Date);
    const now = new Date();
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {
      return NextResponse.json(
        { message: "Cannot edit record older than 30 days" },
        { status: 403 }
      );
    }

    // ✅ Proceed with update
    const sql = `
      UPDATE prevdayproduction
      SET 
        PartName = ?, 
        MachineNumber = ?, 
        Capacity = ?, 
        Shift1 = ?, 
        Shift2 = ?, 
        TotalNumbers = ?, 
        ProductionAchieved = ?, 
        ForSorting = ?, 
        InspectedQuantity = ?, 
        SortedOK = ?, 
        SortedRejected = ?, 
        TotalSorted = ?, 
        UpdatedAt = NOW()
      WHERE Id = ?
    `;

    await conn.execute(sql, [
      partName,
      machineNumber,
      capacity,
      shift1,
      shift2,
      (parseInt(shift1 || 0) + parseInt(shift2 || 0)),
      productionAchieved,
      forSorting,
      inspectedQuantity,
      sortedOK,
      sortedRejected,
      totalSorted,
      id
    ]);

    return NextResponse.json({ message: "Record updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}


// ✅ DELETE — Delete record
export async function DELETE(request) {
  try {
    const conn = await getConnection();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Record ID is required" }, { status: 400 });
    }

    // ✅ Check if record exists and is within 30 days
    const [rows] = await conn.execute("SELECT Date FROM prevdayproduction WHERE Id = ?", [id]);
    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
    }

    const recordDate = new Date(rows[0].Date);
    const now = new Date();
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {
      return NextResponse.json(
        { success: false, message: "Cannot delete record older than 30 days" },
        { status: 403 }
      );
    }

    // ✅ Proceed with delete
    const sql = "DELETE FROM prevdayproduction WHERE Id = ?";
    await conn.execute(sql, [id]);

    return NextResponse.json({ success: true, message: "Record deleted successfully" });

  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

