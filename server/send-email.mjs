/**
 * send-email.mjs — Atlantic to Kindle
 *
 * Odesila clanky emailem pomoci Nodemailer a Gmail App Password.
 * Dva emaily:
 *   1. Na Kindle adresu — jen EPUB priloha (Kindle to zpracuje)
 *   2. Na osobni email — PDF + EPUB jako archivni kopie
 *
 * Pozadavky:
 *   - Gmail ucet s aktivni 2FA
 *   - App Password vygenerovany v Google Account settings
 *   - Kindle email schvaleny v Amazon (Manage Content & Devices)
 *
 * Autor: Claude Code + Jiri Nekola
 * Datum: 2026-03-28
 */

import nodemailer from 'nodemailer';

/**
 * Vytvori Nodemailer transporter s Gmail SMTP.
 * Pouziva App Password (ne normalni heslo — to Gmail blokuje).
 *
 * @returns {Object} — Nodemailer transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Posle EPUB na Kindle email.
 * Amazon automaticky zpracuje EPUB a zobrazi na ctecce.
 *
 * @param {string} title — nazev clanku (pro predmet emailu)
 * @param {Buffer} epubBuffer — EPUB soubor
 * @returns {Promise<Object>} — vysledek odeslani
 */
export async function sendToKindle(title, epubBuffer) {
  const transporter = createTransporter();

  // Sanitizujeme nazev souboru — bez diakritiky a specialnich znaku
  const safeTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').trim().substring(0, 80);
  const filename = `${safeTitle || 'atlantic-article'}.epub`;

  const result = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.KINDLE_EMAIL,
    // Predmet je jedno — Kindle ho ignoruje, zpracuje jen prilohu
    subject: title || 'Atlantic clanek',
    text: 'Clanek z The Atlantic — viz priloha.',
    attachments: [
      {
        filename,
        content: epubBuffer,
        contentType: 'application/epub+zip',
      },
    ],
  });

  console.log(`[EMAIL] Odeslano na Kindle: ${process.env.KINDLE_EMAIL}`);
  return result;
}

/**
 * Posle PDF + EPUB na osobni email jako archivni kopii.
 *
 * @param {string} title — nazev clanku
 * @param {Buffer} pdfBuffer — PDF soubor
 * @param {Buffer} epubBuffer — EPUB soubor
 * @param {string} url — URL originalniho clanku
 * @returns {Promise<Object>} — vysledek odeslani
 */
export async function sendToPersonalEmail(title, pdfBuffer, epubBuffer, url) {
  const transporter = createTransporter();

  const safeTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').trim().substring(0, 80);

  const result = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.MY_EMAIL,
    subject: `[Atlantic] ${title}`,
    text: `Clanek z The Atlantic: ${title}\n\nOriginal: ${url || 'N/A'}\n\nV priloze PDF a EPUB verze.`,
    attachments: [
      {
        filename: `${safeTitle || 'atlantic-article'}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
      {
        filename: `${safeTitle || 'atlantic-article'}.epub`,
        content: epubBuffer,
        contentType: 'application/epub+zip',
      },
    ],
  });

  console.log(`[EMAIL] Odeslano na osobni email: ${process.env.MY_EMAIL}`);
  return result;
}
