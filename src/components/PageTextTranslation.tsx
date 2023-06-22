import usePageText from '~/hooks/usePageText';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import useCustomTranslation from '~/hooks/useCustomTranslation';

const PageTextTranslation: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const [text, setText] = usePageText(currentPage);
  const [response, sourceLangRef, targetLangRef, translate] = useCustomTranslation(text);
  const grammar = (Prism.languages as unknown as { text: Prism.Grammar }).text;

  return currentPage ? (
    <div className="w-full h-full grid grid-cols-2">
      <div className="h-full overflow-scroll border-r">
        <select
          title="Source Language"
          ref={sourceLangRef}
          name="lang"
          className="bg-purple-800 text-white absolute right-[calc(50%+16px)] z-10"
          defaultValue="spanish"
        >
          <option value="spanish">Español</option>
          <option value="english">Inglés</option>
          <option value="portuguese">Portugués</option>
          <option value="gallego">Gallego</option>
          <option value="catalan">Catalán</option>
          <option value="catalan de Valencia">Valenciano</option>
          <option value="catalan de Baleares">Balear</option>
          <option value="euskera">Euskera</option>
        </select>
        <Editor
          value={text}
          onValueChange={(newText) => setText(() => newText)}
          highlight={(code) => Prism.highlight(code, grammar, 'markdown')}
          padding={10}
          className="font-mono leading-6 mt-2"
        />
      </div>
      <div className="h-full overflow-scroll col-start-2">
        <select
          title="Target Language"
          ref={targetLangRef}
          name="lang"
          className="bg-purple-800 text-white fixed right-4 top-4 z-10"
          defaultValue="english"
        >
          <option value="spanish">Español</option>
          <option value="english">Inglés</option>
          <option value="portuguese">Portugués</option>
          <option value="gallego">Gallego</option>
          <option value="catalan">Catalán</option>
          <option value="catalan de Valencia">Valenciano</option>
          <option value="catalan de Baleares">Balear</option>
          <option value="euskera">Euskera</option>
        </select>
        {response ? (
          <Editor
            value={response || ''}
            readOnly
            onValueChange={()=>{ 
              // Not required
            }}
            padding={10}
            highlight={(code) => Prism.highlight(code, grammar, 'markdown')}
            className="font-mono leading-6 mt-2"
          />
        ) : (
          <p className="text-center">
            <button onClick={translate} className="bg-pink-500 p-2 px-4 mx-4 mt-10 rounded-full">
              Translate Source Text
            </button>
          </p>
        )}
      </div>
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default PageTextTranslation;
