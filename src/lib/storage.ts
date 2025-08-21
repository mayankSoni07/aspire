/**
 * Safe localStorage utility functions for the Aspire Cards application
 * Provides error handling and SSR compatibility for Next.js
 */

/**
 * Safely retrieves an item from localStorage with error handling
 * Returns fallback value if localStorage is unavailable or parsing fails
 * 
 * @param key - The localStorage key to retrieve
 * @param fallback - Default value to return if retrieval fails
 * @returns The parsed value from localStorage or fallback
 */
export function safeGetItem<T>(key: string, fallback: T): T {
    // Return fallback during SSR when window is undefined
    if (typeof window === "undefined") return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        // Return fallback if JSON parsing fails or localStorage is unavailable
        return fallback;
    }
}

/**
 * Safely stores an item in localStorage with error handling
 * Silently fails if localStorage is unavailable (e.g., private browsing)
 * 
 * @param key - The localStorage key to store under
 * @param value - The value to store (will be JSON stringified)
 */
export function safeSetItem<T>(key: string, value: T): void {
    // Do nothing during SSR when window is undefined
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch { 
        // Silently fail if localStorage is unavailable
        // This prevents the app from crashing in private browsing mode
    }
} 