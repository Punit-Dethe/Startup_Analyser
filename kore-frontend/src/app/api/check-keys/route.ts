import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    keys: {
      KEY_1: process.env.NEXT_PUBLIC_GEMINI_KEY_1 ? `${process.env.NEXT_PUBLIC_GEMINI_KEY_1.substring(0, 20)}...` : 'NOT SET',
      KEY_2: process.env.NEXT_PUBLIC_GEMINI_KEY_2 ? `${process.env.NEXT_PUBLIC_GEMINI_KEY_2.substring(0, 20)}...` : 'NOT SET',
      KEY_3: process.env.NEXT_PUBLIC_GEMINI_KEY_3 ? `${process.env.NEXT_PUBLIC_GEMINI_KEY_3.substring(0, 20)}...` : 'NOT SET',
      KEY_4: process.env.NEXT_PUBLIC_GEMINI_KEY_4 ? `${process.env.NEXT_PUBLIC_GEMINI_KEY_4.substring(0, 20)}...` : 'NOT SET',
      KEY_5: process.env.NEXT_PUBLIC_GEMINI_KEY_5 ? `${process.env.NEXT_PUBLIC_GEMINI_KEY_5.substring(0, 20)}...` : 'NOT SET',
      KEY_6: process.env.NEXT_PUBLIC_GEMINI_KEY_6 ? `${process.env.NEXT_PUBLIC_GEMINI_KEY_6.substring(0, 20)}...` : 'NOT SET',
    }
  })
}
