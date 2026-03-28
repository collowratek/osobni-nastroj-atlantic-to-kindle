# CLAUDE.md — Atlantic to Kindle

## Popis projektu
Chrome Extension + Node.js backend pro posílání článků z The Atlantic na Kindle.
Dědí pravidla z hlavního CLAUDE.md.

## Architektura
- `extension/` — Chrome Extension (Manifest V3)
  - manifest.json, popup.html, popup.js, content-script.js
- `server/` — Backend (Express)
  - server.mjs, generate-pdf.mjs, generate-epub.mjs, send-email.mjs

## Specifická pravidla
- DOM selektory pro Atlantic se mohou měnit — držet je na jednom místě (content-script.js)
- Credentials NIKDY do gitu — vše v .env
- Extension testovat s reálným přihlášeným účtem na theatlantic.com
- EPUB formát preferovaný pro Kindle (menší, lepší rendering)

## Tech stack
- Node.js 18+, Express, Puppeteer, epub-gen, Nodemailer
- Chrome Extension Manifest V3

## Konvence
- Komentáře česky
- Git commity česky
- Dokumentace česky
