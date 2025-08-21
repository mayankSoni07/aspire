"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useCards } from "@/context/CardContext";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddCardModal({ open, onClose }: Props) {
    const [name, setName] = useState("");
    const { addCard } = useCards();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;
        await addCard(name.trim());
        setName("");
        onClose();
    }

    return (
        <Modal open={open} title="Add new card" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block text-sm font-medium text-gray-800">
                    Card name
                    <input
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#00D087] focus:border-[#00D087] text-gray-900 placeholder:text-gray-400 bg-white transition-colors duration-200"
                        placeholder="e.g. Marketing Card"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </label>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-4 py-2.5 text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-[#00D087] px-4 py-2.5 font-medium text-white hover:bg-[#00B876] transition-colors duration-200"
                    >
                        Add
                    </button>
                </div>
            </form>
        </Modal>
    );
} 