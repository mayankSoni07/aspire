"use client";

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useCards } from "@/context/CardContext";
import Transactions from "@/components/Transactions";
import CardDetailsHeader from "@/components/CardDetailsHeader";

const ActionItem: React.FC<{ icon: string; label: string; onClick?: () => void }> = ({ onClick, icon, label }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 text-center text-sm font-medium text-[#1F2B5A]">
        <div className="grid h-12 w-12 place-items-center">
            <Image src={icon} alt={label} width={40} height={40} />
        </div>
        {label}
    </button>
);

function CollapsedDetailsPreview() {
    return (
        <div className="px-5 py-5 pb-4" style={{ backgroundColor: "white" }}>
            <CardDetailsHeader />
        </div>
    );
}

export default function MobileBottomSheet() {
    const { cards, selectedIndex, toggleFreeze } = useCards();
    const current = cards[selectedIndex];
    const collapsedHeight = 300;
    const [expanded, setExpanded] = useState(false);
    const startY = useRef<number | null>(null);
    const [dragDelta, setDragDelta] = useState(0); // positive means up
    const contentRef = useRef<HTMLDivElement | null>(null);
    const startTouchY = useRef<number | null>(null);

    const targetHeight = useMemo(() => (expanded ? "calc(100svh - 110px)" : `${collapsedHeight}px`), [expanded]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        startY.current = e.clientY;
        setDragDelta(0);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (startY.current === null) return;
        setDragDelta(startY.current - e.clientY);
    }, []);

    const onPointerUp = useCallback(() => {
        if (startY.current === null) return;
        const threshold = 50;
        if (!expanded && dragDelta > threshold) setExpanded(true);
        else if (expanded && dragDelta < -threshold) setExpanded(false);
        startY.current = null;
        setDragDelta(0);
    }, [dragDelta, expanded]);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        startTouchY.current = e.touches[0]?.clientY ?? null;
    }, []);
    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (startTouchY.current == null) return;
        const currentY = e.touches[0]?.clientY ?? startTouchY.current;
        const deltaUp = startTouchY.current - currentY; // positive when finger moves up
        const threshold = 25;
        if (!expanded && deltaUp > threshold) {
            setExpanded(true);
            startTouchY.current = null;
            return;
        }
        if (expanded && deltaUp < -threshold && (contentRef.current?.scrollTop ?? 0) <= 0) {
            setExpanded(false);
            startTouchY.current = null;
            return;
        }
    }, [expanded]);
    const onTouchEnd = useCallback(() => {
        startTouchY.current = null;
    }, []);

    const onWheelSheet = useCallback(
        (e: React.WheelEvent) => {
            if (!expanded && e.deltaY < 0) {
                setExpanded(true);
                return;
            }
            if (expanded && (contentRef.current?.scrollTop ?? 0) <= 0 && e.deltaY > 0) {
                setExpanded(false);
            }
        },
        [expanded]
    );

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        const node: HTMLDivElement = el;
        function onWheel(e: WheelEvent) {
            if (!expanded) return;
            const atTop = node.scrollTop <= 0;
            if (atTop && e.deltaY > 0) setExpanded(false);
        }
        node.addEventListener("wheel", onWheel, { passive: true });
        return () => {
            node.removeEventListener("wheel", onWheel);
        };
    }, [expanded]);

    if (!current) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
            <div
                className="rounded-t-[24px] bg-[var(--color-sheet)] shadow-2xl transition-[height] duration-300 overflow-hidden w-full overscroll-contain"
                style={{ height: targetHeight, transform: `translateY(${Math.max(0, -dragDelta)}px)` }}
                onWheel={onWheelSheet}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="relative cursor-pointer touch-action-none select-none"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                >
                    <div className="mx-auto my-3 h-1.5 w-16 rounded-full bg-[var(--color-indicator)]" />
                </div>
                <div className="px-5 pb-3">
                    <div className="grid grid-cols-5 gap-3">
                        <ActionItem onClick={() => toggleFreeze(current.id)} icon="/Freeze card.svg" label="Freeze card" />
                        <ActionItem icon="/Set spend limit.svg" label="Set spend limit" />
                        <ActionItem icon="/GPay.svg" label="Add to GPay" />
                        <ActionItem icon="/Replace card.svg" label="Replace card" />
                        <ActionItem icon="/Deactivate card.svg" label="Cancel card" />
                    </div>
                </div>
                {!expanded && <CollapsedDetailsPreview />}
                <div
                    ref={contentRef}
                    className="h-[1px] overflow-y-auto overscroll-contain px-4 py-4 pb-6 bg-white/95"
                    style={{ height: expanded ? "calc(100% - 170px)" : 0 }}
                >
                    <div className="mb-4"><CardDetailsHeader /></div>
                    <Transactions />
                </div>
            </div>
        </div>
    );
} 