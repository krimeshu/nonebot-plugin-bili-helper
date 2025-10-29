{
  window.ScriptsModule = {};
  module = { exports: window.ScriptsModule };

  const renderTemplates = [];

  // const { origin } = window.location;

  module.exports.cleanupBeforeRender = function cleanupBeforeRender() {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach((child) => {
      document.body.removeChild(child);
    });
  };

  module.exports.createTemplate = function createTemplate(id = '', content = '') {
    const script = document.createElement('script');
    script.id = id;
    script.type = 'text/html';
    script.innerHTML = content;
    document.body.appendChild(script);
    renderTemplates.push(script);
  };

  module.exports.loadTemplate = async function loadTemplate(src = '') {
    const text = await fetch(src).then((res) => res.text());
    module.exports.createTemplate(`${window.location.origin}${src}`, text);
  };

  module.exports.loadTemplates = async function loadTemplates(list = [], cb = null) {
    await list.reduce((p, src) => p.then(() => loadTemplate(src)), Promise.resolve());
    cb?.();
  };

  module.exports.cleanupAfterRender = function cleanupAfterRender() {
    renderTemplates.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    renderTemplates.length = 0;
  };
}
