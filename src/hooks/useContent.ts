import { useQuery,useQueryClient,useInfiniteQuery,useMutation } from "@tanstack/react-query";
import API from "@/utils/axios";
import { toast } from "sonner";
import { ContentItem,ContentResponse } from "@/types/content";

export const useContentInfinite = (sortBy: string, sortOrder:string) => {
    return useInfiniteQuery({
        queryKey:['content',sortBy,sortOrder],
        queryFn: async ({pageParam = 1}) => {
            const res = await API.get('/content/all',{
                params:{
                    page:pageParam,
                    limit:20,
                    sortBy,
                    order:sortOrder
                }
            });
            return {
                data:res.data.data as ContentItem[],
                pagination:{
                    page:pageParam,
                    limit:20,
                    total: res.data.pagination.total || 0,
                    // totalPages: Math.ceil((res.data.pagination.total || 0) /2),
                    totalPages: res.data.pagination.totalPages,
                    hasMore: res.data.pagination.hasMore || false,
                    showing: res.data.pagination.showing || ''
                }
            } as ContentResponse;
        },
        getNextPageParam: (lastPage) => {
            if(lastPage.pagination.hasMore){
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    })
};

export const useSearchContent = (query:string,enabled:boolean) => {
    return useQuery({
        queryKey: ['content',"search",query],
        queryFn: async () => {
            const res = await API.post('/videos/search',{query:query});
            return (res.data.match || [] ) as ContentItem[];
        },
        staleTime: 1000*60*2,
        enabled: enabled && query.trim().length > 0,
    });
};

export const useImportLikedVideos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (limit:number = 50) => {
            const res = await API.post(`/videos/sync/liked?limit=${limit}`);
            return res.data;
        },
        onMutate: () => {
            toast.loading('Importing Liked Videos...',{id:'import-video'});
        },
        onSuccess: (data) => {
            if(data.success) {
                toast.success(
                    `Imported ${data.stats.synced} videos! (${data.stats.skipped} already existed)`,
                    {id: 'import-video'}
                );
                queryClient.invalidateQueries({queryKey:['content']});
            }
        },
        onError: () => {
            toast.error('Failed to import videos', {id:'import-video'})
        }
    });
};

export const useSyncVideos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await API.get('/videos/sync/smart');
            return res.data;
        },
        onSuccess: (data) => {
            if(data.success && data.stats.synced >0){
                toast.success(`Synced ${data.stats.synced} new videos`,{id:'sync-video'});
                queryClient.invalidateQueries({queryKey:['content']});
            }else{
                toast.info('All videos are up to date!');
            }
        },
        onError: (error:any) => {
            if(error.response?.status === 429){
                const remaining = error.response.data.remainingSeconds;
                const minutes = Math.floor(remaining/60);
                const seconds = remaining%60;
                toast.error(`Please wait ${minutes}m ${seconds}s before syncing again!`);
            }else{
                toast.error('Failed to check for new videos');
            }
        }
    });
};

export const useAddVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (url:string) => {
            const res = await API.post('/vidoes',{videoUrl:url});
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['content']});
            toast.success('Video added successfully!');
        },
        onError: (error:any) => {
            toast.error(error.response?.data?.message || 'Failed to add video!');
        }
    });
};

export const useBulkDeleteContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({videoIds, articleIds} : {videoIds:string[]; articleIds:string[]}) => {
            const allpromises = [];

            if(videoIds.length > 0) {
                allpromises.push(API.post('/videos/bulkDelete',{videoIds:videoIds}));
            }
            if(articleIds.length > 0) {
                allpromises.push(API.post('/articles/bulkDelete',{articleIds:articleIds}));
            }

            await Promise.all(allpromises);
            return {videoIds,articleIds};
        },
        onMutate: async({videoIds,articleIds}) => {
            const count = videoIds.length + articleIds.length;
            toast.loading(`Deleting ${count} item${count > 1 ? 's': ''}...`, {id:'bulk-delete'});
        },
        onSuccess: ({videoIds, articleIds}) => {
            const count = videoIds.length + articleIds.length;
            queryClient.invalidateQueries({queryKey:['content']});
            queryClient.invalidateQueries({queryKey:['articles']});
            toast.success(`Successfully deleted ${count} item${count > 1 ? 's': ''}`, {id:'bulk-delete'});
        },
        onError: () => {
            toast.error('Failed to delete items', {id:'bulk-delete'});
        }
    });
};