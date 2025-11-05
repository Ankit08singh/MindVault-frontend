import API from "@/utils/axios";
import React, { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Loader, LockKeyhole, LucideMail, UserCheck2, UserCircle, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function login(){
    const router = useRouter();
    const [formData,setFormData] = useState({email:'',password:''});
    const [loading,setloading] = useState(false);
    const [error,setError] = useState<string|null>(null);

    useEffect(()=>{
        if(localStorage.getItem('token')){
            router.push('/dashboard');
        }
    },[router]);

    const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setFormData({...formData,[name]:value});
        setError(null);
    };

    const handleOnSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        setloading(true);
        setError(null);
        try{
            const res = await API.post('/auth/login',formData);
            localStorage.setItem('token',res.data.token);
            router.push('/dashboard');
            toast.info("Logged in Successfully");
        }catch(err:any){
            // console.log("login Error::: ",err);
            // console.log("Response", err.response?.data);
            const errMsg = err.response?.data?.message || err.message;
            // console.log("Login Error: ",err.message);
            setError(errMsg);
            toast.error(errMsg);
        }finally{
            setloading(false);
        }
    };

    return(
        <div className="min-h-screen bg-black flex flex-col p-4 items-center justify-center">
            <div className="w-full max-w-md bg-black/80 backdrop-blur-md rounded-2xl pt-3 border border-white p-8 font-serif">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-gray-300 mt-1">SignIn to Your Account</p>
                </div>

                <form onSubmit={handleOnSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <div className="relative">

                            <LucideMail size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter Your Email"
                                value={formData.email}
                                onChange={handleOnChange}
                                required
                                className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-1 focus-visible:ring-gray-300"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <div className="relative">
                            <LockKeyhole size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter Your password"
                                value={formData.password}
                                onChange={handleOnChange}
                                required
                                className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-1 focus-visible:ring-gray-300"
                            />
                        </div>
                    </div>
                    <Button className= 'w-full max-w-md mt-5 text-xl'
                        type="submit"
                        disabled={loading}>
                        {loading ? (
                            <span className="flex items-center">
                                <Loader size={18} className="mr-2 animate-spin" />
                                Login
                            </span>
                        ):(
                            <span className="flex items-center">
                                <UserCheck2 size={18} className="mr-2" />
                                Login
                            </span>
                        )}
                    </Button>

                    <div className="text-center text-sm text-gray-300">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-blue-300 hover:underline">
                        Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}