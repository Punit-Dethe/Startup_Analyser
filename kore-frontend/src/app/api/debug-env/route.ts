import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_GEMINI_KEY_1: process.env.NEXT_PUBLIC_GEMINI_KEY_1 ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_GEMINI_KEY_2: process.env.NEXT_PUBLIC_GEMINI_KEY_2 ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_GEMINI_KEY_3: process.env.NEXT_PUBLIC_GEMINI_KEY_3 ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_GEMINI_KEY_4: process.env.NEXT_PUBLIC_GEMINI_KEY_4 ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_GEMINI_KEY_5: process.env.NEXT_PUBLIC_GEMINI_KEY_5 ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_GEMINI_KEY_6: process.env.NEXT_PUBLIC_GEMINI_KEY_6 ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_BACKEND_TYPE: process.env.NEXT_PUBLIC_BACKEND_TYPE,
    NEXT_PUBLIC_FASTAPI_BASE_URL: process.env.NEXT_PUBLIC_FASTAPI_BASE_URL,
  })
}
