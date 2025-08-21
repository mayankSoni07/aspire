"use client";

import React from "react";

interface ModalProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-gray-900 mx-4">
                {title ? <h3 className="text-lg font-semibold mb-4">{title}</h3> : null}
                {children}
            </div>
        </div>
    );
} 