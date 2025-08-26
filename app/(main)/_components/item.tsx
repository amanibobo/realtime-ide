"use client";

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { error } from "console";
import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Search, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ItemProps {
    id?: Id<"documents">;
    active?: boolean
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
    butter?: boolean;
};

export const Item = ({
    id,
    label,
    onClick,
    icon: Icon,
    active,
    isSearch,
    level = 0,
    onExpand,
    expanded,
    butter,
}: ItemProps) => {

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;
    const { user } = useUser();
    const archive = useMutation(api.documents.archive);
    const router = useRouter();

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if (!id) return;
        const promise = archive({ id })
        .then(() => router.push("/spaces"))

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Space moved to trash",
            error: "Failed to move to trash",
        })
    }


    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: level ? `${(level * 12) + 16}px` : "16px" }}
            className={`group flex items-center py-2 px-0 w-full text-sm font-light text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer rounded-sm ${
                active ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" : ""
            }`}
        >
            <Icon className="shrink-0 h-4 w-4 mr-3" />
            <span className="truncate flex-1">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 font-mono text-[10px] font-light text-gray-500 dark:text-gray-500">
                    <span className="text-xs">⌘K</span>
                </kbd>
            )}
            {butter && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div 
                            role="button"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 flex items-center justify-center rounded-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-500" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive} className="hover:cursor-pointer font-light">
                                <Trash className="h-4 w-4 mr-2" />
                                Move to trash
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs text-gray-500 dark:text-gray-500 p-2 font-light">
                                Last edited by {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    )
}
