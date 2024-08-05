"use client";

import LinkToIframeApp from "@/app/(main)/_components/iframe";
import { InputCon } from "@/app/(main)/_components/input-containter";
import { OutputCon } from "@/app/(main)/_components/output-container";
import { IDE } from "@/components/ui/ide";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

//const IDE = dynamic(() => import("@/components/ui/ide").then(mod => mod.IDE), {
//    ssr: false,
//    loading: () => <div><Spinner /></div>
//});

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const document = useQuery(api.documents.getbyId, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (document === null) {
    return <div>Not Found</div>;
  }

  return (
    <div className="pt-[52px] flex">
      <div className="w-full grid grid-cols-2">
      <Tabs defaultValue="problem" className="w-full pl-3 pr-3">
            <TabsList>
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="problem">
            <LinkToIframeApp />
            </TabsContent>
            <TabsContent value="notes">
              <Textarea />
            </TabsContent>
          </Tabs>


        
        <div>
          <Tabs defaultValue="account" className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="account">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <IDE onChange={onChange} initialContent={document.content} />
            </TabsContent>
          </Tabs>

          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Testcase</TabsTrigger>
              <TabsTrigger value="password">Test Result</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <InputCon onChange={onChange} initialContent={document.content} />
            </TabsContent>
            <TabsContent value="password">
              <OutputCon
                onChange={onChange}
                initialContent={document.content}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentIdPage;
