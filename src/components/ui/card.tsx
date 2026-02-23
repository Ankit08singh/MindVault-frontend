"use Client"

import { cn } from "@/lib/utils"

export default function Card() {
    return (
        <div className={cn("w-72 min-h-100 h-100 rounded-xl",
            "shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]",
            "p-4 flex flex-col"
        )}>
            
            <h2 className="font-bold text-[11px]">Acernity UI Component</h2>
            <p className="text-neutral-600 mt-2 text-[10px]">A collection of beautiful UI components, let's get on with it.</p>
            <div className="flex items-center justify-cent">
                <button></button>
            </div>
        </div>
    )
};