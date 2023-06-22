import CustomChatGPT from './CustomChatGPT';
import DocumentBookmarks from './DocumentBookmarks';
import DocumentData from './DocumentData';
import DocumentEmbeddedFont from './DocumentEmbeddedFont';
import DocumentEmbeddedFontDetails from './DocumentEmbeddedFontDetails';
import DocumentEmbeddedFontExtraction from './DocumentEmbeddedFontExtraction';
import DocumentEmbeddedFontKitDetails from './DocumentEmbeddedFontKitDetails';
import DocumentEmbeddedFontKitFontExtraction from './DocumentEmbeddedFontKitFontExtraction';
import DocumentMetadata from './DocumentMetadata';
import DocumentPagesCustomRasterizationText from './DocumentPagesCustomRasterizationText';
import DocumentPagesInfo from './DocumentPagesInfo';
import DocumentPagesObfuscatedSVG from './DocumentPagesObfuscatedSVG';
import DocumentPagesRasterization from './DocumentPagesRasterization';
import DocumentPagesRasterizationText from './DocumentPagesRasterizationText';
import DocumentPagesSVG from './DocumentPagesSVG';
import GenerateDocumentEmbedding from './GenerateDocumentEmbedding';
import GenerateFullDocumentSummarization from './GenerateFullDocumentSummarization';
import GenerateQuestions from './GenerateQuestions';
import GenerateTextEmbedding from './GenerateTextEmbedding';
import PageDetails from './PageDetails';
import OperatorList from './PageOperatorList';
import PageTextCorrection from './PageTextCorrection';
import PageTextCorrectionEdit from './PageTextCorrectionEdit';
import PageTextExtraction from './PageTextExtraction';
import PageTextInsert from './PageTextInsert';
import PageTextNodes from './PageTextNodes';
import PageTextTranslation from './PageTextTranslation';
import ProcessedPageOperatorList from './ProcessedPageOperatorList';
import QueryDocumentEmbedding from './QueryDocumentEmbedding';

const pdfSections: {
  title: string;
  hash: string;
  render?: (currentPage: number) => React.ReactElement;
}[] = [
  {
    title: `Display Document Metadata`,
    hash: `metadata`,
    render: () => <DocumentMetadata />,
  },
  {
    title: `Document Pages Information`,
    hash: `labels`,
    render: (currentPage: number) => <DocumentPagesInfo currentPage={currentPage} />,
  },
  {
    title: `Document Bookmarks Tree`,
    hash: `bookmarks`,
    render: () => <DocumentBookmarks />,
  },
  {
    title: `Document Object Data`,
    hash: `document`,
    render: () => <DocumentData />,
  },
  {
    title: `Page Details`,
    hash: `pageDetails`,
    render: (currentPage: number) => <PageDetails currentPage={currentPage} />,
  },
  {
    title: `Page Operator List`,
    hash: `structTree`,
    render: (currentPage: number) => <OperatorList currentPage={currentPage} />,
  },
  {
    title: `Processed Page Operator List`,
    hash: `processedStructTree`,
    render: (currentPage: number) => <ProcessedPageOperatorList currentPage={currentPage} />,
  },
  {
    title: `Page Text Nodes`,
    hash: `textNodes`,
    render: (currentPage: number) => <PageTextNodes currentPage={currentPage} />,
  },
  {
    title: `Page Text Extraction`,
    hash: `text`,
    render: (currentPage: number) => <PageTextExtraction currentPage={currentPage} />,
  },
  {
    title: `PDF Embedded Fonts Data`,
    hash: `fontData`,
    render: (currentPage: number) => <DocumentEmbeddedFont currentPage={currentPage} />,
  },
  {
    title: `OpenType.js Embedded Fonts Details`,
    hash: `fontDetails`,
    render: (currentPage: number) => <DocumentEmbeddedFontDetails currentPage={currentPage} />,
  },
  {
    title: `OpenType.js Embedded Fonts Extraction`,
    hash: `fontExtraction`,
    render: (currentPage: number) => <DocumentEmbeddedFontExtraction currentPage={currentPage} />,
  },
  {
    title: `FontKit Embedded Fonts Details`,
    hash: `fontKitDetails`,
    render: (currentPage: number) => <DocumentEmbeddedFontKitDetails currentPage={currentPage} />,
  },
  {
    title: `FontKit Embedded Fonts Extraction`,
    hash: `fontKitExtraction`,
    render: (currentPage: number) => (
      <DocumentEmbeddedFontKitFontExtraction currentPage={currentPage} />
    ),
  },
  {
    title: `Full Page Rasterization`,
    hash: `rasterization`,
    render: (currentPage: number) => <DocumentPagesRasterization currentPage={currentPage} />,
  },
  {
    title: `Full Page Rasterization With Text Layer`,
    hash: `rasterizationText`,
    render: (currentPage: number) => <DocumentPagesRasterizationText currentPage={currentPage} />,
  },

  {
    title: `Full Page Rasterization Custom Text Layer`,
    hash: `customRasterizationText`,
    render: (currentPage: number) => (
      <DocumentPagesCustomRasterizationText currentPage={currentPage} />
    ),
  },
  {
    title: `Convert Page To SVG`,
    hash: `pageAsSVG`,
    render: (currentPage: number) => <DocumentPagesSVG currentPage={currentPage} />,
  },
  {
    title: `Convert Page To SVG (obfuscated)`,
    hash: `pageAsObfuscatedSVG`,
    render: (currentPage: number) => <DocumentPagesObfuscatedSVG currentPage={currentPage} />,
  },
  {
    title: `Generate LLM Text Vectors`,
    hash: `generateTextEmbedding`,
    render: () => <GenerateTextEmbedding />,
  },
  {
    title: `Generate LLM Full PDF Embedding`,
    hash: `generatePDFEmbedding`,
    render: () => <GenerateDocumentEmbedding />,
  },
  {
    title: `Query Full LLM PDF Embedding`,
    hash: `queryPDFEmbedding`,
    render: () => <QueryDocumentEmbedding />,
  },
  {
    title: `Custom Full PDF LLM Chat (Español)`,
    hash: `chatGPTcustomES`,
    render: () => <CustomChatGPT />,
  },
  {
    title: `LLM Text Translation`,
    hash: `textTranslation`,
    render: (currentPage: number) => <PageTextTranslation currentPage={currentPage} />,
  },
  {
    title: `ML Orthotypographic correction & MD format`,
    hash: `textCorrection`,
    render: (currentPage: number) => <PageTextCorrection currentPage={currentPage} />,
  },
  {
    title: `ML Orthotypographic correction (Using edit)`,
    hash: `textCorrectionEdit`,
    render: (currentPage: number) => <PageTextCorrectionEdit currentPage={currentPage} />,
  },
  {
    title: `LLM Insert [insert]`,
    hash: `textInsert`,
    render: (currentPage: number) => <PageTextInsert currentPage={currentPage} />,
  },
  {
    title: `LLM Full Document Summarization`,
    hash: `documentSummarization`,
    render: () => <GenerateFullDocumentSummarization />,
  },
  {
    title: `LLM Questions Generation`,
    hash: `questionsGeneration`,
    render: (currentPage: number) => <GenerateQuestions currentPage={currentPage} />,
  },
];

export default pdfSections;