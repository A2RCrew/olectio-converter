import useEmbeddedFontsExtraction from '~/hooks/useEmbeddedFontsExtraction';
import { type Glyph } from 'opentype.js';
import React, { useState } from 'react';

const DocumentEmbeddedFontExtraction: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const [expandedFonts, setExpandedFonts] = useState(new Array<string>());
  const fontsInfo = useEmbeddedFontsExtraction(currentPage);
  return fontsInfo ? (
    <div className="max-h-full overflow-auto ">
      {Object.keys(fontsInfo).map((fontName) => (
        <div key={fontName} className="mb-4">
          <h2 className="text-blue-400 font-semibold text-xl mb-2">
            <a
              href="#"
              onClick={(ev) => {
                ev.preventDefault();
                expandedFonts.includes(fontName)
                  ? setExpandedFonts(expandedFonts.filter((c) => c !== fontName))
                  : setExpandedFonts([...expandedFonts, fontName]);
              }}
            >
              <span className="inline-block border-yellow-400 border w-6 text-center text-base text-yellow-500">
                {expandedFonts.includes(fontName) ? '-' : '+'}
              </span>{' '}
              {fontName}
            </a>
            :&nbsp;
            <a
              className="underline text-sm text-gray-300"
              href="#"
              onClick={(ev) => {
                ev.preventDefault();
                fontsInfo[fontName]?.download(`${fontName}.otf`);
              }}
            >
              (Download Font)
            </a>
            {' '}
            <span className="text-sm text-orange-400">
              ({
                Object.values(
                  (fontsInfo[fontName]?.glyphs as unknown as { glyphs: { [key: number]: Glyph } })
                    .glyphs,
                ).filter((glyph) => glyph.unicodes.length > 0).length
              }{' '}
              glyphs)
            </span>
          </h2>
          {expandedFonts.includes(fontName) && (
            <dl>
              {Object.values(
                (fontsInfo[fontName]?.glyphs as unknown as { glyphs: { [key: number]: Glyph } })
                  .glyphs,
              ).map((glyph, i) => (
                <React.Fragment key={glyph.index}>
                  {glyph.unicodes.length > 0 && (
                    <>
                      <dt className="text-rose-500 font-semibold ml-4">
                        {(
                          fontsInfo[fontName]?.glyphs as unknown as {
                            glyphs: { [key: number]: Glyph };
                          }
                        ).glyphs[i + 1]?.name ||
                          (glyph.unicodes[0] ? String.fromCharCode(glyph.unicodes[0]) : 'unknown')}
                        :
                      </dt>
                      <dd className="ml-8">
                        {glyph.unicodes.map((code) => (
                          <span
                            className="mr-1 mb-1 rounded-full inline-block border-2 border-teal-700 px-2"
                            key={code}
                          >
                            <span title="Unicode char code" className="text-green-500">
                              {code}
                            </span>
                            <span
                              title="Character in SansSerif"
                              className="text-yellow-500"
                              style={{ fontFamily: 'sans-serif' }}
                            >
                              &nbsp;{String.fromCharCode(code)}&nbsp;
                            </span>
                            <span title="Character in The Font" style={{ fontFamily: fontName }}>
                              {String.fromCharCode(code)}
                            </span>
                          </span>
                        ))}
                      </dd>
                    </>
                  )}
                </React.Fragment>
              ))}
            </dl>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div>Loading fonts...</div>
  );
};

export default DocumentEmbeddedFontExtraction;
