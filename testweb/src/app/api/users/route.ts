import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// เชื่อมต่อฐานข้อมูล
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// GET - ดึงข้อมูลทั้งหมด + ค้นหาชื่อ + เรียงตามอายุ
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const sortByAge = searchParams.get("sort") === "age";

    let sql = "SELECT *, TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age FROM users WHERE 1=1";
    const values: any[] = [];

    if (firstName) {
      sql += " AND first_name LIKE ?";
      values.push(`%${firstName}%`);
    }
    if (lastName) {
      sql += " AND last_name LIKE ?";
      values.push(`%${lastName}%`);
    }
    if (sortByAge) {
      sql += " ORDER BY age DESC";
    }

    const [rows] = await pool.query(sql, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Database query error" }, { status: 500 });
  }
}

//POST - เพิ่มข้อมูลผู้ใช้ใหม่
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, first_name, last_name, birth_date, profile_image } = body;

    if (!title || !first_name || !last_name || !birth_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = `INSERT INTO users (title, first_name, last_name, birth_date, profile_image) VALUES (?, ?, ?, ?, ?)`;
    const values = [title, first_name, last_name, birth_date, profile_image || null];

    const [result] = await pool.query(sql, values);
    return NextResponse.json({ message: "User created successfully", id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

//PUT - อัปเดตข้อมูลผู้ใช้
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, first_name, last_name, birth_date, profile_image } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const sql = `UPDATE users SET title=?, first_name=?, last_name=?, birth_date=?, profile_image=? WHERE id=?`;
    const values = [title, first_name, last_name, birth_date, profile_image || null, id];

    await pool.query(sql, values);
    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE - ลบข้อมูลผู้ใช้
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const sql = `DELETE FROM users WHERE id=?`;
    await pool.query(sql, [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
