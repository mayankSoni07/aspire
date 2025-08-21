/**
 * Mock API layer for the Aspire Cards application
 * Provides data persistence using localStorage and generates realistic sample data
 * Handles card management, transaction history, and data seeding
 */
"use client";

import { Card, Transaction } from "@/types";
import { safeGetItem, safeSetItem } from "@/lib/storage";

// Storage keys for localStorage persistence
const CARDS_KEY = "aspire.cards.v1";
const TX_KEY = "aspire.tx.v1";

/**
 * Generates a unique identifier with optional prefix
 * Uses random string generation for uniqueness
 */
function generateId(prefix: string = "id"): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Generates a random 16-digit card number for demo purposes
 * Creates realistic-looking card numbers for the application
 */
function generateCardNumber(): string {
    let num = "";
    for (let i = 0; i < 16; i++) num += Math.floor(Math.random() * 10);
    return num;
}

/**
 * Converts a card number to masked format for display
 * Shows only the last 4 digits, replaces others with bullets
 */
function toMasked(number: string): string {
    return `${number.slice(0, 4)} ${number.slice(4, 8)} ${number.slice(8, 12)} ${number.slice(12, 16)}`.replace(/\d(?=\d{4})/g, "•");
}

/**
 * Retrieves all cards from localStorage
 * Returns empty array if no cards exist
 */
export async function getCards(): Promise<Card[]> {
    const cards = safeGetItem<Card[]>(CARDS_KEY, []);
    return cards;
}

/**
 * Retrieves all transactions from localStorage
 * Ensures proper data structure and provides fallback data if needed
 */
export async function getTransactions(): Promise<Transaction[]> {
    const tx = safeGetItem<Transaction[]>(TX_KEY, []);
    if (tx.length === 0) return tx;
    let next = tx;
    // Ensure category icons exist
    if (next.some((t) => !t.categoryIcon)) {
        const icons = ["/file-storage.svg", "/flights.svg", "/megaphone.svg", "/file-storage.svg"];
        next = next.map((t, i) => (t.categoryIcon ? t : { ...t, categoryIcon: icons[i % icons.length] }));
    }
    // Ensure exactly 4 items exist for initial view (append if fewer)
    if (next.length < 4) {
        const cards = safeGetItem<Card[]>(CARDS_KEY, []);
        const firstCardId = cards[0]?.id ?? "";
        const missing = 4 - next.length;
        for (let i = 0; i < missing; i++) {
            next.push({
                id: generateId("tx"),
                merchant: "Hamleys",
                dateISO: "2020-05-20",
                amount: 150,
                currency: "SGD",
                type: "debit",
                note: "Charged to debit card",
                categoryIcon: "/file-storage.svg",
                cardId: firstCardId,
            });
        }
    }
    if (next !== tx) safeSetItem(TX_KEY, next);
    return next;
}

/**
 * Seeds the application with initial data on first load
 * Creates a default card and sample transactions if none exist
 */
export async function seedInitialData(): Promise<void> {
    const existing = safeGetItem<Card[]>(CARDS_KEY, []);
    if (existing.length > 0) return; // Don't seed if data already exists
    
    // Create the initial card
    const number = "4123456789012020";
    const initial: Card = {
        id: generateId("card"),
        name: "Mark Henry",
        fullNumber: number,
        maskedNumber: toMasked(number),
        expiryMonth: 12,
        expiryYear: 20,
        brand: "visa",
        isFrozen: false,
    };
    safeSetItem(CARDS_KEY, [initial]);
    
    // Create sample transactions for the initial card
    const date = "2020-05-20";
    const tx: Transaction[] = [
        {
            id: generateId("tx"),
            merchant: "Hamleys",
            dateISO: date,
            amount: 150,
            currency: "SGD",
            type: "credit",
            note: "Refund on debit card",
            categoryIcon: "/file-storage.svg",
            cardId: initial.id,
        },
        {
            id: generateId("tx"),
            merchant: "Hamleys",
            dateISO: date,
            amount: 150,
            currency: "SGD",
            type: "debit",
            note: "Charged to debit card",
            categoryIcon: "/flights.svg",
            cardId: initial.id,
        },
        {
            id: generateId("tx"),
            merchant: "Hamleys",
            dateISO: date,
            amount: 150,
            currency: "SGD",
            type: "debit",
            note: "Charged to debit card",
            categoryIcon: "/megaphone.svg",
            cardId: initial.id,
        },
        {
            id: generateId("tx"),
            merchant: "Hamleyss",
            dateISO: date,
            amount: 150,
            currency: "SGD",
            type: "debit",
            note: "Charged to debit card",
            categoryIcon: "/file-storage.svg",
            cardId: initial.id,
        },
    ];
    safeSetItem(TX_KEY, tx);
}

/**
 * Generates a random date within the specified number of days in the past
 * Used for creating realistic transaction dates
 */
function randomDateISO(daysBack: number = 60): string {
    const now = new Date();
    const past = new Date(now.getTime() - Math.floor(Math.random() * daysBack) * 24 * 60 * 60 * 1000);
    const yyyy = past.getFullYear();
    const mm = String(past.getMonth() + 1).padStart(2, "0");
    const dd = String(past.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Randomly selects an item from an array
 * Used for generating varied transaction data
 */
function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates random transactions for a specific card
 * Creates realistic transaction data with varied merchants, amounts, and types
 * Automatically called when creating new cards
 */
export async function addRandomTransactionsForCard(cardId: string, count: number = 4): Promise<Transaction[]> {
    const existing = safeGetItem<Transaction[]>(TX_KEY, []);
    const merchants = ["Hamleys", "Grab", "Amazon", "Uber", "Starbucks"];
    const notes = ["Charged to debit card", "Refund on debit card", "Subscription payment", "One-time purchase"];
    const icons = ["/file-storage.svg", "/flights.svg", "/megaphone.svg", "/file-storage.svg"];
    const next: Transaction[] = [...existing];
    for (let i = 0; i < count; i++) {
        const type = Math.random() < 0.25 ? "credit" : "debit"; // 25% chance of credit
        const amount = 20 + Math.floor(Math.random() * 300); // Random amount between 20-320
        next.push({
            id: generateId("tx"),
            merchant: pick(merchants),
            dateISO: randomDateISO(120), // Random date within last 120 days
            amount,
            currency: "SGD",
            type,
            note: pick(notes),
            categoryIcon: pick(icons),
            cardId,
        });
    }
    safeSetItem(TX_KEY, next);
    return next.slice(-count); // Return only the newly created transactions
}

/**
 * Creates a new card with the specified name
 * Generates random card details and automatically creates associated transactions
 */
export async function createCard(name: string): Promise<Card> {
    const cards = safeGetItem<Card[]>(CARDS_KEY, []);
    const number = generateCardNumber();
    const card: Card = {
        id: generateId("card"),
        name,
        fullNumber: number,
        maskedNumber: toMasked(number),
        expiryMonth: Math.max(1, Math.ceil(Math.random() * 12)), // Random month 1-12
        expiryYear: 20 + Math.ceil(Math.random() * 5), // Random year 2020-2025
        brand: "visa",
        isFrozen: false,
    };
    const next = [...cards, card];
    safeSetItem(CARDS_KEY, next);
    // Append a few randomized transactions for this new card
    await addRandomTransactionsForCard(card.id, 4);
    return card;
}

/**
 * Updates an existing card in storage
 * Used for toggling freeze state and other card modifications
 */
export async function updateCard(card: Card): Promise<Card> {
    const cards = safeGetItem<Card[]>(CARDS_KEY, []);
    const idx = cards.findIndex((c) => c.id === card.id);
    if (idx >= 0) {
        cards[idx] = card;
        safeSetItem(CARDS_KEY, cards);
    }
    return card;
} 