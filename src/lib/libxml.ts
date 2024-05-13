import init from "libxml.wasm/esm";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReturnTypeAsync<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer R> ? R : any;

export function useLibxml() {
  const [instance, setInstance] = useState<ReturnTypeAsync<typeof init> | null>(null)
  useEffect(() => {
    (async () => {
      setInstance(await init())
    })()
  }, [])
  return instance
}
