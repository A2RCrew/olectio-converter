import { Prism as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
import useThynthwave84 from '~/hooks/useThynthwave84';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import useCustomQuestionsGenerator from '~/hooks/useCustomQuestionsGenerator';
import usePageText from '~/hooks/usePageText';

const GenerateQuestions: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const [text, setText] = usePageText(currentPage);
  const [response, totalQuestions, responsesPerQuestion, generate] =
    useCustomQuestionsGenerator(text);
  const grammar = (Prism.languages as unknown as { text: Prism.Grammar }).text;
  const style = useThynthwave84();
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
        <select
          title="Total Questions"
          ref={totalQuestions}
          name="totalQuestions"
          className="bg-purple-800 text-white fixed right-32 top-4 z-10"
          defaultValue="5"
        >
          <option value="1">1 Question</option>
          <option value="5">5 Questions</option>
          <option value="8">8 Questions</option>
          <option value="10">10 Questions</option>
          <option value="20">20 Questions</option>
        </select>
        <select
          title="Responses per question"
          ref={responsesPerQuestion}
          name="responsesPerQuestion"
          className="bg-purple-800 text-white fixed right-4 top-4 z-10"
          defaultValue="4"
        >
          <option value="2">2 Options</option>
          <option value="3">3 Options</option>
          <option value="4">4 Options</option>
          <option value="5">5 Options</option>
          <option value="6">6 Options</option>
        </select>
        {response ? (
          <ReactSyntaxHighlighter
            className="forceBlackBG"
            showLineNumbers
            wrapLongLines
            language="json"
            style={style}
          >
            {response}
          </ReactSyntaxHighlighter>
        ) : (
          <p className="text-center">
            <button onClick={generate} className="bg-pink-500 p-2 px-4 mx-4 mt-10 rounded-full">
              Generate Questions
            </button>
          </p>
        )}
      </div>
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default GenerateQuestions;
