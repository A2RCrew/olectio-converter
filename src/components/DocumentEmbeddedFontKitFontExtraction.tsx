import type * as fontkit from 'fontkit';
import useEmbeddedFontsFontKitExtraction from '~/hooks/useEmbeddedFontsFontKitExtraction';
import React, { useState } from 'react';
import getGlyphsFromFontKitFont from '~/logic/pdf/getGlyphsFromFontKitFont';

const DocumentEmbeddedFontKitFontExtraction: React.FC<{ currentPage: number }> = ({
  currentPage,
}) => {
  const [expandedFonts, setExpandedFonts] = useState(new Array<string>());
  const fontsInfo = useEmbeddedFontsFontKitExtraction(currentPage);

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
                const buffer = (fontsInfo[fontName] as unknown as { stream: { buffer: Buffer } })
                  .stream.buffer;
                const blob = new Blob([buffer], {
                  type: `font/otf`,
                });
                (ev.target as HTMLAnchorElement).href = URL.createObjectURL(blob);
                (ev.target as HTMLAnchorElement).download = `${fontName}.otf`;
              }}
            >
              (Download Font as Open Type)
            </a>{' '}
            <span className="text-sm text-orange-400">
              ({getGlyphsFromFontKitFont(fontsInfo[fontName] as fontkit.Font).length} glyphs)
            </span>
          </h2>
          {expandedFonts.includes(fontName) && (
            <dl>
              {getGlyphsFromFontKitFont(fontsInfo[fontName] as fontkit.Font).map((glyph) => (
                <React.Fragment key={glyph.id}>
                  <dt className="text-rose-500 font-semibold ml-4">
                    {glyph.name ||
                      (fontsInfo[fontName] as fontkit.Font).stringsForGlyph(glyph.id)[0]}
                    :
                  </dt>
                  <dd className="ml-8">
                    {(fontsInfo[fontName] as fontkit.Font).stringsForGlyph(glyph.id).map((code) => (
                      <span
                        className="mr-1 mb-1 rounded-full inline-block border-2 border-teal-700 px-2"
                        key={code}
                      >
                        <span title="Unicode char code" className="text-green-500">
                          {code.charCodeAt(0)}
                        </span>
                        <span
                          title="Character in SansSerif"
                          className="text-yellow-500"
                          style={{ fontFamily: 'sans-serif' }}
                        >
                          &nbsp;{code}&nbsp;
                        </span>
                        <span title="Character in The Font" style={{ fontFamily: fontName }}>
                          {code}
                        </span>
                      </span>
                    ))}
                  </dd>
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

export default DocumentEmbeddedFontKitFontExtraction;
