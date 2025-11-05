import { Brain, Home, Search, PlusCircle, Settings, LogOut, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.info("Logged Out Successfully");
        router.push('/login');
    }

    const menuItems = [
        { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
        { icon: Search, label: "Search", href: "/search", active: false },
        { icon: PlusCircle, label: "Add Video", href: "/add-video", active: false },
        { icon: Settings, label: "Settings", href: "/settings", active: false },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed lg:sticky top-0 left-0 h-screen
                    bg-stone-900 border-r border-stone-700 
                    flex flex-col z-50
                    transition-all duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'lg:w-20' : 'w-64'}
                `}
            >
                {/* Logo & Brand */}
                <div className={`p-6 border-b border-stone-700 transition-all duration-300 ${isCollapsed ? 'lg:p-4' : ''}`}>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={onMobileClose}
                        className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                            <Brain className="text-white" size={24} />
                        </div>
                        <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
                            <h1 className="text-xl font-bold text-white whitespace-nowrap">MemoryVault</h1>
                            <p className="text-xs text-gray-400 whitespace-nowrap">Your Video Memory</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onMobileClose}
                            className={`
                                group relative flex items-center gap-3 px-4 py-3 rounded-lg 
                                transition-all duration-200
                                ${item.active 
                                    ? 'bg-stone-800 text-white' 
                                    : 'text-gray-400 hover:text-white hover:bg-stone-800'
                                }
                                ${isCollapsed ? 'lg:justify-center' : ''}
                            `}
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                                {item.label}
                            </span>

                            {/* Tooltip on hover when collapsed */}
                            {isCollapsed && (
                                <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-stone-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                                    {item.label}
                                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-stone-800 rotate-45"></div>
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Stats Section (optional)
                <div className={`p-4 border-t border-stone-700 transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                    <div className="bg-stone-800/50 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Total Videos</p>
                        <p className="text-2xl font-bold text-white">0</p>
                    </div>
                </div> */}

                {/* Logout Button */}
                <div className="p-4 border-t border-stone-700">
                    <button 
                        className={`
                            group relative w-full flex items-center gap-3 px-4 py-3 
                            text-gray-400 hover:text-red-400 hover:bg-stone-800 
                            rounded-lg transition-all duration-200
                            ${isCollapsed ? 'lg:justify-center' : ''}
                        `}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                            Logout
                        </span>

                        {/* Tooltip on hover when collapsed */}
                        {isCollapsed && (
                            <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-stone-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                                Logout
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-stone-800 rotate-45"></div>
                            </div>
                        )}
                    </button>
                </div>

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-stone-800 border border-stone-700 
                    rounded-full items-center justify-center text-gray-400 hover:text-white hover:bg-stone-700 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>
        </>
    );
}