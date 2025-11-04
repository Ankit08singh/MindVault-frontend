import { useState } from "react";
import API from "@/utils/axios";
import { Loader, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddProps {
    onVideoAdded?: () => void;
}

export function Add({onVideoAdded}:AddProps) {

    const [form,setformData] = useState({videoUrl:''});
    const [isLoading,setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [open,setOpen] = useState(false);

    const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setformData({...form,[name]:value});
    };

    const handleOnSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            await API.post('/videos',form);
            setformData({videoUrl:''});
            setOpen(false);
            onVideoAdded?.();
        }catch(err:any){
            setError(err.message);
        }finally{
            setIsLoading(false);
        }
    };

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <form onSubmit={handleOnSubmit}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle size={18} />
                        Add
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-stone-900 border-black text-white/80 ">
                    <DialogHeader>
                        <DialogTitle>Save to Memory</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="url">URL</Label>
                            <Input 
                                id="url"
                                name="videoUrl"
                                placeholder="Enter the Video Url"
                                type="text"
                                onChange={handleOnChange}
                                value={form.videoUrl}
                                className="text-white/80 bg-transparent focus-visible:ring-1 focus-visible:ring-blue-200 "
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                                <Button variant="outline" className="bg-stone-600">Cancel</Button>
                        </DialogClose>
                                <Button type="submit" disabled={isLoading} onClick={handleOnSubmit}>
                                    {isLoading ? (
                                        <>
                                            <Loader className="animate-spin mr-2" size={16} />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Memory'
                                    )}
                                </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}