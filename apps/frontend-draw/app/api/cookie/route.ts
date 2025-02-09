import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  req.cookies.set('authorization',body.cookie);
  return NextResponse.json({
    message: "Hi"
  })
}