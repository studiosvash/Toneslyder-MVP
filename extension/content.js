// Content script for ToneSlyder Chrome extension
// Handles retrieving selected text and replacing it with rewritten text

// Keep track of the last selection info for undo
let lastSelectionInfo = null;

// Listen for messages from the extension sidebar or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'getSelection') {
    const selectionInfo = getSelectionInfo();
    lastSelectionInfo = selectionInfo;
    sendResponse({ text: selectionInfo.text });
  } else if (message && message.type === 'applyRewrite') {
    // Replace the selected text with the provided newText
    const { newText } = message;
    applyRewrite(newText);
    sendResponse({ success: true });
  } else if (message && message.type === 'undoRewrite') {
    undoRewrite();
    sendResponse({ success: true });
  }

  // Return true to indicate asynchronous response if needed
  return true;
});

// Get selected text and selection info (for inputs/textareas or contenteditable)
function getSelectionInfo() {
  const activeEl = document.activeElement;
  // Handle text areas and inputs
  if (activeEl && (activeEl.tagName === 'TEXTAREA' || (activeEl.tagName === 'INPUT' && /text|search|url|email|tel/.test(activeEl.type)))) {
    const start = activeEl.selectionStart;
    const end = activeEl.selectionEnd;
    return {
      text: activeEl.value.substring(start, end),
      element: activeEl,
      start,
      end
    };
  }
  // Handle general content editable or document selection
  const sel = window.getSelection();
  return {
    text: sel ? sel.toString() : '',
    selection: sel ? sel.getRangeAt(0).cloneRange() : null
  };
}

// Apply rewritten text to the current selection
function applyRewrite(newText) {
  const activeEl = document.activeElement;
  // Replace in textarea or input field
  if (activeEl && (activeEl.tagName === 'TEXTAREA' || (activeEl.tagName === 'INPUT' && /text|search|url|email|tel/.test(activeEl.type)))) {
    const start = activeEl.selectionStart;
    const end = activeEl.selectionEnd;
    const original = activeEl.value;
    // Save undo info
    lastSelectionInfo = {
      element: activeEl,
      start,
      end,
      originalText: original.substring(start, end)
    };
    activeEl.value = original.substring(0, start) + newText + original.substring(end);
    // Set cursor at end of inserted text
    activeEl.selectionStart = activeEl.selectionEnd = start + newText.length;
    return;
  }
  // Replace in contenteditable or general page text
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    lastSelectionInfo = {
      selection: range.cloneRange(),
      originalText: range.toString()
    };
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
    // Collapse selection to end of inserted text
    sel.removeAllRanges();
  }
}

// Undo the last rewrite by restoring original text
function undoRewrite() {
  if (!lastSelectionInfo) return;
  // Restore in textarea/input
  if (lastSelectionInfo.element) {
    const { element, start, end, originalText } = lastSelectionInfo;
    const current = element.value;
    // Replace the rewritten text with original
    element.value = current.substring(0, start) + originalText + current.substring(start + originalText.length);
    element.selectionStart = element.selectionEnd = start + originalText.length;
  } else if (lastSelectionInfo.selection) {
    const range = lastSelectionInfo.selection;
    range.deleteContents();
    range.insertNode(document.createTextNode(lastSelectionInfo.originalText));
  }
  lastSelectionInfo = null;
}
