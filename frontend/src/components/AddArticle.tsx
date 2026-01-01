import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FileText, Loader } from "lucide-react";
import API from "@/utils/axios";
import { toast } from "sonner";

interface AddArticleProps {
    onArticleAdded: () => void;
}

export function AddArticle({ onArticleAdded }: AddArticleProps) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!url.trim()) {
            toast.error('Please enter a URL');
            return;
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            toast.error('Please enter a valid URL');
            return;
        }

        setLoading(true);
        toast.loading('Scraping article...', { id: 'add-article' });

        try {
            const res = await API.post('/articles', { url: url.trim() });
            
            if (res.data.success) {
                toast.success(
                    `Article saved: ${res.data.data.title}`,
                    { id: 'add-article' }
                );
                onArticleAdded();
                setOpen(false);
                setUrl('');
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg, { id: 'add-article' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#002333] hover:bg-[#002333]/80 text-white">
                    <FileText size={18} className="mr-2" />
                    Add Article
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-md border-[#B4BEC9]/30">
                <DialogHeader>
                    <DialogTitle className="text-[#002333]">Add Article</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="article-url" className="text-[#002333]">
                            Article URL
                        </Label>
                        <Input
                            id="article-url"
                            type="url"
                            placeholder="https://example.com/article"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={loading}
                            className="text-[#002333] bg-white/80 border border-[#B4BEC9]/40 focus-visible:ring-1 focus-visible:ring-[#002333]/40"
                        />
                        <p className="text-xs text-[#002333]/60">
                            Paste the URL of any article you want to save
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="border-[#B4BEC9]/40 text-[#002333]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !url.trim()}
                            className="bg-[#002333] hover:bg-[#002333]/80 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader size={16} className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save Article'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
