import { useState } from "react";

export interface struct {
    name: string;
    members? :struct[];
};

type Prop = {
    node: struct;
    click: () => void;
}

export default function FolderComponent({node,click} : Prop) {
    const [open,setOpen] = useState(false);

    const handleClick = () => {
        //setOpen(!open);
        click();
    }
    
    return(

        <div>
            <div onClick={handleClick} >
                {node.name}
            </div>

            {open && (
                <div>
                    {node.members?.map((m,i) => 
                        <FolderComponent key={i} node={m} click={click} />
                    )}
                </div>
            )}
        </div>
    );
};