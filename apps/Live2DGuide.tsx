import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

export const Live2DGuideApp: React.FC = () => {
  const [content, setContent] = useState<string>('Loading...');

  useEffect(() => {
    fetch('/load-local-live2dmodel.md')
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(err => setContent('Failed to load guide.'));
  }, []);

  return (
    <div className="h-full w-full bg-white text-gray-800 overflow-y-auto p-8 font-sans">
      <div className="max-w-2xl mx-auto prose prose-blue">
        <div className="markdown-body">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
};
