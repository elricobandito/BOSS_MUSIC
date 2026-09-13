"use client";

import { useState } from "react";

export default function BuyButton({
  songId,
  price,
}: {
  songId: string;
  price: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("");

  async function buy() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/songs/${songId}/purchase`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Purchase failed");
      setMessage(data.message);
      setStatus("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Purchase failed");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-emerald-200">
        {message}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={buy}
        disabled={status === "loading"}
        className="btn-primary w-full text-lg disabled:opacity-60"
      >
        {status === "loading" ? "Processing…" : `Buy for ${price}`}
      </button>
      {status === "error" && (
        <p className="mt-2 text-sm text-rose-300">{message}</p>
      )}
    </div>
  );
}
