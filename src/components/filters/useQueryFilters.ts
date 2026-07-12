"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    const query = params.toString();
    router.replace(query ? pathname + "?" + query : pathname, { scroll: false });
  };

  const reset = (names: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    names.forEach((name) => params.delete(name));
    const query = params.toString();
    router.replace(query ? pathname + "?" + query : pathname, { scroll: false });
  };

  const value = (name: string) => searchParams.get(name) ?? "";

  return { reset, update, value };
}
