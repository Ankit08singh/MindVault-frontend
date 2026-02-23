export interface ContentItem {
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

export interface ContentPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    showing: string;
}

export interface ContentResponse {
    data: ContentItem[];
    pagination: ContentPagination;
}