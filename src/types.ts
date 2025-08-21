/**
 * TypeScript type definitions for the Aspire Cards application
 * Defines the core data structures used throughout the application
 */

// Currently only supports Singapore Dollar
export type Currency = "SGD";

/**
 * Card interface representing a debit/credit card
 * Contains all essential card information for display and management
 */
export interface Card {
    id: string;
    name: string; // Card holder or custom label
    maskedNumber: string; // e.g., **** **** **** 2020
    fullNumber: string; // 16 digits without spaces
    expiryMonth: number; // 1-12
    expiryYear: number; // 2-digit or 4-digit; we will store 2-digit
    brand: "visa" | "mastercard";
    isFrozen: boolean;
}

// Transaction can be either incoming money (credit) or outgoing money (debit)
export type TransactionType = "credit" | "debit";

/**
 * Transaction interface representing a financial transaction
 * Contains all transaction details including merchant, amount, and metadata
 */
export interface Transaction {
    id: string;
    merchant: string;
    dateISO: string; // YYYY-MM-DD
    amount: number; // positive numbers; sign decided by type
    currency: Currency;
    type: TransactionType;
    categoryIcon?: string; // emoji or icon key
    note?: string;
    cardId: string; // which card was used
} 