import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { hash, compare } from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userID, newPassword, confirmPassword } = body;

    // Validation
    if (!userID || !newPassword || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
        data: null
      });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match",
        data: null
      });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: "Password must be at least 6 characters",
        data: null
      });
    }

    const db = await getConnection();

    // Fetch user
    const [userRows] = await db.query(
      "SELECT * FROM users WHERE Email = ?",
      [userID]
    );

    if (userRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        data: null
      });
    }

    const user = userRows[0];

    // Check if new password is same as old password
    const isSameAsOld = await compare(newPassword, user.PasswordHash);
    if (isSameAsOld) {
      return NextResponse.json({
        success: false,
        message: "New password cannot be the same as previous password",
        data: null
      });
    }

    // Hash and update password
    const hashedPassword = await hash(newPassword, 10);
    await db.query(
      "UPDATE users SET PasswordHash = ? WHERE Email = ?",
      [hashedPassword, userID]
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      data: null
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
}
