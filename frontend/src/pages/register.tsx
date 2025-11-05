import API from "@/utils/axios";
import React, { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Loader, LockKeyhole, LucideMail, UserCircle, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function register(){
    const router = useRouter();
    const [formData,setFormData] = useState({firstName:'',lastName:'',email:'',password:''});
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
            const res = await API.post('/auth/register',formData);
            localStorage.setItem('token',res.data.token);
            router.push('/login');
            toast.info("Account created Successfully");
        }catch(err:any){
            //console.log("Register Error: ",err.message);
            const errMsg = err.response?.data?.message;
            toast.error(errMsg); 
            setError(err.message);
        }finally{
            setloading(false);
        }
    };

    return(
        <div className="min-h-screen bg-black flex flex-col p-4 items-center justify-center">
            <div className="w-full max-w-md bg-black/80 backdrop-blur-md rounded-2xl pt-3 border border-white p-8 font-serif">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
                    <p className="text-gray-300 mt-1">Enter your details below</p>
                </div>

                <form onSubmit={handleOnSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <div className="relative">
                            <UserCircle size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter Your First Name"
                                value={formData.firstName}
                                onChange={handleOnChange}
                                required
                                className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-1 focus-visible:ring-gray-300"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <div className="relative">
                            <UserCircle size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter Your Last Name"
                                value={formData.lastName}
                                onChange={handleOnChange}
                                required
                                className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-1 focus-visible:ring-gray-300"
                            />
                        </div>
                    </div>
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
                                Creating account...
                            </span>
                        ):(
                            <span className="flex items-center">
                                <UserPlus size={18} className="mr-2" />
                                Create Account
                            </span>
                        )}
                    </Button>

                    <div className="text-center text-sm text-gray-300">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#1baa9b] hover:underline">
                        Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}