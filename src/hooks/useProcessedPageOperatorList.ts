import { useEffect, useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';
import { getOperatorFromCode } from '~/logic/pdf/pdfOperators';

interface ProcessedOperation {
  code: number;
  name: string;
  params?: string;
  text?: string;
}

const useProcessedPageOperatorList = (currentPage: number) => {
  const document = getCurrentPDFDocument();
  const [operatorList, setOperatorList] = useState<ProcessedOperation[]>();

  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then(async (page) => {
          const newOperatorList = await page.getOperatorList();
          const result = newOperatorList.fnArray.map((code, i): ProcessedOperation => {
            if (code === 44) {
              return {
                code,
                name: getOperatorFromCode(code),
                params: (newOperatorList.argsArray[i] as object[])
                  .map((c) => JSON.stringify(c))
                  .join('\r'),
                text: (newOperatorList.argsArray[i] as { unicode: string }[][])
                  .map((c) =>
                    c
                      .map((d) => (typeof d === 'number' && Math.abs(d) > 100 ? ' ' : d.unicode))
                      .join(''),
                  )
                  .join(''),
              };
            }
            return {
              code,
              name: getOperatorFromCode(code),
              params: newOperatorList.argsArray[i]
                ? (newOperatorList.argsArray[i] as number[]).length
                  ? (newOperatorList.argsArray[i] as number[]).join(',')
                  : (newOperatorList.argsArray[i] as Uint8ClampedArray).toLocaleString()
                : undefined,
            };
          });
          setOperatorList(result);
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage]);

  return operatorList;
};

export default useProcessedPageOperatorList;
