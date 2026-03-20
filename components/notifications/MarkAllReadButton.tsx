type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function MarkAllReadButton({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Mark all as read
    </button>
  );
}

