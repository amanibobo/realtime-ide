"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Plus, File, Search } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

// Utility function to format relative time
const formatRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

const SpacesPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);
    const router = useRouter();
    const documents = useQuery(api.documents.getSearch);

    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredDocuments = documents?.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onSelect = (id: string) => {
        router.push(`/spaces/${id}`);
    };

    if (!isMounted) {
        return null;
    }

    const onCreate = () => {
        const promise = create({ title: "Untitled Space" })
            .then((documentId) => router.push(`/spaces/${documentId}`))

        toast.promise(promise, {
            loading: "Creating space...",
            success: "Space created",
            error: "Failed to create space"
        })
    }

    return ( 
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">
                        Welcome back, {user?.firstName}
                    </h1>
                    <p className="text-lg font-light text-gray-500 dark:text-gray-500">
                        Your development spaces
                    </p>
                </div>

                {/* New Space Button */}
                <div className="mb-12">
                    <Button 
                        onClick={onCreate}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 px-8 py-3 text-base font-light border-0 rounded-none"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Space
                    </Button>
                </div>

                {/* Search */}
                {documents && documents.length > 0 && (
                    <div className="mb-8">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search spaces..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-400 dark:focus:border-gray-600 font-light rounded-none"
                            />
                        </div>
                    </div>
                )}

                {/* Spaces List */}
                <div className="space-y-1">
                    {filteredDocuments && filteredDocuments.length > 0 ? (
                        filteredDocuments.map((document) => (
                            <div
                                key={document._id}
                                onClick={() => onSelect(document._id)}
                                className="group flex items-center justify-between py-3 px-0 cursor-pointer border-b border-gray-100 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                            >
                                <div className="flex items-center flex-1 min-w-0">
                                    <File className="w-4 h-4 mr-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
                                    <span className="font-light text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                                        {document.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <span className="text-xs font-light text-gray-400 dark:text-gray-600">
                                        {formatRelativeTime(document._creationTime)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : documents && documents.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 dark:text-gray-600 font-light mb-6">
                                No spaces yet
                            </p>
                            <Button 
                                onClick={onCreate}
                                variant="outline"
                                className="border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 font-light rounded-none"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create your first space
                            </Button>
                        </div>
                    ) : searchQuery && filteredDocuments?.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400 dark:text-gray-600 font-light">
                                No spaces match "{searchQuery}"
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
     );
}
 
export default SpacesPage;