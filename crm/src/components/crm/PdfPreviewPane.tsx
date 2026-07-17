"use client";

import React, { useEffect, useState } from "react";

type Props = {
  blob: Blob | null;
  loading?: boolean;
  emptyLabel?: string;
  className?: string;
};

/**
 * Renders a PDF blob page-by-page on canvas.
 * Works on mobile where iframe/object PDF viewers are blank or blocked.
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

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    const render = async () => {
      setPages([]);
      setRenderError("");
      if (!blob) return;

      setRendering(true);
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const data = await blob.arrayBuffer();
        const header = new TextDecoder().decode(data.slice(0, 8));
        if (!header.startsWith("%PDF")) {
          throw new Error("Server did not return a PDF file");
        }

        const doc = await pdfjs.getDocument({ data }).promise;
        const rendered: string[] = [];

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
          const page = await doc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.35 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas not supported");

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;

          const url = canvas.toDataURL("image/png");
          objectUrls.push(url);
          rendered.push(url);
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
        className={`flex min-h-[420px] h-[70vh] items-center justify-center px-6 text-center text-sm text-error-500 ${className}`}
      >
        {renderError}
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
