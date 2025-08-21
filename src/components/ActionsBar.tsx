"use client";

import React from "react";
import Image from "next/image";
import { useCards } from "@/context/CardContext";

const Tile: React.FC<{ icon: string; label: string; onClick?: () => void }> = ({ onClick, icon, label }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-3 text-center hover:scale-105 transition-transform duration-200">
        <div className="grid h-14 w-14 place-items-center">
            <Image src={icon} alt={label} width={45} height={45} />
        </div>
        <span className="text-[18px] leading-5 font-medium text-[#1F2B5A] max-w-[140px] h-10 flex items-center justify-center">{label}</span>
    </button>
);

export default function ActionsBar() {
    const { cards, selectedIndex, toggleFreeze } = useCards();
    const current = cards[selectedIndex];
    if (!current) return null;
    return (
        <div className="mt-6 rounded-[24px] bg-[var(--color-light-blue)] px-8 py-6">
            <div className="grid grid-cols-5 gap-4 place-items-center">
                <Tile onClick={() => toggleFreeze(current.id)} icon="/Freeze card.svg" label="Freeze card" />
                <Tile icon="/Set spend limit.svg" label="Set spend limit" />
                <Tile icon="/GPay.svg" label="Add to GPay" />
                <Tile icon="/Replace card.svg" label="Replace card" />
                <Tile icon="/Deactivate card.svg" label="Cancel card" />
            </div>
        </div>
    );
} 