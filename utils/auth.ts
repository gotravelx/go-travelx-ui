let cachedToken: string | null = null;

export async function getAccessToken(): Promise<string> {
    if (cachedToken) {
        return cachedToken;
    }

    const tokenRes = await fetch('/api/auth/token');
    if (!tokenRes.ok) {
        const tokenError = await tokenRes.text();
        throw new Error(`Failed to fetch token: ${tokenError}`);
    }

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
        throw new Error('Access token not found in response');
    }

    cachedToken = token;
    return token;
}
