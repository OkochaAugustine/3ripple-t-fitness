import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; // your Supabase client

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ success: false, error: "Invalid email" });
    }

    // ✅ Check duplicate email in Supabase
    const { data: existing, error: fetchError } = await supabase
      .from("registrations")
      .select("email")
      .eq("email", data.email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore "No rows found" error
      return NextResponse.json({ success: false, error: fetchError.message });
    }

    if (existing) {
      return NextResponse.json({
        success: false,
        error: "Email already registered",
      });
    }

    // Add timestamp
    data.timestamp = new Date().toISOString();

    // Insert into Supabase
    const { error: insertError } = await supabase
      .from("registrations")
      .insert([data]);

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API POST error:", err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}

export async function GET() {
  try {
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("*");

    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, registrations });
  } catch (err) {
    console.error("API GET error:", err);
    return NextResponse.json({ success: false, error: String(err), registrations: [] });
  }
}
