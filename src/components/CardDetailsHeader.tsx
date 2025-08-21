"use client";

import Image from "next/image";
import React from "react";

export default function CardDetailsHeader({ variant = "blue" }: { variant?: "blue" | "white" }) {
    const containerBg = variant === "white" ? "bg-white" : "bg-[var(--color-light-blue)]/60";
    return (
        <div className={`flex items-center justify-between ${containerBg} rounded-2xl px-5 py-4 shadow-sm`}>
            <div className="flex items-center gap-3">
                <div>
                    <Image src="/Group 11889.svg" alt="Card details" width={18} height={18} />
                </div>
                <div className="text-[#0D2B45] text-[18px] font-semibold">Card details</div>
            </div>
            <Image src="/down-arrow.svg" alt="expand" width={16} height={16} />
        </div>
    );
} 