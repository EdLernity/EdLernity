/**
 * Android WebViews / older Chromium often lack Promise.withResolvers (ES2024).
 * pdfjs-dist 4.x requires it — polyfill before any pdfjs import.
 */
export function ensurePromiseWithResolvers() {
  const P = Promise as typeof Promise & {
    withResolvers?: <T>() => {
      promise: Promise<T>;
      resolve: (value: T | PromiseLike<T>) => void;
      reject: (reason?: unknown) => void;
    };
  };

  if (typeof P.withResolvers === "function") return;

  P.withResolvers = function withResolvers<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}
