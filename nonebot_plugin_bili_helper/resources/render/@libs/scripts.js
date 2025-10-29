const renderTemplates = [];

const { origin } = window.location;

export function cleanupBeforeRender() {
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach((child) => {
    document.body.removeChild(child);
  });
}

async function createTemplate(id = '', content = '') {
  const script = document.createElement('script');
  script.id = id;
  script.type = 'text/html';
  script.innerHTML = content;
  document.body.appendChild(script);
  renderTemplates.push(script);
}

async function loadTemplate(src = '') {
  const text = await fetch(src).then((res) => res.text());
  createTemplate(`${origin}${src}`, text);
}

export async function loadTemplates(list = [], cb = null) {
  await list.reduce((p, src) => p.then(() => loadTemplate(src)), Promise.resolve());
  cb?.();
}

export function cleanupAfterRender() {
  renderTemplates.forEach((script) => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  });
  renderTemplates.length = 0;
}
