import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { headers } from "next/headers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the current request's nonce for CSP compliance
 * This should be used in Server Components when you need to add
 * nonce attributes to Script components or inline scripts
 */
export async function getCurrentNonce(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-nonce");
}
