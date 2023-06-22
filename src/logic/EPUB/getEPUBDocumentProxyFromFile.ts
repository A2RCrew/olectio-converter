import ePub, {type Book} from 'epubjs';

const getEPUBDocumentProxyFromFile = async (file: File): Promise<Book> => {
  const buffer = await file.arrayBuffer();
  const result = await ePub(buffer).opened;
  return result;
};

export default getEPUBDocumentProxyFromFile;
