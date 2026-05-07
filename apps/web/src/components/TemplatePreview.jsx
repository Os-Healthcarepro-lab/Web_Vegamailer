import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TemplatePreview = ({ htmlContent, subject }) => {
  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-white text-black">
      {subject && (
        <div className="bg-gray-100 border-b px-4 py-3 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Subject:</span>
          <span className="text-sm font-semibold">{subject}</span>
        </div>
      )}
      <ScrollArea className="flex-1 p-6 bg-white">
        <div 
          className="max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ 
            __html: htmlContent || '<div style="text-align:center; color:#888; padding:40px;">No content provided</div>' 
          }} 
        />
      </ScrollArea>
    </div>
  );
};