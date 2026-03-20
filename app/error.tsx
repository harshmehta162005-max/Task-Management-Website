'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Something went wrong</h1>
      <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', overflowX: 'auto', marginTop: '16px', color: 'red' }}>
        {error.message}
      </pre>
      <pre style={{ background: '#333', color: 'white', padding: '12px', borderRadius: '8px', overflowX: 'auto', marginTop: '16px', fontSize: '11px' }}>
        {error.stack}
      </pre>
      <button onClick={reset} style={{ marginTop: '16px', padding: '8px 16px', background: 'black', color: 'white', borderRadius: '4px' }}>Try again</button>
    </main>
  );
}
