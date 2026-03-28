/**
 * popup.js — Atlantic to Kindle
 *
 * Logika popup okna Chrome Extension.
 * 1. Po otevreni posle zpravu content-scriptu aby extrahoval clanek
 * 2. Zobrazi info o clanku (titulek, autor)
 * 3. Po kliknuti na tlacitko posle data na backend server
 *
 * Autor: Claude Code + Jiri Nekola
 * Datum: 2026-03-28
 */

// === KONFIGURACE ===
// URL backendu — pri vyvoji localhost, v produkci zmenit na hosted URL
const BACKEND_URL = 'http://localhost:3000';

// Reference na DOM elementy
const contentDiv = document.getElementById('content');
const statusDiv = document.getElementById('status');

// Data o clanku — naplni se po extrakci
let articleData = null;

/**
 * Nastavi stavovou hlasku pod tlacitkem.
 * @param {string} message — text zpravy
 * @param {string} type — 'loading' | 'success' | 'error'
 */
function setStatus(message, type = 'loading') {
  statusDiv.className = `status ${type}`;
  // Spinner u loading stavu
  if (type === 'loading') {
    statusDiv.innerHTML = `<span class="spinner"></span>${message}`;
  } else {
    statusDiv.textContent = message;
  }
}

/**
 * Zobrazi informace o clanku a tlacitko pro odeslani.
 * @param {Object} data — data clanku z content-scriptu
 */
function showArticle(data) {
  contentDiv.innerHTML = `
    <div class="article-info">
      <div class="article-title">${data.title}</div>
      <div class="article-author">${data.author}</div>
    </div>
    <button id="sendBtn" class="btn">Poslat na Kindle</button>
  `;

  // Kliknuti na tlacitko — posle data na backend
  document.getElementById('sendBtn').addEventListener('click', () => sendToKindle(data));
}

/**
 * Posle data clanku na backend server ke zpracovani.
 * Backend vygeneruje PDF/EPUB a posle email na Kindle + osobni email.
 *
 * @param {Object} data — { title, author, date, bodyHtml, heroImage, url }
 */
async function sendToKindle(data) {
  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  setStatus('Generuji a odesilam...', 'loading');

  try {
    // Posleme POST na backend s daty clanku
    const response = await fetch(`${BACKEND_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Kontrola odpovedi
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server odpodel ${response.status}`);
    }

    const result = await response.json();
    setStatus('Odeslano na Kindle! Zkontroluj ctecku.', 'success');

  } catch (err) {
    // Rozlisime jestli backend vubec bezi
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      setStatus('Backend server nebezi. Spust: npm start', 'error');
    } else {
      setStatus(`Chyba: ${err.message}`, 'error');
    }
    btn.disabled = false;
  }
}

// === INICIALIZACE ===
// Po otevreni popup ziskame aktivni tab a poslem zpravu content scriptu
(async () => {
  try {
    // Zjistime aktivni tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Kontrola ze jsme na theatlantic.com
    if (!tab.url || !tab.url.includes('theatlantic.com')) {
      contentDiv.innerHTML = '<div class="empty-state">Otevri clanek na theatlantic.com</div>';
      return;
    }

    // Poslem zpravu content scriptu aby extrahoval clanek
    chrome.tabs.sendMessage(tab.id, { action: 'extractArticle' }, (response) => {
      // Kontrola chyb
      if (chrome.runtime.lastError) {
        contentDiv.innerHTML = '<div class="empty-state">Obnov stranku (F5) a zkus znovu</div>';
        return;
      }

      if (response?.error) {
        contentDiv.innerHTML = `<div class="empty-state">${response.error}</div>`;
        return;
      }

      if (response?.data) {
        articleData = response.data;
        showArticle(articleData);
      }
    });
  } catch (err) {
    contentDiv.innerHTML = `<div class="empty-state">Chyba: ${err.message}</div>`;
  }
})();
