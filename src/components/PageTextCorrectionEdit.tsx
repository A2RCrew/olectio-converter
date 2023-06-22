import usePageText from '~/hooks/usePageText';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import useCustomCorrectionEdit from '~/hooks/useCustomCorrectionEdit';

const PageTextCorrectionEdit: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const [text, setText] = usePageText(currentPage);
  const  [response, correct] = useCustomCorrectionEdit(text);
  const grammar = (Prism.languages as unknown as { text: Prism.Grammar }).text;

  return currentPage ? (
    <div className="w-full h-full grid grid-cols-2">
      <div className="h-full overflow-scroll border-r">        
        <Editor
          value={text}
          onValueChange={(newText) => setText(() => newText)}
          highlight={(code) => Prism.highlight(code, grammar, 'markdown')}
          padding={10}
          className="font-mono leading-6 mt-2"
        />
      </div>
      <div className="h-full overflow-scroll col-start-2">        
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
            <button onClick={correct} className="bg-pink-500 p-2 px-4 mx-4 mt-10 rounded-full">
              Correct Source Text
            </button>
          </p>
        )}
      </div>
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default PageTextCorrectionEdit;
