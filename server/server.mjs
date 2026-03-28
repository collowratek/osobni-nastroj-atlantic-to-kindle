/**
 * server.mjs — Atlantic to Kindle Backend
 *
 * Express server ktery prijima data clanku z Chrome Extension,
 * generuje PDF a EPUB, a odesila emaily na Kindle a osobni email.
 *
 * Endpointy:
 *   POST /process — zpracuje clanek (generuje PDF/EPUB, odesle emaily)
 *   GET  /health  — kontrola ze server bezi
 *
 * Spusteni: npm start (nebo node server/server.mjs)
 * Port: 3000 (nebo PORT env promenna)
 *
 * Autor: Claude Code + Jiri Nekola
 * Datum: 2026-03-28
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePdf } from './generate-pdf.mjs';
import { generateEpub } from './generate-epub.mjs';
import { sendToKindle, sendToPersonalEmail } from './send-email.mjs';

// Nacteme promenne prostredi z .env souboru
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE ===

// CORS — povolime requesty z Chrome Extension
app.use(cors({
  origin: (origin, callback) => {
    // Chrome extension ma origin ve formatu chrome-extension://ID
    // Povolime taky localhost pro testovani
    if (!origin || origin.startsWith('chrome-extension://') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Nepovoleny origin'));
    }
  },
}));

// Parsovani JSON body — zvyseny limit kvuli velkym clankum s obrazky
app.use(express.json({ limit: '10mb' }));

// === ENDPOINTY ===

/**
 * GET /health — kontrola ze server bezi
 * Uzitecne pro popup.js kdyz chce overit dostupnost backendu.
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /process — hlavni endpoint
 *
 * Prijme data clanku, vygeneruje PDF a EPUB, posle emaily.
 *
 * Body (JSON):
 *   - title {string} — nazev clanku
 *   - author {string} — autor
 *   - date {string} — datum publikace
 *   - deck {string} — podtitulek
 *   - bodyHtml {string} — HTML telo clanku
 *   - heroImage {string} — URL hlavniho obrazku
 *   - url {string} — URL clanku
 *
 * Odpoved:
 *   200: { success: true, message: '...' }
 *   400: { error: 'Chybejici data' }
 *   500: { error: 'Popis chyby' }
 */
app.post('/process', async (req, res) => {
  const article = req.body;

  // Validace — minimalne potrebujeme titulek a telo
  if (!article || !article.bodyHtml) {
    return res.status(400).json({ error: 'Chybejici data clanku. Poslete title a bodyHtml.' });
  }

  console.log(`\n=== Zpracovavam clanek ===`);
  console.log(`Titulek: ${article.title}`);
  console.log(`Autor: ${article.author}`);
  console.log(`URL: ${article.url}`);

  try {
    // 1. Generujeme EPUB (pro Kindle)
    console.log('[1/4] Generuji EPUB...');
    const epubBuffer = await generateEpub(article);
    console.log(`[1/4] EPUB hotov (${(epubBuffer.length / 1024).toFixed(1)} KB)`);

    // 2. Generujeme PDF (archivni kopie)
    console.log('[2/4] Generuji PDF...');
    const pdfBuffer = await generatePdf(article);
    console.log(`[2/4] PDF hotov (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);

    // 3. Poslem EPUB na Kindle
    console.log('[3/4] Odesilam na Kindle...');
    await sendToKindle(article.title, epubBuffer);
    console.log('[3/4] Kindle email odeslan');

    // 4. Poslem PDF + EPUB na osobni email
    console.log('[4/4] Odesilam na osobni email...');
    await sendToPersonalEmail(article.title, pdfBuffer, epubBuffer, article.url);
    console.log('[4/4] Osobni email odeslan');

    console.log(`=== Hotovo! ===\n`);

    res.json({
      success: true,
      message: `Clanek "${article.title}" odeslan na Kindle a email.`,
    });

  } catch (err) {
    console.error('[CHYBA]', err.message);
    res.status(500).json({ error: `Zpracovani selhalo: ${err.message}` });
  }
});

// === START SERVERU ===
app.listen(PORT, () => {
  console.log(`\n  Atlantic to Kindle — backend`);
  console.log(`  Server bezi na http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/health`);

  // Kontrola ze mame credentials
  const missing = [];
  if (!process.env.GMAIL_USER) missing.push('GMAIL_USER');
  if (!process.env.GMAIL_APP_PASSWORD) missing.push('GMAIL_APP_PASSWORD');
  if (!process.env.KINDLE_EMAIL) missing.push('KINDLE_EMAIL');
  if (!process.env.MY_EMAIL) missing.push('MY_EMAIL');

  if (missing.length > 0) {
    console.log(`\n  POZOR: Chybi env promenne: ${missing.join(', ')}`);
    console.log(`  Vytvor .env soubor podle .env.example`);
  } else {
    console.log(`  Kindle email: ${process.env.KINDLE_EMAIL}`);
    console.log(`  Osobni email: ${process.env.MY_EMAIL}`);
  }
  console.log('');
});
