// ToneSlyder Chrome extension sidebar script
const BACKEND_URL = 'https://localhost:8787/rewrite'; // update to your backend

function updateValue(id, value) {
  document.getElementById(id + 'Value').textContent = value;
}

['formality', 'conversational', 'informativeness', 'authoritativeness'].forEach(key => {
  const el = document.getElementById(key);
  updateValue(key, el.value);
  el.addEventListener('input', () => updateValue(key, el.value));
});

let lastRewrite = null;
let undoStack = [];

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

document.getElementById('previewBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const previewArea = document.getElementById('previewArea');
  status.textContent = '';
  previewArea.textContent = '';
  const tab = await getActiveTab();
  chrome.tabs.sendMessage(tab.id, { type: 'getSelection' }, async (resp) => {
    if (!resp || !resp.text) {
      status.textContent = 'Please select text.';
      return;
    }
    const sliders = {
      formality: parseInt(document.getElementById('formality').value, 10),
      conversational: parseInt(document.getElementById('conversational').value, 10),
      informativeness: parseInt(document.getElementById('informativeness').value, 10),
      authoritativeness: parseInt(document.getElementById('authoritativeness').value, 10),
    };
    const required = document.getElementById('required').value.split(',').map(s => s.trim()).filter(Boolean);
    const banned = document.getElementById('banned').value.split(',').map(s => s.trim()).filter(Boolean);
    const body = { text: resp.text, sliders, guardrails: { required, banned } };
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.rewrittenText) {
        previewArea.textContent = data.rewrittenText;
        lastRewrite = { original: resp.text, newText: data.rewrittenText };
      } else {
        status.textContent = 'No rewrite received.';
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Error contacting backend.';
    }
  });
});

document.getElementById('applyBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  if (!lastRewrite) {
    status.textContent = 'Please preview first.';
    return;
  }
  const tab = await getActiveTab();
  chrome.tabs.sendMessage(tab.id, { type: 'applyRewrite', newText: lastRewrite.newText }, (resp) => {
    if (resp && resp.success) {
      undoStack.push(lastRewrite.original);
      document.getElementById('undoBtn').disabled = false;
      status.textContent = 'Applied.';
    } else {
      status.textContent = 'Failed to apply.';
    }
  });
});

document.getElementById('undoBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  if (undoStack.length === 0) return;
  const original = undoStack.pop();
  const tab = await getActiveTab();
  chrome.tabs.sendMessage(tab.id, { type: 'applyRewrite', newText: original }, (resp) => {
    if (resp && resp.success) {
      status.textContent = 'Undo applied.';
      if (undoStack.length === 0) document.getElementById('undoBtn').disabled = true;
    } else {
      status.textContent = 'Failed to undo.';
    }
  });
});
