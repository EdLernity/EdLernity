"use client";

import React, { useEffect, useState } from "react";
import { ensurePromiseWithResolvers } from "@/lib/promiseWithResolversPolyfill";

type Props = {
  blob: Blob | null;
  loading?: boolean;
  emptyLabel?: string;
  className?: string;
};

/**
 * Renders a PDF blob page-by-page on canvas.
 * Works on mobile where iframe/object PDF viewers are blank or blocked.
 *
 * Uses pdfjs-dist 3.x (no Promise.withResolvers) so Android WebViews work.
 * Polyfill kept as a safety net if the package is upgraded later.
 */
export default function PdfPreviewPane({
  blob,
  loading = false,
  emptyLabel = "Select a document to preview",
  className = "",
}: Props) {
  const [pages, setPages] = useState<string[]>([]);
  const [renderError, setRenderError] = useState("");
  const [rendering, setRendering] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      setPages([]);
      setRenderError("");
      if (!blob) return;

      setRendering(true);
      try {
        ensurePromiseWithResolvers();

        const pdfjs = await import("pdfjs-dist/build/pdf");
        // pdfjs 3.x ships a classic worker that runs on older Android WebViews.
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

        const data = await blob.arrayBuffer();
        const header = new TextDecoder().decode(data.slice(0, 8));
        if (!header.startsWith("%PDF")) {
          throw new Error("Server did not return a PDF file");
        }

        const doc = await pdfjs.getDocument({ data }).promise;
        const rendered: string[] = [];
        const maxPages = Math.min(doc.numPages, 20);

        for (let pageNum = 1; pageNum <= maxPages; pageNum += 1) {
          const page = await doc.getPage(pageNum);
          const scale =
            typeof window !== "undefined" && window.innerWidth < 640 ? 1.1 : 1.35;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas not supported");

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;

          rendered.push(canvas.toDataURL("image/png"));
        }

        if (!cancelled) setPages(rendered);
      } catch (err) {
        if (!cancelled) {
          setRenderError(
            err instanceof Error ? err.message : "Could not render PDF preview"
          );
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [blob]);

  if (loading || rendering) {
    return (
      <div
        className={`flex min-h-[420px] h-[70vh] items-center justify-center text-sm text-gray-500 ${className}`}
      >
        Loading preview…
      </div>
    );
  }

  if (renderError) {
    return (
      <div
        className={`flex min-h-[420px] h-[70vh] flex-col items-center justify-center gap-3 px-6 text-center text-sm ${className}`}
      >
        <p className="text-error-500">{renderError}</p>
        {objectUrl ? (
          <a
            href={objectUrl}
            download="offer-letter.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
          >
            Download PDF instead
          </a>
        ) : null}
      </div>
    );
  }

  if (!blob || pages.length === 0) {
    return (
      <div
        className={`flex min-h-[420px] h-[70vh] items-center justify-center text-sm text-gray-500 ${className}`}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      className={`max-h-[75vh] min-h-[420px] space-y-4 overflow-y-auto rounded-xl bg-gray-100 p-3 dark:bg-gray-900/50 sm:p-4 ${className}`}
    >
      {objectUrl ? (
        <div className="flex justify-end">
          <a
            href={objectUrl}
            download="offer-letter.pdf"
            className="text-xs font-medium text-brand-500 hover:text-brand-600"
          >
            Download PDF
          </a>
        </div>
      ) : null}
      {pages.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${index}-${src.slice(0, 32)}`}
          src={src}
          alt={`Page ${index + 1}`}
          className="mx-auto w-full max-w-4xl rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700"
        />
      ))}
    </div>
  );
}
