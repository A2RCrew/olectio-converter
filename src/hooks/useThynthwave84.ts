import { useEffect, useState } from 'react';

const useThynthwave84 = () => {
  const [style, setStyle] = useState({});
  useEffect(() => {
    import('react-syntax-highlighter/dist/esm/styles/prism/synthwave84')
      .then((mod) => setStyle(mod.default))
      .catch((ex) => console.error(ex));
  }, []);
  return style;
}

export default useThynthwave84;