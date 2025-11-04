import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
    onClick: () => void;
}

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
            aria-label="Open menu"
        >
            <Menu size={24} />
        </button>
    );
}
