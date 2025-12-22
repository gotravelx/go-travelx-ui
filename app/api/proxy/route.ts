import { NextResponse } from 'next/server';

const TARGET_URL =
  'https://rte-dev.ual.com/rte/flifo-dashboard/v1/flifo/getFlightStatus';

// OAuth configuration
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const SCOPE = process.env.AZURE_SCOPE;

// Verify environment variables are loaded
if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !SCOPE) {
  console.error('Missing required environment variables:', {
    TENANT_ID: !!TENANT_ID,
    CLIENT_ID: !!CLIENT_ID,
    CLIENT_SECRET: !!CLIENT_SECRET,
    SCOPE: !!SCOPE,
  });
}

const TOKEN_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;


async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiry > now) {
    return cachedToken;
  }

  // Fetch new token
  const params = new URLSearchParams({
    client_id: CLIENT_ID || '',
    client_secret: CLIENT_SECRET || '',
    scope: SCOPE || '',
    grant_type: 'client_credentials',
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch access token: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in - 300) * 1000;

  return cachedToken!;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const fltNbr = searchParams.get('fltNbr') ?? '5724';

    const targetUrl = new URL(TARGET_URL);
    targetUrl.searchParams.set('fltNbr', fltNbr);

    searchParams.forEach((value, key) => {
      if (key !== 'fltNbr') targetUrl.searchParams.append(key, value);
    });

    // Get access token
    const token = await getAccessToken();

    const res = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'UnitedFlightService/1.0',
        'rte-ual-auth': 'GTXRlZ3R4OkdUWFBBNRP',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const contentType =
      res.headers.get('content-type') ?? 'application/json';
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
