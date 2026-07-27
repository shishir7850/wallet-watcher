export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
      <p className="text-sm text-gray-500">Analyzing your statement...</p>
    </div>
  );
}
