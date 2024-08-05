"use client";

import { ChevronDown, ChevronsLeftRight, Moon, Sun } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export const UserItem = () => {

    const { user } = useUser();

    const { setTheme } = useTheme()


  return (
  
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div role="button"
                className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
                    <div className="gap-x-2 flex items-center max-w-[150px]">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={user?.imageUrl} />
                        </Avatar>
                        <span className="text-start font-medium line-clamp-1">
                            {user?.fullName}
                        </span>
                    </div>
                    <ChevronDown className="ml-2 text-muted-foreground h-4 w-4"/>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="w-90"
            align="start"
            alignOffset={11}
            forceMount
        >
            <div className="flex flex-col space-y-4 p-2">
                <p className="text-xs font-medium leading-none text-muted-foreground">
                    {user?.emailAddresses[0].emailAddress}
                </p>
                <div>
      
       <div className="flex gap-2"> 
        <Button variant="outline" size="sm" onClick={() => setTheme("light")} className="w-full">
            <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 " />
        </Button>

        <Button variant="outline" size="sm" onClick={() => setTheme("dark")} className="w-full">
            <Moon className="h-[1rem] w-[1rem]  scale-100 transition-all dark:rotate-0 " />
        </Button>
        </div>
                </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
                <SignOutButton>
                    Log Out
                </SignOutButton>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

  )
};
