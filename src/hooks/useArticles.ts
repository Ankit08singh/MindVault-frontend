import { useQuery, useMutation, useQueryClient,useInfiniteQuery } from "@tanstack/react-query";
import API from "@/utils/axios";
import { toast } from "sonner";

export interface IArticle {
    _id:string;
    title:string;
    url:string;
    content:string;
    excerpt: string;
    author?: string;
    siteName?: string;
    featuredImage?: string;
    wordCount?: number;
    createdAt: string;
    updatedAt: string;
}

interface ArticlesResponse{
    data: IArticle[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        hasMore: boolean;
        showing: string;
    };
}

export const useArticlesInfinite =  (sortBy: string, sortOrder: string) => {
    return useInfiniteQuery({
        queryKey: ['articles',sortBy,sortOrder],
        queryFn: async ({pageParam = 1}) => {
            const res = await API.get('/articles/getAll',{
                params:{
                    page: pageParam,
                    limit: 20,
                    sortBy,
                    order: sortOrder
                }
            });
            return{
                data: res.data.data as IArticle[],
                pagination: res.data.pagination || {
                    page: pageParam,
                    limit: 20,
                    total: res.data.total || 0,
                    totalPages: Math.ceil((res.data.total || 0) / 20),
                    hasMore: res.data.hasMore || false,
                    showing: res.data.showing || ''
                }
            } as ArticlesResponse;
        },
        getNextPageParam : (lastPage) => {
            if (lastPage.pagination.hasMore) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });    
};

export const  useSearchArticles = (query:string, enabled:boolean) => {
    return useQuery({
        queryKey: ['articles','search',query],
        queryFn: async () => {
            const res = await API.get('/article/search',{
                params: {query: query.trim() }
            });
            return (res.data.data || []) as IArticle[];
        },
        enabled: enabled && query.trim().length > 0,
        staleTime: 1000*60*2,
    });
};

export const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (articleId: string) => {
            await API.post('/articles/delete', {articleId:articleId});
            return articleId;
        },
        onSuccess: (articleId) => {
            queryClient.invalidateQueries({queryKey:['articles']});
            toast.success('Article deleted successfully');
        },
        onError: (error:any) => {
            toast.error(error.response?.data?.message || 'Failed to delete the article');
        }
    });
};

export const useBulkDeleteArticles = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: async (articleIds: string []) => {
            await API.post('/articles/bulkDelete',{articleIds:articleIds});
            return articleIds;
        },
        onMutate: async(articleIds) => {
            await queryClient.cancelQueries({queryKey: ['articles']});
            toast.loading(`Deleting ${articleIds.length} articles...`,{id: 'bulk-delete'});
        },
        onSuccess: (articleIds) => {
            queryClient.invalidateQueries({queryKey:['articles']});
            toast.success(`Successfully deleted ${articleIds.length} articles`, {id: 'bulk-delete'});
        },
        onError: (err:any) => {
            toast.error('Failed to delete articles',{id:'bulk-delete'});
        }
    });
};

export const useAddArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (url: string) => {
            const res = await API.post('/articles/add', {url:url});
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['articles']});
            toast.success('Article added successfully!');
        },
        onError: (err:any) => {
            toast.error(err.response?.data?.message || 'Failed to add the article');
        }
    });
};