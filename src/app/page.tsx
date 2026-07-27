"use client";

import Header from "@/components/shared/Header";
import DropZone from "@/components/upload/DropZone";
import FilePreview from "@/components/upload/FilePreview";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorBanner from "@/components/shared/ErrorBanner";
import Dashboard from "@/components/results/Dashboard";
import { useStatementUpload } from "@/hooks/useStatementUpload";

export default function Home() {
  const { state, file, upload, reset } = useStatementUpload();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {state.status === "success" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Statement Analysis
                {state.data.bank !== "unknown" && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({state.data.bank})
                  </span>
                )}
              </h2>
              <button
                onClick={reset}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Upload Another
              </button>
            </div>
            {state.data.warning && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
                {state.data.warning}
              </div>
            )}
            {state.data.debug_markdown && (
              <details className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <summary className="text-sm font-medium text-gray-600 cursor-pointer">
                  Debug: Raw markdown output
                </summary>
                <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap overflow-x-auto max-h-96">
                  {state.data.debug_markdown}
                </pre>
              </details>
            )}
            <Dashboard data={state.data} />
          </div>
        ) : (
          <div className="mx-auto max-w-lg space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Analyze Your Spending
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Upload a bank statement PDF to see your spending breakdown.
                Everything is processed on the server — no data is stored.
              </p>
            </div>

            <DropZone
              onFileSelected={upload}
              disabled={state.status === "loading"}
            />

            {file && state.status !== "loading" && (
              <FilePreview file={file} onRemove={reset} />
            )}

            {state.status === "loading" && <LoadingSpinner />}

            {state.status === "error" && (
              <ErrorBanner message={state.message} onDismiss={reset} />
            )}
          </div>
        )}
      </main>
    </>
  );
}
