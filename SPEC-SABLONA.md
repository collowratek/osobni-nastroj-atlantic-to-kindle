# SPEC-SABLONA.md — Univerzalni sablona pro specifikaci projektu
#
# JAK POUZIT:
# 1. Zkopiruj tento soubor do noveho projektu jako SPEC-nazev-projektu.md
# 2. Vyplni sekce oznacene 👉 [DOPLNIT]
# 3. Smaz tenhle uvodni blok a helpery v zavorkach
# 4. Nebo proste vloz do promptu a rekni agentovi co chces — on si doplni
#
# DULEZITE: Tenhle soubor je SABLONA. Nepopisuje zadny konkretni projekt.
# Konkretni obsah vzdy dodej v druhem souboru, v promptu, nebo v konverzaci.

---

# 🚀 Specifikace: [DOPLNIT nazev projektu]

## 📋 Metadata projektu
- **Nazev repo:** `[DOPLNIT podle konvence: klient-typ-nazev]`
- **Kategorie:** [DOPLNIT klient] / [DOPLNIT typ]
- **Stav:** 🟢 AKTIVNI
- **Autor:** Jiri Nekola + Claude Code
- **Zalozeno:** [DOPLNIT datum YYYY-MM-DD]

> 💡 **Konvence nazvu repo:** `[klient]-[typ]-[nazev]`
> Klienti: aisprint, ambis, skolagpt, vaneco, osobni, obecny, [dalsi]
> Typy: web, app, auto, kurz, nastroj, api

---

## 🎯 Co to je
[DOPLNIT — 1-3 vety. Co to dela? Pro koho? Proc to existuje?]

## 😤 Problem
[DOPLNIT — Co je spatne ted? Proc to potrebujes resit? Jakou bolest to miri?]

1. [Problem 1]
2. [Problem 2]
3. ...

## ✅ Reseni
[DOPLNIT — Jak to budes resit? Jaky pristup? Proc zrovna tenhle?]

---

## 🔍 Zjisteni z pruzkumu (volitelne)
> Tuhle sekci vyplnuj az kdyz mas realne poznatky z prototypovani, testovani, nebo researche.
> Kdyz zacinaj od nuly, klidne ji smaz.

- [Co jsi zjistil?]
- [Co nefunguje / neplati?]
- [Jaka omezeni existuji?]

---

## 🏗️ Architektura

### Hlavni komponenty
```
[DOPLNIT — nakresli jednoduche schema]

Priklad:
[Frontend]              [Backend]              [Externi sluzby]
  ├── soubor1             ├── soubor1             ├── API 1
  ├── soubor2             ├── soubor2             └── Sluzba 2
  └── ...                 └── .env

Flow:
[Uzivatel] → [Akce] → [Zpracovani] → [Vysledek]
```

### Datovy tok
1. [Krok 1 — co se stane prvni]
2. [Krok 2 — co nasleduje]
3. [Krok 3 — konecny vysledek]

---

## 🧩 Detailni popis komponent

### Komponenta 1: [NAZEV]
- **Ucel:** [co dela]
- **Technologie:** [cim je postavena]
- **Klicove soubory:**
  - `soubor.js` — [co dela]
  - `dalsi.js` — [co dela]

### Komponenta 2: [NAZEV]
- **Ucel:** [co dela]
- **Technologie:** [cim je postavena]
- **Klicove soubory:**
  - `soubor.js` — [co dela]

> ➕ Pridej dalsi komponenty podle potreby

---

## 🔐 Credentials a secrets
```
[DOPLNIT — jake env promenne budes potrebovat]

Priklad:
API_KEY=<popis odkud ziskat>
DATABASE_URL=<popis>
SECRET_TOKEN=<popis>
```

> ⚠️ **BEZPECNOST:** Skutecne hodnoty POUZE v `.env` souboru (v `.gitignore`).
> NIKDY nepsat do specifikace, NIKDY necommitovat do gitu.
> Hesla a tokeny patri do `.env`, ne do SPEC souboru!

---

## 🛠️ Tech stack
- **Runtime:** [napr. Node.js 18+, Python 3.11+]
- **Framework:** [napr. Express, FastAPI, Next.js]
- **Balicky:** [vycet hlavnich zavislosti]
- **Externi sluzby:** [API, databaze, hosting]

---

## 📐 Funkcni pozadavky
> Co MUSI aplikace umet, aby byla "hotova"?

- [ ] [Pozadavek 1 — konkretni a testovatelny]
- [ ] [Pozadavek 2]
- [ ] [Pozadavek 3]
- [ ] ...

---

## 🧪 Jak otestovat ze to funguje
> Jak poznas ze je to hotove? Jaky je "happy path"?

1. [Krok 1 — co udelas]
2. [Krok 2 — co ocekuvas]
3. [Krok 3 — jak overes vysledek]

---

## 🔮 Mozna budouci rozsireni (nice-to-have)
> Neni soucasti MVP. Jenom napady na potom.

- [Napad 1]
- [Napad 2]
- [Napad 3]

---

## ⚠️ Zname problemy a omezeni
> Co nefunguje? Co je krehke? Na co si dat pozor?

- [Omezeni 1]
- [Omezeni 2]

---

## 📝 Poznamky pro agenta
> Specialni instrukce pro Claude Code nebo jineho AI agenta pri praci na tomhle projektu.

- [napr. "DOM selektory se mohou menit — drzet na jednom miste"]
- [napr. "Testovat s realnym uctem, ne s mockem"]
- [napr. "Preferovat EPUB pred PDF"]

---

# 🤖 INSTRUKCE PRO AGENTA — POVINNY POSTUP

## Krok 0: Pochop co uzivatel OPRAVDU chce 💛
> **TOHLE JE NEJDULEZITEJSI KROK. BEZ NEHO NEEXISTUJE DOBRY PRODUKT.**
>
> Tvuj cil neni "splnit task". Tvuj cil je **udelat uzivatele stastnym**.
> To znamena: pochop jeho vizi, jeho pocity, jeho ocekavani.
> Ptej se. Naslouchej. Ukazuj ze ti na tom zalezi.

### 🧠 Filosofie: Nejdriv pochop, pak stav

Uzivatel casto vi CO chce, ale ne vzdy umi presne popsat JAK.
Tvoje prace je byt jako dobry architekt — nestavis dum podle
"chci dum", ale zepta se: jak v nem chces zit? Co te ma tesit
kdyz rano vstanes? Kolik lidi tam bude? Mas psa?

**NIKDY nezacinej stavet dokud si neni VZAJEMNE jasne co vznikne.**

### 🗣️ Jak se ptat (ne jako formular, ale jako clovek)

Neptej se vsechno najednou. Ved to jako **rozhovor**:

**1. kolo — Velky obrazek** (pochop vizi)
```
🤖 Super, [nazev projektu] zni zajimave! Povidej mi o tom trochu vic:

🎯 Kdyz si predstavis hotovy vysledek — jak to vypada?
   Co presne vidis? Co se deje kdyz to nekdo pouzije?

😤 Co te dneska sere / nefunguje / chybi, ze tohle chces resit?
```

Pak POSLECHNI odpoved. Neskakej dal. Reaguj na to co rekl.

**2. kolo — Upresni** (podle toho co rekl v 1. kole)
```
🤖 Ok, rozumim! Takze kdyz to shrnuju: [vlastnimi slovy preformuluj
   co uzivatel rekl]. Sedí to?

Jeste par veci at stavim presne to co chces:

👤 Kdo to bude pouzivat? (ty sam / nekdo konkretni / kdokoliv?)

📦 Kdybys mel vybrat JEDNU vec co to musi umet na zacatek — co by to byla?

✨ Je neco na cem ti extra zalezi? (design? rychlost? jednoduchost?
   aby to vypadalo profi? aby to bylo srandovni?)
```

**3. kolo — Detaily** (jen kdyz je potreba)
```
🤖 Jasny, mam dobrou predstavu! Jeste posledni veci:

🖥️ Kde to pobezi? (tvuj pocitac / web / mobil?)
🔧 Mas nejaky preference na technologie? (nebo nechas na me?)
📎 Mas uz neco rozpracovanyho? (kod, poznamky, nakresy, cokoliv?)
```

### ✅ Kontrola porozumeni — POVINNE pred zacatkem prace

Nez zacnes cokoliv stavet, VZDY uzivateli ukazes co jsi pochopil:

```
🤖 Hele, nez zacnu makat, chci se ujistit ze jsme na stejne vlne.
Tady je co budu stavet:

📋 SHRNUTI:
[2-3 vety co to bude, vlastnimi slovy, ne copy-paste uzivatele]

🎯 HLAVNI FUNKCE:
1. [co to udelá]
2. [co to udelá]
3. [co to udelá]

🎨 POCIT A STYL:
[jak to bude vypadat/pusobit — jednoduchy? hravy? profesionalni?]

⚡ PRVNI VERZE BUDE UMET:
[co presne bude v MVP — nic vic, nic min]

Sedi to? Neco bys zmenil? Klidne me oprav, radsi ted nez za hodinu! 😄
```

### 🚫 Co NIKDY nedelej

- **NEHADEJ** co uzivatel chce. Kdyz nevis, zeptej se.
- **NEPREDPOKLADEJ** nazev repo, technologii, architekturu — dokud ti to uzivatel nerekne nebo nepotvrdí.
- **NEZACINEJ KÓDOVAT** dokud uzivatel nerekl "jo, presne tak, jed!"
- **NEIGNORUJ pocity** — kdyz uzivatel rekne "chci aby to bylo krasny", tak to neni vedlejsi pozadavek. To je HLAVNI pozadavek.
- **NEPOSÍLEJ checklisty** — mluv jako clovek, ne jako formular.
- **NEVYTVAREJ SLOZKY ANI SOUBORY** dokud nevis co do nich prijde. Prazdna slozka = dukaz ze jsi nepochopil zadani.

### 🌟 Co VZDY delej

- **PREFORMULUJ** co uzivatel rekl vlastnimi slovy — to ukazuje ze rozumis.
- **NAVRHNI** veci o kterych uzivatel mozna nepremyslel (ale neptej se na 20 veci najednou).
- **UKAZUJ NADŠENÍ** — kdyz uzivatel popisuje svuj projekt, reaguj na to! "To je skvely napad!" neni podbizivost, je to lidskost.
- **BUDUJ DUVERU** — radsi rekni "tohle nevim, zjistim" nez "jasne, udelam" a pak to bude spatne.
- **MYSLI NA RADOST** — konecny vysledek ma uzivatele potesit. Kdyz delas rozhodnuti, ptej se sam sebe: "bude z toho mit radost?"

## Krok 1: Zaloz projekt spravne 📁
```bash
# 1. Vytvor slozku (nazev PODLE KONVENCE z metadat SPEC souboru)
mkdir [nazev-repo]
cd [nazev-repo]

# 2. OKAMZITE git init — ZADNE VYJIMKY
git init

# 3. Povinne soubory PRVNI
# - README.md (co to je, jak spustit, stav)
# - CLAUDE.md (pravidla pro agenta, dedi z hlavniho)
# - .gitignore (VZDY — minimalne .env, node_modules, __pycache__)
# - TODO.md (aktualni stav a dalsi kroky)
# - CHANGELOG.md (historie zmen)
# - SPEC soubor (zkopiruj nebo vytvor)

# 4. INIT commit
git add -A
git commit -m "[INIT] Zalozeni projektu [nazev]

Zakladni struktura: README, CLAUDE.md, .gitignore, TODO.md
Specifikace: [strucny popis co to bude]"

# 5. GitHub repo + push
gh repo create [nazev-repo] --private --source=. --push
```

## Krok 2: Postav MVP 🏗️
- Implementuj podle SPEC souboru
- Commituj po KAZDÉM logickem kroku
- Testuj PRUBEZNE, ne az na konci
- Komentare VSUDE a CESKY

## Krok 3: Over ze to funguje ✅
- Projdi "Jak otestovat" sekci ze SPEC
- Vsechno musi projit
- Pokud ne → oprav → commitni fix

## Krok 4: Uklid a dokumentace 📝
- Aktualizuj README.md s realnym stavem
- Aktualizuj TODO.md
- CHANGELOG.md — co se zmenilo
- Zaverecny commit

---

> **ZLATÉ PRAVIDLO:** Radsi se zeptej 3x nez jednou stavis blbe.
> Cas straveny ptanim se = cas usetrenym predelavanim.
>
> **STRIBRNOE PRAVIDLO:** Funkcni ošklivý kod > krasny nedokonceny kod.
> Nejdriv at to funguje, pak to udělej hezky.
