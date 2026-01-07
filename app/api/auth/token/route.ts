import { NextResponse } from 'next/server';

const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const SCOPE = process.env.AZURE_SCOPE;

const TOKEN_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

export async function GET() {
    try {
        if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !SCOPE) {
            return NextResponse.json(
                { error: 'Missing required Azure OAuth environment variables' },
                { status: 500 }
            );
        }

        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: SCOPE,
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
            return NextResponse.json(
                { error: `Failed to fetch access token: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Token generation failed', details: err?.message ?? String(err) },
            { status: 500 }
        );
    }
}
