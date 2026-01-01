import { ExternalLink, Trash } from "lucide-react";
import API from "@/utils/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface VideoCardProps {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    description?: string;
    duration?: string;
    onVideoDeleted?: () => void;
    isSelected?: boolean;
    onSelect?: () => void;
    selectionMode?: boolean;
}

export default function VideoCard({ 
    id, 
    title, 
    thumbnail, 
    url, 
    description,
    duration,
    onVideoDeleted,
    isSelected = false,
    onSelect,
    selectionMode = false
}: VideoCardProps) {

    const [form,setFormData] = useState({videoUrl:''});

    const handleDelete = async() => {
        setFormData({videoUrl:url});
        // console.log(form);
        try{
            const res = await API.post('/videos/deletevideo',{videoUrl:url});
            toast.success("Video deleted from the memory");
            onVideoDeleted?.();
        }catch(err:any){
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg);
        }
    };

    return (
        <div className={`relative bg-white/80 backdrop-blur-md rounded-lg overflow-hidden border ${
            isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-[#B4BEC9]/30'
        } hover:border-[#C5B67B]/60 transition-all hover:shadow-lg hover:shadow-[#C5B67B]/20 cursor-pointer group hover:scale-102 duration-300`}>
            {/* Selection Checkbox - Always show if selectionMode active */}
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
            
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <img 
                    src={thumbnail} 
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Optional Duration Badge */}
                {duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {duration}
                    </div>
                )}
            </div>
            
            {/* Card Body */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h1 className="text-[#002333] font-semibold text-base leading-tight line-clamp-2 group-hover:text-[#C5B67B] transition-colors">
                    {title}
                </h1>
                
                {/* Optional Description */}
                {description && (
                    <p className="text-[#002333]/60 text-sm line-clamp-2">
                        {description}
                    </p>
                )}
                
                {/* Link */}
                <div className="flex justify-between items-center">
                    <a 
                        href={url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#002333] text-sm font-medium hover:text-[#C5B67B] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="font-semibold">
                            Watch Now
                        </span>
                        <ExternalLink size={16} />
                    </a>
                    <Button className="bg-red-50 hover:bg-red-100 border border-red-200"
                        onClick={() => 
                            toast("Are you sure you want to delete this?",{
                                action:{
                                    label:"Yes",
                                    onClick:handleDelete,
                                },
                            })
                        }
                    ><Trash className="text-red-950/85" size={18} /></Button>
                </div>
            </div>
        </div>
    );
};