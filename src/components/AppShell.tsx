/**
 * Main application shell component that provides the overall layout structure
 * Contains the header, main content area, and mobile-specific components
 * Manages the responsive layout differences between desktop and mobile
 */
"use client";

import React, { useState } from "react";
import { CardProvider } from "@/context/CardContext";
import CardCarousel from "@/components/CardCarousel";
import ActionsBar from "@/components/ActionsBar";
import Transactions from "@/components/Transactions";
import AddCardModal from "@/components/AddCardModal";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import MobileBottomNav from "@/components/MobileBottomNav";
import CardDetailsHeader from "@/components/CardDetailsHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import Image from "next/image";

/**
 * Header component that displays available balance and "New card" button
 * Shows different button designs for mobile vs desktop
 */
function Header({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex items-center justify-between w-full gap-4">
            {/* Left side: Available balance display */}
            <div className="flex-1 min-w-0">
                <div className="text-sm text-white/80 lg:text-gray-600">Available balance</div>
                <div className="mt-1 flex items-center gap-2 text-2xl sm:text-3xl font-bold text-white lg:text-[var(--color-navy-900)]">
                    <span className="rounded bg-[var(--color-card-green)] px-2 py-1 text-sm font-semibold text-white lg:text-white">S$</span>
                    3,000
                </div>
            </div>
            {/* Mobile Button - Dark blue background with light blue circle */}
            <button
                onClick={onAdd}
                className="block sm:hidden flex items-center gap-2 bg-[#0E2A47] text-[#23CEFD] px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md flex-shrink-0"
            >
                <div className="w-4 h-4 rounded-full bg-[#23CEFD] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#0E2A47]">+</span>
                </div>
                <span className="whitespace-nowrap text-sm font-semibold">New card</span>
            </button>

            {/* Desktop Button - Blue background with white plus icon */}
            <button
                onClick={onAdd}
                className="desktop-button hidden sm:block new-card-button flex items-center gap-3 px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md flex-shrink-0"
            >
                <Image src="/plus-icon.svg" alt="add" width={18} height={18} className="flex-shrink-0" />
                <span className="whitespace-nowrap text-base font-semibold">New card</span>
            </button>
        </div>
    );
}

/**
 * Main AppShell component that orchestrates the entire application layout
 * Wraps everything in CardProvider for state management
 * Handles responsive layout and component organization
 */
export default function AppShell() {
    // State to control the add card modal visibility
    const [open, setOpen] = useState(false);
    return (
        <CardProvider>
            <div className="min-h-screen bg-[#0E2A47] pb-[64px]">
                <div className="w-full">
                    {/* Main grid layout: sidebar + content */}
                    <div className="grid lg:grid-cols-[260px_1fr] gap-0">
                        {/* Desktop sidebar - hidden on mobile */}
                        <DesktopSidebar />
                        {/* Main content area */}
                        <div className="bg-transparent text-white lg:bg-white lg:text-[var(--color-navy-900)] min-h-screen p-4 sm:p-6 lg:p-10">
                            {/* Header with balance and new card button */}
                            <Header onAdd={() => setOpen(true)} />
                            {/* Main content grid: cards + transactions sidebar */}
                            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
                                {/* Left column: Cards and actions */}
                                <div className="min-w-0">
                                    {/* Tab navigation for card types */}
                                    <div className="mb-4 text-sm">
                                        <div className="flex gap-8">
                                            <button className="relative font-medium text-white lg:text-[var(--color-navy-900)]">
                                                My debit cards
                                                <span className="absolute -bottom-2 left-0 h-[3px] w-24 bg-[#23CEFD] rounded-full" />
                                            </button>
                                            <button className="text-white/60 lg:text-gray-400">All company cards</button>
                                        </div>
                                    </div>
                                    {/* Card carousel - center aligned with max width */}
                                    <div className="mx-auto max-w-[560px] w-full mt-12">
                                        <CardCarousel />
                                    </div>
                                    {/* Desktop actions bar - hidden on mobile */}
                                    <div className="hidden lg:block">
                                        <ActionsBar />
                                    </div>
                                </div>
                                {/* Right column: Card details and transactions (desktop only) */}
                                <div className="space-y-4 lg:block hidden">
                                    <CardDetailsHeader />
                                    <Transactions />
                                </div>
                            </div>
                            {/* Add card modal */}
                            <AddCardModal open={open} onClose={() => setOpen(false)} />
                        </div>
                    </div>
                </div>
                {/* Mobile-specific components */}
                <MobileBottomSheet />
                <MobileBottomNav />
            </div>
        </CardProvider>
    );
}
