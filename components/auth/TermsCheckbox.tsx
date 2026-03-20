type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
};

export function TermsCheckbox({ checked, onChange, error }: Props) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="flex h-5 items-center">
        <input
          id="terms"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border-slate-300 bg-slate-50 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
        />
      </div>
      <label className="leading-tight text-sm text-slate-600 dark:text-slate-400" htmlFor="terms">
        I agree to the{" "}
        <a className="font-medium text-primary hover:underline" href="#">
          Terms
        </a>{" "}
        and{" "}
        <a className="font-medium text-primary hover:underline" href="#">
          Privacy Policy
        </a>
      </label>
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}
