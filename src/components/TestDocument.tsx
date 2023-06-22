import React, { useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getSections from './menuSections';
import getCurrentEPUBDocumentPages from '~/logic/EPUB/getCurrentEPUBDocumentPages';

const TestDocument: React.FC = () => {
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || 'metadata');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const sectionHash = currentHash.split('-')[0]?.replace('#', '');
  const sections = getSections();
  const activeSection = sections.find((c) => c.hash === sectionHash);
  const pdfDocument = getCurrentPDFDocument();
  let numPages = 1;
  if (pdfDocument) {
    numPages = pdfDocument.numPages;    
  } else {
    numPages = getCurrentEPUBDocumentPages() || 1;    
  }
  if (pageNumber > numPages) {
    const hash = `${sectionHash || 'metadata'}-${numPages}`;
    setCurrentHash(hash);
    window.location.hash = hash;
    setPageNumber(numPages);
  } else if (pageNumber < 1) {
    const hash = `${sectionHash || 'metadata'}-${1}`;
    setCurrentHash(hash);
    window.location.hash = hash;
    setPageNumber(1);
  }
  return (
    <>
      <div className="w-96 text-right text-white">
        <div className="w-full px-4 py-0 text-left">
          <label htmlFor="pageNumber">
            Page Number:{' '}
            <input
              className="bg-transparent border-0 focus:outline-none"
              id="pageNumber"
              type="number"
              value={pageNumber}
              onChange={(ev) => {
                let newPageNumber = parseInt(ev.target.value, 10);
                if (newPageNumber > numPages) {
                  newPageNumber = numPages;
                } else if (newPageNumber < 1) {
                  newPageNumber = 1;
                }
                setPageNumber(newPageNumber);
                const hash = `${sectionHash || 'metadata'}-${newPageNumber}`;
                setCurrentHash(hash);
                window.location.hash = hash;
              }}
              name="pageNumber"
            />
          </label>
          <input
            className="accent-emerald-400 w-full"
            type="range"
            name="pageNumber"
            value={pageNumber}
            onChange={(ev) => {
              const newPageNumber = parseInt(ev.target.value, 10);
              setPageNumber(newPageNumber);
              const hash = `${sectionHash || 'metadata'}-${newPageNumber}`;
              setCurrentHash(hash);
              window.location.hash = hash;
            }}
            min={1}
            max={numPages}
          />
        </div>
        <br />
        <div
          style={{ maxHeight: 'calc(100vh - 500px)' }}
          className="overflow-y-auto z-20 relative left-0 translate-x-0.5"
        >
          {sections.map((section) => (
            <React.Fragment key={section.hash}>
              <a
                href={`#${section.hash}`}
                aria-expanded={sectionHash === section.hash}
                title={section.title}
                onClick={(ev) => {
                  ev.preventDefault();
                  const hash = `${section.hash}-${pageNumber}`;
                  setCurrentHash(hash);
                  window.location.hash = hash;
                }}
                className="bg-black relative aria-expanded:z-20 mr-0.5 aria-expanded:mr-0 inline-block font-semibold aria-expanded:pr-2 aria-expanded:text-rose-500 border-2 border-r-0 border-violet-700 aria-expanded:border-rose-600 rounded-l-full p-2 pl-4 mb-0.5"
              >
                {section.title}
              </a>
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="left-96 bg-black fixed top-0 h-full w-[calc(100%-24rem)] border-2 border-rose-600 border-r-0 rounded-l-xl text-white p-4">
        {activeSection && activeSection.render && activeSection.render(pageNumber)}
      </div>
    </>
  );
};

export default TestDocument;
