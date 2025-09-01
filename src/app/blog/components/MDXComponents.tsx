import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Quote, Code, ImageIcon } from 'lucide-react';

interface MDXComponentsProps {
  children?: ReactNode;
  className?: string;
  href?: string;
  src?: string;
  alt?: string;
  [key: string]: unknown;
}

// Componentes customizados para MDX
const MDXComponents = {
  // Headings
  h1: ({ children, ...props }: MDXComponentsProps) => (
    <div className="relative mb-8">
      <h1
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent mb-4 leading-tight"
        {...props}
      >
        {children}
      </h1>
      <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
    </div>
  ),
  
  h2: ({ children, ...props }: MDXComponentsProps) => (
    <div className="relative mt-12 mb-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight flex items-center" {...props}>
        <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-4"></span>
        {children}
      </h2>
    </div>
  ),
  
  h3: ({ children, ...props }: MDXComponentsProps) => (
    <div className="relative mt-8 mb-4">
      <h3 className="text-2xl font-bold text-gray-900 leading-tight flex items-center" {...props}>
        <span className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-3"></span>
        {children}
      </h3>
    </div>
  ),
  
  h4: ({ children, ...props }: MDXComponentsProps) => (
    <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),
  
  // Paragraphs
  p: ({ children, ...props }: MDXComponentsProps) => (
    <p className="text-gray-700 leading-relaxed mb-6 text-lg font-light tracking-wide" {...props}>
      {children}
    </p>
  ),
  
  // Links
  a: ({ children, href, ...props }: MDXComponentsProps) => {
    const isExternal = href?.startsWith('http');
    
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium bg-green-50 hover:bg-green-100 px-2 py-1 rounded-md transition-all duration-300 border-b-2 border-green-200 hover:border-green-400"
          {...props}
        >
          {children}
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      );
    }
    
    return (
      <Link
        href={href || '#'}
        className="text-green-600 hover:text-green-700 font-medium bg-green-50 hover:bg-green-100 px-2 py-1 rounded-md transition-all duration-300 border-b-2 border-green-200 hover:border-green-400"
        {...props}
      >
        {children}
      </Link>
    );
  },
  
  // Lists
  ul: ({ children, ...props }: MDXComponentsProps) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: MDXComponentsProps) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props}>
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }: MDXComponentsProps) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  
  // Blockquotes
  blockquote: ({ children, ...props }: MDXComponentsProps) => (
    <div className="relative my-8">
      <blockquote className="relative bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-gradient-to-b from-green-500 to-blue-500 pl-8 pr-6 py-6 rounded-r-2xl shadow-sm" {...props}>
        <Quote className="absolute top-4 left-2 w-5 h-5 text-green-500 opacity-60" />
        <div className="text-gray-700 italic text-lg font-medium leading-relaxed">
          {children}
        </div>
        <div className="absolute bottom-2 right-4 w-8 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
      </blockquote>
    </div>
  ),
  
  // Code
  code: ({ children, ...props }: MDXComponentsProps) => (
    <code className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-mono border border-gray-200 transition-colors duration-200" {...props}>
      <Code className="w-3 h-3 mr-1 text-gray-500" />
      {children}
    </code>
  ),
  
  pre: ({ children, ...props }: MDXComponentsProps) => (
    <div className="relative my-6">
      <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 rounded-xl overflow-x-auto shadow-lg border border-gray-700" {...props}>
        <div className="absolute top-3 right-3 flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        {children}
      </pre>
    </div>
  ),
  
  // Images
  img: ({ src, alt, ...props }: MDXComponentsProps) => (
    <div className="relative my-10 group">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Image
          src={src || ''}
          alt={alt || ''}
          className="w-full transition-transform duration-500 group-hover:scale-105"
          width={800}
          height={400}
          {...props}
        />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ImageIcon className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      {alt && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm italic bg-gray-50 inline-block px-4 py-2 rounded-full border border-gray-200">
            {alt}
          </p>
        </div>
      )}
    </div>
  ),
  
  // Horizontal Rule
  hr: ({ ...props }: MDXComponentsProps) => (
    <hr className="border-gray-300 my-8" {...props} />
  ),
  
  // Strong/Bold
  strong: ({ children, ...props }: MDXComponentsProps) => (
    <strong className="font-bold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  
  // Emphasis/Italic
  em: ({ children, ...props }: MDXComponentsProps) => (
    <em className="italic text-gray-700" {...props}>
      {children}
    </em>
  ),
  
  // Tables
  table: ({ children, ...props }: MDXComponentsProps) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-gray-300 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children, ...props }: MDXComponentsProps) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  
  tbody: ({ children, ...props }: MDXComponentsProps) => (
    <tbody className="bg-white" {...props}>
      {children}
    </tbody>
  ),
  
  tr: ({ children, ...props }: MDXComponentsProps) => (
    <tr className="border-b border-gray-200" {...props}>
      {children}
    </tr>
  ),
  
  th: ({ children, ...props }: MDXComponentsProps) => (
    <th className="px-4 py-3 text-left font-semibold text-gray-900" {...props}>
      {children}
    </th>
  ),
  
  td: ({ children, ...props }: MDXComponentsProps) => (
    <td className="px-4 py-3 text-gray-700" {...props}>
      {children}
    </td>
  ),
};

export default MDXComponents;