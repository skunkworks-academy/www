const modules = [
  "module-01-introduction.md",
  "module-02-getting-started.md",
  "module-03-core-use-cases.md",
  "module-04-effective-prompting.md",
  "module-05-documents-files.md",
  "module-06-projects-memory.md",
  "module-07-best-practices-pitfalls.md",
  "module-08-capstone-qa.md",
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderTable(lines, startIndex) {
  const tableLines = [];
  let index = startIndex;
  while (index < lines.length && lines[index].trim().startsWith("|")) {
    tableLines.push(lines[index]);
    index += 1;
  }
  if (tableLines.length < 2) return { html: "", nextIndex: startIndex };
  const rows = tableLines
    .filter((line, rowIndex) => rowIndex !== 1)
    .map((line) => line.trim().slice(1, -1).split("|").map((cell) => cell.trim()));
  const head = rows[0] || [];
  const body = rows.slice(1);
  const html = `<table><thead><tr>${head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  return { html, nextIndex: index };
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let i = 0;
  let inCode = false;
  let codeBuffer = [];
  let listBuffer = [];

  function flushList() {
    if (listBuffer.length) {
      html.push(`<ul>${listBuffer.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      listBuffer = [];
    }
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (!inCode) {
        flushList();
        inCode = true;
        codeBuffer = [];
      } else {
        html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
        inCode = false;
      }
      i += 1;
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      i += 1;
      continue;
    }

    if (trimmed.startsWith("|") && i + 1 < lines.length && lines[i + 1].trim().startsWith("|")) {
      flushList();
      const table = renderTable(lines, i);
      html.push(table.html);
      i = table.nextIndex;
      continue;
    }

    if (!trimmed) {
      flushList();
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      html.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
    } else if (trimmed.startsWith("## ")) {
      flushList();
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      flushList();
      html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("#### ")) {
      flushList();
      html.push(`<h4>${inlineMarkdown(trimmed.slice(5))}</h4>`);
    } else if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^\d+\.\s/, ""));
    } else if (trimmed.startsWith("> ")) {
      flushList();
      html.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`);
    } else if (trimmed === "---") {
      flushList();
      html.push("<hr />");
    } else {
      flushList();
      html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
    }
    i += 1;
  }

  flushList();
  return html.join("\n");
}

async function loadModule(moduleName) {
  const safeModule = modules.includes(moduleName) ? moduleName : modules[0];
  const content = document.getElementById("content");
  const select = document.getElementById("moduleSelect");
  if (select) select.value = safeModule;
  content.innerHTML = "<p>Loading module...</p>";

  try {
    const response = await fetch(`modules/${safeModule}`);
    if (!response.ok) throw new Error(`Could not load ${safeModule}`);
    const markdown = await response.text();
    content.innerHTML = renderMarkdown(markdown);
    const url = new URL(window.location.href);
    url.searchParams.set("module", safeModule);
    window.history.replaceState({}, "", url);
  } catch (error) {
    content.innerHTML = `<h1>Module could not be loaded</h1><p>${escapeHtml(error.message)}</p><p>Open the module directly from the course home page.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("module") || modules[0];
  const select = document.getElementById("moduleSelect");

  if (select) {
    select.addEventListener("change", () => loadModule(select.value));
  }

  loadModule(requested);
});
