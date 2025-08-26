/* ToneSlyder Word Add-in app.js */
Office.onReady(() => {
  document.getElementById('formality').addEventListener('input', updateLabels);
  document.getElementById('conversational').addEventListener('input', updateLabels);
  document.getElementById('informativeness').addEventListener('input', updateLabels);
  document.getElementById('authoritativeness').addEventListener('input', updateLabels);
  document.getElementById('previewButton').addEventListener('click', previewRewrite);
  document.getElementById('applyButton').addEventListener('click', applyRewrite);
  document.getElementById('undoButton').addEventListener('click', undoRewrite);
  updateLabels();
});

function updateLabels() {
  ['formality','conversational','informativeness','authoritativeness'].forEach(key => {
    const slider = document.getElementById(key);
    const label = document.getElementById(key + 'Value');
    if (slider && label) {
      label.textContent = slider.value;
    }
  });
}

let lastSelection = null;

async function previewRewrite() {
  const selection = await getSelection();
  if (!selection || !selection.text) {
    setStatus('Select some text first.');
    return;
  }
  const wordCount = countWords(selection.text);
  if (wordCount > 1000) {
    setStatus('Selection too long. Please select up to 1000 words.');
    return;
  }
  const sliders = {
    formality: parseInt(document.getElementById('formality').value),
    conversational: parseInt(document.getElementById('conversational').value),
    informativeness: parseInt(document.getElementById('informativeness').value),
    authoritativeness: parseInt(document.getElementById('authoritativeness').value)
  };
  const required = document.getElementById('requiredTerms').value.split(',').map(s => s.trim()).filter(s => s);
  const banned = document.getElementById('bannedTerms').value.split(',').map(s => s.trim()).filter(s => s);
  setStatus('Rewriting...');
  try {
    const response = await fetch('https://localhost:8787/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: selection.text,
        sliders: sliders,
        guardrails: { required: required, banned: banned }
      })
    });
    if (!response.ok) {
      throw new Error('Rewrite failed');
    }
    const result = await response.json();
    document.getElementById('previewArea').textContent = result.rewrittenText || '';
    document.getElementById('applyButton').disabled = false;
    lastSelection = selection;
    setStatus('Preview ready.');
  } catch (err) {
    setStatus('Error: ' + err.message);
  }
}

async function applyRewrite() {
  const newText = document.getElementById('previewArea').textContent;
  if (!newText || !lastSelection) return;
  try {
    await replaceSelection(newText);
    document.getElementById('undoButton').disabled = false;
    document.getElementById('applyButton').disabled = true;
    setStatus('Applied.');
  } catch (err) {
    setStatus('Apply failed: ' + err);
  }
}

async function undoRewrite() {
  if (!lastSelection) return;
  try {
    await replaceSelection(lastSelection.text);
    document.getElementById('undoButton').disabled = true;
    document.getElementById('applyButton').disabled = true;
    setStatus('Undo successful.');
    lastSelection = null;
  } catch (err) {
    setStatus('Undo failed: ' + err);
  }
}

function countWords(text) {
  // simple word count splitting by whitespace
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function setStatus(msg) {
  const div = document.getElementById('status');
  div.textContent = msg;
}

function getSelection() {
  return new Promise((resolve, reject) => {
    Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, result => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve({ text: result.value });
      } else {
        reject(result.error.message);
      }
    });
  });
}

function replaceSelection(newText) {
  return new Promise((resolve, reject) => {
    Office.context.document.setSelectedDataAsync(newText, { coercionType: Office.CoercionType.Text }, result => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve();
      } else {
        reject(result.error.message);
      }
    });
  });
}
