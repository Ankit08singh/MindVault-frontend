import { useEffect,useState } from "react";
import API from "@/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, LucideSearchX, PlusCircleIcon, Search, RefreshCw, Trash } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import Sidebar from "@/components/Sidebar";
import MobileMenuButton from "@/components/MobileMenuButton";
import { useRouter } from "next/navigation";
import { AddContentModal } from "@/components/AddContentModal";
import { toast } from "sonner";

interface ContentItem {
    _id: string;
    type: 'video' | 'article';
    title: string;
    contentUrl: string;
    preview?: string;
    source?: string;
    createdAt: string;
    // Video-specific
    duration?: string;
    // Article-specific
    excerpt?: string;
    author?: string;
    wordCount?: number;
}

export default function dashboard()  {
    const router = useRouter();
    const [form,setQuery] = useState({query:''});
    const [error,setError] = useState<string|null>(null);
    const [queryResult,setqueryResult] = useState<ContentItem[]>([]);
    const [isResult,setIsResult] = useState(false);
    const [isSearched,setSearched] = useState(false);
    const [content,setContent] = useState<ContentItem[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDisable,setIsDisabled] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
        showing: ''
    });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    
    
    useEffect(()=>{
        if(form.query.length == 0){
            setIsDisabled(true);
        }
    },[form]);

    useEffect(()=>{
        if(!localStorage.getItem('token')){
            router.push('/login');
        }
    },[router]);

    useEffect(() => {
        handleGetAll(1, false);
    }, [sortBy, sortOrder]);

    // Auto-sync on page load - checks for new videos in background
    useEffect(() => {
        const autoSync = async () => {
            try {
                const res = await API.get('/videos/sync/smart');
                
                if (res.data.success && res.data.stats.synced > 0) {
                    // Show notification only if new videos found
                    toast.success(
                        `🎉 ${res.data.stats.synced} new video${res.data.stats.synced > 1 ? 's' : ''} synced!`,
                        { duration: 3000 }
                    );
                    // Refresh video list to show new videos
                    handleGetAll(1, false);
                }
                // If synced === 0, do nothing (no new videos)
            } catch (err: any) {
                if (err.response?.status === 429) {
                    // Cooldown active - user synced recently, this is normal
                    console.log('Sync cooldown active:', err.response.data.message);
                } else {
                    // Other errors - log but don't show to user (background operation)
                    console.error('Auto-sync error:', err);
                }
            }
        };

        // Run auto-sync on mount (page load/refresh)
        autoSync();
    }, []);


    const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setQuery({...form,[name]:value});
        setError(null);
        setIsDisabled(false);
    };

    const handleSearch = async() => {
        console.log("Search Button clicked");
        setSearched(true);
        setIsLoading(true);
        try{
            const res = await API.post('/videos/search',form);
            setqueryResult(res.data.match);
            setIsResult(true);
            setError(null);

        }catch(err:any){
            console.log(err.message);
            setError(err.message);
        }finally{
            setIsLoading(false);
        }
    };

    const handleGetAll = async(page = 1, append = false) => {
        console.log(`Fetching content - page ${page}`);
        
        try{
            if (!append) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }
            
            const res = await API.get('/content/all', {
                params: {
                    page,
                    limit: 20,
                    sortBy,
                    order: sortOrder
                }
            });
            
            if (append) {
                // Append to existing content (Load More)
                setContent(prev => [...prev, ...res.data.data]);
            } else {
                // Replace content (initial load or refresh)
                setContent(res.data.data);
            }
            
            setPagination(res.data.pagination);
            setError(null);
        }catch(err:any){
            console.log(err.message);
            setError(err.message);
            if (!append) setContent([]);
        }finally{
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }

    const handleLoadMore = () => {
        const nextPage = pagination.page + 1;
        handleGetAll(nextPage, true);
    };

    const handleClear = () => {
        setQuery({query:''});
        setqueryResult([]);
        setIsResult(false);
        setSearched(false);
    };

    const handleAsk = () => {
        toast("Are you sure you want to import from your youtube account?",{
            action:{
                label:"Yes",
                onClick:handleImport,
            },
        })
    }

    const handleImport = async() => {
        setIsImporting(true);
        toast.loading('Importing liked videos...', { id: 'import' });
        
        try{
            const res = await API.post('/videos/sync/liked?limit=50');
            console.log(res);
            console.log(res.data);
            
            if (res.data.success) {
                toast.success(
                    `Imported ${res.data.stats.synced} videos! (${res.data.stats.skipped} already existed)`,
                    { id: 'import' }
                );
                // Refresh video list
                handleGetAll(1, false);
            }
        }catch(err:any){
            console.log(err.response);
            const errMsg = err.response?.data?.message || err.message;
            console.error("Error: ",errMsg);
            toast.error('Failed to import videos', { id: 'import' });
        }finally{
            setIsImporting(false);
        }
    }

    const handleRefresh = async() => {
        setIsRefreshing(true);
        
        try{
            const res = await API.get('/videos/sync/smart');
            
            if (res.data.success) {
                if (res.data.stats.synced > 0) {
                    toast.success(`Synced ${res.data.stats.synced} new videos!`);
                    handleGetAll(1, false);
                } else {
                    toast.info('All videos are up to date!');
                }
            }
        }catch(err:any){
            if (err.response?.status === 429) {
                const remaining = err.response.data.remainingSeconds || 0;
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                toast.error(`Please wait ${minutes}m ${seconds}s before syncing again`);
            } else {
                const errMsg = err.response?.data?.message || err.message;
                toast.error('Failed to check for new videos');
                console.error('Refresh error:', errMsg);
            }
        }finally{
            setIsRefreshing(false);
        }
    }

    const handleSelectVideo = (videoId: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(videoId)) {
                newSet.delete(videoId);
            } else {
                newSet.add(videoId);
            }
            // Exit selection mode if no videos selected
            if (newSet.size === 0) {
                setSelectionMode(false);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const currentItems = isSearched ? queryResult : content;
        if (selectedIds.size === currentItems.length) {
            // Deselect all
            setSelectedIds(new Set());
            setSelectionMode(false);
        } else {
            // Select all
            setSelectedIds(new Set(currentItems.map(v => v._id)));
            setSelectionMode(true);
        }
    };

    const handleCancelSelection = () => {
        setSelectedIds(new Set());
        setSelectionMode(false);
    };

    const handleBulkDelete = async () => {
        const count = selectedIds.size;
        
        toast(`Are you sure you want to delete ${count} item${count > 1 ? 's' : ''}?`, {
            action: {
                label: 'Delete',
                onClick: async () => {
                    setIsBulkDeleting(true);
                    toast.loading(`Deleting ${count} items...`, { id: 'bulk-delete' });
                    
                    try {
                        const items = isSearched ? queryResult : content;
                        const selectedItems = items.filter(item => selectedIds.has(item._id));
                        const videoIds = selectedItems.filter(item => item.type === 'video').map(item => item._id);
                        const articleIds = selectedItems.filter(item => item.type === 'article').map(item => item._id);

                        const promises = [];
                        
                        if (videoIds.length > 0) {
                            promises.push(API.post('/videos/bulkDelete', { videoIds }));
                        }
                        
                        if (articleIds.length > 0) {
                            promises.push(API.post('/articles/bulkDelete', { articleIds }));
                        }

                        await Promise.all(promises);
                        
                        toast.success(`Successfully deleted ${count} item${count > 1 ? 's' : ''}!`, { id: 'bulk-delete' });
                        
                        // Clear selection and refresh
                        setSelectedIds(new Set());
                        setSelectionMode(false);
                        handleGetAll(1, false);
                    } catch (err: any) {
                        console.error('Bulk delete failed:', err);
                        toast.error('Failed to delete items', { id: 'bulk-delete' });
                    } finally {
                        setIsBulkDeleting(false);
                    }
                }
            }
        });
    };

    return(
        <div className="flex font-serif overflow-x-hidden">
            {/* Mobile Menu Button */}
            <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
            
            {/* Sidebar */}
            <Sidebar 
                isMobileOpen={isMobileMenuOpen} 
                onMobileClose={() => setIsMobileMenuOpen(false)} 
                
            />
            
            {/* Main Content */}
            <div className="flex-1 min-h-screen bg-linear-to-br from-[#CCC098] to-[#9EA58D] p-4 lg:p-4 pt-16 lg:pt-4">
                <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-md border border-[#B4BEC9]/30">
                    <div className="max-w-md mr-4 flex justify-between items-center">
                        <Input  
                            id="query"
                            name="query"
                            placeholder="Search your Memory"
                            onChange={handleOnChange}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !isDisable){
                                    handleSearch();
                                }
                            }}
                            type="text"
                            value={form.query}
                            className="text-[#002333] bg-white/80 border border-[#B4BEC9]/40 focus-visible:ring-1 focus-visible:ring-[#002333]/40 focus-visible:border-[#002333]/50"
                            />
                        <Button className={`ml-5 ${isDisable ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} bg-[#002333] hover:bg-[#002333]/80 text-white shadow-md`}
                            disabled={isDisable}
                            onClick={handleSearch}><Search size={18} className="items-center justify-center" />Search</Button>
                    </div>
                </div>

                
                <div className="mt-5 border-t border-[#B4BEC9]/40 rounded-2xl"></div>


                <div className="mt-5 bg-white/60 backdrop-blur-md rounded-xl h-[calc(113vh-250px)] overflow-y-auto shadow-md border border-[#B4BEC9]/30
                                ">
                    <div className='bg-transparent flex justify-between items-center p-6 pl-10 pr-10'>
                        <div className="flex items-center gap-4">
                            {isSearched ? (
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl text-[#002333] font-semibold">Search Result</h1>
                                    <Button className="bg-[#002333] hover:bg-[#002333]/80" onClick={handleClear} size="sm">
                                        <LucideSearchX size={18} className="text-white mr-1" />
                                        Clear
                                    </Button>
                                    <p className="text-[#002333]/70">{queryResult.length} Results</p>
                                </div>
                            ) : (
                                <h1 className="text-2xl text-[#002333] font-semibold">Your Memory</h1>
                            )}
                            
                            {/* Selection Mode Toolbar */}
                            {((isSearched && queryResult.length > 0) || (!isSearched && content.length > 0)) && (
                                <div className="flex items-center gap-3 ml-6">
                                    {/* Select All Checkbox */}
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-[#002333]/70 hover:text-[#002333]">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size > 0 && selectedIds.size === (isSearched ? queryResult : content).length}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 cursor-pointer accent-[#002333]"
                                        />
                                        Select All
                                    </label>
                                    
                                    {/* Show count and actions when items selected */}
                                    {selectedIds.size > 0 && (
                                        <>
                                            <span className="text-sm text-[#002333] font-medium">
                                                {selectedIds.size} selected
                                            </span>
                                            <Button
                                                onClick={handleCancelSelection}
                                                variant="ghost"
                                                size="sm"
                                                className="text-[#002333]/70 hover:text-[#002333] h-8"
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            {/* Show Delete Selected button when items selected */}
                            {selectedIds.size > 0 && (
                                <Button
                                    onClick={handleBulkDelete}
                                    disabled={isBulkDeleting}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isBulkDeleting ? (
                                        <>
                                            <Loader size={16} className="animate-spin mr-1" />
                                            Deleting...
                                        </>
                                    ) : (
                                        `Delete Selected (${selectedIds.size})`
                                    )}
                                </Button>
                            )}
                            
                            {/* Regular action buttons */}
                            <Button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                variant="outline"
                                size="sm"
                                className="border-[#B4BEC9]/40 text-[#002333] hover:bg-[#B4BEC9]/10"
                            >
                                <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Checking...' : 'Check New'}
                            </Button>
                            <AddContentModal onContentAdded={() => handleGetAll(1, false)}/>
                            <Button 
                                onClick={handleAsk}
                                disabled={isImporting}
                                className="bg-[#002333] hover:bg-[#002333]/80 text-white"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader size={16} className="animate-spin mr-1" />
                                        Importing...
                                    </>
                                ) : (
                                    'Import Videos'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Sorting and Pagination Info */}
                    {!isSearched && content.length > 0 && (
                        <div className="flex justify-between items-center mb-4 px-6 pt-4">
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-[#002333]/70 font-medium">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-1.5 border border-[#B4BEC9]/40 rounded-md text-sm bg-white text-[#002333] focus:outline-none focus:ring-2 focus:ring-[#002333]/20"
                                >
                                    <option value="createdAt">Date Added</option>
                                    <option value="title">Title</option>
                                    <option value="updatedAt">Last Updated</option>
                                </select>
                                
                                <button
                                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                    className="p-1.5 border border-[#B4BEC9]/40 rounded-md hover:bg-[#B4BEC9]/10 transition-colors"
                                    title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
                                >
                                    <span className="text-[#002333] font-bold text-lg">
                                        {sortOrder === 'desc' ? '↓' : '↑'}
                                    </span>
                                </button>
                            </div>
                            
                            <p className="text-sm text-[#002333]/60">
                                {pagination.showing || `${content.length} items`}
                            </p>
                        </div>
                    )}

                    {isSearched ? (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader size={36} className="animate-spin text-[#002333] mr-4"></Loader>
                                    <p className="text-[#002333]/70">Searching your Memories...</p>
                                </div>
                            ) : isResult && queryResult.length > 0 ? (
                                queryResult.map((item) => (
                                    <ContentCard
                                        key={item._id}
                                        item={item}
                                        isSelected={selectedIds.has(item._id)}
                                        onSelect={() => {
                                            handleSelectVideo(item._id);
                                            if (!selectionMode) setSelectionMode(true);
                                        }}
                                        onDeleted={() => handleGetAll(1, false)}
                                        selectionMode={selectionMode}
                                    />
                                ))
                            ):(
                                <p className="text-[#002333]/60 text-center col-span-full py-8">
                                    Nothing related to this in memory!!
                                </p>
                            )}
                        </div>
                    ):(
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-4">
                            {content.length > 0 ? (
                                content.map((item) => (
                                    <ContentCard
                                        key={item._id}
                                        item={item}
                                        isSelected={selectedIds.has(item._id)}
                                        onSelect={() => {
                                            handleSelectVideo(item._id);
                                            if (!selectionMode) setSelectionMode(true);
                                        }}
                                        onDeleted={() => handleGetAll(1, false)}
                                        selectionMode={selectionMode}
                                    />
                                ))
                            ):(
                                <p className="text-[#002333]/60 text-center col-span-full py-8">
                                    No Content Saved Yet!!
                                </p>
                            )}
                        </div>
                    )}
                    
                    {/* Load More Button - Outside search/all videos conditional */}
                    {!isSearched && pagination.hasMore && content.length > 0 && (
                        <div className="flex justify-center py-6 border-t border-[#B4BEC9]/20">
                            <Button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                variant="outline"
                                className="border-[#B4BEC9]/40 text-[#002333] hover:bg-[#B4BEC9]/10 min-w-[200px]"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader size={16} className="animate-spin mr-2" />
                                        Loading...
                                    </>
                                ) : (
                                    `Load More (${pagination.total - content.length} remaining)`
                                )}
                            </Button>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
        
    )
};