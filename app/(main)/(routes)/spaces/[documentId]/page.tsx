"use client";

import LinkToIframeApp from "@/app/(main)/_components/iframe";
import Notes from "@/app/(main)/_components/notes";
import Whiteboard from "@/app/(main)/_components/whiteboard";
import { IDE } from "@/components/ui/ide";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useEffect, useState } from "react";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const [documentId, setDocumentId] = useState<Id<"documents"> | null>(null);

  useEffect(() => {
    params.then(({ documentId }) => {
      setDocumentId(documentId);
    });
  }, [params]);

  const document = useQuery(
    api.documents.getbyId,
    documentId ? { documentId } : "skip"
  );

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    if (documentId) {
      update({
        id: documentId,
        content,
      });
    }
  };

  const onNotesChange = (notes: string) => {
    if (documentId) {
      update({
        id: documentId,
        notes,
      });
    }
  };

  if (!documentId || document === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-2">
            Space not found
          </h2>
          <p className="text-sm font-light text-gray-500 dark:text-gray-500">
            This space may have been deleted or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[52px] flex h-screen">
      <div className="w-full grid grid-cols-2 h-full">
        {/* Left Panel - Problem/Notes/Whiteboard */}
        <div className="border-r border-gray-200 dark:border-gray-800">
          <Tabs defaultValue="problem" className="w-full h-full flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2">
              <TabsList className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none">
                <TabsTrigger value="problem" className="font-light">Problem</TabsTrigger>
                <TabsTrigger value="notes" className="font-light">Notes</TabsTrigger>
                <TabsTrigger value="whiteboard" className="font-light">Whiteboard</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="problem" className="h-full m-0 p-4">
                <LinkToIframeApp />
              </TabsContent>
              <TabsContent value="notes" className="h-full m-0 p-4">
                <Notes 
                  value={document.notes}
                  onChange={onNotesChange}
                  documentId={documentId}
                />
              </TabsContent>
              <TabsContent value="whiteboard" className="h-full m-0">
                <Whiteboard documentId={documentId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor with Judge0 */}
        <div className="flex flex-col h-full">
          <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                Code Editor
              </h3>
              <div className="text-xs font-light text-gray-500 dark:text-gray-500">
                Powered by Judge0
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <IDE 
              onChange={onChange} 
              initialContent={document.content} 
              documentId={documentId} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentIdPage;
