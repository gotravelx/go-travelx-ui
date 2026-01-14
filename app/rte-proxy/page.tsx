'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { getAccessToken } from '@/utils/auth';

// Force dynamic rendering to prevent static generation errors with useSearchParams
export const dynamic = 'force-dynamic';

function FlightStatusContent() {
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const flightno = searchParams
    ? (searchParams.get('flightno') ?? searchParams.get('flightNo'))
    : null;
  const carrier = searchParams ? searchParams.get('carrier') : null;
  const date = searchParams ? searchParams.get('date') : null;
  const departure = searchParams ? searchParams.get('departure') : null;
  const arrival = searchParams ? searchParams.get('arrival') : null;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!flightno) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch access token
        const token = await getAccessToken();

        // 2. Call proxy with token with carrier
        const query = new URLSearchParams({
          fltNbr: flightno,
          ...(carrier && { carrier }),
          ...(date && { fltLegSchedDepDt: date }),
          ...(departure && { departure }),
          ...(arrival && { arrival }),
        });

        const proxyRes = await fetch(`/api/proxy?${query.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!proxyRes.ok) {
          const proxyError = await proxyRes.text();
          throw new Error(`Proxy error: ${proxyError}`);
        }

        const data = await proxyRes.json();
        setResponse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [flightno, carrier, date, departure, arrival]);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        padding: '24px',
        margin: '90px',
        fontFamily: 'Arial',
        backgroundColor: isDark ? '#000' : '#fff',
        color: isDark ? '#fff' : '#000',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontWeight: 'bold', marginBottom: 20 }}>
        Flight Status: {carrier ? `${carrier} ` : ''}{flightno}
      </h1>

      {loading && <p>Loading…</p>}

      {error && <pre style={{ color: 'red' }}>{error}</pre>}

      {response && (
        <pre
          style={{
            background: isDark ? '#111' : '#f4f4f4',
            padding: '12px',
            overflow: 'auto',
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function RteProxyPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading...</div>}>
      <FlightStatusContent />
    </Suspense>
  );
}
