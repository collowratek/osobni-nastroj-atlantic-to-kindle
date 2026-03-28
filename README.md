# Atlantic → Kindle

## Co to je
Chrome Extension + backend server pro posílání článků z The Atlantic na Kindle čtečku a email.

Uživatel je předplatitel The Atlantic. Extension využívá existující browser session (žádné přihlašování), extrahuje článek z DOM, backend vygeneruje PDF/EPUB a pošle na Kindle + osobní email.

## Stav projektu
🟢 AKTIVNÍ — inicializace, specifikace hotová

## Jak to funguje
1. Uživatel čte článek na theatlantic.com
2. Klikne na ikonku extension
3. Extension extrahuje článek (titulek, autor, text, obrázky)
4. Backend vygeneruje PDF + EPUB
5. Pošle EPUB na Kindle, PDF+EPUB na email

## Tech stack
- **Extension:** Chrome Manifest V3, vanilla JS
- **Backend:** Node.js, Express, Puppeteer, epub-gen, Nodemailer
- **Doručení:** Gmail App Password → Kindle email + osobní email

## Jak spustit
> Zatím ve fázi vývoje — instrukce budou doplněny.

## Požadavky
- Node.js 18+
- Chrome browser
- Gmail účet s App Password (2FA zapnutá)
- Jednorázový setup: schválit odesílatele v Amazon (Manage Content & Devices)

## Autoři
- Jiří Nekola
- Claude Code (AI asistent)

## Založeno
2026-03-28
