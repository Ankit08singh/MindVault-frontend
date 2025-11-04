import { useEffect,useState } from "react";
import API from "@/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, LucideSearchX, PlusCircleIcon, Search } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import Sidebar from "@/components/Sidebar";
import MobileMenuButton from "@/components/MobileMenuButton";
import { useRouter } from "next/navigation";
import { Add } from "@/components/AddVideo";

export interface IVideo{
    _id:string;
    title:string;
    thumbnailUrl:string;
    videoUrl:string;
};

export default function dashboard()  {
    const router = useRouter();
    const [form,setQuery] = useState({query:''});
    const [error,setError] = useState<string|null>(null);
    const [queryResult,setqueryResult] = useState<IVideo[]>([]);
    const [isResult,setIsResult] = useState(false);
    const [isSearched,setSearched] = useState(false);
    const [videos,setVideos] = useState<IVideo[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDisable,setIsDisabled] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    
    
    
    useEffect(()=>{
        if(form.query.length == 0){
            setIsDisabled(true);
        }
    },[form]);

    useEffect(()=>{
        if(!localStorage.getItem('token')){
            router.push('/login');
        }
    },[router]);

    useEffect(() => {
        handleGetAll();
    },[router]);


    const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setQuery({...form,[name]:value});
        setError(null);
        setIsDisabled(false);
    };

    const handleSearch = async() => {
        console.log("Search Button clicked");
        setSearched(true);
        setIsLoading(true);
        try{
            const res = await API.post('/videos/search',form);
            setqueryResult(res.data.match);
            setIsResult(true);
            setError(null);

        }catch(err:any){
            console.log(err.message);
            setError(err.message);
        }finally{
            setIsLoading(false);
        }
    };

    const handleGetAll = async() => {
        console.log("Button Clicked");
        try{
            const res = await API.get('/videos/getAll');
            setVideos(res.data.data);
            setError(null);
        }catch(err:any){
            console.log(err.message);
            setError(err.message);
            setVideos([]);
        }
    }

    const handleClear = () => {
        setQuery({query:''});
        setqueryResult([]);
        setIsResult(false);
        setSearched(false);
    };

    return(
        <div className="flex font-serif">
            {/* Mobile Menu Button */}
            <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
            
            {/* Sidebar */}
            <Sidebar 
                isMobileOpen={isMobileMenuOpen} 
                onMobileClose={() => setIsMobileMenuOpen(false)} 
            />
            
            {/* Main Content */}
            <div className="flex-1 min-h-screen bg-stone-900 p-4 lg:p-4 pt-16 lg:pt-4">
                <div className="bg-stone-800/50 p-4 rounded-xl ">
                    <div className="max-w-md mr-4 flex justify-between items-center">
                        <Input  
                            id="query"
                            name="query"
                            placeholder="Search your Memory"
                            onChange={handleOnChange}
                            type="text"
                            value={form.query}
                            className="text-white/80 bg-transparent focus-visible:ring-1 focus-visible:ring-blue-200 "
                            />
                        <Button className={`ml-5 ${isDisable ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} bg-black text-white`}
                            disabled={isDisable}
                            onClick={handleSearch}><Search size={18} className="items-center justify-center" />Search</Button>
                    </div>
                </div>

                
                <div className="mt-5 border-t-2 border-gray-500 rounded-2xl"></div>


                <div className="mt-5 bg-stone-800/50 rounded-xl h-[calc(113vh-250px)] overflow-y-auto 
                                ">
                    <div className='bg-transparent flex justify-between items-center p-6 pl-10 pr-10'>
                        {isSearched ? (
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl text-white/80 font-semibold font-serif">Search Result</h1>
                                <Button className="ml-5" onClick={handleClear}>
                                    <LucideSearchX size={18} className="text-white" />
                                    Clear
                                </Button>
                                <p className="text-white/80 ml-5">top 2 result</p>
                            </div>
                        ):(
                            <h1 className="text-2xl text-white/80 font-semibold font-serif">Your videos</h1>)}
                        <Add onVideoAdded={handleGetAll}/>
                    </div>

                    {isSearched ? (
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-200"></div> */}
                                    <Loader size={36} className="animate-spin text-white/80 mr-4"></Loader>
                                    <p className="text-gray-400">Searching your Memories...</p>
                                </div>
                            ) : isResult && queryResult.length > 0 ? (
                                queryResult.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        id={video._id}
                                        title={video.title}
                                        thumbnail={video.thumbnailUrl}
                                        url={video.videoUrl}
                                    />
                                ))
                            ):(
                                <p className="text-gray-400 text-center col-span-full py-8">
                                    Nothing related to this in memeory!!
                                </p>
                            )}
                        </div>
                    ):(
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-4">
                            {videos.length > 0 ? (
                                videos.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        id={video._id}
                                        title={video.title}
                                        thumbnail={video.thumbnailUrl}
                                        url={video.videoUrl}
                                    />
                                ))
                            ):(
                                <p className="text-gray-400 text-center col-span-full py-8">
                                    No Video Saved Yet!!
                                </p>
                            )}
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
        
    )
};