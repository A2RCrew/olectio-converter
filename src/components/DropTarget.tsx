import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Noto_Color_Emoji } from 'next/font/google';
import loadPDF from '~/logic/pdf/loadPDF';
import loadEPUB from '~/logic/EPUB/loadEPUB';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const emoji = Noto_Color_Emoji({ subsets: ['emoji'], weight: '400' });

const DropTarget: React.FC<{
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
    <div className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-white fixed">
      <div
        {...getRootProps()}
        className="p-6 z-10 text-2xl cursor-pointer shadow-lg backdrop-blur shadow-black/50 bg-black/30 rounded-full border-4 border-dashed border-white borderAnimated"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          isDragAccept ? (
            <p>
              <span className={`${emoji.className} text-4xl float-left -my-1 mr-2`}>😋</span> Drop
              that <span className="text-rose-600 font-bold">EPUB</span> or{' '}
              <span className="text-rose-600 font-bold">PDF</span> to me!
            </p>
          ) : (
            <p>
              <span className={`${emoji.className} text-4xl float-left -my-1 mr-2`}>🤮</span> Puag
              that is not an <span className="text-rose-600 font-bold">EPUB</span> or{' '}
              <span className="text-rose-600 font-bold">PDF</span>!
            </p>
          )
        ) : (
          <p>
            <span className={`${emoji.className} text-4xl float-left -my-1 mr-2`}>🤤</span>Drag me
            some <span className="text-rose-600 font-bold">EPUB</span> or{' '}
            <span className="text-rose-600 font-bold">PDF</span>, dude!
          </p>
        )}
      </div>
      <p className="pt-2 text-sm text-center font-light">
        Carefully Crafted By Ignacio Ferro Picón
      </p>
    </div>
  );
};

export default DropTarget;
