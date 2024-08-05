"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { api } from "@/convex/_generated/api";
import Editor from "@monaco-editor/react";
import { useMutation } from "convex/react";
import { useState } from "react";

interface IDEProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

export const IDE = ({
  onChange,
  initialContent = "",
  editable = true
}: IDEProps) => {
  const [content, setContent] = useState(initialContent);

  const update = useMutation(api.documents.update);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onChange(value);

      // Save content to Convex database
      update({
        id: initialContent._id, // Assuming initialContent is an object with an _id field
        content: value,
      })
        .then(() => console.log("Content updated successfully"))
        .catch((error) => console.error("Error updating content:", error));
    }
  };

  return (
    <div>
      <Editor
        height="47.4vh" //💀
        language={"python"}
        value={content}
        onChange={handleEditorChange}
        defaultValue="//Welcome to Realttime!"
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },
          readOnly: !editable,
        }}
      />
    </div>
  );
};


