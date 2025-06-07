document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("siteSearch");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const content = document.querySelector("main");
      if (!query) {
        clearHighlights(content);
        return;
      }
      highlightMatches(content, query);
    });
  }

  function highlightMatches(element, query) {
    clearHighlights(element);
    const textNodes = getTextNodes(element);
    let firstMatch = null;

    textNodes.forEach(node => {
      const val = node.nodeValue;
      const index = val.toLowerCase().indexOf(query);
      if (index >= 0) {
        const span = document.createElement("span");
        span.className = "highlight-modern";
        const match = val.substr(index, query.length);
        const before = document.createTextNode(val.substr(0, index));
        const after = document.createTextNode(val.substr(index + query.length));
        span.textContent = match;

        const parent = node.parentNode;
        parent.replaceChild(after, node);
        parent.insertBefore(span, after);
        parent.insertBefore(before, span);

        if (!firstMatch) firstMatch = span;
      }
    });

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function clearHighlights(element) {
    const highlights = element.querySelectorAll("span.highlight-modern");
    highlights.forEach(span => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
  }

  function getTextNodes(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.parentNode.tagName !== "SCRIPT"
    });
    const nodes = [];
    let current;
    while ((current = walker.nextNode())) {
      if (current.nodeValue.trim()) nodes.push(current);
    }
    return nodes;
  }
});
