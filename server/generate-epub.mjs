/**
 * generate-epub.mjs — Atlantic to Kindle
 *
 * Generuje EPUB soubor z dat clanku.
 * EPUB je preferovany format pro Kindle — mensi velikost, lepsi rendering.
 * Pouziva knihovnu epub-gen-memory pro generovani v pameti (bez docasnych souboru).
 *
 * Autor: Claude Code + Jiri Nekola
 * Datum: 2026-03-28
 */

import epub from 'epub-gen-memory';

/**
 * Vygeneruje EPUB buffer z dat clanku.
 *
 * @param {Object} article — data clanku z content-scriptu
 * @param {string} article.title — nazev clanku
 * @param {string} article.author — jmeno autora
 * @param {string} article.date — datum publikace (ISO format)
 * @param {string} article.deck — podtitulek
 * @param {string} article.bodyHtml — HTML telo clanku
 * @param {string} article.url — URL clanku
 * @returns {Promise<Buffer>} — EPUB soubor jako Buffer
 *
 * @example
 * const epubBuffer = await generateEpub({
 *   title: 'Nazev clanku',
 *   author: 'Autor',
 *   bodyHtml: '<p>Text clanku...</p>',
 * });
 */
export async function generateEpub(article) {
  // Sestavime HTML obsah kapitoly — deck + telo
  let chapterContent = '';

  // Podtitulek jako uvodni odstavec kurzivou
  if (article.deck) {
    chapterContent += `<p><em>${article.deck}</em></p><hr/>\n`;
  }

  // Hlavni telo clanku
  chapterContent += article.bodyHtml;

  // Zdroj na konci
  if (article.url) {
    chapterContent += `\n<hr/><p><small>Zdroj: ${article.url}</small></p>`;
  }

  // Konfigurace EPUB
  const options = {
    title: article.title || 'Atlantic clanek',
    author: article.author || 'The Atlantic',
    publisher: 'The Atlantic',
    // Datum ve formatu YYYY-MM-DD
    date: article.date ? article.date.split('T')[0] : new Date().toISOString().split('T')[0],
    lang: 'en',
    // CSS pro hezci zobrazeni na Kindle
    css: `
      body { font-family: Georgia, serif; line-height: 1.6; }
      h1, h2, h3 { margin-top: 1.5em; }
      p { margin-bottom: 0.8em; text-align: justify; }
      blockquote {
        margin: 1em 0;
        padding-left: 1em;
        border-left: 3px solid #ccc;
        font-style: italic;
      }
      img { max-width: 100%; height: auto; }
      small { color: #666; }
    `,
    content: [
      {
        title: article.title,
        data: chapterContent,
      },
    ],
  };

  // Generujeme EPUB — vraci Buffer
  const epubBuffer = await epub(options);
  return epubBuffer;
}
