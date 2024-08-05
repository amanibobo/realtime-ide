"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Code, File, PlusCircle, Search } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item } from "../../_components/item";
import { useSearchHome, useSearch } from "@/hooks/use-search";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import NavWidthWrapper from "@/components/ui/NavWidthWrapper";

const SpacesPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);
    const router = useRouter();
    const search = useSearch();
    const searchHome = useSearchHome();
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
            loading: "Creating a new space...",
            success: "New space created!",
            error: "Failed to generate a new space."
        })
    }

    return ( 
        <NavWidthWrapper>
        <div className="h-full flex flex-col space-y-4 p-8 pt-24">
            <h2 className="text-4xl font-semibold">
                Welcome back, {user?.firstName}
            </h2>
            <p className="text-lg text-[#acacac] font-medium">Create a new development space and start programming.</p>
            <Card className="w-full hover:cursor-pointer" onClick={onCreate}>
                <CardHeader>
                    <CardTitle><Code /></CardTitle>
                </CardHeader>
                <CardContent>
                    Write Code
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardContent>
            </Card>

            <Card className="w-full mt-4">
                <CardContent>
                    <Input
                        placeholder={`Search Your Library...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4 mt-4"
                    />
                    {filteredDocuments?.length === 0 ? (
                        <p>No results found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {filteredDocuments?.map((document) => (
                                <li 
                                    key={document._id}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded dark:hover:bg-muted-foreground/20"
                                    onClick={() => onSelect(document._id)}
                                >
                                    <File className="mr-2 h-4 w-4" />
                                    <span>{document.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
        </NavWidthWrapper>
     );
}
 
export default SpacesPage;