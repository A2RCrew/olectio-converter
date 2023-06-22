import useCustomChatGPT from '~/hooks/useCustomChatGPT';
import MarkDown from './Markdown';

const CustomChatGPT: React.FC = () => {
  const [embeddingExists, addNewQuery, response, queryTextRef, langSelectRef, clearChat] = useCustomChatGPT();

  if (embeddingExists.isLoading) {
    return <div className="max-h-full overflow-auto">Loading...</div>;
  }
  if (!embeddingExists.data) {
    return <div className="max-h-full overflow-auto">Full Text store required</div>;
  }
  return (
    <div className="h-full overflow-auto flex flex-col-reverse">
      <select
        name="lang"
        className="bg-purple-800 text-white fixed right-2 top-3 z-10"
        defaultValue="es"
        ref={langSelectRef}
      >
        <option value="es">Español</option>
        <option value="en">Inglés</option>
      </select>
      <button title="Clear Chat" onClick={clearChat} className="fixed right-24 text-2xl top-2 z-10">
        🔄
      </button>
      <form onSubmit={addNewQuery} className="mr-40 mb-8">
        <input
          title="Chat language"
          ref={queryTextRef}
          autoFocus
          className="rounded-full p-2 mt-5 px-4 w-full bg-purple-950 focus:outline-none border-rose-500 border-2 text-white"
          type="text"
          name="embeddingToAdd"
          placeholder="enter your question"
        />
      </form>
      {response.map((message, i) => (
        <div
          className={`rounded-2xl p-1 px-2 mb-4 w-fit border-2 ${
            message.mine
              ? 'bg-purple-900 border-rose-500 mr-10'
              : 'bg-green-950 self-end ml-10 border-green-500'
          }`}
          key={i}
        >
          <div className="-mt-5">
            <MarkDown>{message.text}</MarkDown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomChatGPT;
