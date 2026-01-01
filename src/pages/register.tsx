import API from "@/utils/axios";
import React, { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Loader, LockKeyhole, LucideMail, UserCircle, UserPlus, Brain } from "lucide-react";
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
        <div className="min-h-screen bg-linear-to-br from-[#C5DBF0] to-[#F0E8D8] flex flex-col p-4 items-center justify-center relative overflow-hidden">
            {/* Floating decorative elements */}
            <div className="absolute top-20 right-10 w-32 h-32 bg-[#0E4D85]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#F0E8D8]/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-[#002333]/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
            
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-[#0E4D85]/30 shadow-2xl p-8 relative overflow-hidden hover:shadow-[0_20px_60px_rgba(14,77,133,0.3)] transition-all duration-500">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#0E4D85]/5 via-transparent to-[#F0E8D8]/10 pointer-events-none"></div>
                
                {/* Brain icon decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-linear-to-br from-[#0E4D85]/20 to-[#002333]/10 rounded-full blur-2xl"></div>
                
                <div className="mb-6 text-center relative z-10">
                    <h2 className="text-3xl font-bold text-[#000000]">Create Your Account</h2>
                    <p className="text-[#002333]/80 mt-1 text-sm">Enter your details below</p>
                </div>

                <form onSubmit={handleOnSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-2 group">
                        <Label htmlFor="firstName" className="text-[#000000] font-semibold text-sm">First Name</Label>
                        <div className="relative">
                            <UserCircle size={18} className="absolute left-3 top-2.5 text-[#0E4D85] group-focus-within:scale-110 transition-transform" />
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter Your First Name"
                                value={formData.firstName}
                                onChange={handleOnChange}
                                required
                                className="bg-white border-2 border-[#0E4D85]/20 text-[#000000] pl-10 focus-visible:ring-2 focus-visible:ring-[#0E4D85] focus-visible:border-[#0E4D85] transition-all duration-300 hover:border-[#0E4D85]/40"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <Label htmlFor="lastName" className="text-[#000000] font-semibold text-sm">Last Name</Label>
                        <div className="relative">
                            <UserCircle size={18} className="absolute left-3 top-2.5 text-[#0E4D85] group-focus-within:scale-110 transition-transform" />
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter Your Last Name"
                                value={formData.lastName}
                                onChange={handleOnChange}
                                required
                                className="bg-white border-2 border-[#0E4D85]/20 text-[#000000] pl-10 focus-visible:ring-2 focus-visible:ring-[#0E4D85] focus-visible:border-[#0E4D85] transition-all duration-300 hover:border-[#0E4D85]/40"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <Label htmlFor="email" className="text-[#000000] font-semibold text-sm">Email</Label>
                        <div className="relative">

                            <LucideMail size={18} className="absolute left-3 top-2.5 text-[#0E4D85] group-focus-within:scale-110 transition-transform" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter Your Email"
                                value={formData.email}
                                onChange={handleOnChange}
                                required
                                className="bg-white border-2 border-[#0E4D85]/20 text-[#000000] pl-10 focus-visible:ring-2 focus-visible:ring-[#0E4D85] focus-visible:border-[#0E4D85] transition-all duration-300 hover:border-[#0E4D85]/40"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <Label htmlFor="password" className="text-[#000000] font-semibold text-sm">Password</Label>
                        <div className="relative">
                            <LockKeyhole size={18} className="absolute left-3 top-2.5 text-[#0E4D85] group-focus-within:scale-110 transition-transform" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter Your password"
                                value={formData.password}
                                onChange={handleOnChange}
                                required
                                className="bg-white border-2 border-[#0E4D85]/20 text-[#000000] pl-10 focus-visible:ring-2 focus-visible:ring-[#0E4D85] focus-visible:border-[#0E4D85] transition-all duration-300 hover:border-[#0E4D85]/40"
                            />
                        </div>
                    </div>
                    <Button className='w-full max-w-md mt-5 text-lg bg-linear-to-r from-[#000000] to-[#0E4D85] hover:from-[#0E4D85] hover:to-[#000000] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'
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

                    <div className="text-center text-sm text-[#002333]/80">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#0E4D85] font-medium hover:underline">
                        Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}