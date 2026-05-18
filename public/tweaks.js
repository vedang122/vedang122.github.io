// Vedang.dev — tweaks panel (vanilla, cross-page via localStorage)
(function () {
  const KEY = "vedang_tweaks_v1";
  const defaults = { accent: "violet", density: "comfortable", theme: "light" };
  const load = () => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
    catch { return { ...defaults }; }
  };
  const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));
  const apply = (s) => {
    const r = document.documentElement;
    r.setAttribute("data-accent", s.accent);
    r.setAttribute("data-density", s.density);
    r.setAttribute("data-theme", s.theme);
  };

  let state = load();
  apply(state);

  // Build panel
  function mountPanel() {
    const panel = document.createElement("div");
    panel.className = "tw-panel";
    panel.innerHTML = `
      <div class="tw-head"><b>// Tweaks</b><button class="tw-x" aria-label="Close">×</button></div>
      <div class="tw-body">
        <div class="tw-row">
          <span class="lab">Accent</span>
          <div class="tw-swatches" data-group="accent">
            <button class="tw-sw" data-v="violet" style="background:#7c3aed" title="violet"></button>
            <button class="tw-sw" data-v="orange" style="background:#ff5b1f" title="orange"></button>
            <button class="tw-sw" data-v="blue"   style="background:#1f6feb" title="blue"></button>
            <button class="tw-sw" data-v="green"  style="background:#0a7f5f" title="green"></button>
          </div>
        </div>
        <div class="tw-row">
          <span class="lab">Density</span>
          <div class="tw-seg" data-group="density">
            <button data-v="comfortable">Comfort</button>
            <button data-v="compact">Compact</button>
          </div>
        </div>
        <div class="tw-row">
          <span class="lab">Theme</span>
          <div class="tw-seg" data-group="theme">
            <button data-v="light">Light</button>
            <button data-v="dark">Dark</button>
          </div>
        </div>
        <div class="tw-row" style="color:var(--muted);font-size:10px;line-height:1.5;letter-spacing:.06em;text-transform:uppercase;">
          Synced across pages via localStorage.
        </div>
      </div>`;
    document.body.appendChild(panel);

    const sync = () => {
      panel.querySelectorAll(".tw-sw").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === state.accent ? "true" : "false"));
      panel.querySelectorAll('[data-group="density"] button').forEach(b => b.setAttribute("aria-pressed", b.dataset.v === state.density ? "true" : "false"));
      panel.querySelectorAll('[data-group="theme"] button').forEach(b => b.setAttribute("aria-pressed", b.dataset.v === state.theme ? "true" : "false"));
    };
    sync();

    panel.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-v]");
      if (btn) {
        const group = btn.parentElement.dataset.group;
        state[group] = btn.dataset.v;
        save(state); apply(state); sync();
        return;
      }
      if (e.target.closest(".tw-x")) {
        panel.classList.remove("open");
        window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
      }
    });

    // Host integration
    window.addEventListener("message", (ev) => {
      const t = ev?.data?.type;
      if (t === "__activate_edit_mode") panel.classList.add("open");
      if (t === "__deactivate_edit_mode") panel.classList.remove("open");
    });
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountPanel);
  } else {
    mountPanel();
  }
})();
