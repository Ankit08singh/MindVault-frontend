import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "@/utils/axios";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import MobileMenuButton from "@/components/MobileMenuButton";
import { AddArticle } from "@/components/AddArticle";
import ArticleCard  from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader, ChevronDown } from "lucide-react";

interface IArticle {
    _id: string;
    title: string;
    url: string;
    content: string;
    excerpt: string;
    author?: string;
    siteName?: string;
    featuredImage?: string;
    wordCount?: number;
    createdAt: string;
    updatedAt: string;
}

export default function Articles() {
    const router = useRouter();
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false
    });

    // Sort state
    const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'updatedAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Bulk selection state
    const [selectedArticleIds, setSelectedArticleIds] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);

    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check auth
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    // Fetch articles
    const handleGetAll = async (page = 1, append = false) => {
        try {
            const res = await API.get('/articles/getAll', {
                params: {
                    page,
                    limit: pagination.limit,
                    sortBy,
                    sortOrder
                }
            });

            if (res.data.success) {
                const newArticles = res.data.data;
                setArticles(prev => append ? [...prev, ...newArticles] : newArticles);
                setPagination({
                    page,
                    limit: pagination.limit,
                    total: res.data.total || 0,
                    hasMore: res.data.hasMore || false
                });
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        handleGetAll(1, false);
    }, [sortBy, sortOrder]);

    // Load more handler
    const handleLoadMore = () => {
        const nextPage = pagination.page + 1;
        handleGetAll(nextPage, true);
    };

    // Search handler
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            handleGetAll(1, false);
            return;
        }

        setSearching(true);
        try {
            const res = await API.get('/articles/search', {
                params: { query: searchQuery.trim() }
            });

            if (res.data.success) {
                setArticles(res.data.data);
                setPagination({
                    page: 1,
                    limit: pagination.limit,
                    total: res.data.data.length,
                    hasMore: false
                });
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg);
        } finally {
            setSearching(false);
        }
    };

    // Article deleted callback
    const handleArticleDeleted = (articleId: string) => {
        setArticles(prev => prev.filter(a => a._id !== articleId));
        setPagination(prev => ({
            ...prev,
            total: prev.total - 1
        }));
        selectedArticleIds.delete(articleId);
        setSelectedArticleIds(new Set(selectedArticleIds));
    };

    // Article added callback
    const handleArticleAdded = () => {
        setSearchQuery('');
        handleGetAll(1, false);
    };

    // Selection handlers
    const handleSelectArticle = (articleId: string) => {
        const newSelected = new Set(selectedArticleIds);
        if (newSelected.has(articleId)) {
            newSelected.delete(articleId);
        } else {
            newSelected.add(articleId);
        }
        setSelectedArticleIds(newSelected);
        setSelectionMode(newSelected.size > 0);
    };

    const handleSelectAll = () => {
        if (selectedArticleIds.size === articles.length) {
            setSelectedArticleIds(new Set());
            setSelectionMode(false);
        } else {
            setSelectedArticleIds(new Set(articles.map(a => a._id)));
            setSelectionMode(true);
        }
    };

    const handleCancelSelection = () => {
        setSelectedArticleIds(new Set());
        setSelectionMode(false);
    };

    // Bulk delete handler
    const handleBulkDelete = async () => {
        if (selectedArticleIds.size === 0) return;

        const confirmed = window.confirm(
            `Delete ${selectedArticleIds.size} article${selectedArticleIds.size > 1 ? 's' : ''}?`
        );
        if (!confirmed) return;

        const articleIds = Array.from(selectedArticleIds);
        toast.loading(`Deleting ${articleIds.length} articles...`, { id: 'bulk-delete' });

        try {
            const res = await API.post('/articles/bulkDelete', { articleIds });
            
            if (res.data.success) {
                setArticles(prev => prev.filter(a => !selectedArticleIds.has(a._id)));
                setPagination(prev => ({
                    ...prev,
                    total: prev.total - selectedArticleIds.size
                }));
                toast.success(`Deleted ${selectedArticleIds.size} articles`, { id: 'bulk-delete' });
                setSelectedArticleIds(new Set());
                setSelectionMode(false);
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message;
            toast.error(errMsg, { id: 'bulk-delete' });
        }
    };

    // Sort handlers
    const handleSortChange = (newSortBy: typeof sortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#9EA58D]/20 via-[#CCC098]/20 to-[#B4BEC9]/20">
            <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
            <div className="lg:ml-64 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
                            <h1 className="text-3xl font-bold text-[#002333]">
                                My Articles
                            </h1>
                        </div>
                        <AddArticle onArticleAdded={handleArticleAdded} />
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#002333]/40" size={20} />
                            <Input
                                type="text"
                                placeholder="Search articles by title, content, author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 text-[#002333] bg-white/80 border border-[#B4BEC9]/40 focus-visible:ring-1 focus-visible:ring-[#002333]/40"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={searching}
                            className="bg-[#002333] hover:bg-[#002333]/80 text-white"
                        >
                            {searching ? <Loader size={18} className="animate-spin" /> : 'Search'}
                        </Button>
                    </form>

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-[#B4BEC9]/30">
                        <div className="text-sm text-[#002333]/70">
                            {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} total
                        </div>

                        {selectionMode && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-[#002333]/70">
                                    {selectedArticleIds.size} selected
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleSelectAll}
                                    className="border-[#002333]/30 text-[#002333] hover:bg-[#002333]/10"
                                >
                                    {selectedArticleIds.size === articles.length ? 'Deselect All' : 'Select All'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelSelection}
                                    className="border-[#002333]/30 text-[#002333] hover:bg-[#002333]/10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete Selected
                                </Button>
                            </div>
                        )}

                        {!selectionMode && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#002333]/70">Sort by:</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSortChange('createdAt')}
                                    className={`border-[#002333]/30 ${
                                        sortBy === 'createdAt' ? 'bg-[#002333] text-white' : 'text-[#002333]'
                                    }`}
                                >
                                    Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSortChange('title')}
                                    className={`border-[#002333]/30 ${
                                        sortBy === 'title' ? 'bg-[#002333] text-white' : 'text-[#002333]'
                                    }`}
                                >
                                    Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSortChange('updatedAt')}
                                    className={`border-[#002333]/30 ${
                                        sortBy === 'updatedAt' ? 'bg-[#002333] text-white' : 'text-[#002333]'
                                    }`}
                                >
                                    Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Articles Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader size={40} className="animate-spin text-[#002333]" />
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#002333]/60 text-lg">
                                {searchQuery ? 'No articles found' : 'No articles yet. Start by adding one!'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {articles.map((article) => (
                                    <ArticleCard
                                        key={article._id}
                                        id={article._id}
                                        title={article.title}
                                        url={article.url}
                                        excerpt={article.excerpt}
                                        featuredImage={article.featuredImage}
                                        siteName={article.siteName}
                                        author={article.author}
                                        wordCount={article.wordCount}
                                        createdAt={article.createdAt}
                                        onArticleDeleted={() => handleArticleDeleted(article._id)}
                                        isSelected={selectedArticleIds.has(article._id)}
                                        onSelect={() => handleSelectArticle(article._id)}
                                        selectionMode={selectionMode}
                                    />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {pagination.hasMore && (
                                <div className="flex justify-center pt-6">
                                    <Button
                                        onClick={handleLoadMore}
                                        className="bg-[#002333] hover:bg-[#002333]/80 text-white"
                                    >
                                        Load More
                                        <ChevronDown size={18} className="ml-2" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
