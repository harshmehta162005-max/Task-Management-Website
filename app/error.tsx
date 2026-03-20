'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Something went wrong</h1>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
