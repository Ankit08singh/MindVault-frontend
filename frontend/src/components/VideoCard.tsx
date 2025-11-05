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
}

export default function VideoCard({ 
    id, 
    title, 
    thumbnail, 
    url, 
    description,
    duration ,
    onVideoDeleted
}: VideoCardProps) {

    const [form,setFormData] = useState({videoUrl:''});

    const handleDelete = async() => {
        setFormData({videoUrl:url});
        try{
            const res = await API.post('/videos/deletevideo',form);
            toast.success("Video deleted from the memory");
            onVideoDeleted?.();
        }catch(err:any){
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg);
        }
    };

    return (
        <div className="bg-stone-700/50 rounded-lg overflow-hidden hover:bg-stone-700 transition-all hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer group">
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
                <h1 className="text-white font-semibold text-base leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {title}
                </h1>
                
                {/* Optional Description */}
                {description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                        {description}
                    </p>
                )}
                
                {/* Link */}
                <div className="flex justify-between items-center">
                    <a 
                        href={url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="font-semibold">
                            Watch Now
                        </span>
                        <ExternalLink size={16} />
                    </a>
                    <Button className="bg-red-200/50"
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