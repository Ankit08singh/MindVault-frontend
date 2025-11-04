import { ExternalLink } from "lucide-react";

interface VideoCardProps {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    description?: string;
    duration?: string;
}

export default function VideoCard({ 
    id, 
    title, 
    thumbnail, 
    url, 
    description,
    duration 
}: VideoCardProps) {
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
            </div>
        </div>
    );
};