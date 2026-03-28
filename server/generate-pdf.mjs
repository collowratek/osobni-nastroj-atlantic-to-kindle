/**
 * generate-pdf.mjs — Atlantic to Kindle
 *
 * Generuje PDF soubor z dat clanku pomoci Puppeteer.
 * PDF je urceny jako archivni kopie pro osobni email (ne pro Kindle — tam jde EPUB).
 * Format A5, serif typografie, cisty layout s Atlantic stylingem.
 *
 * Autor: Claude Code + Jiri Nekola
 * Datum: 2026-03-28
 */

import puppeteer from 'puppeteer';

/**
 * Sestavy HTML sablonu clanku pro PDF generovani.
 * Cervena linka nahore, serif typografie, cisty layout.
 *
 * @param {Object} article — data clanku
 * @returns {string} — kompletni HTML stranka
 */
function buildHtmlTemplate(article) {
  // Formatovani data do citelne podoby
  const dateStr = article.date
    ? new Date(article.date).toLocaleDateString('cs-CZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    /* Zakladni layout — A5 format, serif font */
    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #1a1a1a;
      max-width: 100%;
      margin: 0;
      padding: 20px 30px;
    }

    /* Cervena linka nahore — Atlantic branding */
    .top-line {
      height: 4px;
      background: #e2242a;
      margin-bottom: 24px;
    }

    /* Hlavicka clanku */
    .header {
      margin-bottom: 24px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 16px;
    }

    h1 {
      font-size: 22pt;
      line-height: 1.2;
      margin: 0 0 8px 0;
    }

    .deck {
      font-size: 13pt;
      color: #555;
      font-style: italic;
      margin-bottom: 12px;
    }

    .meta {
      font-size: 9pt;
      color: #888;
    }

    .meta .author { font-weight: 700; color: #333; }

    /* Telo clanku */
    .body p {
      margin-bottom: 0.8em;
      text-align: justify;
    }

    .body h2 {
      font-size: 16pt;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }

    .body blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 3px solid #e2242a;
      font-style: italic;
      color: #444;
    }

    .body img {
      max-width: 100%;
      height: auto;
      margin: 1em 0;
    }

    /* Paticka */
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
      font-size: 8pt;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="top-line"></div>

  <div class="header">
    <h1>${article.title || 'Bez nazvu'}</h1>
    ${article.deck ? `<div class="deck">${article.deck}</div>` : ''}
    <div class="meta">
      <span class="author">${article.author || 'The Atlantic'}</span>
      ${dateStr ? ` &middot; ${dateStr}` : ''}
    </div>
  </div>

  <div class="body">
    ${article.bodyHtml || '<p>Zadny obsah</p>'}
  </div>

  <div class="footer">
    The Atlantic &middot; ${article.url || ''}<br>
    Vygenerovano pomoci Atlantic to Kindle
  </div>
</body>
</html>`;
}

/**
 * Vygeneruje PDF buffer z dat clanku.
 *
 * @param {Object} article — data clanku z content-scriptu
 * @returns {Promise<Buffer>} — PDF soubor jako Buffer
 *
 * @example
 * const pdfBuffer = await generatePdf({
 *   title: 'Nazev clanku',
 *   author: 'Autor',
 *   bodyHtml: '<p>Text...</p>',
 * });
 */
export async function generatePdf(article) {
  // Spustime headless prohlizec pro PDF rendering
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Nacteme HTML sablonu
  const html = buildHtmlTemplate(article);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Vygenerujeme PDF — A5 format je lepsi pro ctecky
  const pdfBuffer = await page.pdf({
    format: 'A5',
    margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}
