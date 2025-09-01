"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, HomeIcon, MenuIcon, Plus, PlusCircle, Search, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { useSearch } from "@/hooks/use-search";
import { Navbar } from "./navbar";
import { TrashBox } from "./trashbox";

export const Navigation = () => {

    const router = useRouter();
    const search = useSearch();
    const params = useParams();
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile, resetWidth]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWitdth = event.clientX;

        if (newWitdth < 240) newWitdth = 240;
        if (newWitdth > 480) newWitdth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWitdth}px`;
            navbarRef.current.style.setProperty("left", `${newWitdth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWitdth}px)`);
        }
    };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        const resetWidth = () => {
            if (sidebarRef.current && navbarRef.current) {
                setIsCollapsed(false);
                setIsResetting(true);

                sidebarRef.current.style.width = isMobile ? "100%" : "240px";
                navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
                navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
                setTimeout(() => setIsResetting(false), 300);
            }
        };

        const collapse = () => {
            if (sidebarRef.current && navbarRef.current) {
                setIsCollapsed(true);
                setIsResetting(true);

                sidebarRef.current.style.width = "0";
                navbarRef.current.style.setProperty("width", "100%");
                navbarRef.current.style.setProperty("left", "0");
                setTimeout(() => setIsResetting(false), 300);
            }
        }
    
        const handleCreate = () => {
            const promise = create({ title: "Untitled Space" })
                .then((documentId) => router.push(`/spaces/${documentId}`))

            toast.promise(promise, {
                loading: "Creating space...",
                success: "Space created",
                error: "Failed to create space"
            });
        };

        const Homer = () => {
            const homeyy =  router.push(`/spaces`);

            return homeyy;
        };

    return (
        <>
        <aside
            ref={sidebarRef}
            className={cn("group/sidebar h-screen bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "w-0"
            )}
        >
            <div
                onClick={collapse}
                role="button"
                className={cn("h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-800 absolute top-4 right-3 opacity-0 group-hover/sidebar:opacity-100 transition-all",
                    isMobile && "opacity-100"
                )}
            >
                <ChevronsLeft className="h-6 w-6"/>
            </div>
            
            {/* User Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <UserItem />
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-1">
               <Item onClick={Homer} label="Home" icon={HomeIcon} butter={false} />
               <Item 
                label="Search"
                icon={Search}
                isSearch
                onClick={search.onOpen}
                butter={false}
               />
               <Item onClick={handleCreate} label="New Space" icon={Plus} butter={false} />
            </div>

            {/* Spaces Section */}
            <div className="flex-1 px-4">
                <div className="mb-3">
                    <span className="text-xs font-light text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                        Spaces
                    </span>
                </div>
                <DocumentList />
            </div>

            {/* Trash Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <Popover>
                    <PopoverTrigger className="w-full">
                        <Item label="Trash" icon={Trash} />
                    </PopoverTrigger>
                    <PopoverContent 
                    className="p-0 w-72"
                    side={isMobile ? "bottom" : "right"}>
                        <TrashBox />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Resize Handle */}
            <div onMouseDown={handleMouseDown} onClick={resetWidth} className="opacity-0 group-hover/sidebar:opacity-100
            transition cursor-ew-resize absolute h-screen w-1 bg-gray-300 dark:bg-gray-700
            right-0 top-0"/>  
        </aside>
        <div
            ref={navbarRef}
            className={cn(
                "absolute top-0 z-[99999] left-60 w[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full"
            )}
        >

            {!!params.documentId ? (
                <Navbar 
                    isCollapsed={isCollapsed}
                    onResetWidth={resetWidth}
                />
            ) : (
            <nav className="bg-transparent px-3 py-2 w-full">
                {isCollapsed && <MenuIcon role="button" onClick={resetWidth} className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
            </nav>
            )}
        </div>
        </>
    );
};