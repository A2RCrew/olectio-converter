import { type Rendition, type Book } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { getCurrentEPUBDocument } from '~/logic/EPUB/currentDocument';

let lock = false;
const useVerticalRender = () => {
  const epubDocument = getCurrentEPUBDocument();
  const [rendition, setRendition] = useState<Rendition>();
  const containerRef = useRef<HTMLDivElement>(null);

  const renderEpub = async (epub: Book, ref: HTMLDivElement) => {
    const rendition = epub.renderTo(ref, {
      width: '100%',
      height: '100%',
      flow: 'scrolled-doc',
      allowScriptedContent: true,
    });
    await rendition.display();
    setRendition(rendition);
  };

  useEffect(() => {
    if (containerRef.current && epubDocument && !lock) {
      lock = true;
      containerRef.current.innerHTML = '';
      console.log('render...');
      renderEpub(epubDocument, containerRef.current)
        .then(() => {
          lock = false;
        })
        .catch(console.error);
    }
  }, [epubDocument, containerRef]);
  return [containerRef, rendition] as const;
};

export default useVerticalRender;
