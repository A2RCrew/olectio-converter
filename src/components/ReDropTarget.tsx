import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Noto_Color_Emoji } from 'next/font/google';
import loadPDF from '~/logic/pdf/loadPDF';
import loadEPUB from '~/logic/EPUB/loadEPUB';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const emoji = Noto_Color_Emoji({ subsets: ['emoji'], weight: '400' });

const ReDropTarget: React.FC<{
  onLoad: () => void;
}> = ({ onLoad }) => {
  const getFileData = async (file: File): Promise<void> => {   
    if (file.type === 'application/pdf') {
      await loadPDF(file);
    } else if (file.type === 'application/epub+zip') {
      await loadEPUB(file);
    }
    onLoad();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const firstFile = acceptedFiles[0];
    if (firstFile) {
      getFileData(firstFile).catch((err) => {
        console.error(err);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/epub+zip': ['.epub'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="p-3 z-10 text-lg cursor-pointer w-80 left-8 bottom-4 font-semibold text-white shadow-lg backdrop-blur shadow-black/50 bg-black/30 rounded-full fixed border-4 border-dashed border-white borderAnimated"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        isDragAccept ? (
          <p>
            <span className={`${emoji.className} text-2xl float-left -my-1 mr-2`}>😋</span> Drop
            that <span className="text-rose-600 font-bold">EPUB</span> /{' '}
            <span className="text-rose-600 font-bold">PDF</span> !
          </p>
        ) : (
          <p>
            <span className={`${emoji.className} text-2xl float-left -my-1 mr-2`}>🤮</span> That is not a <span className="text-rose-600 font-bold">EPUB</span> /{' '}
            <span className="text-rose-600 font-bold">PDF</span>!
          </p>
        )
      ) : (
        <p>
          <span className={`${emoji.className} text-2xl float-left -my-1 mr-2`}>🤤</span> Drag me a <span className="text-rose-600 font-bold">EPUB</span> /{' '}
          <span className="text-rose-600 font-bold">PDF</span>{' '}!
        </p>
      )}
    </div>
  );
};

export default ReDropTarget;
