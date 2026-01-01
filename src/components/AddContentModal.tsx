import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Video, FileText, Loader, Plus } from "lucide-react";
import API from "@/utils/axios";
import { toast } from "sonner";

interface AddContentModalProps {
    onContentAdded: () => void;
}

type ContentType = 'video' | 'article' | null;

export function AddContentModal({ onContentAdded }: AddContentModalProps) {
    const [open, setOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<ContentType>(null);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetModal = () => {
        setSelectedType(null);
        setUrl('');
        setError(null);
        setLoading(false);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(resetModal, 200); // Reset after animation
    };

    const validateUrl = (url: string, type: ContentType): string | null => {
        if (!url.trim()) return 'Please enter a URL';

        try {
            new URL(url);
        } catch {
            return 'Please enter a valid URL';
        }

        if (type === 'video') {
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                return 'Please enter a valid YouTube URL';
            }
        } else if (type === 'article') {
            const socialSites = ['youtube.com', 'youtu.be', 'twitter.com', 'facebook.com', 'instagram.com'];
            if (socialSites.some(site => url.includes(site))) {
                return 'Social media links are not supported. Please use article URLs.';
            }
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateUrl(url, selectedType);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);

        const loadingMessage = selectedType === 'video' 
            ? 'Fetching video details...' 
            : 'Scraping article content... (may take 5 seconds)';
        
        toast.loading(loadingMessage, { id: 'add-content' });

        try {
            const endpoint = selectedType === 'video' ? '/videos' : '/articles';
            const payload = selectedType === 'video' 
                ? { videoUrl: url.trim() } 
                : { url: url.trim() };

            const res = await API.post(endpoint, payload);
            
            if (res.data.success) {
                const contentName = selectedType === 'video' 
                    ? res.data.video?.title || 'Video'
                    : res.data.article?.title || 'Article';
                
                toast.success(
                    `${selectedType === 'video' ? 'Video' : 'Article'} saved: ${contentName}`,
                    { id: 'add-content' }
                );
                
                onContentAdded();
                handleClose();
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message;
            
            if (errMsg.toLowerCase().includes('already exists')) {
                toast.error(`This ${selectedType} already exists in your vault`, { id: 'add-content' });
            } else if (errMsg.toLowerCase().includes('failed to scrape')) {
                toast.error('Failed to scrape article. Please try another URL.', { id: 'add-content' });
                setError('Failed to scrape article. The website may be blocking automated access.');
            } else {
                toast.error(errMsg, { id: 'add-content' });
                setError(errMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#002333] hover:bg-[#002333]/80 text-white">
                    <Plus size={18} className="mr-2" />
                    Add Content
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-md border-[#B4BEC9]/30 sm:max-w-md mx-4">
                <DialogHeader>
                    <DialogTitle className="text-[#002333] text-xl">
                        {!selectedType ? 'Choose Content Type' : `Add ${selectedType === 'video' ? 'Video' : 'Article'}`}
                    </DialogTitle>
                </DialogHeader>

                {/* Step 1: Choose Type */}
                {!selectedType && (
                    <div className="space-y-4 py-2">
                        <p className="text-sm text-[#002333]/60">
                            What would you like to add to your vault?
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <button
                                onClick={() => setSelectedType('video')}
                                className="flex flex-col items-center justify-center p-5 sm:p-6 border-2 border-[#B4BEC9]/40 rounded-xl hover:border-red-400 hover:bg-red-50/50 transition-all duration-300 group hover:scale-105 active:scale-95"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-3 group-hover:bg-red-500/20 transition-all group-hover:scale-110">
                                    <Video size={28} className="text-red-600" strokeWidth={2.5} />
                                </div>
                                <span className="font-semibold text-[#002333] text-sm sm:text-base">Video</span>
                                <span className="text-xs text-[#002333]/50 mt-1">YouTube videos</span>
                            </button>

                            <button
                                onClick={() => setSelectedType('article')}
                                className="flex flex-col items-center justify-center p-5 sm:p-6 border-2 border-[#B4BEC9]/40 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group hover:scale-105 active:scale-95"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-all group-hover:scale-110">
                                    <FileText size={28} className="text-blue-600" strokeWidth={2.5} />
                                </div>
                                <span className="font-semibold text-[#002333] text-sm sm:text-base">Article</span>
                                <span className="text-xs text-[#002333]/50 mt-1">Web articles</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Enter URL */}
                {selectedType && (
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="content-url" className="text-[#002333] font-medium">
                                {selectedType === 'video' ? 'YouTube URL' : 'Article URL'}
                            </Label>
                            <Input
                                id="content-url"
                                type="url"
                                placeholder={
                                    selectedType === 'video' 
                                        ? 'https://youtube.com/watch?v=...' 
                                        : 'https://example.com/article'
                                }
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setError(null);
                                }}
                                disabled={loading}
                                className="text-[#002333] bg-white border-2 border-[#B4BEC9]/40 focus-visible:ring-2 focus-visible:ring-[#002333]/30 focus-visible:border-[#002333] transition-all h-11"
                                autoFocus
                            />
                            {error && (
                                <p className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1.5 rounded">{error}</p>
                            )}
                            <p className="text-xs text-[#002333]/60 leading-relaxed">
                                {selectedType === 'video' 
                                    ? 'Paste the URL of any YouTube video' 
                                    : 'Paste the URL of any article or blog post (may take a few seconds to scrape)'
                                }
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (loading) return;
                                    resetModal();
                                }}
                                disabled={loading}
                                className="border-[#B4BEC9]/40 text-[#002333] hover:bg-[#B4BEC9]/10"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !url.trim()}
                                className="bg-[#002333] hover:bg-[#002333]/90 text-white shadow-md hover:shadow-lg transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader size={16} className="animate-spin mr-2" />
                                        {selectedType === 'video' ? 'Saving...' : 'Scraping...'}
                                    </>
                                ) : (
                                    `Add ${selectedType === 'video' ? 'Video' : 'Article'}`
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
