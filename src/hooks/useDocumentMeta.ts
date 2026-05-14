import { useEffect } from 'react';

const DEFAULT_TITLE = 'Pokédex';

type Options = {
  title: string;
  description?: string;
};

/**
 * Atualiza título e meta description (SEO leve em SPA), compatível com React 19.
 */
export function useDocumentMeta({ title, description }: Options) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;

    if (!description) return;

    let el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'description');
      document.head.appendChild(el);
    }
    el.setAttribute('content', description);
  }, [title, description]);
}
