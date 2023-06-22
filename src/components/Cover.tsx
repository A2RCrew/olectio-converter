/* eslint-disable @next/next/no-img-element */
import useCover from '~/hooks/useCover';

const Cover: React.FC = () => {
  const imageUrl = useCover();
  return (
    <div className="w-full h-screen flex flex-col align-middle justify-center">
      <img alt="Ebook Cover" src={imageUrl} className="max-h-full mx-auto" />
    </div>
  );
};

export default Cover;
