import { NextResponse } from 'next/server';

const TARGET_URL_BASE = process.env.KONG_API_TARGET_URL;


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    if (!TARGET_URL_BASE) {
      return NextResponse.json(
        { error: 'Server configuration error: missing environment variables' },
        { status: 500 }
      );
    }

    const fltNbr = searchParams.get('fltNbr') ?? '5724';
    const targetUrl = new URL(`${TARGET_URL_BASE}/flifo/getFlightStatus`);
    targetUrl.searchParams.set('fltNbr', fltNbr);

    searchParams.forEach((value, key) => {
      if (key !== 'fltNbr') targetUrl.searchParams.append(key, value);
    });


    const res = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'UnitedFlightService/1.0',
        'rte-ual-auth': "GTXRlZ3R4OkdUWFBBNRP",
        Authorization: authHeader,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Proxy Upstream Error:', {
        status: res.status,
        statusText: res.statusText,
        body: errorBody,
      });
      // We might want to return this error details to the client for easier debugging
      return NextResponse.json(
        { error: 'Upstream error', status: res.status, details: errorBody },
        { status: res.status }
      );
    }

    const contentType = res.headers.get('content-type') ?? 'application/json';
    const body = await res.text();

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Proxy GET failed', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
