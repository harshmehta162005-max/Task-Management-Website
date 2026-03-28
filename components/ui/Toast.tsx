"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextType = {
  showToast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

/* ── Toast container rendered via portal into document.body ── */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <>
      {/* Inject animation keyframes */}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 2147483647,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              minWidth: 280,
              maxWidth: 420,
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              backdropFilter: "blur(12px)",
              animation: "toastSlideIn 0.3s ease-out",
              border:
                toast.type === "success"
                  ? "1px solid rgba(16,185,129,0.35)"
                  : "1px solid rgba(239,68,68,0.35)",
              background:
                toast.type === "success"
                  ? "rgba(236,253,245,0.97)"
                  : "rgba(254,242,242,0.97)",
              color: toast.type === "success" ? "#065f46" : "#991b1b",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle
                style={{ width: 18, height: 18, flexShrink: 0, color: "#10b981" }}
              />
            ) : (
              <XCircle
                style={{ width: 18, height: 18, flexShrink: 0, color: "#ef4444" }}
              />
            )}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                flexShrink: 0,
                padding: 2,
                borderRadius: 4,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                opacity: 0.5,
                color: "inherit",
                display: "flex",
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ))}
      </div>
    </>,
    document.body
  );
}

/* ── Provider ── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
