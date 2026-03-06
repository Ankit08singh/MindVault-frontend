import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Loader,
    User,
    Mail,
    Calendar,
    Link2,
    Unlink,
    Trash2,
    AlertTriangle,
    ShieldAlert,
    Youtube,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Send
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileMenuButton from "@/components/MobileMenuButton";
import {
    useProfile,
    useLinkGoogle,
    useUnlinkGoogle,
    useDeleteAllContent,
    useDeleteAccount,
} from "@/hooks/useSettings";

export default function Settings() {
    const router = useRouter();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSendingFeedback,setIsSendingFeedback] = useState(false);


    // Hooks
    const { data: profile, isLoading: profileLoading } = useProfile();
    const { linkGoogle } = useLinkGoogle();
    const unlinkMutation = useUnlinkGoogle();
    const deleteContentMutation = useDeleteAllContent();
    const deleteAccountMutation = useDeleteAccount();

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthChecked(true);
        }
    }, [router]);

    // Handlers
    const handleUnlinkGoogle = useCallback(() => {
        toast("Unlink your Google account? You won't be able to sync YouTube videos.", {
            action: {
                label: "Unlink",
                onClick: () => unlinkMutation.mutate(),
            },
        });
    }, [unlinkMutation]);

    const handleDeleteAllContent = useCallback(() => {
        toast("This will permanently delete ALL your saved videos and articles.", {
            action: {
                label: "Delete All",
                onClick: () => deleteContentMutation.mutate(),
            },
        });
    }, [deleteContentMutation]);

    const handleDeleteAccount = useCallback(() => {
        if (deleteConfirmText !== "DELETE") {
            toast.error('Type "DELETE" to confirm');
            return;
        }
        deleteAccountMutation.mutate();
    }, [deleteConfirmText, deleteAccountMutation]);

    const handleSendFeedback = useCallback(async () => {
        if(!feedbackText.trim()) return;

        setIsSendingFeedback(true);
        try{
            const sheetUrl = process.env.NEXT_PUBLIC_FEEDBACK_SHEET_URL;
            if(!sheetUrl){
                toast.error("Feedback service not configured");
                return;
            }

            await fetch(sheetUrl,{
                method:'POST',
                mode:'no-cors',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    email:profile?.email || 'unknown',
                    feedback: feedbackText.trim(),
                }),
            });

            toast.success("Thank you for your feedback!");
            setFeedbackText("");
        }catch{
            toast.error("Failed to send feedback. Please try again.");
        }finally{
            setIsSendingFeedback(false);
        }
    },[feedbackText,profile]);

    // Loading state
    if (!isAuthChecked) {
        return (
            <div className="flex justify-center items-center min-h-screen overflow-y-auto bg-linear-to-br from-[#CCC098] to-[#9EA58D]">
                <Loader size={36} className="animate-spin text-[#002333]" />
            </div>
        );
    }

    return (
        <div className="flex font-serif overflow-x-hidden ">
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
                label="Settings"
            />

            {/* Main Content */}
            <div className="flex-1 h-screen bg-linear-to-br from-[#CCC098] to-[#9EA58D] p-4 lg:p-6 pt-16 lg:pt-6 overflow-y-auto">
                <h1 className="text-3xl font-bold text-[#002333] mb-6">Settings</h1>

                <div className="space-y-6 max-w-3xl pb-6">
                    {/* ───── Account Info ───── */}
                    <section className="bg-white/70 backdrop-blur-md rounded-xl shadow-md border border-[#B4BEC9]/30 p-6">
                        <h2 className="text-xl font-semibold text-[#002333] mb-4 flex items-center gap-2">
                            <User size={20} />
                            Account Information
                        </h2>

                        {profileLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-5 bg-[#B4BEC9]/20 rounded w-60 animate-pulse" />
                                ))}
                            </div>
                        ) : profile ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#002333]">
                                    <User size={16} className="text-[#002333]/60 shrink-0" />
                                    <span className="font-medium w-24 shrink-0">Name</span>
                                    <span className="text-[#002333]/80">
                                        {profile.firstName} {profile.lastName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[#002333]">
                                    <Mail size={16} className="text-[#002333]/60 shrink-0" />
                                    <span className="font-medium w-24 shrink-0">Email</span>
                                    <span className="text-[#002333]/80">{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[#002333]">
                                    <Calendar size={16} className="text-[#002333]/60 shrink-0" />
                                    <span className="font-medium w-24 shrink-0">Joined</span>
                                    <span className="text-[#002333]/80">
                                        {new Date(profile.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[#002333]/60">Unable to load profile.</p>
                        )}
                    </section>

                    {/* ───── YouTube / Google Integration ───── */}
                    <section className="bg-white/70 backdrop-blur-md rounded-xl shadow-md border border-[#B4BEC9]/30 p-6">
                        <h2 className="text-xl font-semibold text-[#002333] mb-4 flex items-center gap-2">
                            <Youtube size={20} className="text-red-600" />
                            YouTube Integration
                        </h2>

                        {profileLoading ? (
                            <div className="h-5 bg-[#B4BEC9]/20 rounded w-48 animate-pulse" />
                        ) : (
                            <div className="space-y-5">
                                {/* Connection status */}
                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-[#B4BEC9]/20">
                                    <div className="flex items-center gap-3">
                                        {profile?.googleLinked ? (
                                            <CheckCircle2 size={22} className="text-green-600" />
                                        ) : (
                                            <XCircle size={22} className="text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-medium text-[#002333]">
                                                {profile?.googleLinked
                                                    ? "Google Account Linked"
                                                    : "Google Account Not Linked"}
                                            </p>
                                            {profile?.googleLinked && profile?.youtubeChannelName && (
                                                <p className="text-sm text-[#002333]/60">
                                                    Channel: {profile.youtubeChannelName}
                                                </p>
                                            )}
                                            {!profile?.googleLinked && (
                                                <p className="text-sm text-[#002333]/60">
                                                    Link your Google account to import YouTube videos
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {profile?.googleLinked ? (
                                        <Button
                                            onClick={handleUnlinkGoogle}
                                            disabled={unlinkMutation.isPending}
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            {unlinkMutation.isPending ? (
                                                <Loader size={16} className="animate-spin mr-1" />
                                            ) : (
                                                <Unlink size={16} className="mr-1" />
                                            )}
                                            Unlink
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={linkGoogle}
                                            className="bg-[#002333] hover:bg-[#002333]/80 text-white"
                                        >
                                            <Link2 size={16} className="mr-1" />
                                            Link Google
                                        </Button>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="text-sm text-[#002333]/60 bg-[#002333]/5 rounded-lg p-3">
                                    <p>
                                        Linking your Google account allows you to import your YouTube
                                        watch history and liked videos into MindVault. Your Google
                                        credentials are never stored — we use secure OAuth
                                        authentication.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-md border border-[#B4BEC9]/30 p-6">
                        <h2 className="text-xl font-semibold text-[#002333] flex items-center gap-2 mb-4">
                            <MessageSquare size={22} className="text-[#002333]" />
                            Send Feedback
                        </h2>

                        <p className="text-sm text-[#002333]/60 mb-4">
                            Help us improve MindVault. Share your thoughts, suggestions, or report bugs.
                        </p>

                        <div className="space-y-3">
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="What's on your mind? Tell us how we can improve..."
                                rows={4}
                                maxLength={1000}
                                className="w-full px-4 py-3 border border-[#B4BEC9]/40 rounded-lg text-[#002333] bg-white/80 placeholder:text-[#002333]/40 focus:outline-none focus:ring-2 focus:ring-[#002333]/20 focus:border-[#002333]/50 resize-none text-sm"
                            />

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-[#002333]/40">
                                    {feedbackText.length}/1000 characters
                                </span>

                                <Button
                                    onClick={handleSendFeedback}
                                    disabled={!feedbackText.trim() || isSendingFeedback}
                                    className="bg-[#002333] hover:bg-[#002333]/80 text-white"
                                >
                                    {isSendingFeedback ? (
                                        <>
                                            <Loader size={16} className="animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} className="mr-2" />
                                            Send Feedback
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {profile?.email && (
                            <p className="text-xs text-[#002333]/40 mt-3">
                                Feedback will be sent with your email ({profile.email}) so we can follow up if needed.
                            </p>
                        )}
                    </div>

                    {/* ───── Danger Zone ───── */}
                    <section className="bg-white/70 backdrop-blur-md rounded-xl shadow-md border border-red-300/40 p-6">
                        <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                            <ShieldAlert size={20} />
                            Danger Zone
                        </h2>

                        <div className="space-y-4">
                            {/* Delete all content */}
                            <div className="flex items-center justify-between p-4 rounded-lg border border-red-200/60 bg-red-50/30">
                                <div>
                                    <p className="font-medium text-[#002333]">Delete All Content</p>
                                    <p className="text-sm text-[#002333]/60">
                                        Permanently remove all your saved videos and articles.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleDeleteAllContent}
                                    disabled={deleteContentMutation.isPending}
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 shrink-0"
                                >
                                    {deleteContentMutation.isPending ? (
                                        <>
                                            <Loader size={16} className="animate-spin mr-1" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} className="mr-1" />
                                            Delete All
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Delete account */}
                            <div className="p-4 rounded-lg border border-red-300/60 bg-red-50/40">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-red-700">Delete Account</p>
                                        <p className="text-sm text-[#002333]/60">
                                            Permanently delete your account and all associated data.
                                            This cannot be undone.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                                        variant="outline"
                                        className="border-red-400 text-red-700 hover:bg-red-100 shrink-0"
                                    >
                                        <AlertTriangle size={16} className="mr-1" />
                                        {showDeleteAccount ? "Cancel" : "Delete Account"}
                                    </Button>
                                </div>

                                {showDeleteAccount && (
                                    <div className="mt-4 pt-4 border-t border-red-200/60">
                                        <p className="text-sm text-red-700 mb-3 font-medium">
                                            Type <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded">DELETE</span> to confirm:
                                        </p>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={deleteConfirmText}
                                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                placeholder="Type DELETE"
                                                className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm bg-white text-[#002333] focus:outline-none focus:ring-2 focus:ring-red-400/40"
                                            />
                                            <Button
                                                onClick={handleDeleteAccount}
                                                disabled={
                                                    deleteConfirmText !== "DELETE" ||
                                                    deleteAccountMutation.isPending
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                                            >
                                                {deleteAccountMutation.isPending ? (
                                                    <>
                                                        <Loader size={16} className="animate-spin mr-1" />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    "Confirm Delete"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
