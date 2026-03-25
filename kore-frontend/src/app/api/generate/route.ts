import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TYPE = process.env.NEXT_PUBLIC_BACKEND_TYPE || 'n8n'
const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL
const N8N_WEBHOOK = process.env.N8N_GENERATE_WEBHOOK

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Extract API key from request if provided
  const apiKey = body.apiKey || req.headers.get('x-gemini-api-key')

  // Determine which backend to use
  const backendUrl = BACKEND_TYPE === 'fastapi' 
    ? `${FASTAPI_URL}/api/generate`
    : N8N_WEBHOOK

  // No backend configured → return error (frontend falls back to dummy data via api.ts)
  if (!backendUrl) {
    return NextResponse.json(
      { error: `Backend not configured (type: ${BACKEND_TYPE})` },
      { status: 503 }
    )
  }

  try {
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json',
    }
    
    // Add API key to headers if provided
    if (apiKey) {
      headers['X-Gemini-API-Key'] = apiKey
    }

    const upstream = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status} ${upstream.statusText}` },
        { status: upstream.status }
      )
    }

    const data = await upstream.json()
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
