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
import { SignOutButton, useUser } from "@clerk/nextjs";
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
                className="flex items-center w-full p-0 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-sm transition-all">
                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                        <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                            <AvatarImage src={user?.imageUrl} />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-light text-gray-900 dark:text-gray-100 truncate">
                                {user?.fullName}
                            </div>
                            <div className="text-xs font-light text-gray-500 dark:text-gray-500 truncate">
                                {user?.emailAddresses[0].emailAddress}
                            </div>
                        </div>
                    </div>
                    <ChevronDown className="ml-2 text-gray-400 h-4 w-4 flex-shrink-0"/>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="w-64"
            align="start"
            alignOffset={11}
            forceMount
        >
            <div className="flex flex-col space-y-4 p-4">
                <div className="space-y-2">
                    <p className="text-sm font-light text-gray-900 dark:text-gray-100">
                        {user?.fullName}
                    </p>
                    <p className="text-xs font-light text-gray-500 dark:text-gray-500">
                        {user?.emailAddresses[0].emailAddress}
                    </p>
                </div>
                
                <div className="space-y-2">
                    <p className="text-xs font-light text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                        Theme
                    </p>
                    <div className="flex gap-2"> 
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setTheme("light")} 
                            className="flex-1 font-light border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                        </Button>

                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setTheme("dark")} 
                            className="flex-1 font-light border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                        </Button>
                    </div>
                </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="w-full cursor-pointer text-gray-600 dark:text-gray-400 font-light">
                <SignOutButton>
                    Sign out
                </SignOutButton>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

  )
};
