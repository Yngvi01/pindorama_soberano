import type { MDXComponents } from 'mdx/types';
import MDXComponentsConfig from './src/app/blog/components/MDXComponents';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...MDXComponentsConfig,
    ...components,
  };
}