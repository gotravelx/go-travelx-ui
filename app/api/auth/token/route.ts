// export const runtime = "nodejs";

// import { NextResponse } from 'next/server';

// const TENANT_ID = process.env.AZURE_TENANT_ID;
// const CLIENT_ID = process.env.AZURE_CLIENT_ID;
// const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
// const SCOPE = process.env.AZURE_SCOPE;

// const TOKEN_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

// export async function GET() {
//     try {
//         if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !SCOPE) {
//             return NextResponse.json(
//                 { error: 'Missing required Azure OAuth environment variables' },
//                 { status: 500 }
//             );
//         }

//         const params = new URLSearchParams({
//             client_id: CLIENT_ID,
//             client_secret: CLIENT_SECRET,
//             scope: SCOPE,
//             grant_type: 'client_credentials',
//         });

//         const response = await fetch(TOKEN_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: params.toString(),
//             cache: 'no-store',
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             return NextResponse.json(
//                 { error: `Failed to fetch access token: ${response.status}`, details: errorText },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();
//         return NextResponse.json(data);
//     } catch (err: any) {
//         return NextResponse.json(
//             { error: 'Token generation failed', details: err?.message ?? String(err) },
//             { status: 500 }
//         );
//     }
// }


export const runtime = "nodejs";

import { NextResponse } from "next/server";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!rawBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const BACKEND_BASE_URL = rawBaseUrl.replace("/v1", "");
console.log("BACKEND_BASE_URL", BACKEND_BASE_URL)

export async function GET() {
    const startTime = Date.now();

    try {
        if (!BACKEND_BASE_URL) {
            console.error('[Token Route] Backend URL not configured');
            return NextResponse.json(
                { error: "Backend URL not configured" },
                { status: 500 }
            );
        }

        console.log(`[Token Route] Fetching token from: ${BACKEND_BASE_URL}/api/auth/token`);

        // Create abort controller for timeout (15 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.error('[Token Route] Request timeout after 15s');
            controller.abort();
        }, 15000);

        const response = await fetch(
            `${BACKEND_BASE_URL}/api/auth/token`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store",
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);

        const duration = Date.now() - startTime;
        console.log(`[Token Route] Backend responded in ${duration}ms with status ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Token Route] Backend error (${response.status}):`, errorText);
            return NextResponse.json(
                { error: "Backend token API failed", details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('[Token Route] ✓ Token fetched successfully');
        return NextResponse.json(data);

    } catch (err: any) {
        const duration = Date.now() - startTime;

        if (err.name === 'AbortError') {
            console.error(`[Token Route] ✗ Request aborted after ${duration}ms (timeout)`);
            return NextResponse.json(
                { error: "Token request timeout", details: "Backend did not respond within 15 seconds" },
                { status: 504 }
            );
        }

        console.error(`[Token Route] ✗ Error after ${duration}ms:`, err.message);
        return NextResponse.json(
            { error: "Token proxy failed", details: err?.message },
            { status: 500 }
        );
    }
}
