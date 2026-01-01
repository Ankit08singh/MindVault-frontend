import { ExternalLink, Trash, FileText } from "lucide-react";
import API from "@/utils/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ArticleCardProps {
    id: string;
    title: string;
    url: string;
    excerpt?: string;
    featuredImage?: string;
    siteName?: string;
    author?: string;
    wordCount?: number;
    createdAt: string;
    onArticleDeleted?: () => void;
    isSelected?: boolean;
    onSelect?: () => void;
    selectionMode?: boolean;
}

export default function ArticleCard({ 
    id, 
    title, 
    url, 
    excerpt,
    featuredImage,
    siteName,
    author,
    wordCount,
    createdAt,
    onArticleDeleted,
    isSelected = false,
    onSelect,
    selectionMode = false
}: ArticleCardProps) {

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async() => {
        try{
            const res = await API.post('/articles/delete', { articleId: id });
            toast.success("Article deleted from memory");
            onArticleDeleted?.();
        }catch(err:any){
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={`relative bg-white/80 backdrop-blur-md rounded-lg overflow-hidden border ${
            isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-[#B4BEC9]/30'
        } hover:border-[#C5B67B]/60 transition-all hover:shadow-lg hover:shadow-[#C5B67B]/20 cursor-pointer group hover:scale-102 duration-300`}>
            {/* Selection Checkbox */}
            {onSelect && (
                <div className={`absolute top-2 left-2 z-10 ${
                    selectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity`}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelect}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 cursor-pointer accent-blue-600 bg-white border-2 border-gray-300 rounded"
                    />
                </div>
            )}
            
            {/* Featured Image or Placeholder */}
            <div className="relative aspect-video overflow-hidden bg-linear-to-br from-[#CCC098] to-[#9EA58D]">
                {featuredImage ? (
                    <img 
                        src={featuredImage} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FileText size={64} className="text-[#002333]/30" />
                    </div>
                )}
            </div>
            
            {/* Card Body */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h1 className="text-[#002333] font-semibold text-base leading-tight line-clamp-2 group-hover:text-[#C5B67B] transition-colors">
                    {title}
                </h1>
                
                {/* Excerpt */}
                {excerpt && (
                    <p className="text-[#002333]/60 text-sm line-clamp-3">
                        {excerpt}
                    </p>
                )}
                
                {/* Metadata */}
                <div className="text-xs text-[#002333]/50 flex items-center gap-2">
                    {siteName && <span>{siteName}</span>}
                    {siteName && wordCount && <span>•</span>}
                    {wordCount && <span>{wordCount} words</span>}
                </div>
                
                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                    <a 
                        href={url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#002333] text-sm font-medium hover:text-[#C5B67B] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="font-semibold">
                            Read Article
                        </span>
                        <ExternalLink size={16} />
                    </a>
                    <Button 
                        className="bg-red-50 hover:bg-red-100 border border-red-200"
                        onClick={() => 
                            toast("Are you sure you want to delete this article?",{
                                action:{
                                    label:"Yes",
                                    onClick:handleDelete,
                                },
                            })
                        }
                        disabled={isDeleting}
                    >
                        <Trash className="text-red-950/85" size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
