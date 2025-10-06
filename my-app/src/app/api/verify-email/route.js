// File: /app/api/verify-email/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userID } = body;

    // Handle missing userID
    if (!userID) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
        data: null
      });
    }

    const db = await getConnection();
    const [rows] = await db.query("SELECT * FROM users WHERE Email = ?", [userID]);

    // Handle user not found
    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        data: null
      });
    }

    // Success
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      data: { userID }
    });

  } catch (err) {
    console.error("Verify Email Error:", err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
}
