let config = {};
let timer = null;
let currentIndex = 0;
let activeTabs = [];

function rotate() {
  if (activeTabs.length === 0) return;

  const tab = activeTabs[currentIndex];
  chrome.tabs.update(tab.tabId, { active: true });

  const duration = config[tab.tabId]?.duration || 7000;

  currentIndex = (currentIndex + 1) % activeTabs.length;
  timer = setTimeout(rotate, duration);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start") {
    chrome.storage.local.get("tabRotatorConfig", data => {
      config = data.tabRotatorConfig || {};
      chrome.tabs.query({ currentWindow: true }, tabs => {
        activeTabs = tabs
          .filter(t => config[t.id]?.enabled)
          .map(t => ({ tabId: t.id }));

        currentIndex = 0;
        clearTimeout(timer);
        rotate();
      });
    });
  } else if (msg.action === "stop") {
    clearTimeout(timer);
  }
});
