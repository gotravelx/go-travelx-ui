let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

/**
 * Fetch access token with retry logic and timeout handling
 * Implements exponential backoff for transient failures
 */
export async function getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const maxRetries = 3;
    const timeoutMs = 10000; // 10 seconds
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            const tokenRes = await fetch('/api/auth/token', {
                signal: controller.signal,
                cache: 'no-store',
            });

            clearTimeout(timeoutId);

            if (!tokenRes.ok) {
                const tokenError = await tokenRes.text();
                throw new Error(`Token API returned ${tokenRes.status}: ${tokenError}`);
            }

            const tokenData = await tokenRes.json();
            const token = tokenData.access_token;

            if (!token) {
                throw new Error('Access token not found in response');
            }

            // Cache the token with expiration (default 55 minutes if not provided)
            cachedToken = token;
            const expiresIn = tokenData.expires_in || 3300; // 55 minutes in seconds
            tokenExpiresAt = Date.now() + (expiresIn * 1000);

            console.log(`✓ Token fetched successfully on attempt ${attempt}`);
            return token;

        } catch (err: any) {
            lastError = err;

            // Don't retry on abort (timeout) for the last attempt
            if (err.name === 'AbortError') {
                console.warn(`⚠ Token fetch timeout on attempt ${attempt}/${maxRetries}`);
            } else {
                console.warn(`⚠ Token fetch failed on attempt ${attempt}/${maxRetries}: ${err.message}`);
            }

            // If this isn't the last attempt, wait before retrying
            if (attempt < maxRetries) {
                const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
                console.log(`  Retrying in ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    // All retries failed
    throw new Error(
        `Failed to fetch access token after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`
    );
}

/**
 * Clear the cached token (useful for logout or token invalidation)
 */
export function clearCachedToken(): void {
    cachedToken = null;
    tokenExpiresAt = null;
}
