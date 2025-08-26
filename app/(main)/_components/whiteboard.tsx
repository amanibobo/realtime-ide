"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Palette, Download, Trash2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

// Dynamically import Tldraw to avoid SSR issues
const Tldraw = dynamic(
  async () => {
    const { Tldraw } = await import('tldraw');
    return Tldraw;
  },
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <Spinner size="default" />
          <span className="text-sm font-light text-gray-600 dark:text-gray-400">
            Loading whiteboard...
          </span>
        </div>
      </div>
    ),
  }
);

interface WhiteboardProps {
  documentId?: string;
}

const Whiteboard = ({ documentId }: WhiteboardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    // Set loaded state after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClearCanvas = () => {
    if (editor) {
      editor.deleteShapes(editor.getSelectedShapeIds());
      // Clear all shapes
      const allShapes = editor.getCurrentPageShapes();
      editor.deleteShapes(allShapes.map((shape: any) => shape.id));
    }
  };

  const handleExport = async () => {
    if (editor) {
      try {
        const svg = await editor.getSvg([...editor.getCurrentPageShapeIds()]);
        if (svg) {
          const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `whiteboard-${documentId?.slice(-8) || 'export'}.svg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  const handleZoomIn = () => {
    if (editor) {
      editor.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (editor) {
      editor.zoomOut();
    }
  };

  const handleResetView = () => {
    if (editor) {
      editor.zoomToFit();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 mb-6 px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h2 className="text-sm font-light text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Whiteboard
            </h2>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-7 px-2 text-xs font-light rounded-none hover:bg-gray-200 dark:hover:bg-gray-800"
              disabled={!isLoaded}
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-7 px-2 text-xs font-light rounded-none hover:bg-gray-200 dark:hover:bg-gray-800"
              disabled={!isLoaded}
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetView}
              className="h-7 px-2 text-xs font-light rounded-none hover:bg-gray-200 dark:hover:bg-gray-800"
              disabled={!isLoaded}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="h-7 px-2 text-xs font-light rounded-none hover:bg-gray-200 dark:hover:bg-gray-800"
              disabled={!isLoaded}
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCanvas}
              className="h-7 px-2 text-xs font-light rounded-none hover:bg-red-200 dark:hover:bg-red-800/20 text-red-600 dark:text-red-400"
              disabled={!isLoaded}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex items-center justify-between text-xs font-light text-gray-500 dark:text-gray-500 pb-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Collaborative drawing</span>
          </div>
          <div>
            {documentId && `Space: ${documentId.slice(-8)}`}
          </div>
        </div>
      </div>

      {/* Whiteboard Content */}
      <div className="flex-1 min-h-0 mx-4 mb-4">
        {!isLoaded && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <Palette className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">
                Whiteboard Loading
              </h3>
              <p className="text-sm font-light text-gray-500 dark:text-gray-500 leading-relaxed">
                Your collaborative whiteboard is being prepared. 
                You can draw, sketch, and brainstorm ideas here.
              </p>
            </div>
          </div>
        )}
        
        <div className="h-full relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
          <Tldraw
            autoFocus={false}
            persistenceKey={documentId ? `whiteboard-${documentId}` : 'whiteboard-default'}
            onMount={(editor) => {
              setEditor(editor);
              setIsLoaded(true);
            }}
          />
          
          {/* Overlay for better integration */}
          <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-none px-2 py-1">
            <span className="text-xs font-light text-gray-600 dark:text-gray-400">
              {isLoaded ? 'Ready to draw' : 'Loading...'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="flex items-center justify-between text-xs font-light text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <span>Use mouse/trackpad to draw and navigate</span>
            <span>•</span>
            <span>Hold Shift to draw straight lines</span>
            <span>•</span>
            <span>Double-click to add text</span>
          </div>
          <div className="text-xs">
            Powered by tldraw
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard; 