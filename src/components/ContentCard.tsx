import { ExternalLink, Trash, Play, FileText, CheckCircle2 } from "lucide-react";
import API from "@/utils/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ContentItem {
    _id: string;
    type: 'video' | 'article';
    title: string;
    contentUrl: string;
    preview?: string;
    source?: string;
    duration?: string;
    excerpt?: string;
    wordCount?: number;
    author?: string;
    createdAt: string;
}

interface ContentCardProps {
    item: ContentItem;
    isSelected?: boolean;
    onSelect?: () => void;
    onDeleted?: () => void;
    selectionMode?: boolean;
}

export default function ContentCard({ 
    item, 
    isSelected = false, 
    onSelect, 
    onDeleted,
    selectionMode = false 
}: ContentCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!window.confirm(`Delete this ${item.type}?`)) return;

        setIsDeleting(true);
        toast.loading(`Deleting ${item.type}...`, { id: `delete-${item._id}` });

        try {
            const endpoint = item.type === 'video' 
                ? '/videos/deletevideo' 
                : '/articles/delete';
            
            const payload = item.type === 'video'
                ? { videoUrl: item.contentUrl }
                : { articleId: item._id };

            await API.post(endpoint, payload);
            
            toast.success(`${item.type === 'video' ? 'Video' : 'Article'} deleted!`, { 
                id: `delete-${item._id}` 
            });
            
            onDeleted?.();
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg, { id: `delete-${item._id}` });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCardClick = () => {
        if (selectionMode && onSelect) {
            onSelect();
        } else {
            window.open(item.contentUrl, '_blank');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div 
            className={`
                group relative bg-white backdrop-blur-sm rounded-xl overflow-hidden 
                border-2 transition-all duration-300 cursor-pointer
                ${isSelected 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]' 
                    : 'border-[#B4BEC9]/30 hover:border-[#C5B67B]/60 hover:shadow-lg hover:scale-[1.01]'
                }
                ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
            `}
            onClick={handleCardClick}
        >
            {/* Selection Checkbox */}
            {(selectionMode || isSelected) && onSelect && (
                <div 
                    className="absolute top-3 left-3 z-20"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                >
                    <div className={`
                        w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer
                        ${isSelected 
                            ? 'bg-blue-500 border-blue-500 scale-110' 
                            : 'bg-white/95 border-gray-400 hover:border-blue-400 hover:bg-blue-50'
                        }
                    `}>
                        {isSelected && <CheckCircle2 size={16} className="text-white" strokeWidth={3} />}
                    </div>
                </div>
            )}

            {/* Type Badge */}
            <div className="absolute top-3 right-3 z-20">
                <span className={`
                    px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md
                    ${item.type === 'video' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }
                `}>
                    {item.type === 'video' ? (
                        <>
                            <Play size={12} fill="white" />
                            Video
                        </>
                    ) : (
                        <>
                            <FileText size={12} />
                            Article
                        </>
                    )}
                </span>
            </div>

            {/* Preview/Thumbnail */}
            <div className="relative w-full aspect-video bg-linear-to-br from-[#9EA58D]/10 via-[#CCC098]/10 to-[#B4BEC9]/20">
                {item.preview ? (
                    <img 
                        src={item.preview} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {item.type === 'video' ? (
                            <Play size={56} className="text-[#002333]/20" strokeWidth={1.5} />
                        ) : (
                            <FileText size={56} className="text-[#002333]/20" strokeWidth={1.5} />
                        )}
                    </div>
                )}
                
                {/* Duration Badge (Video only) */}
                {item.type === 'video' && item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {item.duration}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2.5">
                {/* Title */}
                <h3 className="font-bold text-[#002333] line-clamp-2 leading-snug group-hover:text-[#C5B67B] transition-colors duration-200">
                    {item.title}
                </h3>

                {/* Excerpt (Article only) */}
                {item.type === 'article' && item.excerpt && (
                    <p className="text-sm text-[#002333]/60 line-clamp-2">
                        {item.excerpt}
                    </p>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-[#002333]/50">
                    <div className="flex items-center gap-2">
                        {item.source && (
                            <span className="font-medium">{item.source}</span>
                        )}
                        {item.author && (
                            <span>• by {item.author}</span>
                        )}
                    </div>
                    {item.type === 'article' && item.wordCount && (
                        <span>{item.wordCount} words</span>
                    )}
                </div>

                {/* Date */}
                <div className="text-xs text-[#002333]/40">
                    {formatDate(item.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#B4BEC9]/20">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[#002333]/30 text-[#002333] hover:bg-[#002333] hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.contentUrl, '_blank');
                        }}
                    >
                        <ExternalLink size={14} className="mr-1.5" />
                        Open
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <Trash size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
