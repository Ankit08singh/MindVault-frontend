import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import API from '@/utils/axios';
import { toast } from "sonner";

export interface IVideo {
    _id:string;
    title:string;
    thumbnailUrl:string;
    videoUrl:string;
    channelName:string;
    createdAt:string;
}

interface VideoResponse{
    data:IVideo[];
    pagination:{
        page:number;
        limit:number;
        total:number;
        totalPage:number;
        hasMore:boolean;
        showing:string;
    };
}

export const useVideosInfinite = (sortBy: string, sortOrder: string) => {
    return useInfiniteQuery({
        queryKey:['videos',sortBy,sortOrder],
        queryFn: async ({pageParam =1}) => {
            const res = await API.get('/videos/getAll',{
                params:{
                    page:pageParam,
                    limit:20,
                    sortBy,
                    order:sortOrder
                }
            });
            return{
                data: res.data.data as IVideo[],
                pagination: res.data.pagination || {
                    page: pageParam,
                    limit: 20,
                    total: res.data.total || 0,
                    totalPages: Math.ceil((res.data.total || 0) / 20),
                    hasMore: res.data.hasMore || false,
                    showing: res.data.showing || ''
                }
            } as VideoResponse;
        },
        getNextPageParam: (lastPage) => {
            if(lastPage.pagination.hasMore) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};

export const useSearchVideos = (query: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['videos', 'search', query],
        queryFn: async () => {
            const res = await API.post('/videos/search', { query: query.trim() });
            return (res.data.data || []) as IVideo[];
        },
        enabled: enabled && query.trim().length > 0,
        staleTime: 1000 * 60 * 2,
    });
};

export const useDeleteVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (videoUrl:string) => {
            await API.post('/videos/delete',{videoUrl: videoUrl});
            return videoUrl;
        },
        onSuccess: (videoUrl) => {
            queryClient.invalidateQueries({queryKey:['videos']});
            toast.success('Video deleted successfully');
        },
        onError: (error:any)=>{
            toast.error(error.response?.data?.message || 'Failed to delete the video');
        }
    });
};

export const useBulkDeleteVideos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (videoIds:string[]) => {
            await API.post('/videos/bulkDelete',{videoIds:videoIds});
            return videoIds;
        },
        onMutate: async(videoIds) => {
            await queryClient.cancelQueries({queryKey:['videos']});
            toast.loading(`Deleting ${videoIds.length} videos...`,{id: 'bulk-delete'});
        },
        onSuccess: (videoIds) => {
            queryClient.invalidateQueries({queryKey:['videos']});
            toast.success(`Successfully deleted ${videoIds.length} videos`, {id: 'bulk-delete'});
        },
        onError: (err:any) => {
            toast.error('Failed to delete videos',{id: 'bulk-delete'});
        }
    });
};
