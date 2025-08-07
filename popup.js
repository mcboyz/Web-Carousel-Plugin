let config = {};

function saveConfig() {
  chrome.storage.local.set({ tabRotatorConfig: config });
}

function loadTabs(filter = "") {
  chrome.tabs.query({ currentWindow: true }, tabs => {
    const container = document.getElementById("tabList");
    container.innerHTML = "";

    tabs.forEach(tab => {
      if (!tab.url.startsWith("http")) return;
      if (filter && !tab.title.toLowerCase().includes(filter.toLowerCase())) return;

      const entry = document.createElement("div");
      entry.className = "tab-entry";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = config[tab.id]?.enabled || false;
      checkbox.addEventListener("change", () => {
        config[tab.id] = config[tab.id] || {};
        config[tab.id].enabled = checkbox.checked;
        saveConfig();
      });

      const title = document.createElement("div");
      title.className = "tab-title";
      title.textContent = tab.title;

      const duration = document.createElement("input");
      duration.type = "number";
      duration.value = config[tab.id]?.duration || 7000;
      duration.min = 1000;
      duration.addEventListener("change", () => {
        config[tab.id] = config[tab.id] || {};
        config[tab.id].duration = parseInt(duration.value);
        saveConfig();
      });

      entry.appendChild(checkbox);
      entry.appendChild(title);
      entry.appendChild(duration);
      container.appendChild(entry);
    });
  });
}

document.getElementById("search").addEventListener("input", e => {
  loadTabs(e.target.value);
});

document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start" });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stop" });
});

chrome.storage.local.get("tabRotatorConfig", data => {
  config = data.tabRotatorConfig || {};
  loadTabs();
});
