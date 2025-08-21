/**
 * Test suite for the API layer of the Aspire Cards application
 * Tests data seeding, card creation, and transaction generation functionality
 * Uses Vitest with jsdom environment for browser-like localStorage testing
 */
import { describe, it, expect, beforeEach } from "vitest";
import { seedInitialData, getCards, getTransactions, createCard } from "@/lib/api";

/**
 * Helper function to clear localStorage before each test
 * Ensures test isolation and prevents data leakage between tests
 */
function clearStorage() {
    window.localStorage.clear();
}

/**
 * Test suite for API data flow functionality
 * Covers the core data management operations of the application
 */
describe("api data flow", () => {
    // Clear storage before each test to ensure clean state
    beforeEach(() => {
        clearStorage();
    });

    /**
     * Test that initial data seeding works correctly
     * Verifies that the app creates one card and at least four transactions
     */
    it("seeds initial data with one card and four transactions", async () => {
        await seedInitialData();
        const cards = await getCards();
        const tx = await getTransactions();
        
        // Should create exactly one initial card
        expect(cards.length).toBe(1);
        // Should create at least 4 transactions for the initial view
        expect(tx.length).toBeGreaterThanOrEqual(4);
        // All transactions should have a valid cardId
        expect(tx.every((t) => !!t.cardId)).toBe(true);
    });

    /**
     * Test that creating a new card generates associated transactions
     * Verifies that new cards automatically get random transaction data
     */
    it("createCard appends random transactions for the new card", async () => {
        // Start with initial data
        await seedInitialData();
        const beforeTx = await getTransactions();
        const beforeCards = await getCards();
        
        // Create a new card
        const newCard = await createCard("Test Card");
        const afterCards = await getCards();
        const afterTx = await getTransactions();
        
        // Should have one more card
        expect(afterCards.length).toBe(beforeCards.length + 1);
        // Should have more transactions than before
        expect(afterTx.length).toBeGreaterThan(beforeTx.length);
        
        // The last few transactions should belong to the new card
        const tail = afterTx.slice(-4);
        expect(tail.every((t) => t.cardId === newCard.id)).toBe(true);
    });
}); 