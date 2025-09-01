import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save, Clock } from 'lucide-react';

interface NotesProps {
  value?: string;
  onChange: (content: string) => void;
  documentId: string;
}

const Notes = ({ value = '', onChange, documentId }: NotesProps) => {
  const [content, setContent] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced save function
  const debouncedSave = useCallback(
    (newContent: string) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        setIsSaving(true);
        onChange(newContent);
        setTimeout(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        }, 500);
      }, 1000);
    },
    [onChange]
  );

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(newContent);
  };

  // Update content when value prop changes
  useEffect(() => {
    setContent(value);
  }, [value]);

  // Calculate stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content.split('\n').length;

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    return lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h2 className="text-sm font-light text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Notes
            </h2>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-light text-gray-500 dark:text-gray-500">
            {isSaving && (
              <div className="flex items-center gap-1">
                <Save className="w-3 h-3 animate-pulse" />
                <span>Saving...</span>
              </div>
            )}
            {!isSaving && lastSaved && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Saved {formatLastSaved()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-xs font-light text-gray-500 dark:text-gray-500 pb-3 border-b border-gray-200 dark:border-gray-800">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-h-0">
        {content.trim() === '' ? (
          <div className="h-full relative">
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder=""
              className="w-full h-full resize-none border-none bg-transparent font-light text-sm leading-relaxed focus:ring-0 focus:border-none focus:outline-none p-0"
              style={{ minHeight: '100%' }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="h-full flex items-start justify-center pt-20">
                <div className="text-center max-w-md mx-auto px-4">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">
                    Start Taking Notes
                  </h3>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-500 leading-relaxed">
                    Jot down your thoughts, problem-solving approach, edge cases, 
                    or any important observations. Your notes auto-save as you type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none">
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your notes..."
              className="w-full h-full resize-none border-none bg-transparent font-light text-sm leading-relaxed focus:ring-0 focus:border-none focus:outline-none p-4"
              style={{ minHeight: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Quick Actions Footer (when content exists) */}
      {content.trim() !== '' && (
        <div className="flex-shrink-0 mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs font-light text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Auto-save enabled</span>
            </div>
            <div>
              Document ID: {documentId.slice(-8)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes; 