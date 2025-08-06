import { ReactNode } from 'react';
import Link from 'next/link';

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
    <h1
      className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
      {...props}
    >
      {children}
    </h1>
  ),
  
  h2: ({ children, ...props }: MDXComponentsProps) => (
    <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8 leading-tight" {...props}>
      {children}
    </h2>
  ),
  
  h3: ({ children, ...props }: MDXComponentsProps) => (
    <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6 leading-tight" {...props}>
      {children}
    </h3>
  ),
  
  h4: ({ children, ...props }: MDXComponentsProps) => (
    <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),
  
  // Paragraphs
  p: ({ children, ...props }: MDXComponentsProps) => (
    <p className="text-gray-700 leading-relaxed mb-4 text-lg" {...props}>
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
          className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 hover:decoration-green-500 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link
        href={href || '#'}
        className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 hover:decoration-green-500 transition-colors"
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
    <blockquote className="border-l-4 border-green-500 pl-6 py-2 my-6 bg-green-50 rounded-r-lg" {...props}>
      <div className="text-gray-700 italic text-lg">
        {children}
      </div>
    </blockquote>
  ),
  
  // Code
  code: ({ children, ...props }: MDXComponentsProps) => (
    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  
  pre: ({ children, ...props }: MDXComponentsProps) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm" {...props}>
      {children}
    </pre>
  ),
  
  // Images
  img: ({ src, alt, ...props }: MDXComponentsProps) => (
    <div className="my-8">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg shadow-lg"
        {...props}
      />
      {alt && (
        <p className="text-center text-gray-500 text-sm mt-2 italic">
          {alt}
        </p>
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