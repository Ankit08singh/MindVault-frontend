import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/utils/axios";
import { toast } from "sonner";

export interface UserProfile {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    googleLinked: boolean;
    youtubeChannelName?: string;
    createdAt: string;
}

// Fetch user profile
export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await API.get("/auth/me");
            return res.data.user as UserProfile;
        },
        staleTime: 1000 * 60 * 5,
    });
};

// Link Google account (redirect-based)
export const useLinkGoogle = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    return {
        linkGoogle: () => {
            const token = localStorage.getItem("token");
            window.location.href = `${apiUrl}/auth/google/link?token=${token}`;
        },
    };
};

// Unlink Google account
export const useUnlinkGoogle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await API.post("/auth/google/unlink");
            return res.data;
        },
        onMutate: () => {
            toast.loading("Unlinking Google account...", { id: "unlink-google" });
        },
        onSuccess: () => {
            toast.success("Google account unlinked successfully", { id: "unlink-google" });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Failed to unlink Google account",
                { id: "unlink-google" }
            );
        },
    });
};

// Delete all user content (videos + articles)
export const useDeleteAllContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await API.delete("/content/all");
            return res.data;
        },
        onMutate: () => {
            toast.loading("Deleting all content...", { id: "delete-content" });
        },
        onSuccess: (data) => {
            toast.success(
                data.message || "All content deleted successfully",
                { id: "delete-content" }
            );
            queryClient.invalidateQueries({ queryKey: ["content"] });
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Failed to delete content",
                { id: "delete-content" }
            );
        },
    });
};

// Delete user account
export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: async () => {
            const res = await API.delete("/auth/account");
            return res.data;
        },
        onMutate: () => {
            toast.loading("Deleting your account...", { id: "delete-account" });
        },
        onSuccess: () => {
            toast.success("Account deleted. Goodbye!", { id: "delete-account" });
            localStorage.removeItem("token");
            window.location.href = "/login";
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Failed to delete account",
                { id: "delete-account" }
            );
        },
    });
};
