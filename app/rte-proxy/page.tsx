'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';

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

    setLoading(true);
    setError(null);

    const query = new URLSearchParams({
      fltNbr: flightno,
      ...(carrier && { carrier }),
      ...(date && { fltLegSchedDepDt: date }),
      ...(departure && { departure }),
      ...(arrival && { arrival }),
    });

    fetch(`/api/proxy?${query.toString()}`)
      .then(async res => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        return res.json();
      })
      .then(setResponse)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [flightno, carrier, date, departure, arrival]);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        padding: '24px',
        margin: '50px',
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
