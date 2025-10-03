document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send-btn');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const closeBtn = document.getElementById('close-btn');

  // Load API Key from storage
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  // Save API Key
  saveKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ apiKey: apiKey }, () => {
        addMessage('system', 'Chave de API salva com sucesso!');
      });
    } else {
      addMessage('system', 'Por favor, insira uma chave de API válida.');
    }
  });

  // Send message
  const sendMessage = () => {
    const message = chatInput.value.trim();
    if (message) {
      addMessage('user', message);
      chatInput.value = '';
      // Show a temporary "thinking" message
      addMessage('assistant', 'Pensando...', true);
      // Send message to background script
      chrome.runtime.sendMessage({ type: 'getGeminiResponse', prompt: message });
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  // Listen for responses from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'geminiResponse') {
        // Remove the "thinking" message before adding the new one
        const thinkingMessage = document.querySelector('.thinking');
        if (thinkingMessage) {
            thinkingMessage.remove();
        }

        if (request.error) {
            addMessage('assistant', `Erro: ${request.error}`);
        } else {
            addMessage('assistant', request.response);
        }
    }
  });

  // Function to add a message to the chat
  function addMessage(sender, text, isThinking = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    if (isThinking) {
        messageElement.classList.add('thinking');
    }
    // A simple markdown-like formatting for newlines
    messageElement.innerHTML = text.replace(/\n/g, '<br>');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Close sidebar by sending a message to the background script
  closeBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'closeSidebar' });
  });
});