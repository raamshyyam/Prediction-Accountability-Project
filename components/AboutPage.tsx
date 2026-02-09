import React, { useState, useEffect } from 'react';
import { Language } from '../types.ts';
import { translations } from '../translations.ts';
// @ts-ignore
import aboutContentMD from '../ABOUT.md?raw';

interface AboutPageProps {
  lang: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const t = translations[lang];

  // Simple markdown to HTML converter for basic markdown syntax
  const renderMarkdown = (md: string) => {
    if (!md) return '';

    // Remove title implementation if redundant or process safely
    let html = md
      // Tables - basic support
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        const isHeader = match.includes('---');
        if (isHeader) return '';
        return `<tr>${cells.map(c => `<td class="border p-2">${c.trim()}</td>`).join('')}</tr>`;
      })
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto text-sm my-4">$1</pre>')
      // Headers
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-black text-slate-800 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-black text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-4xl font-black text-slate-900 mb-6">$1</h1>')
      // Blockquotes
      .replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-slate-600 my-4">$1</blockquote>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800">$1</a>')
      // Lists
      .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Horizontal Rule
      .replace(/^---$/gm, '<hr class="my-8 border-slate-200" />')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="my-4">')
      .replace(/\n/g, '<br />');

    // Wrap tables
    html = html.replace(/(<tr>.*?<\/tr>)+/g, '<div class="overflow-x-auto my-4"><table class="w-full text-sm text-left"><tbody>$&</tbody></table></div>');

    return `<p class="my-4">${html}</p>`;
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="prose prose-sm max-w-none">
          <div
            className="space-y-4 text-slate-700 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(aboutContentMD) }}
          />
        </div>

        {/* Footer verification badge */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest">
          <span>★ Verified Content ★</span>
        </div>
      </div>
    </div>
  );
};
