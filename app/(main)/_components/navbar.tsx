"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Coffee, CoffeeIcon, MenuIcon, Worm, WormIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
  


interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
};

export const Navbar = ({
    isCollapsed,
    onResetWidth
}: NavbarProps) =>  {
    const params = useParams();
    const [language, setLanguage] = useState<string>("python");
    const document = useQuery(api.documents.getbyId, {
        documentId: params.documentId as Id<"documents">
    });


    if (document === undefined) {
        return <div><Spinner /></div>
    }
    
    if (document === null) {
        return null;
    }

    const onChangeLanguage = (newLanguage: string) => {
        setLanguage(newLanguage);
    }

    return (
        <>
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4 border-b">
                {isCollapsed && ( 
                    <MenuIcon role="button" onClick={onResetWidth} className="h-6 w-6 text-muted-foreground" />
                )}
                <div className="flex items-center justify-between w-full">
                <Title initialData={document} />

                <div className="flex gap-2">

                <Select onValueChange={onChangeLanguage} value={language}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="java">java</SelectItem>
          <SelectItem value="python">python</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
                <ModeToggle />
                </div>
                </div>
            </nav>
        </>
    )
}




