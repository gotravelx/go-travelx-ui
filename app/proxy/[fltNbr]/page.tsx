'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function ProxyFlightPage() {
  const params = useParams<{ fltNbr: string }>();
  const searchParams = useSearchParams();

  const fltNbr = params?.fltNbr;

  const carrier = searchParams ? searchParams.get('carrier') : null;
  const departure = searchParams ? searchParams.get('departure') : null;
  const arrival = searchParams ? searchParams.get('arrival') : null;
  const fltLegSchedDepDt = searchParams ? searchParams.get('fltLegSchedDepDt') : null;

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Theme hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch flight data
  useEffect(() => {
    if (!fltNbr) return;

    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.set('fltNbr', fltNbr);

    if (carrier) query.set('carrier', carrier);
    if (departure) query.set('departure', departure);
    if (arrival) query.set('arrival', arrival);
    if (fltLegSchedDepDt) query.set('fltLegSchedDepDt', fltLegSchedDepDt);

    const fetchFlightStatus = async () => {
      try {
        const res = await fetch(`/api/proxy?${query.toString()}`);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        setResponse(data);
      } catch (err: any) {
        setError(err.message ?? 'Request failed');
      } finally {
        setLoading(false);
      }
    };

    fetchFlightStatus();
  }, [fltNbr, carrier, departure, arrival, fltLegSchedDepDt]);

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
      <h1 style={{fontWeight:"bold",margin:"20px 0 20px 0"}}>Flight Status: {carrier ? `${carrier} ` : ''}{fltNbr}</h1>

      {loading && <p>Loading…</p>}

      {error && (
        <pre style={{ color: isDark ? '#ff6b6b' : 'red' }}>
          {error}
        </pre>
      )}

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
