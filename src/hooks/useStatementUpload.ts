"use client";

import { useState } from "react";
import { ParseResponse } from "@/types/transaction";
import { uploadStatement } from "@/lib/api";

type UploadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: ParseResponse };

export function useStatementUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [file, setFile] = useState<File | null>(null);

  async function upload(selectedFile: File) {
    setFile(selectedFile);
    setState({ status: "loading" });

    try {
      const data = await uploadStatement(selectedFile);
      setState({ status: "success", data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }

  function reset() {
    setState({ status: "idle" });
    setFile(null);
  }

  return { state, file, upload, reset };
}
