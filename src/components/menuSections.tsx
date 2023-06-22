import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import pdfSections from './pdfSections';
import epubSections from './epubSections';

const getSections = (): {
  title: string;
  hash: string;
  render?: (currentPage: number) => React.ReactElement;
}[] => {
  const document = getCurrentPDFDocument();
  if (document) {
    return pdfSections;
  }
  return epubSections;
};

export default getSections;
