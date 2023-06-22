import type * as fontkit from 'fontkit';

const getGlyphsFromFontKitFont = (font: fontkit.Font, filterEmptyGlyphs = true): fontkit.Glyph[] => {
  const numGlyphs = font.numGlyphs;
  const glyphs = new Array<fontkit.Glyph>();

  for (let i = 0; i < numGlyphs; i++) {
    const glyph = font.getGlyph(i);
    if (!filterEmptyGlyphs || font.stringsForGlyph(glyph.id).length) {
      glyphs.push(glyph);
    }
  }
  return glyphs;
};

export default getGlyphsFromFontKitFont;