# Atlantic → Kindle

## Co to je
Chrome Extension + backend server pro posílání článků z The Atlantic na Kindle čtečku a email.

Uživatel je předplatitel The Atlantic. Extension využívá existující browser session (žádné přihlašování), extrahuje článek z DOM, backend vygeneruje PDF/EPUB a pošle na Kindle + osobní email.

## Stav projektu
🟢 AKTIVNÍ — extension + backend implementovány, čeká na testování s reálným článkem

## Jak to funguje
1. Uživatel čte článek na theatlantic.com
2. Klikne na ikonku extension
3. Extension extrahuje článek (titulek, autor, text, obrázky)
4. Backend vygeneruje PDF + EPUB
5. Pošle EPUB na Kindle, PDF+EPUB na email

## Jak spustit

### 1. Backend server
```bash
# Nainstaluj závislosti
npm install

# Zkopíruj konfiguraci a doplň své údaje
cp .env.example .env
# Uprav .env — doplň Gmail App Password, Kindle email atd.

# Spusť server
npm start
# Server poběží na http://localhost:3000
```

### 2. Chrome Extension
1. Otevři Chrome → `chrome://extensions/`
2. Zapni "Developer mode" (vpravo nahoře)
3. Klikni "Load unpacked"
4. Vyber složku `extension/`
5. Extension se objeví v toolbaru

### 3. Použití
1. Otevři článek na theatlantic.com (musíš být přihlášený)
2. Klikni na ikonku Atlantic→Kindle v toolbaru
3. Klikni "Poslat na Kindle"
4. Hotovo — článek přijde na čtečku během pár minut

### 4. Jednorázový setup pro Kindle
Musíš schválit odesílatele v Amazonu:
1. Amazon.com → Manage Content & Devices → Preferences
2. Personal Document Settings → Approved Personal Document E-mail List
3. Přidej svůj Gmail (ten z .env)

## Tech stack
- **Extension:** Chrome Manifest V3, vanilla JS
- **Backend:** Node.js, Express, Puppeteer, epub-gen-memory, Nodemailer
- **Doručení:** Gmail App Password → Kindle email + osobní email

## Struktura projektu
```
extension/           — Chrome Extension
  ├── manifest.json  — Manifest V3 konfigurace
  ├── popup.html     — UI popup okna
  ├── popup.js       — Logika popup (komunikace s backend)
  ├── content-script.js — Extrakce článku z DOM
  └── icons/         — Ikonky extension

server/              — Backend
  ├── server.mjs     — Express server + /process endpoint
  ├── generate-pdf.mjs   — PDF generování (Puppeteer)
  ├── generate-epub.mjs  — EPUB generování (epub-gen-memory)
  └── send-email.mjs     — Odesílání emailů (Nodemailer)
```

## Požadavky
- Node.js 18+
- Chrome browser
- Gmail účet s App Password (2FA zapnutá)

## Autoři
- Jiří Nekola
- Claude Code (AI asistent)

## Založeno
2026-03-28
