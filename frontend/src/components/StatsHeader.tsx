import { useEffect, useState } from "react";
import API from "@/utils/axios";
import { Video, FileText, TrendingUp, Loader } from "lucide-react";

interface Stats {
    totalVideos: number;
    totalArticles: number;
    recentVideos: number;
    recentArticles: number;
}

export function StatsHeader() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get('/content/stats');
            if (res.data.success) {
                setStats(res.data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#B4BEC9]/30 animate-pulse">
                        <div className="h-3 bg-[#B4BEC9]/20 rounded w-20 mb-3"></div>
                        <div className="h-8 bg-[#B4BEC9]/20 rounded w-16"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            label: 'Total Videos',
            value: stats.totalVideos,
            icon: Video,
            color: 'text-red-600',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-200'
        },
        {
            label: 'Total Articles',
            value: stats.totalArticles,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-200'
        },
        {
            label: 'Recent Videos',
            value: stats.recentVideos,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-200',
            subtitle: 'Last 7 days'
        },
        {
            label: 'Recent Articles',
            value: stats.recentArticles,
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-200',
            subtitle: 'Last 7 days'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((stat, index) => (
                <div 
                    key={index}
                    className={`bg-white backdrop-blur-sm rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${stat.borderColor} hover:border-[#C5B67B]`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-[#002333]/60 font-medium mb-1.5 truncate">
                                {stat.label}
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-[#002333]">
                                {stat.value}
                            </p>
                            {stat.subtitle && (
                                <p className="text-xs text-[#002333]/40 mt-1">
                                    {stat.subtitle}
                                </p>
                            )}
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
                            <stat.icon size={20} className={stat.color} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
