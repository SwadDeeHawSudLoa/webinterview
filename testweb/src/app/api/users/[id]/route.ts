import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
dotenv.config();
// DELETE - ลบข้อมูลผู้ใช้
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const connection = await mysql.createConnection(pool);
  await connection.execute('DELETE FROM users WHERE id = ?', [params.id]);
  await connection.end();

  return Response.json({ message: 'User deleted' });
}
// GET - Fetch user by ID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Query to find the user by ID
    const sql = `
      SELECT *, TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
      FROM users
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [userId]) as unknown as [any[]]; // Force it to be array type

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0]; // Grab the first (and only) user
    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    return NextResponse.json({ error: "Database query error" }, { status: 500 });
  }
}