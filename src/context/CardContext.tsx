/**
 * React Context provider for managing card and transaction state
 * Provides global state management for the entire Aspire Cards application
 * Handles cards, transactions, selected card index, and UI state
 */
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Card, Transaction } from "@/types";
import { createCard, getCards, getTransactions, seedInitialData, updateCard } from "@/lib/api";

/**
 * Interface defining the shape of the card context state
 * Contains all data and functions needed by components throughout the app
 */
interface CardState {
    cards: Card[]; // Array of all available cards
    selectedIndex: number; // Index of currently selected card in carousel
    transactions: Transaction[]; // Array of all transactions across all cards
    loading: boolean; // Whether initial data is still being loaded
    showNumbers: boolean; // Whether to show full card numbers or masked
    selectCard: (index: number) => void; // Function to select a card by index
    addCard: (name: string) => Promise<Card>; // Function to create a new card
    toggleFreeze: (id: string) => Promise<void>; // Function to freeze/unfreeze a card
    toggleShowNumbers: () => void; // Function to toggle card number visibility
}

// Create the React context with undefined initial value
const Ctx = createContext<CardState | undefined>(undefined);

/**
 * CardProvider component that wraps the application with card state
 * Manages all card-related data and provides it to child components
 */
export function CardProvider({ children }: { children: React.ReactNode }) {
    // State for storing cards, transactions, and UI preferences
    const [cards, setCards] = useState<Card[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showNumbers, setShowNumbers] = useState(false);

    // Effect to initialize data on component mount
    useEffect(() => {
        (async () => {
            // Seed initial data if this is the first time loading
            await seedInitialData();
            // Load both cards and transactions in parallel
            const [c, t] = await Promise.all([getCards(), getTransactions()]);
            setCards(c);
            setTransactions(t);
            setLoading(false);
        })();
    }, []);

    // Function to select a card by index
    const selectCard = useCallback((index: number) => setSelectedIndex(index), []);

    /**
     * Function to add a new card
     * Creates the card, refreshes all data, and selects the new card
     */
    const addCard = useCallback(async (name: string) => {
        // Create the new card (this also generates random transactions)
        const card = await createCard(name);
        // Refresh both cards and transactions to get the latest data
        const [freshCards, freshTx] = await Promise.all([getCards(), getTransactions()]);
        setCards(freshCards);
        setTransactions(freshTx);
        // Select the newly created card (last in the array)
        setSelectedIndex(Math.max(0, freshCards.length - 1));
        return card;
    }, []);

    /**
     * Function to toggle the freeze state of a card
     * Updates both local state and persistent storage
     */
    const toggleFreeze = useCallback(async (id: string) => {
        // Optimistically update local state for immediate UI feedback
        setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFrozen: !c.isFrozen } : c)));
        // Find the card and update it in storage
        const card = cards.find((c) => c.id === id);
        if (card) await updateCard({ ...card, isFrozen: !card.isFrozen });
    }, [cards]);

    // Function to toggle card number visibility
    const toggleShowNumbers = useCallback(() => setShowNumbers((v) => !v), []);

    // Memoized context value to prevent unnecessary re-renders
    const value = useMemo<CardState>(
        () => ({ cards, transactions, selectedIndex, loading, showNumbers, selectCard, addCard, toggleFreeze, toggleShowNumbers }),
        [cards, transactions, selectedIndex, loading, showNumbers, selectCard, addCard, toggleFreeze, toggleShowNumbers]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Hook to access the card context
 * Must be used within a CardProvider component
 * Throws an error if used outside of the provider
 */
export function useCards() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useCards must be used inside CardProvider");
    return ctx;
} 