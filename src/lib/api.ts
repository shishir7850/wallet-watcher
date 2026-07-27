import { ParseResponse } from "@/types/transaction";

export async function uploadStatement(file: File): Promise<ParseResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/parse", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to parse statement");
  }

  return data;
}
