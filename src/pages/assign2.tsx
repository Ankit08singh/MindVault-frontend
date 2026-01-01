import FolderComponent from "@/components/folderComponent";
import { struct } from "@/components/folderComponent";
import { useState } from "react";

export default function explore(){
    const folder : struct[]= [
        {name:'A',members:[
            {name:'B',members:[
                {name:'C',members:[
                    {name:'C1',members:[]},
                    {name:'C2',members:[]}
                ]}
            ]},
            {name:'A1',members:[]},
            {name: 'A2',members:[]}
            
        ]}
    ];

    const [current,setCurrent] = useState<struct>(folder[0]);
    const [path,SetPath] = useState<struct[]>([]);

    const handleNavigate = (node:struct) => {
        SetPath([...path,current]);
        setCurrent(node);
    };

    const Back = () => {
        if(path.length > 0) {
            const prev = path[path.length-1];
            setCurrent(prev);
            SetPath(path.slice(0,-1));
        }
    };

    return(
        <div className="grid grid-cols-2 gap-5">

            <div onClick={Back}>{current.name}</div>

            <div>
                {current.members?.map((node,i) => (
                    <FolderComponent key={i} node={node} click={
                        () => {
                            handleNavigate(node);
                        }
                    } />
                ))}
            </div>
            
        </div>
    );
};