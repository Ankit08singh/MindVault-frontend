
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccess() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const token = params.get("token");
        if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboard");
        } else {
        router.push("/login");
        }
    }, [params, router]);

    return (
        <div className="flex items-center justify-center min-h-screen text-white">
        Redirecting...
        </div>
    );
}
