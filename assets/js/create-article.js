// Rich text editor helpers
const editor = document.querySelector('.editor');
function insertAtCursor(html){ document.execCommand('insertHTML', false, html); }
function publishArticle(){ showToast('Published to Knowledge Hub ✓ DOI assigned'); location.href='knowledge-hub.html'; }
