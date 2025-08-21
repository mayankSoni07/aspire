"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useCards } from "@/context/CardContext";

function amountString(type: "credit" | "debit", amount: number) {
    const s = `S$ ${amount}`;
    return type === "credit" ? `+ ${s}` : `- ${s}`;
}

function CategoryAvatar({ icon, tone = "blue" }: { icon?: string; tone?: "blue" | "mint" | "pink" }) {
    const toneBg = tone === "pink" ? "var(--color-light-pink)" : tone === "mint" ? "var(--color-light-mint)" : "var(--color-light-blue)";
    return (
        <div className="h-14 w-14 rounded-full grid place-items-center" style={{ backgroundColor: toneBg }}>
            {icon ? <Image src={icon} alt="icon" width={22} height={22} /> : null}
        </div>
    );
}

export default function Transactions() {
    const { transactions, cards, selectedIndex } = useCards();
    const currentCardId = cards[selectedIndex]?.id;
    const list = useMemo(() => transactions.filter((t) => t.cardId === currentCardId).slice(0, 4), [transactions, currentCardId]);

    return (
        <div className="rounded-2xl bg-white p-0 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between bg-[var(--color-light-blue)]/60 px-5 py-4">
                <div className="flex items-center gap-3 text-[#1F2B5A]">
                    <Image src="/Group 11889-1.svg" alt="recent" width={20} height={20} />
                    <h3 className="text-[18px] font-semibold">Recent transactions</h3>
                </div>
                <Image src="/down-arrow.svg" alt="collapse" width={16} height={16} style={{ transform: "rotate(180deg)" }} />
            </div>
            <div className="px-5">
                {list.map((t, idx) => (
                    <div key={t.id} className="py-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-4 min-w-0">
                                <CategoryAvatar icon={t.categoryIcon} tone={idx === 1 ? "mint" : idx === 2 ? "pink" : "blue"} />
                                <div className="min-w-0">
                                    <div className="text-[16px] font-semibold text-[#1F2B5A] truncate">{t.merchant}</div>
                                    <div className="text-[14px] text-gray-400">{new Date(t.dateISO).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="text-[16px] font-semibold" style={{ color: t.type === "credit" ? "var(--color-card-green)" : "#333" }}>
                                    {amountString(t.type, t.amount)}
                                </div>
                                <Image src="/next-3.svg" alt="chevron" width={16} height={16} />
                            </div>
                        </div>
                        <div className="mt-3 ml-[72px] flex items-center gap-2 text-[15px]" style={{ color: "var(--color-blue-500)" }}>
                            <div className="grid h-7 w-7 place-items-center rounded-full" style={{ backgroundColor: "var(--color-blue-500)", opacity: 0.9 }}>
                                <Image src="/Account.svg" alt="card" width={16} height={16} />
                            </div>
                            <span className="truncate">{t.note}</span>
                        </div>
                        {idx < list.length - 1 && <div className="mt-5 h-px bg-gray-100 ml-[72px]" />}
                    </div>
                ))}
            </div>
            <div className="bg-[var(--color-light-mint)]/60 text-center py-4 text-[18px] font-medium" style={{ color: "var(--color-brand-green)" }}>
                View all card transactions
            </div>
        </div>
    );
} 