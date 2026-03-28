# Specifikace: Atlantic → Kindle

## Co to je
Nastroj na posilani clanku z The Atlantic na Kindle ctecku a email. Uzivatel je predplatitel The Atlantic.

## Problem
1. The Atlantic nema nativni "Send to Kindle" funkci
2. Clanky jsou za paywallem — scraping vyzaduje prihlasenou session
3. Atlantic nema jednoduchou login stranku (zadne /login URL) — pouzivaji custom auth system
4. Kindle vyzaduje jednoraze schvaleni odesilatele v Amazon nastaveni (Manage Content & Devices → Personal Document Settings)

## Zjisteni z prototypu (co jsme zistili)
- Login URL `accounts.theatlantic.com/accounts/login/` neexistuje (404)
- URL `/sign-in/` taky neexistuje (404)
- Atlantic pouziva nejaky custom/Piano auth — automatizace pres Puppeteer je nespolehlivy
- Kdyz je uzivatel prihlaseny v prohlizeci, clanky jsou plne pristupne
- DOM struktura clanku:
  - Titulek: `h1` s tridou `ArticleTitle_root__*`
  - Podtitulek: `[class*="ArticleHero_dek"]`
  - Autor: `[class*="byline"] a`
  - Datum: `<time datetime="...">`
  - Hero obrazek: `[class*="ArticleLeadArt"] img`
  - Telo clanku: `[class*="ArticleBody"]` obsahuje `<p>` elementy (testovany clanek mel 18 odstavcu)

## Navrzene reseni: Chrome Extension

### Proc extension
- Uzivatel UZ je prihlaseny v prohlizeci → extension vidi cely clanek vcetne obsahu za paywallem
- Zadny login problem — pouziva existujici browser session
- Prirozeny UX: ctes clanek → kliknes na ikonku → hotovo
- Stejny princip jako Instapaper, Pocket, Push to Kindle (drive existovaly)

### Jak to bude fungovat
1. Uzivatel je v prohlizeci na strance clanku z theatlantic.com
2. Klikne na ikonku extension v toolbaru
3. Extension popup ukaze: nazev clanku, autora, tlacitko "Poslat na Kindle"
4. Po kliknuti:
   a. Content script extrahuje text clanku z DOM (title, author, date, body paragraphs, images)
   b. Extension posle data na backend server (localhost nebo hosted)
   c. Backend vygeneruje PDF a EPUB
   d. Backend posle EPUB na jiri.nekola@kindle.com pres Gmail
   e. Backend posle PDF+EPUB na jiri.nekola@gmail.com
5. Popup ukaze "Odeslano!" s download linky

### Architektura

```
[Chrome Extension]                    [Backend Server]
  ├── manifest.json (v3)               ├── server.mjs (Express)
  ├── popup.html + popup.js            ├── generate-pdf.mjs
  ├── content-script.js                ├── generate-epub.mjs
  └── icons/                           ├── send-email.mjs
                                       └── .env (credentials)

Flow:
Browser tab → content-script.js extrahuje clanek → popup.js posle na server → server generuje PDF/EPUB → server posle email
```

### Chrome Extension (frontend)

**manifest.json**
- Manifest V3
- Permissions: `activeTab`, `scripting`
- Host permissions: `*://*.theatlantic.com/*`
- Content script injected na theatlantic.com stranky

**content-script.js**
- Bezi na strankach theatlantic.com
- Extrahuje clanek z DOM:
  - Title: `document.querySelector('h1')`
  - Deck: `document.querySelector('[class*="dek"]')`
  - Author: `document.querySelector('[class*="byline"] a')`
  - Date: `document.querySelector('time')?.getAttribute('datetime')`
  - Hero image: `document.querySelector('[class*="ArticleLeadArt"] img')?.src`
  - Body: `document.querySelectorAll('[class*="ArticleBody"] p, [class*="ArticleBody"] h2, [class*="ArticleBody"] blockquote')`
- Posle data pres `chrome.runtime.sendMessage()`

**popup.html + popup.js**
- Minimalni UI v cervene/bile (Atlantic branding)
- Zobrazi nazev clanku a autora
- Tlacitko "Poslat na Kindle"
- Progress indikator
- Stav: "Odeslano!" nebo chybova hlaska

### Backend Server

**server.mjs**
- Express na `localhost:3000`
- `POST /process` — prijme article data (JSON), vygeneruje PDF/EPUB, posle emaily
- CORS povolen pro chrome-extension origin

**generate-pdf.mjs**
- Puppeteer `page.pdf()` z HTML sablony
- A5 format (lepsi pro ctecky)
- Serif typografie, cisty layout
- Atlantic styling (cervena linka, logo text)

**generate-epub.mjs**
- epub-gen knihovna
- Metadata: title, author, publisher "The Atlantic"
- Optimalizovano pro Kindle

**send-email.mjs**
- Nodemailer + Gmail App Password
- Na Kindle: EPUB priloha
- Na osobni email: PDF + EPUB priloha

### Credentials (.env)
```
GMAIL_USER=jiri.nekola@gmail.com
GMAIL_APP_PASSWORD=afjgcokhbajawjqe
KINDLE_EMAIL=jiri.nekola@kindle.com
MY_EMAIL=jiri.nekola@gmail.com
```

(Atlantic heslo NENI potreba — extension pouziva browser session)

### Jednorazy setup pro Kindle
Uzivatel musi jednou schvalit odesilatele:
1. Amazon.com → Manage Content & Devices → Preferences
2. Personal Document Settings → Approved Personal Document E-mail List
3. Pridat: jiri.nekola@gmail.com

### Mozna budouci rozsireni
- Mobilni PWA verze (Share sheet integration)
- Podpora dalsich casopisu (New Yorker, NYT, atd.)
- Offline fronta — ulozit clanek a poslat pozdeji
- Sdileni clanku dalsi osobe (napr. Katerine) jednim kliknutim

### Technicke pozadavky
- Node.js 18+
- npm balicky: express, nodemailer, dotenv, epub-gen, puppeteer
- Chrome browser s Manifest V3 podporou
- Gmail ucet s App Password (2FA musi byt zapnuta)
