const BACKEND_URL = "https://your-backend-url/rewrite";

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Open ToneSlyder', 'showSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('ToneSlyder');
  DocumentApp.getUi().showSidebar(html);
}

function getSelectedText() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (!selection) return '';
  var text = '';
  var rangeElements = selection.getRangeElements();
  for (var i = 0; i < rangeElements.length; i++) {
    var el = rangeElements[i];
    if (el.getElement().editAsText) {
      var txt = el.getElement().asText();
      var start = el.getStartOffset();
      var end = el.getEndOffsetInclusive();
      text += txt.getText().substring(start, end + 1) + ' ';
    }
  }
  return text.trim();
}

function replaceSelectedText(newText) {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (!selection) return;
  var rangeElements = selection.getRangeElements();
  var inserted = false;
  for (var i = 0; i < rangeElements.length; i++) {
    var el = rangeElements[i];
    if (el.getElement().editAsText) {
      var txt = el.getElement().asText();
      var start = el.getStartOffset();
      var end = el.getEndOffsetInclusive();
      txt.deleteText(start, end);
      if (!inserted) {
        txt.insertText(start, newText);
        inserted = true;
      }
    }
  }
}
