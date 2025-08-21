"use client";

import Image from "next/image";
import React from "react";

const items = [
    { key: "home", label: "Home", icon: "/Logo-1.svg" },
    { key: "cards", label: "Cards", icon: "/pay.svg", active: true },
    { key: "payments", label: "Payments", icon: "/Payments.svg" },
    { key: "credit", label: "Credit", icon: "/Credit.svg" },
    { key: "profile", label: "Profile", icon: "/user.svg" },
];

export default function MobileBottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 block lg:hidden">
            <div className="mx-auto w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 border-t border-gray-200">
                <ul className="grid grid-cols-5 gap-2 px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
                    {items.map((it) => (
                        <li key={it.key} className="flex flex-col items-center justify-center text-[11px] leading-4">
                            <Image src={it.icon} alt={it.label} width={24} height={24} className={it.active ? "opacity-100" : "opacity-60"} />
                            <span className={it.active ? "text-[#00D087] font-semibold" : "text-gray-300"}>{it.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
} 