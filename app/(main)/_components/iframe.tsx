import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, ExternalLink, Globe, LoaderCircle } from 'lucide-react';

const LinkToIframeApp = () => {
  const [link, setLink] = useState('');
  const [iframeLink, setIframeLink] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoadError(false);
    
    if (!link.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsLoading(true);
    setIframeLink(link.trim());
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const openInNewTab = () => {
    if (iframeLink) {
      window.open(iframeLink, '_blank', 'noopener,noreferrer');
    }
  };

  const clearContent = () => {
    setIframeLink('');
    setLink('');
    setError('');
    setLoadError(false);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h2 className="text-sm font-light text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Problem Viewer
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              value={link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
              placeholder="Enter problem URL (e.g., https://usaco.org/...)"
              className="flex-1 font-light rounded-none border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="font-light rounded-none bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
              disabled={isLoading || !link.trim()}
            >
              {isLoading ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                'Load'
              )}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-none">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm font-light text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </form>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-h-0">
        {!iframeLink ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <Globe className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">
                No Problem Loaded
              </h3>
              <p className="text-sm font-light text-gray-500 dark:text-gray-500 leading-relaxed">
                Enter a URL above to load a problem statement or any webpage. 
                Common sources include USACO, CodeForces, AtCoder, and more.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Iframe Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs font-light text-gray-600 dark:text-gray-400 truncate">
                  {iframeLink}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openInNewTab}
                  className="h-7 px-2 text-xs font-light rounded-none hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearContent}
                  className="h-7 px-2 text-xs font-light rounded-none hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 relative bg-white dark:bg-gray-950 border-l border-r border-b border-gray-200 dark:border-gray-800">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-10">
                  <div className="flex items-center gap-3">
                    <Spinner className="w-5 h-5" />
                    <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                      Loading content...
                    </span>
                  </div>
                </div>
              )}

              {loadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-10">
                  <div className="text-center max-w-md mx-auto px-4">
                    <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">
                      Content Blocked
                    </h3>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-500 leading-relaxed mb-4">
                      This website cannot be displayed in an iframe due to security restrictions. 
                      You can still open it in a new tab.
                    </p>
                    <Button
                      onClick={openInNewTab}
                      className="font-light rounded-none bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              )}

              <iframe
                src={iframeLink}
                className="w-full h-full border-none"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Problem Content"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkToIframeApp;