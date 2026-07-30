interface AlertMessageProps {
  type?: "error" | "warning" | "success";
  title: string;
  message: string;
}

export function AlertMessage({
  type = "error",
  title,
  message,
}: AlertMessageProps) {
  const styles = {
    error:
      "border-red-200 bg-red-50 text-red-700",
    warning:
      "border-amber-200 bg-amber-50 text-amber-700",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm whitespace-pre-line">{message}</p>
    </div>
  );
}