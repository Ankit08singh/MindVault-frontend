import { useEffect, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import MobileMenuButton from '@/components/MobileMenuButton';
import { Add } from '@/components/AddVideo';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Loader, RefreshCw, Search, LucideSearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useVideoStore } from '@/stores/useVideoStore';
import { useVideosInfinite, useSearchVideos, useBulkDeleteVideos, IVideo } from '@/hooks/useVideos';

export default function Videos() {
    const router = useRouter();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    
    // Zustand store
    const {
        selectedIds,
        selectionMode,
        isMobileMenuOpen,
        sortBy,
        sortOrder,
        searchQuery,
        isSearched,
        toggleSelect,
        selectAll,
        clearSelection,
        setMobileMenuOpen,
        setSortBy,
        toggleSortOrder,
        setSearchQuery,
        setIsSearched,
        clearSearch,
    } = useVideoStore();
    
    // React Query hooks
    const {
        data: videosData,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
        isRefetching,
    } = useVideosInfinite(sortBy, sortOrder);
    
    const [submittedSearch, setSubmittedSearch] = useState("");
    
    const {
        data: searchResults,
        isLoading: isSearching,
    } = useSearchVideos(submittedSearch, isSearched);
    
    const bulkDeleteMutation = useBulkDeleteVideos();
    
    // Flatten paginated videos
    const videos = useMemo(() => {
        return videosData?.pages.flatMap(page => page.data) ?? [];
    }, [videosData]);
    
    // Get current items based on search state
    const currentItems = isSearched ? (searchResults ?? []) : videos;
    
    // Get pagination info from last page
    const pagination = useMemo(() => {
        const lastPage = videosData?.pages[videosData.pages.length - 1];
        return lastPage?.pagination ?? { total: 0, showing: '' };
    }, [videosData]);
    
    // Check auth
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthChecked(true);
        }
    }, [router]);
    
    // Handlers
    const handleSearch = useCallback(() => {
        if (!searchQuery.trim()) return;
        setSubmittedSearch(searchQuery);
        setIsSearched(true);
    }, [searchQuery, setIsSearched]);
    
    const handleClearSearch = useCallback(() => {
        clearSearch();
        clearSelection();
        setSubmittedSearch("");
    }, [clearSearch, clearSelection]);
    
    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);
    
    const handleLoadMore = useCallback(() => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage]);
    
    const handleSelectAll = useCallback(() => {
        selectAll(currentItems.map(v => v._id));
    }, [selectAll, currentItems]);
    
    const handleBulkDelete = useCallback(() => {
        const count = selectedIds.size;
        
        toast(`Are you sure you want to delete ${count} video${count > 1 ? 's' : ''}?`, {
            action: {
                label: 'Delete',
                onClick: () => {
                    bulkDeleteMutation.mutate(Array.from(selectedIds), {
                        onSuccess: () => {
                            clearSelection();
                        }
                    });
                }
            }
        });
    }, [selectedIds, bulkDeleteMutation, clearSelection]);
    
    const handleVideoDeleted = useCallback(() => {
        refetch();
    }, [refetch]);
    
    const handleVideoAdded = useCallback(() => {
        refetch();
    }, [refetch]);

    // Prevent content flash before auth check
    if (!isAuthChecked) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-[#CCC098] to-[#9EA58D]">
                <Loader size={36} className="animate-spin text-[#002333]" />
            </div>
        );
    }

    return (
        <div className="flex font-serif overflow-x-hidden">
            {/* Mobile Menu Button */}
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
            
            {/* Sidebar */}
            <Sidebar 
                isMobileOpen={isMobileMenuOpen} 
                onMobileClose={() => setMobileMenuOpen(false)} 
                label="Videos"
            />
            
            {/* Main Content */}
            <div className="flex-1 min-h-screen bg-linear-to-br from-[#CCC098] to-[#9EA58D] p-4 lg:p-4 pt-16 lg:pt-4">
                <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-md border border-[#B4BEC9]/30">
                    <div className="max-w-md mr-4 flex justify-between items-center">
                        <Input  
                            id="searchQuery"
                            name="searchQuery"
                            placeholder="Search your Videos"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    handleSearch();
                                }
                            }}
                            type="text"
                            value={searchQuery}
                            className="text-[#002333] bg-white/80 border border-[#B4BEC9]/40 focus-visible:ring-1 focus-visible:ring-[#002333]/40 focus-visible:border-[#002333]/50"
                        />
                        <Button 
                            className={`ml-5 ${!searchQuery.trim() ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} bg-[#002333] hover:bg-[#002333]/80 text-white shadow-md`}
                            disabled={!searchQuery.trim() || isSearching}
                            onClick={handleSearch}
                        >
                            {isSearching ? <Loader size={18} className="animate-spin mr-1" /> : <Search size={18} className="mr-1" />}
                            Search
                        </Button>
                    </div>
                </div>

                <div className="mt-5 border-t border-[#B4BEC9]/40 rounded-2xl"></div>

                <div className="mt-5 bg-white/60 backdrop-blur-md rounded-xl h-[calc(113vh-250px)] overflow-y-auto shadow-md border border-[#B4BEC9]/30">
                    <div className='bg-transparent flex justify-between items-center p-6 pl-10 pr-10'>
                        <div className="flex items-center gap-4">
                            {isSearched ? (
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl text-[#002333] font-semibold">Search Results</h1>
                                    <Button className="bg-[#002333] hover:bg-[#002333]/80" onClick={handleClearSearch} size="sm">
                                        <LucideSearchX size={18} className="text-white mr-1" />
                                        Clear
                                    </Button>
                                    <p className="text-[#002333]/70">{searchResults?.length ?? 0} Results</p>
                                </div>
                            ) : (
                                <h1 className="text-2xl text-[#002333] font-semibold">Your Videos</h1>
                            )}
                            
                            {/* Selection Mode Toolbar */}
                            {currentItems.length > 0 && (
                                <div className="flex items-center gap-3 ml-6">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-[#002333]/70 hover:text-[#002333]">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size > 0 && selectedIds.size === currentItems.length}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 cursor-pointer accent-[#002333]"
                                        />
                                        Select All
                                    </label>
                                    
                                    {selectedIds.size > 0 && (
                                        <>
                                            <span className="text-sm text-[#002333] font-medium">
                                                {selectedIds.size} selected
                                            </span>
                                            <Button
                                                onClick={clearSelection}
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
                            {selectedIds.size > 0 && (
                                <Button
                                    onClick={handleBulkDelete}
                                    disabled={bulkDeleteMutation.isPending}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {bulkDeleteMutation.isPending ? (
                                        <>
                                            <Loader size={16} className="animate-spin mr-1" />
                                            Deleting...
                                        </>
                                    ) : (
                                        `Delete Selected (${selectedIds.size})`
                                    )}
                                </Button>
                            )}
                            
                            <Button
                                onClick={handleRefresh}
                                disabled={isRefetching}
                                variant="outline"
                                size="sm"
                                className="border-[#B4BEC9]/40 text-[#002333] hover:bg-[#B4BEC9]/10"
                            >
                                <RefreshCw size={16} className={`mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
                                {isRefetching ? 'Refreshing...' : 'Refresh'}
                            </Button>
                            <Add onVideoAdded={handleVideoAdded} />
                        </div>
                    </div>

                    {/* Sorting and Pagination Info */}
                    {!isSearched && videos.length > 0 && (
                        <div className="flex justify-between items-center mb-4 px-6 pt-4">
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-[#002333]/70 font-medium">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="px-3 py-1.5 border border-[#B4BEC9]/40 rounded-md text-sm bg-white text-[#002333] focus:outline-none focus:ring-2 focus:ring-[#002333]/20"
                                >
                                    <option value="createdAt">Date Added</option>
                                    <option value="title">Title</option>
                                    <option value="updatedAt">Last Updated</option>
                                </select>
                                
                                <button
                                    onClick={toggleSortOrder}
                                    className="p-1.5 border border-[#B4BEC9]/40 rounded-md hover:bg-[#B4BEC9]/10 transition-colors"
                                    title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
                                >
                                    <span className="text-[#002333] font-bold text-lg">
                                        {sortOrder === 'desc' ? '↓' : '↑'}
                                    </span>
                                </button>
                            </div>
                            
                            <p className="text-sm text-[#002333]/60">
                                {pagination.showing || `${videos.length} videos`}
                            </p>
                        </div>
                    )}

                    {/* Videos Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader size={36} className="animate-spin text-[#002333] mr-4" />
                            <p className="text-[#002333]/70">Loading videos...</p>
                        </div>
                    ) : isSearched ? (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-4">
                            {isSearching ? (
                                <div className="flex justify-center items-center py-20 col-span-full">
                                    <Loader size={36} className="animate-spin text-[#002333] mr-4" />
                                    <p className="text-[#002333]/70">Searching your Videos...</p>
                                </div>
                            ) : (searchResults?.length ?? 0) > 0 ? (
                                searchResults?.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        id={video._id}
                                        title={video.title}
                                        thumbnail={video.thumbnailUrl}
                                        url={video.videoUrl}
                                        onVideoDeleted={handleVideoDeleted}
                                        isSelected={selectedIds.has(video._id)}
                                        onSelect={() => toggleSelect(video._id)}
                                        selectionMode={selectionMode}
                                    />
                                ))
                            ) : (
                                <p className="text-[#002333]/60 text-center col-span-full py-8">
                                    No videos found matching your search!
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-4">
                            {videos.length > 0 ? (
                                videos.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        id={video._id}
                                        title={video.title}
                                        thumbnail={video.thumbnailUrl}
                                        url={video.videoUrl}
                                        onVideoDeleted={handleVideoDeleted}
                                        isSelected={selectedIds.has(video._id)}
                                        onSelect={() => toggleSelect(video._id)}
                                        selectionMode={selectionMode}
                                    />
                                ))
                            ) : (
                                <p className="text-[#002333]/60 text-center col-span-full py-8">
                                    No Videos Saved Yet!!
                                </p>
                            )}
                        </div>
                    )}
                    
                    {/* Load More Button */}
                    {!isSearched && hasNextPage && videos.length > 0 && (
                        <div className="flex justify-center py-6 border-t border-[#B4BEC9]/20">
                            <Button
                                onClick={handleLoadMore}
                                disabled={isFetchingNextPage}
                                variant="outline"
                                className="border-[#B4BEC9]/40 text-[#002333] hover:bg-[#B4BEC9]/10 min-w-[200px]"
                            >
                                {isFetchingNextPage ? (
                                    <>
                                        <Loader size={16} className="animate-spin mr-2" />
                                        Loading...
                                    </>
                                ) : (
                                    `Load More (${pagination.total - videos.length} remaining)`
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}