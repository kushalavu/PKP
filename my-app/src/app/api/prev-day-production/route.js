import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      date, partName, machineNumber, capacity, shift1, shift2, totalNumbers,
      productionAchieved, productionTarget, inspectedQuantity, sortedOK,
      sortedRejected, totalSorted, sortingOut
    } = body;

    const pool = await getConnection();
    await pool.request()
      .input('date', new Date(date))
      .input('partName', partName)
      .input('machineNumber', machineNumber)
      .input('capacity', capacity)
      .input('shift1', shift1)
      .input('shift2', shift2)
      .input('totalNumbers', totalNumbers)
      .input('productionAchieved', productionAchieved)
      .input('productionTarget', productionTarget)
      .input('inspectedQuantity', inspectedQuantity)
      .input('sortedOK', sortedOK)
      .input('sortedRejected', sortedRejected)
      .input('totalSorted', totalSorted)
      .input('sortingOut', sortingOut)
      .query(`INSERT INTO PrevDayProduction
      (Date, PartName, MachineNumber, Capacity, Shift1, Shift2, TotalNumbers,
        ProductionAchieved, ProductionTarget, InspectedQuantity, SortedOK,
        SortedRejected, TotalSorted, SortingOut)
      VALUES
      (@date,@partName,@machineNumber,@capacity,@shift1,@shift2,@totalNumbers,
        @productionAchieved,@productionTarget,@inspectedQuantity,@sortedOK,
        @sortedRejected,@totalSorted,@sortingOut)`);

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
    const osmNumber = searchParams.get('osmNumber'); // optional

    const pool = await getConnection();
    let query = `SELECT * FROM PrevDayProduction WHERE 1=1`;
    if (date) query += ` AND CONVERT(date, Date)='${date}'`;
    if (partName) query += ` AND PartName='${partName}'`;
    if (osmNumber) query += ` AND MachineNumber='${osmNumber}'`;
    query += ' ORDER BY Date DESC';

    const result = await pool.request().query(query);
    return NextResponse.json(result.recordset, { status: 200 });
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
    await pool.request()
      .input('id', id)
      .input('date', date ? new Date(date) : null)
      .input('partName', partName)
      .input('machineNumber', machineNumber)
      .input('capacity', parseInt(capacity))
      .input('shift1', parseInt(shift1))
      .input('shift2', parseInt(shift2))
      .input('totalNumbers', parseInt(totalNumbers))
      .input('productionAchieved', parseInt(productionAchieved))
      .input('productionTarget', parseInt(productionTarget))
      .input('inspectedQuantity', parseInt(inspectedQuantity))
      .input('sortedOK', parseInt(sortedOK))
      .input('sortedRejected', parseInt(sortedRejected))
      .input('totalSorted', parseInt(totalSorted))
      .input('sortingOut', sortingOut || '')
      .query(`UPDATE PrevDayProduction SET 
        Date=@date, PartName=@partName, MachineNumber=@machineNumber, Capacity=@capacity,
        Shift1=@shift1, Shift2=@shift2, TotalNumbers=@totalNumbers,
        ProductionAchieved=@productionAchieved, ProductionTarget=@productionTarget,
        InspectedQuantity=@inspectedQuantity, SortedOK=@sortedOK, SortedRejected=@sortedRejected,
        TotalSorted=@totalSorted, SortingOut=@sortingOut
        WHERE Id=@id`);

    return NextResponse.json({ message: 'Record updated successfully' }, { status: 200 });
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
    await pool.request()
      .input('id', id)
      .query('DELETE FROM PrevDayProduction WHERE Id=@id');

    return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
