import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LinkToIframeApp = () => {
  const [link, setLink] = useState('');
  const [iframeLink, setIframeLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIframeLink('');

    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIframeLink(link);
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    // This will only work for same-origin iframes due to security restrictions
    try {
      if (e.currentTarget.contentWindow?.document.body.innerHTML === '') {
        setError('The content could not be loaded. This might be due to CORS restrictions or the website not allowing embedding.');
      }
    } catch (err) {
      // If we can't access the iframe's content, it's likely due to CORS
      console.log('Cannot access iframe content. This is expected for cross-origin URLs.');
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={link}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
            placeholder="Enter a URL for your problem (e.g., https://usaco.org)"
            className="flex-grow"
          />
          <Button type="submit">Load</Button>
        </div>
      </form>
      {error && (
        <p className="text-red-500">{error}</p>
      )}
      {iframeLink && (
        <div className="border border-gray-300 rounded">
          <iframe
            src={iframeLink}
            width="100%"
            height="800px"
            className="border-none"
            onLoad={handleIframeLoad}
          />
        </div>
      )}
    </div>
  );
};

export default LinkToIframeApp;