"use client";

import { api } from "@/convex/_generated/api";
import Editor from "@monaco-editor/react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Play, Square, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface IDEProps {
  onChange: (value: string) => void;
  initialContent?: string;
  documentId?: Id<"documents">;
  editable?: boolean;
}

// Judge0 language mappings
const LANGUAGES = [
  { id: 71, name: "Python", value: "python", monaco: "python" },
  { id: 63, name: "JavaScript", value: "javascript", monaco: "javascript" },
  { id: 62, name: "Java", value: "java", monaco: "java" },
  { id: 54, name: "C++", value: "cpp", monaco: "cpp" },
  { id: 50, name: "C", value: "c", monaco: "c" },
  { id: 51, name: "C#", value: "csharp", monaco: "csharp" },
  { id: 78, name: "Kotlin", value: "kotlin", monaco: "kotlin" },
  { id: 72, name: "Ruby", value: "ruby", monaco: "ruby" },
  { id: 73, name: "Rust", value: "rust", monaco: "rust" },
  { id: 74, name: "TypeScript", value: "typescript", monaco: "typescript" },
  { id: 75, name: "C", value: "c", monaco: "c" },
];

interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  status: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}

// API Key Setup Component
const APIKeySetup = () => {
  return (
    <div className="p-6 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 rounded-none">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-light text-orange-900 dark:text-orange-100 mb-1">
              Judge0 API Key Required
            </h3>
            <p className="text-xs font-light text-orange-700 dark:text-orange-300">
              To execute code, you need to configure your Judge0 API key. This enables running code in 60+ programming languages.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-light text-orange-900 dark:text-orange-100 uppercase tracking-wider">
              Quick Setup:
            </h4>
            <ol className="text-xs font-light text-orange-700 dark:text-orange-300 space-y-1">
              <li>1. Go to <strong>RapidAPI</strong> and create a free account</li>
              <li>2. Subscribe to <strong>Judge0 Community Edition</strong> (free tier: 50 requests/day)</li>
              <li>3. Copy your <strong>X-RapidAPI-Key</strong></li>
              <li>4. Add <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">NEXT_PUBLIC_RAPIDAPI_KEY=your_key</code> to your <strong>.env.local</strong> file</li>
              <li>5. Restart your development server</li>
            </ol>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => window.open('https://rapidapi.com/judge0-official/api/judge0-ce', '_blank')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-light border-0 rounded-none"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Get API Key
            </Button>
            <Button
              onClick={() => window.open('https://github.com/your-repo#judge0-setup', '_blank')}
              variant="outline"
              className="border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 px-4 py-2 text-xs font-light rounded-none"
            >
              Setup Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const IDE = ({
  onChange,
  initialContent = "",
  documentId,
  editable = true
}: IDEProps) => {
  const [content, setContent] = useState(initialContent);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [input, setInput] = useState("");

  // Generate language-specific template
  const getLanguageTemplate = (language: any) => {
    const templates: { [key: string]: string } = {
      python: `# Your function here
def yourFunction(input_data):
    # Implement your solution here
    return "result"

# Test the function and show the result
test_input = input().strip()
result = yourFunction(test_input)
print(result)  # This will show the actual return value`,

      javascript: `// Your function here
function yourFunction(inputData) {
    // Implement your solution here
    return "result";
}

// Test the function and show the result
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (testInput) => {
    const result = yourFunction(testInput.trim());
    console.log(result); // This will show the actual return value
    rl.close();
});`,

      java: `import java.util.*;

// Your function here
class Solution {
    public boolean yourFunction(String inputData) {
        // Implement your solution here
        return true; // Change return type as needed
    }
}

// Test the function and show the result
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String testInput = sc.nextLine().trim();
        Solution solution = new Solution();
        boolean result = solution.yourFunction(testInput);
        System.out.println(result); // This will show the actual return value
    }
}`,

      cpp: `#include <iostream>
#include <string>
using namespace std;

// Your function here
string yourFunction(string inputData) {
    // Implement your solution here
    return "result";
}

// Test the function and show the result
int main() {
    string testInput;
    getline(cin, testInput);
    string result = yourFunction(testInput);
    cout << result << endl; // This will show the actual return value
    return 0;
}`,

      c: `#include <stdio.h>
#include <string.h>

// Your function here
char* yourFunction(char* inputData) {
    // Implement your solution here
    return "result";
}

// Test the function and show the result
int main() {
    char testInput[1000];
    fgets(testInput, sizeof(testInput), stdin);
    testInput[strcspn(testInput, "\\n")] = 0; // Remove newline
    char* result = yourFunction(testInput);
    printf("%s\\n", result); // This will show the actual return value
    return 0;
}`,

      csharp: `using System;

// Your function here
public class Solution {
    public string YourFunction(string inputData) {
        // Implement your solution here
        return "result";
    }
}

// Test the function and show the result
class Program {
    static void Main(string[] args) {
        string testInput = Console.ReadLine().Trim();
        Solution solution = new Solution();
        string result = solution.YourFunction(testInput);
        Console.WriteLine(result); // This will show the actual return value
    }
}`,

      typescript: `// Your function here
function yourFunction(inputData: string): string {
    // Implement your solution here
    return "result";
}

// Test the function and show the result
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (testInput: string) => {
    const result = yourFunction(testInput.trim());
    console.log(result); // This will show the actual return value
    rl.close();
});`,

      rust: `use std::io;

// Your function here
fn your_function(input_data: &str) -> String {
    // Implement your solution here
    return "result".to_string();
}

// Test the function and show the result
fn main() {
    let mut test_input = String::new();
    io::stdin().read_line(&mut test_input).unwrap();
    let test_input = test_input.trim();
    let result = your_function(test_input);
    println!("{}", result); // This will show the actual return value
}`,

      kotlin: `import java.util.*

// Your function here
fun yourFunction(inputData: String): String {
    // Implement your solution here
    return "result"
}

// Test the function and show the result
fun main() {
    val scanner = Scanner(System.in)
    val testInput = scanner.nextLine().trim()
    val result = yourFunction(testInput)
    println(result) // This will show the actual return value
}`,

      ruby: `# Your function here
def your_function(input_data)
    # Implement your solution here
    return "result"
end

# Test the function and show the result
test_input = gets.chomp
result = your_function(test_input)
puts result # This will show the actual return value`
    };

    return templates[language.value] || templates.python;
  };

  const update = useMutation(api.documents.update);
  const hasAPIKey = Boolean(process.env.NEXT_PUBLIC_RAPIDAPI_KEY && 
    process.env.NEXT_PUBLIC_RAPIDAPI_KEY !== 'your_rapidapi_key_here' && 
    process.env.NEXT_PUBLIC_RAPIDAPI_KEY !== '' && 
    process.env.NEXT_PUBLIC_RAPIDAPI_KEY.length > 0);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onChange(value);

      // Save content to Convex database if documentId is provided
      if (documentId) {
        update({
          id: documentId,
          content: value,
        })
          .then(() => console.log("Content updated successfully"))
          .catch((error) => console.error("Error updating content:", error));
      }
    }
  };

  const executeCode = async () => {
    if (!hasAPIKey) {
      toast.error("Please configure your Judge0 API key first. Check your .env.local file.");
      console.error("API Key not configured. Please set NEXT_PUBLIC_RAPIDAPI_KEY in your .env.local file");
      return;
    }

    if (!content.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      // Debug logging
      console.log("Submitting code:", {
        language_id: selectedLanguage.id,
        language_name: selectedLanguage.name,
        content_length: content.length,
        input_length: input.length,
        has_api_key: !!process.env.NEXT_PUBLIC_RAPIDAPI_KEY
      });

      // Submit code to Judge0
      const submitResponse = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
        },
        body: JSON.stringify({
          language_id: selectedLanguage.id,
          source_code: content, // Send raw code, not base64 encoded
          stdin: input || "", // Send raw input, not base64 encoded
        }),
      });

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        console.error("Submit response error:", submitResponse.status, errorText);
        throw new Error(`Failed to submit code: ${submitResponse.status} ${errorText}`);
      }

      const submitData = await submitResponse.json();
      console.log("Submit response:", submitData);
      const submissionId = submitData.token;

      // Poll for results
      const pollForResult = async () => {
        const resultResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
          {
            headers: {
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
            },
          }
        );

        if (!resultResponse.ok) {
          const errorText = await resultResponse.text();
          console.error("Result response error:", resultResponse.status, errorText);
          throw new Error(`Failed to get execution result: ${resultResponse.status} ${errorText}`);
        }

        const result = await resultResponse.json();
        console.log("Execution result:", result);

        // If still processing, poll again
        if (result.status.id <= 2) {
          setTimeout(pollForResult, 1000);
          return;
        }

        // Handle output safely - Judge0 might return plain text or base64
        const safeDecode = (str: string | null | undefined): string | undefined => {
          if (!str || str.trim() === '') return undefined;
          
          console.log("Processing output:", str);
          
          // Check if it looks like base64 (contains only base64 characters)
          const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
          const isBase64 = base64Regex.test(str);
          
          if (isBase64) {
            try {
              console.log("Attempting base64 decode:", str);
              const decoded = atob(str);
              console.log("Base64 decoded result:", decoded);
              return decoded;
            } catch (error) {
              console.error("Base64 decoding failed:", error);
              // If base64 decoding fails, return the original string
              return str;
            }
          } else {
            console.log("Output appears to be plain text:", str);
            return str;
          }
        };

        const decodedResult: ExecutionResult = {
          ...result,
          stdout: safeDecode(result.stdout),
          stderr: safeDecode(result.stderr),
          compile_output: safeDecode(result.compile_output),
        };

        setExecutionResult(decodedResult);
        setIsExecuting(false);

        // Show toast based on result
        if (decodedResult.status.id === 3) {
          toast.success("Code executed successfully");
        } else if (decodedResult.status.id === 4) {
          toast.error(`Runtime Error (NZEC): Your program crashed or exited with an error. Check for infinite loops, missing input handling, or runtime errors.`);
        } else if (decodedResult.status.id === 5) {
          toast.error(`Time Limit Exceeded: Your program took too long to run. Check for infinite loops or inefficient algorithms.`);
        } else if (decodedResult.status.id === 6) {
          toast.error(`Memory Limit Exceeded: Your program used too much memory. Check for memory leaks or inefficient data structures.`);
        } else {
          toast.error(`Execution failed: ${decodedResult.status.description}`);
        }
      };

      await pollForResult();
    } catch (error) {
      console.error("Execution error:", error);
      toast.error("Failed to execute code");
      setIsExecuting(false);
    }
  };

  const stopExecution = () => {
    setIsExecuting(false);
    setExecutionResult(null);
    toast.info("Execution stopped");
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      {/* API Key Setup Warning */}
      {!hasAPIKey && (
        <div className="border-b border-gray-200 dark:border-gray-800">
          <APIKeySetup />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Select
            value={selectedLanguage.value}
            onValueChange={(value) => {
              const language = LANGUAGES.find(lang => lang.value === value);
              if (language) {
                setSelectedLanguage(language);
                // Update content with language-specific template
                const template = getLanguageTemplate(language);
                setContent(template);
                handleEditorChange(template);
              }
            }}
          >
            <SelectTrigger className="w-40 border-gray-200 dark:border-gray-800 font-light rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language.id} value={language.value} className="font-light">
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {!isExecuting ? (
            <Button
              onClick={executeCode}
              disabled={!hasAPIKey}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-light border-0 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          ) : (
            <Button
              onClick={stopExecution}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-light border-0 rounded-none"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={selectedLanguage.monaco}
          value={content}
          onChange={handleEditorChange}
          defaultValue={getLanguageTemplate(LANGUAGES[0])}
          theme="vs-dark"
          options={{
            minimap: {
              enabled: false,
            },
            readOnly: !editable,
            fontSize: 14,
            lineHeight: 1.6,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
            fontFamily: "'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
          }}
        />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="p-3">
          <label className="block text-xs font-light text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input for your program..."
            className="w-full h-20 px-3 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-light font-mono resize-none focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 rounded-none"
          />
        </div>
      </div>

      {/* Output Area */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-light text-gray-500 dark:text-gray-500 uppercase tracking-wider">
              Output
            </span>
            {isExecuting && (
              <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
            )}
          </div>
          
          <div className="min-h-20 max-h-40 overflow-y-auto">
            {isExecuting ? (
              <div className="text-sm font-light text-gray-500 dark:text-gray-500 font-mono">
                Executing code...
              </div>
            ) : executionResult ? (
              <div className="space-y-2">
                {executionResult.stdout && (
                  <div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-light">stdout:</div>
                    <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {executionResult.stdout}
                    </pre>
                  </div>
                )}
                
                {executionResult.stderr && (
                  <div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-light">stderr:</div>
                    <pre className="text-sm font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                      {executionResult.stderr}
                    </pre>
                  </div>
                )}
                
                {executionResult.compile_output && (
                  <div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-light">compile output:</div>
                    <pre className="text-sm font-mono text-yellow-600 dark:text-yellow-400 whitespace-pre-wrap">
                      {executionResult.compile_output}
                    </pre>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-500 font-light">
                  Status: {executionResult.status.description}
                  {executionResult.time && ` | Time: ${executionResult.time}s`}
                  {executionResult.memory && ` | Memory: ${executionResult.memory}KB`}
                </div>
              </div>
            ) : (
              <div className="text-sm font-light text-gray-500 dark:text-gray-500 font-mono">
                {hasAPIKey ? "Click \"Run\" to execute your code" : "Configure Judge0 API key to execute code"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


