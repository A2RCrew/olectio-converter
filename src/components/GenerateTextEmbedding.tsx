import { Fragment} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import useGenerateTextEmbedding from '~/hooks/useGenerateTextEmbedding';

const GenerateTextEmbedding: React.FC = ({}) => {
  const [texts, setTexts, distances, setDistances, addNewText, addTextRef, selectedText, setSelectedText] = useGenerateTextEmbedding()
  return (
    <div className="h-full overflow-auto">
      <form onSubmit={addNewText}>
        <input
          ref={addTextRef}
          autoFocus
          className="rounded-full p-2 px-4 w-full bg-purple-950 focus:outline-none border-rose-500 border-2 text-white"
          type="text"
          name="embeddingToAdd"
          placeholder="type text to add"
        />
      </form>
      {texts.length ? (
        <>
          <table className="w-full my-4 ">
            <tbody>
              <tr>
                <th className="border w-0 bg-purple-950 text-rose-500 border-purple-500 px-2 text-left">
                  Text
                </th>
                <th className="border bg-purple-950 text-rose-500 border-purple-500 px-2 text-left">
                  Vector ({texts[0]?.vector.length})
                </th>
              </tr>
              {texts.map((value, i) => (
                <tr key={`${value.text}-${i}`} className="bg-slate-950 odd:bg-slate-900">
                  <td className="break-keep whitespace-nowrap w-0 text-yellow-300 border-purple-500 border px-2">
                    {value.text}
                  </td>
                  <td className="text-xs px-2 border-purple-500 border max-w-2xl overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {value.vector.filter((i) => i < 10).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-auto">
            <Listbox value={selectedText} onChange={setSelectedText}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-72 cursor-default rounded-lg bg-purple-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-white">{selectedText.text}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto rounded-md bg-purple-500 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {texts.map((value, i) => (
                      <Listbox.Option
                        key={`${value.text}-${i}`}
                        value={value}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-amber-100 text-amber-900' : 'text-yellow-200'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {value.text}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
                <button
                  onClick={() => {
                    const result = new Array<{ text: string; distance: number }>();
                    if (selectedText && selectedText.vector) {
                      texts.forEach((text) => {
                        const totalDistance = text.vector.reduce(
                          (total, current, index) =>
                            total + Math.pow((selectedText.vector[index] || 0) - current, 2),
                          0,
                        );
                        result.push({ text: text.text, distance: Math.sqrt(totalDistance) });
                      });
                    }
                    result.sort((a, b) => a.distance - b.distance);
                    setDistances(result);
                  }}
                  className="rounded-full mt-4 p-1 px-4 font-normal ml-2 bg-purple-950 border-rose-900 border-2 text-white "
                >
                  Recalculate
                </button>
              </div>
            </Listbox>
          </div>
          {distances.length ? (
            <table className="w-full border my-4 ">
              <tbody>
                <tr>
                  <th className="border bg-purple-950 w-0 text-rose-500 border-purple-500 px-2 text-left">
                    Text
                  </th>
                  <th className="border bg-purple-950 w-max text-rose-500 border-purple-500 px-2 text-left">
                    Distance
                  </th>
                </tr>
                {distances.map((value, i) => {
                  return (
                    <tr key={`${value.text}-${i}`} className="bg-slate-950 odd:bg-slate-900">
                      <td className="break-keep w-0 text-yellow-300 border-purple-500 border px-2  whitespace-nowrap ">
                        {value.text}
                      </td>
                      <td className="text-xs px-2 w-max border-purple-500 border max-w-2xl overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {value.distance}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
          <p className="text-left">
            <button
              onClick={() => {
                setTexts([]);
              }}
              className="rounded-full mt-4 p-2 px-4 bg-purple-950 border-rose-500 border-2 text-white font-bold"
            >
              Clear
            </button>
          </p>
        </>
      ) : null}
    </div>
  );
};

export default GenerateTextEmbedding;
