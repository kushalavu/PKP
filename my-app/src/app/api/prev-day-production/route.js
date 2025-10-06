import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // make sure this returns MySQL connection

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
      productionAchieved, productionTarget, inspectedQuantity, sortedOK,
      sortedRejected, totalSorted, sortingOut
    } = body;

    const pool = await getConnection();
    const sql = `INSERT INTO PrevDayProduction 
      (Date, PartName, MachineNumber, Capacity, Shift1, Shift2, TotalNumbers,
        ProductionAchieved, ProductionTarget, InspectedQuantity, SortedOK,
        SortedRejected, TotalSorted, SortingOut)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await pool.execute(sql, [
      date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
      productionAchieved, productionTarget, inspectedQuantity, sortedOK,
      sortedRejected, totalSorted, sortingOut
    ]);

    return NextResponse.json({ message: 'Production submitted successfully' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const partName = searchParams.get('partName');
    const osmNumber = searchParams.get('osmNumber');

    const pool = await getConnection();
    let sql = `SELECT * FROM PrevDayProduction WHERE 1=1`;
    const params = [];
    if (date) { sql += ' AND Date = ?'; params.push(date); }
    if (partName) { sql += ' AND PartName = ?'; params.push(partName); }
    if (osmNumber) { sql += ' AND MachineNumber = ?'; params.push(osmNumber); }
    sql += ' ORDER BY Date DESC';

    const [rows] = await pool.execute(sql, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id, date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
      productionAchieved, productionTarget, inspectedQuantity, sortedOK,
      sortedRejected, totalSorted, sortingOut
    } = body;

    if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });

    const pool = await getConnection();
    const sql = `UPDATE PrevDayProduction SET 
      Date=?, PartName=?, MachineNumber=?, Capacity=?, Shift1=?, Shift2=?,
      TotalNumbers=?, ProductionAchieved=?, ProductionTarget=?, InspectedQuantity=?,
      SortedOK=?, SortedRejected=?, TotalSorted=?, SortingOut=?
      WHERE Id=?`;

    await pool.execute(sql, [
      date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
      productionAchieved, productionTarget, inspectedQuantity, sortedOK,
      sortedRejected, totalSorted, sortingOut, id
    ]);

    return NextResponse.json({ message: 'Record updated successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });

    const pool = await getConnection();
    await pool.execute(`DELETE FROM PrevDayProduction WHERE Id=?`, [id]);

    return NextResponse.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
