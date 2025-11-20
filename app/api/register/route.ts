import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("Incoming registration data:", data);

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error("Invalid email format:", data.email);
      return NextResponse.json({ success: false, error: "Invalid email" });
    }

    // ✅ Check duplicate email in Supabase
    const { data: existing, error: fetchError } = await supabase
      .from("registrations")
      .select("email")
      .eq("email", data.email)
      .single();

    console.log("Existing email check:", { existing, fetchError });

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore "No rows found" error
      console.error("Supabase select error:", fetchError);
      return NextResponse.json({ success: false, error: fetchError.message });
    }

    if (existing) {
      console.warn("Email already registered:", data.email);
      return NextResponse.json({
        success: false,
        error: "Email already registered",
      });
    }

    // Add timestamp
    data.timestamp = new Date().toISOString();

    // Insert into Supabase
    const { data: inserted, error: insertError } = await supabase
      .from("registrations")
      .insert([data]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ success: false, error: insertError.message });
    }

    console.log("Successfully inserted registration:", inserted);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API POST unexpected error:", err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}

export async function GET() {
  try {
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("*");

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json({ success: false, error: error.message });
    }

    console.log("Fetched registrations:", registrations.length);

    return NextResponse.json({ success: true, registrations });
  } catch (err) {
    console.error("API GET unexpected error:", err);
    return NextResponse.json({ success: false, error: String(err), registrations: [] });
  }
}

