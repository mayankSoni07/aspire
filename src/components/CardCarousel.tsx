"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useCards } from "@/context/CardContext";
import CardView from "@/components/CardView";

export default function CardCarousel() {
    const { cards, selectedIndex, selectCard, toggleShowNumbers, showNumbers } = useCards();
    const clampedIndex = useMemo(() => Math.max(0, Math.min(selectedIndex, Math.max(0, cards.length - 1))), [selectedIndex, cards.length]);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const startXRef = useRef<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        startXRef.current = e.clientX;
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }, []);

    const endSwipe = useCallback((clientX: number) => {
        if (startXRef.current === null) return;
        const delta = clientX - startXRef.current;
        const threshold = 60;
        if (delta > threshold && clampedIndex > 0) {
            selectCard(clampedIndex - 1);
        } else if (delta < -threshold && clampedIndex < cards.length - 1) {
            selectCard(clampedIndex + 1);
        }
        startXRef.current = null;
        setIsDragging(false);
    }, [clampedIndex, cards.length, selectCard]);

    const onPointerUp = useCallback((e: React.PointerEvent) => endSwipe(e.clientX), [endSwipe]);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        startXRef.current = e.touches[0]?.clientX ?? null;
        setIsDragging(true);
    }, []);
    const onTouchEnd = useCallback((e: React.TouchEvent) => endSwipe(e.changedTouches[0]?.clientX ?? 0), [endSwipe]);

    if (cards.length === 0) return null;

    return (
        <div className="relative select-none">
            <button
                onClick={toggleShowNumbers}
                className="absolute -top-7 right-0  flex items-center gap-2 rounded-[5px] bg-white px-3 pt-1.5 pb-5 text-sm font-medium text-[#2FCC74] shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
                <Image src="/remove_red_eye-24px.svg" alt="Toggle" width={16} height={16} />
                <span className="whitespace-nowrap">{showNumbers ? "Hide card number" : "Show card number"}</span>
            </button>
            <div
                className="overflow-hidden rounded-2xl"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div
                    ref={trackRef}
                    className={`flex ${isDragging ? "transition-none" : "transition-transform duration-300"}`}
                    style={{ transform: `translateX(-${clampedIndex * 100}%)` }}
                >
                    {cards.map((card) => (
                        <div key={card.id} className="min-w-full flex justify-center">
                            <CardView card={card} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
                {cards.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => selectCard(idx)}
                        aria-label={`Go to card ${idx + 1}`}
                        className={idx === clampedIndex ? "h-2 w-6 rounded-full bg-[#00D087]" : "h-2 w-2 rounded-full bg-[#00D087]/40"}
                    />
                ))}
            </div>
        </div>
    );
} 