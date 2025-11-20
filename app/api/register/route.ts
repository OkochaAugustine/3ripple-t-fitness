import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "registrations.json");

// Ensure file exists and is valid JSON
function ensureFile() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, "[]");
      return;
    }

    let raw = fs.readFileSync(filePath, "utf-8").trim();

    // If empty or invalid, reset it
    try {
      if (!raw || raw === "") {
        fs.writeFileSync(filePath, "[]");
      } else {
        JSON.parse(raw); // test parse
      }
    } catch {
      fs.writeFileSync(filePath, "[]");
    }
  } catch (err) {
    console.error("Error ensuring file:", err);
  }
}

ensureFile();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ❌ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ success: false, error: "Invalid email" });
    }

    // Load registrations safely
    let raw = fs.readFileSync(filePath, "utf-8").trim();
    let registrations = JSON.parse(raw);

    // ❌ Prevent duplicate email
    if (registrations.some((r: any) => r.email === data.email)) {
      return NextResponse.json({
        success: false,
        error: "Email already registered",
      });
    }

    // Add timestamp
    data.timestamp = new Date().toISOString();

    registrations.push(data);

    // Write back safely
    fs.writeFileSync(filePath, JSON.stringify(registrations, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API POST error:", err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}

export async function GET() {
  try {
    let raw = fs.readFileSync(filePath, "utf-8").trim();

    if (!raw || raw === "") {
      raw = "[]";
      fs.writeFileSync(filePath, raw);
    }

    const registrations = JSON.parse(raw);

    return NextResponse.json({ success: true, registrations });
  } catch (err) {
    console.error("API GET error:", err);

    // Auto repair file if corrupted
    fs.writeFileSync(filePath, "[]");

    return NextResponse.json({
      success: false,
      error: "File was corrupted and has been reset",
      registrations: [],
    });
  }
}
