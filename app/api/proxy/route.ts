// import { NextResponse } from 'next/server';

// const TARGET_URL_BASE = process.env.KONG_API_TARGET_URL;


// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const authHeader = req.headers.get('Authorization');

//     if (!authHeader) {
//       return NextResponse.json(
//         { error: 'Authorization header is required' },
//         { status: 401 }
//       );
//     }

//     if (!TARGET_URL_BASE) {
//       return NextResponse.json(
//         { error: 'Server configuration error: missing environment variables' },
//         { status: 500 }
//       );
//     }

//     const fltNbr = searchParams.get('fltNbr') ?? '5724';
//     const targetUrl = new URL(`${TARGET_URL_BASE}/flifo/getFlightStatus`);
//     targetUrl.searchParams.set('fltNbr', fltNbr);

//     searchParams.forEach((value, key) => {
//       if (key !== 'fltNbr') targetUrl.searchParams.append(key, value);
//     });


//     const res = await fetch(targetUrl.toString(), {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'User-Agent': 'UnitedFlightService/1.0',
//         'rte-ual-auth': "GTXRlZ3R4OkdUWFBBNRP",
//         Authorization: authHeader,
//       },
//       cache: 'no-store',
//     });

//     if (!res.ok) {
//       const errorBody = await res.text();
//       console.error('Proxy Upstream Error:', {
//         status: res.status,
//         statusText: res.statusText,
//         body: errorBody,
//       });
//       // We might want to return this error details to the client for easier debugging
//       return NextResponse.json(
//         { error: 'Upstream error', status: res.status, details: errorBody },
//         { status: res.status }
//       );
//     }

//     const contentType = res.headers.get('content-type') ?? 'application/json';
//     const body = await res.text();

//     return new NextResponse(body, {
//       status: res.status,
//       headers: {
//         'content-type': contentType,
//       },
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: 'Proxy GET failed', details: err?.message ?? String(err) },
//       { status: 500 }
//     );
//   }
// }



export const runtime = "nodejs";

import { NextResponse } from "next/server";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!rawBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const BACKEND_BASE_URL = rawBaseUrl.replace("v1", "");


export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const backendUrl = new URL(`${BACKEND_BASE_URL}api/proxy`);

    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "GoTravelX-Frontend/1.0",
        Authorization: authHeader,
      },
      cache: "no-store",
    });

    const body = await response.text();
    const contentType =
      response.headers.get("content-type") ?? "application/json";

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Backend proxy failed",
          status: response.status,
          details: body,
        },
        { status: response.status }
      );
    }

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Frontend proxy failed",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
