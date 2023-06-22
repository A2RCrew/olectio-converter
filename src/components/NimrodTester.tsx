import { useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import DropTarget from './DropTarget';
import ReDropTarget from './ReDropTarget';
import TestDocument from './TestDocument';
import { getCurrentEPUBDocument } from '~/logic/EPUB/currentDocument';

const NimrodTester = () => {
  const [, setRender] = useState<number>(0);
  const updateRender = () => {
    setRender((x) => x + 1);
  };
  return getCurrentPDFDocument() || getCurrentEPUBDocument() ? (
    <>
      <TestDocument />      
      <ReDropTarget onLoad={updateRender} />
    </>
  ) : (
    <DropTarget onLoad={updateRender} />
  );
};

export default NimrodTester;
