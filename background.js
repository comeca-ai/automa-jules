// Ensure the service worker is activated on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Assistente Gemini instalado.');
});

// This function will be injected into the active tab to toggle the sidebar
function toggleSidebarInPage() {
  const iframeId = 'gemini-sidebar-iframe';
  const existingIframe = document.getElementById(iframeId);

  if (existingIframe) {
    existingIframe.remove();
  } else {
    const iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.src = chrome.runtime.getURL('sidebar.html');
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 350px;
      height: 100%;
      border: none;
      z-index: 2147483647; /* Use a very high z-index */
      background-color: #f9f9f9;
    `;
    document.body.appendChild(iframe);
  }
}

// When the user clicks on the extension action (toolbar icon)
chrome.action.onClicked.addListener((tab) => {
  // Prevent injection on special browser pages
  if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("edge://")) {
    console.log("Cannot inject sidebar on this page.");
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleSidebarInPage,
  });
});

// Listener for messages from sidebar.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle request to get response from Gemini
  if (request.type === 'getGeminiResponse') {
    chrome.storage.local.get(['apiKey'], async (result) => {
      const apiKey = result.apiKey;
      if (!apiKey) {
        // The message needs to be sent back to the sidebar's iframe
        chrome.runtime.sendMessage({
          type: 'geminiResponse',
          error: 'Chave de API não encontrada. Por favor, salve sua chave nas configurações.'
        });
        return;
      }

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: request.prompt }] }] })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0]?.content?.parts[0]?.text;
        if (text) {
          chrome.runtime.sendMessage({ type: 'geminiResponse', response: text });
        } else {
          throw new Error("Resposta inválida da API Gemini.");
        }
      } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        chrome.runtime.sendMessage({ type: 'geminiResponse', error: error.message });
      }
    });
    return true; // Indicates asynchronous response
  }
  // Handle request to close the sidebar
  else if (request.type === 'closeSidebar') {
    // We need the tab ID to execute the script. The sender object has it.
    if (sender.tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: () => {
          const iframeId = 'gemini-sidebar-iframe';
          const existingIframe = document.getElementById(iframeId);
          if (existingIframe) {
            existingIframe.remove();
          }
        },
      });
    }
  }
});