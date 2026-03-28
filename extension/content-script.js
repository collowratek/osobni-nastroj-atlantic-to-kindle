/**
 * content-script.js — Atlantic to Kindle
 *
 * Bezi na strankach theatlantic.com a extrahuje obsah clanku z DOM.
 * Vsechny DOM selektory jsou soustredeny TADY — kdyz Atlantic zmeni strukturu,
 * opravuje se jen tento soubor.
 *
 * Autor: Claude Code + Jiri Nekola
 * Datum: 2026-03-28
 */

// === DOM SELEKTORY ===
// Atlantic muze kdykoliv zmenit tridy — vsechny selektory na jednom miste
const SELECTORS = {
  // Titulek clanku — h1 element s tridou ArticleTitle_root__*
  title: 'h1',
  // Podtitulek (deck) — element s tridou obsahujici "dek"
  deck: '[class*="dek"]',
  // Autor — odkaz uvnitr byline
  author: '[class*="byline"] a',
  // Datum publikace — <time> element s datetime atributem
  date: 'time[datetime]',
  // Hlavni obrazek clanku
  heroImage: '[class*="ArticleLeadArt"] img',
  // Telo clanku — odstavce, nadpisy, citace
  bodyElements: '[class*="ArticleBody"] p, [class*="ArticleBody"] h2, [class*="ArticleBody"] blockquote',
};

/**
 * Extrahuje clanek ze stranky The Atlantic.
 * Vraci objekt se vsemi castmi clanku.
 *
 * @returns {Object} articleData — { title, deck, author, date, heroImage, bodyHtml, bodyText, url }
 */
function extractArticle() {
  // Titulek — prvni h1 na strance
  const titleEl = document.querySelector(SELECTORS.title);
  const title = titleEl ? titleEl.textContent.trim() : 'Bez nazvu';

  // Podtitulek (deck) — kratky popis pod titulkem
  const deckEl = document.querySelector(SELECTORS.deck);
  const deck = deckEl ? deckEl.textContent.trim() : '';

  // Autor clanku
  const authorEl = document.querySelector(SELECTORS.author);
  const author = authorEl ? authorEl.textContent.trim() : 'Neznamy autor';

  // Datum publikace z datetime atributu
  const dateEl = document.querySelector(SELECTORS.date);
  const date = dateEl ? dateEl.getAttribute('datetime') : '';

  // Hlavni obrazek — URL z src atributu
  const heroImgEl = document.querySelector(SELECTORS.heroImage);
  const heroImage = heroImgEl ? heroImgEl.src : '';

  // Telo clanku — sbira vsechny odstavce, nadpisy a citace
  const bodyElements = document.querySelectorAll(SELECTORS.bodyElements);
  let bodyHtml = '';
  let bodyText = '';

  bodyElements.forEach((el) => {
    // Zachovava HTML tagy (tucne, kurziva, odkazy) pro EPUB
    bodyHtml += el.outerHTML + '\n';
    // Cisty text pro nahled
    bodyText += el.textContent.trim() + '\n\n';
  });

  return {
    title,
    deck,
    author,
    date,
    heroImage,
    bodyHtml,
    bodyText,
    url: window.location.href,
  };
}

// Naslouchame zprave z popup.js — kdyz uzivatel klikne "Poslat na Kindle"
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractArticle') {
    try {
      const data = extractArticle();
      // Kontrola ze jsme nasli obsah
      if (!data.bodyHtml) {
        sendResponse({ error: 'Nepodarilo se najit obsah clanku. Jsi na strance s clankem?' });
        return;
      }
      sendResponse({ data });
    } catch (err) {
      sendResponse({ error: `Chyba pri extrakci: ${err.message}` });
    }
  }
  // Vracime true aby sendResponse fungoval asynchronne
  return true;
});
