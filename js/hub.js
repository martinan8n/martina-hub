
  function route() {
    var hash = location.hash || "#/";
    var name = hash === "#/" || hash === "#" || hash === "" ? "home" : hash.replace(/^#\//, "");
    var sections = document.querySelectorAll("[data-route]");
    var matched = false;
    sections.forEach(function (el) {
      var isMatch = el.getAttribute("data-route") === name;
      el.classList.toggle("is-active", isMatch);
      if (isMatch) matched = true;
    });
    if (!matched) {
      document.querySelector('[data-route="home"]').classList.add("is-active");
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  function openBeforeModal(refId) {
    if (refId) {
      var ref = document.getElementById(refId);
      var modalImg = document.getElementById("beforeModalImg");
      if (ref && modalImg) modalImg.src = ref.src;
    }
    document.getElementById("beforeModal").classList.add("is-open");
  }
  function closeBeforeModal(e) {
    if (e) e.stopPropagation();
    document.getElementById("beforeModal").classList.remove("is-open");
  }
  function openWfModal(el) {
    var wf = el.querySelector(".wf");
    if (!wf) return;
    var clone = wf.cloneNode(true);
    clone.style.transform = "none";
    var body = document.getElementById("wfModalBody");
    body.innerHTML = "";
    body.appendChild(clone);
    document.getElementById("wfModal").classList.add("is-open");
  }
  function openMermaidModal(el) {
    var clone = el.cloneNode(true);
    var body = document.getElementById("wfModalBody");
    body.innerHTML = "";
    body.appendChild(clone);
    document.getElementById("wfModal").classList.add("is-open");
  }
  function closeWfModal(e) {
    if (e) e.stopPropagation();
    document.getElementById("wfModal").classList.remove("is-open");
  }
  function openApprovalDetailModal(e) {
    if (e) e.stopPropagation();
    document.getElementById("approvalDetailModal").classList.add("is-open");
  }
  function closeApprovalDetailModal(e) {
    if (e) e.stopPropagation();
    document.getElementById("approvalDetailModal").classList.remove("is-open");
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeBeforeModal(); closeAnnModal(); closeWfModal(); closeApprovalDetailModal(); }
  });

  function openAnnModal(sourceEl, kind) {
    var badge = document.getElementById("annModalBadge");
    var kicker = document.getElementById("annModalKicker");
    var body = document.getElementById("annModalBody");
    var jump = document.getElementById("annModalJump");
    document.querySelector(".ann-modal-content").classList.remove("is-sticky");
    var numEl = sourceEl.querySelector(".ann-num");
    var bodyEl = sourceEl.querySelector(".ann-body");
    badge.textContent = numEl ? numEl.textContent : "";
    badge.className = "ann-modal-badge" + (kind === "question" ? " is-question" : "");
    kicker.textContent = kind === "question" ? "Open question" : "What changed";
    body.innerHTML = bodyEl ? bodyEl.innerHTML : "";
    jump.style.display = "";
    jump.onclick = function (e) {
      e.preventDefault();
      closeAnnModal();
      sourceEl.scrollIntoView({ behavior: "smooth", block: "center" });
      sourceEl.classList.add("is-flashed");
      setTimeout(function () { sourceEl.classList.remove("is-flashed"); }, 1600);
    };
    document.getElementById("annModal").classList.add("is-open");
  }

  function openCritiqueDot(el) {
    var badge = document.getElementById("annModalBadge");
    var body = document.getElementById("annModalBody");
    var jump = document.getElementById("annModalJump");
    document.querySelector(".ann-modal-content").classList.add("is-sticky");
    badge.textContent = el.getAttribute("data-badge") || "?";
    badge.className = "ann-modal-badge";
    body.textContent = el.getAttribute("data-text") || "";
    jump.style.display = "none";
    document.getElementById("annModal").classList.add("is-open");
  }
  function closeAnnModal(e) {
    if (e) e.stopPropagation();
    var m = document.getElementById("annModal");
    if (m) m.classList.remove("is-open");
  }

  function goToWorkstream(e, cardId) {
    if (e) e.preventDefault();
    location.hash = "#/activation-rate";
    setTimeout(function () {
      var el = document.getElementById(cardId);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("is-flashed");
      setTimeout(function () { el.classList.remove("is-flashed"); }, 1600);
    }, 50);
  }

  (function initFormatToolbar() {
    var ta = document.getElementById("instructions-textarea");
    var tb = document.getElementById("fmt-toolbar");
    if (!ta || !tb) return;
    function hasRealSelection() {
      var sel = window.getSelection();
      return !!(sel && !sel.isCollapsed && sel.toString().trim().length > 0 && ta.contains(sel.anchorNode));
    }
    function check() { tb.classList.toggle("is-visible", hasRealSelection()); }
    ta.addEventListener("mouseup", check);
    ta.addEventListener("dblclick", check);
    document.addEventListener("selectionchange", function () {
      if (!hasRealSelection()) tb.classList.remove("is-visible");
    });
  })();

  function togglePvScreen(headEl) {
    var screen = headEl.closest(".pv-screen");
    var body = screen.querySelector(".pv-screen-body");
    var isOpen = body.classList.toggle("is-open");
    headEl.classList.toggle("is-open", isOpen);
    if (typeof fitWireframes === "function") fitWireframes();
  }

  function changePvState(btn, dir) {
    var wrap = btn.closest(".pv-toggle-wrap");
    var states = Array.prototype.slice.call(wrap.querySelectorAll(".pv-state"));
    var idx = states.findIndex(function (s) { return s.classList.contains("is-active"); });
    if (idx === -1) idx = 0;
    states[idx].classList.remove("is-active");
    var next = (idx + dir + states.length) % states.length;
    states[next].classList.add("is-active");
    var label = wrap.querySelector(".pv-toggle-nav .label");
    if (label) label.textContent = (next + 1) + " / " + states.length + " · " + states[next].getAttribute("data-label");
    if (typeof fitWireframes === "function") fitWireframes();
  }

  function gotoProtoState(el, state) {
    var wrap = el.closest(".proto-switch");
    wrap.querySelectorAll(".proto-state").forEach(function (s) {
      s.classList.toggle("is-active", s.getAttribute("data-state") === state);
    });
    if (typeof fitWireframes === "function") fitWireframes();
  }

  var FULLSCREEN_ICON = '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>';
  var MINIMIZE_ICON = '<path d="M4 14h6v6M20 10h-6V4M14 10 21 3M10 14 3 21"/>';

  function updateFullScreenIcons(panes) {
    var full = panes.classList.contains("is-fullscreen") ? panes.getAttribute("data-full") : null;
    panes.querySelectorAll(".icon-btn[data-pane]").forEach(function (btn) {
      var isThis = btn.getAttribute("data-pane") === full;
      var size = btn.getAttribute("data-size") || "15";
      btn.title = isThis ? "Exit full screen" : "Full screen";
      btn.innerHTML = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + (isThis ? MINIMIZE_ICON : FULLSCREEN_ICON) + '</svg>';
    });
  }

  var SURFACE_TITLES = { preview: "Preview", assistant: "AI Assistant" };

  function isSurfaceOn(panes, name) {
    return !panes.classList.contains("no-" + name);
  }

  function setSurfaceState(panes, name, on) {
    panes.classList.toggle("no-" + name, !on);
    panes.querySelectorAll('.pv-surface-icon[title="' + SURFACE_TITLES[name] + '"]').forEach(function (icon) {
      icon.classList.toggle("is-active", on);
    });
  }

  function snapshotSurface(panes, name) {
    panes.setAttribute("data-prev-" + name, isSurfaceOn(panes, name) ? "on" : "off");
  }

  function restoreSurface(panes, name) {
    var prev = panes.getAttribute("data-prev-" + name);
    if (prev !== null) {
      setSurfaceState(panes, name, prev === "on");
      panes.removeAttribute("data-prev-" + name);
    }
  }

  function toggleFullScreen(el, pane) {
    var panes = el.closest(".pv-panes");
    if (panes.classList.contains("is-fullscreen") && panes.getAttribute("data-full") === pane) {
      panes.classList.remove("is-fullscreen");
      panes.removeAttribute("data-full");
      restoreSurface(panes, "preview");
      restoreSurface(panes, "assistant");
    } else {
      snapshotSurface(panes, "preview");
      snapshotSurface(panes, "assistant");
      panes.classList.add("is-fullscreen");
      panes.setAttribute("data-full", pane);
      ["preview", "assistant"].forEach(function (name) {
        if (name !== pane) setSurfaceState(panes, name, false);
      });
    }
    updateFullScreenIcons(panes);
    if (typeof fitWireframes === "function") fitWireframes();
  }

  function toggleSurfacePane(el, name) {
    var panes = el.closest(".pv-panes");
    var turningOn = !isSurfaceOn(panes, name);
    setSurfaceState(panes, name, turningOn);
    if (turningOn) {
      panes.classList.remove("is-fullscreen");
      panes.removeAttribute("data-full");
    }
    updateFullScreenIcons(panes);
    if (typeof fitWireframes === "function") fitWireframes();
  }

  function togglePreview(el) { toggleSurfacePane(el, "preview"); }
  function toggleAssistantPane(el) { toggleSurfacePane(el, "assistant"); }

  function pvEmbedAssistToggle(paneId, iconEl) {
    var pane = document.getElementById(paneId);
    if (!pane) return;
    var showing = pane.style.display !== "none";
    pane.style.display = showing ? "none" : "flex";
    if (iconEl) iconEl.classList.toggle("is-active", !showing);
    if (typeof fitWireframes === "function") requestAnimationFrame(fitWireframes);
  }

  function changeCanvasState(dir) {
    var section = document.querySelector('[data-route="agent-tab"]');
    var canvas = section.querySelector(".canvas");
    var states = Array.prototype.slice.call(canvas.querySelectorAll(".canvas-state"));
    var idx = states.findIndex(function (s) { return s.classList.contains("is-active"); });
    if (idx === -1) idx = 0;
    states[idx].classList.remove("is-active");
    var next = (idx + dir + states.length) % states.length;
    states[next].classList.add("is-active");
    var count = section.querySelector(".state-nav .state-count");
    if (count) count.textContent = String(next + 1);
    var dot14 = document.getElementById("dot-14");
    if (dot14) dot14.style.display = next === 1 ? "" : "none";
    if (typeof fitWireframes === "function") fitWireframes();
  }

  function goToCanvasState(n) {
    var section = document.querySelector('[data-route="agent-tab"]');
    var canvas = section.querySelector(".canvas");
    var states = Array.prototype.slice.call(canvas.querySelectorAll(".canvas-state"));
    var idx = states.findIndex(function (s) { return s.classList.contains("is-active"); });
    if (idx === -1) idx = 0;
    changeCanvasState((n - 1) - idx);
    section.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function selectTab(el, name) {
    var tabbar = el.closest(".tabbar");
    tabbar.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
    el.classList.add("active");
    var body = tabbar.closest(".panel-body");
    body.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
    var panel = body.querySelector('.tab-panel[data-panel="' + name + '"]');
    if (panel) panel.classList.add("active");
    var frame = el.closest(".frame");
    if (frame) {
      frame.querySelectorAll(".annotation-dots").forEach(function (d) {
        d.style.display = d.getAttribute("data-for") === name ? "" : "none";
      });
    }
    if (typeof fitWireframes === "function") fitWireframes();
  }

  function toggleAdvanced(el) {
    el.classList.toggle("is-open");
    var body = el.nextElementSibling;
    if (body) body.classList.toggle("is-open");
    if (typeof fitWireframes === "function") fitWireframes();
  }

  function showOpenQuestion(n) {
    var el = document.getElementById("oq-" + n);
    if (!el) return;
    openAnnModal(el, "question");
  }

  function showAnnotation(n) {
    var el = document.getElementById("ann-" + n);
    if (!el) return;
    openAnnModal(el, "change");
  }

  function fitWireframes() {
    document.querySelectorAll(".wf-scale-wrap").forEach(function (wrap) {
      var inner = wrap.querySelector(".wf");
      if (!inner) return;
      inner.style.transform = "scale(1)";
      var naturalW = inner.scrollWidth;
      var naturalH = inner.scrollHeight;
      if (!naturalW || !naturalH) return;
      var scale = Math.min(1, wrap.clientWidth / naturalW);
      inner.style.transform = "scale(" + scale + ")";
      wrap.style.height = (naturalH * scale) + "px";
    });
  }
  window.addEventListener("resize", fitWireframes);
  window.addEventListener("hashchange", function () { requestAnimationFrame(fitWireframes); });

  function wfMarkAncestor(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    return el ? el.closest("mark.wf-hl") : null;
  }

  var WF_HL_KEY = "wf-highlights-v1";

  function wfHlLoad() {
    try {
      var raw = localStorage.getItem(WF_HL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function wfHlSave(list) {
    try { localStorage.setItem(WF_HL_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function wfHlSameRecord(a, b) {
    return a.containerPath === b.containerPath && a.text === b.text && a.occurrence === b.occurrence;
  }

  function wfHlPath(el) {
    var parts = [];
    var node = el;
    while (node && node.nodeType === 1) {
      if (node.id) { parts.unshift("#" + node.id); return parts.join(" > "); }
      if (node === document.body) { parts.unshift("body"); break; }
      var parent = node.parentElement;
      if (!parent) break;
      var siblings = Array.prototype.filter.call(parent.children, function (c) { return c.tagName === node.tagName; });
      var idx = siblings.indexOf(node) + 1;
      parts.unshift(node.tagName.toLowerCase() + ":nth-of-type(" + idx + ")");
      node = parent;
    }
    return parts.join(" > ");
  }

  function wfFlattenText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    var text = "";
    var n;
    while ((n = walker.nextNode())) {
      nodes.push({ node: n, start: text.length, end: text.length + n.nodeValue.length });
      text += n.nodeValue;
    }
    return { text: text, nodes: nodes };
  }

  function wfWrapFlatRange(nodes, start, end) {
    nodes.forEach(function (entry) {
      var s = Math.max(start, entry.start);
      var e = Math.min(end, entry.end);
      if (s >= e) return;
      var nodeRange = document.createRange();
      nodeRange.setStart(entry.node, s - entry.start);
      nodeRange.setEnd(entry.node, e - entry.start);
      var mark = document.createElement("mark");
      mark.className = "wf-hl";
      nodeRange.surroundContents(mark);
    });
  }

  function wfRecordForMark(mark) {
    var container = mark.parentElement;
    if (!container) return null;
    var containerPath = wfHlPath(container);
    var flat = wfFlattenText(container);
    var markTextNode = mark.firstChild;
    var entry = flat.nodes.filter(function (e) { return e.node === markTextNode; })[0];
    if (!entry) return null;
    var text = mark.textContent;
    var idx = -1, occ = 0;
    while (true) {
      idx = flat.text.indexOf(text, idx + 1);
      if (idx === -1) break;
      if (idx === entry.start) break;
      occ++;
    }
    return { containerPath: containerPath, text: text, occurrence: occ };
  }

  function wfRestoreHighlight(rec) {
    var container;
    try { container = document.querySelector(rec.containerPath); } catch (e) { return; }
    if (!container) return;
    var flat = wfFlattenText(container);
    var idx = -1;
    for (var i = 0; i <= rec.occurrence; i++) {
      idx = flat.text.indexOf(rec.text, idx + 1);
      if (idx === -1) return;
    }
    var end = idx + rec.text.length;
    var alreadyDone = flat.nodes.some(function (entry) {
      if (entry.end <= idx || entry.start >= end) return false;
      var el = entry.node.parentElement;
      return el && el.closest("mark.wf-hl");
    });
    if (alreadyDone) return;
    wfWrapFlatRange(flat.nodes, idx, end);
  }

  function wfRestoreAllHighlights() {
    wfHlLoad().forEach(wfRestoreHighlight);
  }

  function wfIntersectingTextNodes(range) {
    var root = range.commonAncestorContainer;
    var nodes = [];
    if (root.nodeType === 3) {
      nodes.push(root);
    } else {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      var n;
      while ((n = walker.nextNode())) {
        if (range.intersectsNode(n) && n.nodeValue.trim() !== "") nodes.push(n);
      }
    }
    return nodes;
  }

  function wfUnwrapMarkNoNormalize(mark) {
    var rec = wfRecordForMark(mark);
    var parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    if (rec) wfHlSave(wfHlLoad().filter(function (r) { return !wfHlSameRecord(r, rec); }));
  }

  function wfToggleHighlight(range) {
    var sel = window.getSelection();
    var textNodes = wfIntersectingTextNodes(range);
    if (!textNodes.length) return;

    var extents = textNodes.map(function (tn) {
      var start = tn === range.startContainer ? range.startOffset : 0;
      var end = tn === range.endContainer ? range.endOffset : tn.nodeValue.length;
      return { node: tn, start: start, end: end };
    }).filter(function (ext) { return ext.start < ext.end; });
    if (!extents.length) return;

    var touchedMarks = [];
    textNodes.forEach(function (tn) {
      var m = wfMarkAncestor(tn);
      if (m && touchedMarks.indexOf(m) === -1) touchedMarks.push(m);
    });

    var isPureToggleOff = false;
    if (touchedMarks.length === 1) {
      var mark0 = touchedMarks[0];
      var markTextNodes = [];
      var mw = document.createTreeWalker(mark0, NodeFilter.SHOW_TEXT, null, false);
      var mn;
      while ((mn = mw.nextNode())) markTextNodes.push(mn);
      var sameSet = markTextNodes.length === textNodes.length &&
        markTextNodes.every(function (n, idx) { return n === textNodes[idx]; });
      if (sameSet) {
        isPureToggleOff = extents[0].start === 0 && extents[extents.length - 1].end === textNodes[textNodes.length - 1].nodeValue.length;
      }
    }

    if (isPureToggleOff) {
      var mark = touchedMarks[0];
      var parent = mark.parentNode;
      var children = Array.prototype.slice.call(mark.childNodes);
      wfUnwrapMarkNoNormalize(mark);
      if (children.length && sel) {
        var undoRange = document.createRange();
        undoRange.setStartBefore(children[0]);
        undoRange.setEndAfter(children[children.length - 1]);
        parent.normalize();
        sel.removeAllRanges();
        sel.addRange(undoRange);
      } else {
        parent.normalize();
      }
      return;
    }

    // Partial overlap, multiple marks touched, or a fresh selection that includes
    // already-highlighted text: unwrap whatever is touched first so we never nest
    // marks, then wrap the full selection cleanly in one pass.
    touchedMarks.forEach(wfUnwrapMarkNoNormalize);

    var newRecords = [];
    var createdMarks = [];
    extents.forEach(function (ext) {
      var nodeRange = document.createRange();
      nodeRange.setStart(ext.node, ext.start);
      nodeRange.setEnd(ext.node, ext.end);
      var mark = document.createElement("mark");
      mark.className = "wf-hl";
      nodeRange.surroundContents(mark);
      createdMarks.push(mark);
      var rec = wfRecordForMark(mark);
      if (rec) newRecords.push(rec);
    });
    if (newRecords.length) wfHlSave(wfHlLoad().concat(newRecords));
    if (createdMarks.length && sel) {
      var newRange = document.createRange();
      newRange.setStartBefore(createdMarks[0]);
      newRange.setEndAfter(createdMarks[createdMarks.length - 1]);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }

  // Text-highlighter feature disabled 2026-09-03 — was firing on every normal text
  // selection (e.g. copying text to paste into chat), which got in the way while
  // building. Functions above are untouched; uncomment this block to re-enable.
  /*
  document.addEventListener("mouseup", function () {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    var range = sel.getRangeAt(0);
    var anchorNode = range.commonAncestorContainer;
    var anchorEl = anchorNode.nodeType === 1 ? anchorNode : anchorNode.parentElement;
    if (anchorEl && anchorEl.closest("[contenteditable], input, textarea")) return;
    wfToggleHighlight(range);
  });

  wfRestoreAllHighlights();
  window.addEventListener("hashchange", function () { requestAnimationFrame(wfRestoreAllHighlights); });
  */

  var LRT_PROTO_STEPS = [
    {
      surface: "Preview (full screen)",
      caption: "Preview (full screen), empty — the real empty state: a session chip up top, agent identity centered, nothing sent yet. Click the + to pick “Long-running task” explicitly — the pill appears right next to it — or just type without picking anything and let the agent judge complexity itself.",
      body: '<div class="pv-session-chip"><span class="avatar" style="width:26px;height:26px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v3"/><circle cx="12" cy="6" r="1.2" fill="currentColor" stroke="none"/><rect x="4" y="9" width="16" height="12" rx="3"/></svg></span>New session <span class="chev">&#8964;</span></div><div class="pv-preview-empty"><span class="avatar"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v3"/><circle cx="12" cy="6" r="1.2" fill="currentColor" stroke="none"/><rect x="4" y="9" width="16" height="12" rx="3"/></svg></span><div class="pv-preview-empty-name">Sales Outreach</div><div class="pv-preview-empty-sub">Send a message to start a conversation</div></div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "Implicit alternative: no mode picked. User sends a request that’s clearly more than a one-shot reply, so the agent judges complexity before responding.",
      body: '<div class="pv-bubble" style="margin:0 0 12px auto;">Find 500 leads at Series A SaaS companies in the US, check if they’re already using a competitor, and send a personalized outreach email to the good fits, with a note on why.</div><div class="lrt-thinking lrt-clickable-hint" style="cursor:pointer;" onclick="lrtProtoGo(2)" title="Click to continue">Judging complexity <span class="dot"></span><span class="dot"></span><span class="dot"></span></div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "Complex enough — the agent proposes a plan instead of a one-shot reply. Nothing has run yet. Same destination whether you arrived here explicitly (step 2) or implicitly (step 3).",
      body: '<div class="pv-bubble" style="margin:0 0 12px auto;">Find 500 leads at Series A SaaS companies in the US, check if they’re already using a competitor, and send a personalized outreach email to the good fits, with a note on why.</div><div class="lrt-plan-card"><p class="ask">This looks like it’ll take some real work. Here’s my plan — want me to go ahead?</p><ul><li><span class="marker"></span> Find Series A SaaS companies in the US, aiming for 500</li><li><span class="marker"></span> Check each one for existing use of a competitor</li><li><span class="marker"></span> Score the good fits and draft a one-line reason for each</li><li><span class="marker"></span> Send a personalized outreach email to the good fits</li></ul><div class="lrt-plan-actions" style="justify-content:space-between;"><span class="lrt-btn" onclick="lrtProtoGo(3)">&#9998; Edit plan</span><div style="display:flex; gap:8px;"><span class="lrt-btn" onclick="lrtProtoGo(0)">Cancel</span><span class="lrt-btn is-primary lrt-clickable-hint" onclick="lrtProtoGo(5)">Start</span></div></div></div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "Clicking “Edit plan” disables the plan card in place and drops an editing pill above the message box — same pattern as n8n’s other edit flows, and ChatGPT’s own plan editor. Type the change there and send it, same as any other message.",
      editPill: true,
      body: '<div class="pv-bubble" style="margin:0 0 12px auto;">Find 500 leads at Series A SaaS companies in the US, check if they’re already using a competitor, and send a personalized outreach email to the good fits, with a note on why.</div><div class="lrt-plan-card" style="opacity:0.45; pointer-events:none;"><p class="ask">This looks like it’ll take some real work. Here’s my plan — want me to go ahead?</p><ul><li><span class="marker"></span> Find Series A SaaS companies in the US, aiming for 500</li><li><span class="marker"></span> Check each one for existing use of a competitor</li><li><span class="marker"></span> Score the good fits and draft a one-line reason for each</li><li><span class="marker"></span> Send a personalized outreach email to the good fits</li></ul><div class="lrt-plan-actions" style="justify-content:space-between;"><span class="lrt-btn">&#9998; Edit plan</span><div style="display:flex; gap:8px;"><span class="lrt-btn">Cancel</span><span class="lrt-btn is-primary">Start</span></div></div></div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "The plan updates in place. Same two actions as before.",
      body: '<div class="pv-bubble" style="margin:0 0 12px auto;">Find 500 leads at Series A SaaS companies in the US, check if they’re already using a competitor, and send a personalized outreach email to the good fits, with a note on why.</div><div class="lrt-plan-card"><p class="ask">Updated — here’s the revised plan:</p><ul><li><span class="marker"></span> Find Series A SaaS companies in the US, aiming for <b>100</b></li><li><span class="marker"></span> Check each one for existing use of a competitor</li><li><span class="marker"></span> Score the good fits and draft a one-line reason for each</li><li><span class="marker"></span> Send a personalized outreach email to the good fits</li></ul><div class="lrt-plan-actions" style="justify-content:space-between;"><span class="lrt-btn" onclick="lrtProtoGo(3)">&#9998; Edit plan</span><div style="display:flex; gap:8px;"><span class="lrt-btn" onclick="lrtProtoGo(0)">Cancel</span><span class="lrt-btn is-primary lrt-clickable-hint" onclick="lrtProtoGo(5)">Start</span></div></div></div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "Approved. The agent confirms once, states the guardrails for this session, and starts. You can pause or edit the plan at any point while it runs.",
      body: '<div class="pv-reply" style="margin-bottom:10px;">I’ll start now. If something needs your approval, I’ll notify you via Slack DM — cost cap is $5.00 for this session (set in the Agent Author section below).</div><div class="lrt-progress-card" style="margin:0;"><div class="goal-row"><span>Goal: 100 qualified leads</span></div><div class="lrt-progress-steps"><span class="lrt-graph-node is-done">&#10003; Find leads</span><span class="lrt-graph-node is-active"><span class="lrt-spinner"></span> Check competitors</span><span class="lrt-graph-node">Score fits</span><span class="lrt-graph-node">Send outreach emails</span></div><div style="display:flex; align-items:center; gap:10px; margin:10px 0;"><div class="lrt-progress-bar" style="flex:1; margin:0;"><div class="lrt-progress-bar-fill is-nudging" style="width:30%;"></div></div><span class="lrt-pause-btn" style="cursor:pointer;" onclick="lrtProtoGo(8)" title="Pause"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg></span></div><div class="lrt-trace-link"><span style="cursor:pointer; text-decoration:underline;" onclick="lrtProtoGo(3)">&#9998; Edit plan</span></div></div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "A tool needs approval mid-run. Everything else keeps running in the background — trace, edit-plan, and pause stay available, same as the running state.",
      body: '<div class="lrt-progress-card" style="margin:0 0 10px;"><div class="goal-row"><span>Goal: 100 qualified leads</span></div><div class="lrt-progress-steps"><span class="lrt-graph-node is-done">&#10003; Find leads</span><span class="lrt-graph-node is-done">&#10003; Check competitors</span><span class="lrt-graph-node is-done">&#10003; Score fits</span><span class="lrt-graph-node is-waiting">Send outreach emails</span></div><div style="display:flex; align-items:center; gap:10px; margin:10px 0;"><div class="lrt-progress-bar" style="flex:1; margin:0;"><div class="lrt-progress-bar-fill is-stalled is-nudging" style="width:70%;"></div></div><span class="lrt-pause-btn" style="cursor:pointer;" onclick="lrtProtoGo(8)" title="Pause"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg></span></div><div class="lrt-trace-link"><span style="cursor:pointer; text-decoration:underline;" onclick="lrtProtoGo(3)">&#9998; Edit plan</span></div></div><div class="lrt-alert-card"><div class="lrt-alert-head"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>Needs your approval — <b>send_outreach_email</b> (23 companies)</div><div class="lrt-alert-details">&rsaquo; Sending a personalized outreach email to 23 companies, tagged “Series A SaaS — Q3 outreach,” each with a note on why it’s a good fit.</div><div class="lrt-alert-actions"><span class="lrt-btn">Reject</span><span class="lrt-btn is-primary lrt-clickable-hint" onclick="lrtProtoGo(7)">Approve</span></div></div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "Approved — the goal is met. The agent halts cleanly and reports the outcome.",
      body: '<div class="lrt-progress-card" style="margin:0 0 10px;"><div class="goal-row"><span>Goal: 100 qualified leads</span><span class="lrt-status-pill is-done">&#10003; Completed</span></div><div class="lrt-progress-steps"><span class="lrt-graph-node is-done">&#10003; Find leads</span><span class="lrt-graph-node is-done">&#10003; Check competitors</span><span class="lrt-graph-node is-done">&#10003; Score fits</span><span class="lrt-graph-node is-done">&#10003; Send outreach emails</span></div><div class="lrt-trace-link"><span style="cursor:pointer; text-decoration:underline;" onclick="lrtProtoGo(9)">&#8599; View summary</span></div></div><div class="pv-reply">Done — outreach emails sent to 100 qualified leads, each personalized with a one-line reason.</div>'
    },
    {
      surface: "Preview (full screen)",
      caption: "Paused — reachable any time while running (step 8). Nothing lost, resume picks up exactly where it left off.",
      body: '<div class="lrt-progress-card" style="margin:0;"><div class="goal-row"><span>Goal: 100 qualified leads</span><span class="lrt-status-pill is-paused">&#9679; Paused</span></div><div class="lrt-progress-steps"><span class="lrt-graph-node is-done">&#10003; Find leads</span><span class="lrt-graph-node">Check competitors</span><span class="lrt-graph-node">Score fits</span><span class="lrt-graph-node">Send outreach emails</span></div><div class="lrt-plan-actions" style="padding:0;"><span class="lrt-btn is-primary lrt-clickable-hint" onclick="lrtProtoGo(5)">Resume</span><span class="lrt-btn" onclick="lrtProtoGo(10)">Cancel</span></div></div>'
    },
    {
      isSummary: true,
      surface: "Preview (full screen)",
      caption: "Summary — click “View summary” from the Completed step. Opens as a real second column on the right."
    },
    {
      caption: "Cancelled by the author — ends the session for good, distinct from Pause (which can still be resumed).",
      body: '<div class="lrt-progress-card" style="margin:0;"><div class="goal-row"><span>Goal: 100 qualified leads</span><span class="lrt-status-pill is-cancelled">&#10005; Cancelled</span></div><div class="lrt-progress-steps"><span class="lrt-graph-node is-done">&#10003; Find leads</span><span class="lrt-graph-node">Check competitors</span><span class="lrt-graph-node">Score fits</span><span class="lrt-graph-node">Send outreach emails</span></div></div><div class="pv-reply">Cancelled &mdash; nothing further will run here. Send a new message whenever you&#39;re ready.</div>'
    },
    {
      caption: "A tool call itself can fail (an API error, a timeout) — different from Needs approval, which is a normal, expected pause point. Retry picks the same step back up; nothing before it is lost.",
      body: '<div class="lrt-progress-card" style="margin:0 0 10px;"><div class="goal-row"><span>Goal: 100 qualified leads</span><span class="lrt-status-pill is-failed">&#10005; Failed</span></div><div class="lrt-progress-steps"><span class="lrt-graph-node is-done">&#10003; Find leads</span><span class="lrt-graph-node is-failed">&#10005; Check competitors</span><span class="lrt-graph-node">Score fits</span><span class="lrt-graph-node">Send outreach emails</span></div></div><div class="lrt-alert-card"><div class="lrt-alert-head" style="color:#a62c2c;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>Failed &mdash; <b>check_competitor_usage</b> errored</div><div class="lrt-alert-details">&rsaquo; The competitor-check API timed out after 3 attempts. Nothing after this step has run.</div><div class="lrt-alert-actions"><span class="lrt-btn" onclick="lrtProtoGo(10)">Cancel</span><span class="lrt-btn is-primary lrt-clickable-hint" onclick="lrtProtoGo(5)">Retry</span></div></div>'
    }
  ];

  function lrtToggleMode() {
    var tag = document.getElementById("lrtModeTag");
    if (!tag) return;
    tag.style.display = tag.style.display === "none" ? "flex" : "none";
  }

  function showPvTopTab(idx) {
    document.querySelectorAll("#pvTopTabs .lrt-ref-tab").forEach(function (t) {
      t.classList.toggle("is-active", parseInt(t.getAttribute("data-tab"), 10) === idx);
    });
    document.querySelectorAll('[data-route="preview"] .pv-toppanel').forEach(function (p) {
      p.style.display = parseInt(p.getAttribute("data-panel"), 10) === idx ? "" : "none";
    });
    requestAnimationFrame(fitWireframes);
  }

  function pvFloatDragStart(e, id) {
    if (e.button !== 0) return;
    e.preventDefault();
    var panel = document.getElementById(id);
    if (!panel) return;
    var wf = panel.closest(".wf");
    var scale = 1;
    if (wf && wf.style.transform) {
      var m = /scale\(([\d.]+)\)/.exec(wf.style.transform);
      if (m) scale = parseFloat(m[1]) || 1;
    }
    var startX = e.clientX, startY = e.clientY;
    var startLeft = panel.offsetLeft, startTop = panel.offsetTop;
    function onMove(ev) {
      panel.style.left = Math.max(0, startLeft + (ev.clientX - startX) / scale) + "px";
      panel.style.top = Math.max(0, startTop + (ev.clientY - startY) / scale) + "px";
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function pvFloatToggle(panelId, launcherId) {
    var panel = document.getElementById(panelId);
    var launcher = document.getElementById(launcherId);
    if (!panel || !launcher) return;
    var showing = panel.style.display !== "none";
    panel.style.display = showing ? "none" : "flex";
    launcher.style.display = showing ? "flex" : "none";
  }

  function pvFloatExpand(panelId, launcherId, fullAssistId) {
    var panel = document.getElementById(panelId);
    var launcher = document.getElementById(launcherId);
    var full = document.getElementById(fullAssistId);
    if (panel) panel.style.display = "none";
    if (launcher) launcher.style.display = "none";
    if (full) full.style.display = "flex";
    requestAnimationFrame(fitWireframes);
  }

  function pvFloatCollapse(panelId, fullAssistId) {
    var panel = document.getElementById(panelId);
    var full = document.getElementById(fullAssistId);
    if (panel) panel.style.display = "flex";
    if (full) full.style.display = "none";
    requestAnimationFrame(fitWireframes);
  }

  function lrtShowPageTab(idx) {
    document.querySelectorAll("#lrtPageTabs .lrt-page-tab").forEach(function (t) {
      t.classList.toggle("is-active", parseInt(t.getAttribute("data-page-tab"), 10) === idx);
    });
    document.querySelectorAll(".lrt-page-panel").forEach(function (p) {
      p.style.display = parseInt(p.getAttribute("data-page-panel"), 10) === idx ? "" : "none";
    });
    requestAnimationFrame(fitWireframes);
  }

  function lrtShowRefTab(idx) {
    document.querySelectorAll(".lrt-ref-tab").forEach(function (t) {
      t.classList.toggle("is-active", parseInt(t.getAttribute("data-tab"), 10) === idx);
    });
    document.querySelectorAll(".lrt-ref-panel").forEach(function (p) {
      p.style.display = parseInt(p.getAttribute("data-panel"), 10) === idx ? "" : "none";
    });
    requestAnimationFrame(fitWireframes);
  }

  var LRT_CANVAS_DETAILS = {
    find: '<div class="lrt-alert-card"><div class="lrt-alert-head">&#10003; Find leads &mdash; completed</div><div class="lrt-alert-details" style="border-bottom:none;">Found 500 Series A SaaS companies in the US matching the criteria.</div></div>',
    check: '<div class="lrt-alert-card"><div class="lrt-alert-head"><span class="lrt-spinner"></span> Check competitors &mdash; running</div><div class="lrt-alert-details" style="border-bottom:none;">Checked 210 of 500 companies so far for existing competitor usage.</div></div>',
    enrich: '<div class="lrt-alert-card"><div class="lrt-alert-head"><span class="lrt-spinner"></span> Enrich firmographics &mdash; running</div><div class="lrt-alert-details" style="border-bottom:none;">Running in parallel with Check competitors. Pulling company size, funding stage, and tech stack for each match.</div></div>',
    score: '<div class="lrt-alert-card"><div class="lrt-alert-head">Score fits &mdash; not started</div><div class="lrt-alert-details" style="border-bottom:none;">Runs once Check competitors and Enrich firmographics both finish.</div></div>',
    send: '<div class="lrt-alert-card"><div class="lrt-alert-head"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>Needs your approval &mdash; <b>send_outreach_email</b> (23 companies)</div><div class="lrt-alert-details">&rsaquo; Sending a personalized outreach email to 23 companies, tagged &quot;Series A SaaS &mdash; Q3 outreach,&quot; each with a note on why it&#39;s a good fit.</div><div class="lrt-alert-actions"><span class="lrt-btn">Reject</span><span class="lrt-btn is-primary">Approve</span></div></div>'
  };
  function lrtShowCanvasDetail(key) {
    var panel = document.getElementById("lrtCanvasDetail");
    if (!panel) return;
    panel.innerHTML = LRT_CANVAS_DETAILS[key] || "";
    panel.style.display = "";
  }

  var LRT_V2_DETAILS = {
    find: '<div class="lrt-alert-card"><div class="lrt-alert-head">&#10003; Find leads &mdash; completed <span class="lrt-checkpoint" style="margin-left:6px;">&#9679;</span> checkpoint</div><div class="lrt-alert-details"><b>Why:</b> Started here since the goal needs a fixed list of companies before anything else can run.<br><b>Result:</b> Found 500 Series A SaaS companies in the US matching the criteria.</div><div class="lrt-alert-actions"><span class="lrt-btn is-primary">&#8618; Restart session from here</span></div></div>',
    check: '<div class="lrt-alert-card"><div class="lrt-alert-head"><span class="lrt-spinner"></span> Check competitors &mdash; running</div><div class="lrt-alert-details"><b>Why:</b> Excluding companies already on a competitor avoids wasting outreach on accounts we can&#39;t realistically win right now.<br><b>Result so far:</b> Checked 210 of 500 companies.</div></div>',
    enrich: '<div class="lrt-alert-card"><div class="lrt-alert-head"><span class="lrt-spinner"></span> Enrich firmographics &mdash; running</div><div class="lrt-alert-details"><b>Why:</b> Running alongside Check competitors, since neither depends on the other&#39;s result &mdash; no reason to wait.<br><b>Result so far:</b> Pulled company size, funding stage, and tech stack for 180 of 500.</div></div>',
    score: '<div class="lrt-alert-card"><div class="lrt-alert-head">Score fits &mdash; not started</div><div class="lrt-alert-details"><b>Why it waits:</b> Scoring needs both the competitor check and the firmographics enrichment finished first, so the ranking uses complete data.</div></div>',
    send: '<div class="lrt-alert-card"><div class="lrt-alert-head"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>Needs your approval &mdash; <b>send_outreach_email</b> (23 companies)</div><div class="lrt-alert-details"><b>Why it asks:</b> Sending a real email to an external recipient is a risky action &mdash; always confirmed, never pre-approved.<br>&rsaquo; Sending a personalized outreach email to 23 companies, tagged &quot;Series A SaaS &mdash; Q3 outreach,&quot; each with a note on why it&#39;s a good fit.</div><div class="lrt-alert-actions"><span class="lrt-btn">Reject</span><span class="lrt-btn is-primary">Approve</span></div></div>'
  };
  function lrtV2ShowNodeDetail(key) {
    var panel = document.getElementById("lrtV2NodeDetail");
    if (!panel) return;
    panel.innerHTML = LRT_V2_DETAILS[key] || "";
  }
  function lrtV3ShowNodeDetail(key) {
    var panel = document.getElementById("lrtV3NodeDetail");
    if (!panel) return;
    panel.innerHTML = LRT_V2_DETAILS[key] || "";
  }

  function lrtShowBoardDetail(key) {
    var panel = document.getElementById("lrtBoardDetail");
    if (!panel) return;
    panel.innerHTML = LRT_CANVAS_DETAILS[key] || "";
    panel.style.display = "";
  }

  var lrtCurrentStep = 0;

  function lrtProtoSend() {
    var editPill = document.getElementById("lrtProtoEditPill");
    var modeTag = document.getElementById("lrtModeTag");
    if (editPill && editPill.style.display !== "none") {
      lrtProtoGo(4);
    } else if (lrtCurrentStep === 0) {
      if (modeTag && modeTag.style.display !== "none") {
        lrtProtoGo(2);
      } else {
        lrtProtoGo(1);
      }
    }
  }

  function lrtProtoGo(i) {
    var body = document.getElementById("lrtProtoBody");
    var caption = document.getElementById("lrtProtoCaption");
    var previewView = document.getElementById("lrtProtoPreviewView");
    var editPill = document.getElementById("lrtProtoEditPill");
    var summaryPanel = document.getElementById("lrtProtoSummaryPanel");
    var chatFooter = document.getElementById("lrtProtoChatFooter");
    if (!body || !LRT_PROTO_STEPS[i]) return;
    lrtCurrentStep = i;
    var step = LRT_PROTO_STEPS[i];
    if (editPill) editPill.style.display = step.editPill ? "flex" : "none";
    previewView.style.display = "";
    if (chatFooter) chatFooter.style.right = step.isSummary ? "210px" : "0";
    if (step.isSummary) {
      body.innerHTML = LRT_PROTO_STEPS[7].body;
      if (summaryPanel) {
        summaryPanel.style.display = "";
        summaryPanel.innerHTML = '<div class="lrt-proto-side-title" style="margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">Summary <span style="cursor:pointer; font-weight:400;" onclick="lrtProtoGo(7)" title="Close">&#10005;</span></div><p class="hint" style="margin:0 0 8px;">Goal: 100 qualified leads</p><ul style="margin:0 0 10px; padding-left:16px; font-size:12px; color:var(--ink-soft);"><li>&#10003; Find leads &mdash; 500 companies found</li><li>&#10003; Check competitors &mdash; excluded 340 already using a competitor</li><li>&#10003; Score fits &mdash; 100 scored as good fits</li><li>&#10003; Send outreach emails &mdash; 100 personalized emails sent</li></ul><p class="hint" style="margin:0;">Done &mdash; outreach emails sent to 100 qualified leads, each personalized with a one-line reason.</p>';
      }
    } else {
      body.innerHTML = step.body;
      if (summaryPanel) summaryPanel.style.display = "none";
    }
    caption.textContent = step.caption;
    var modeTag = document.getElementById("lrtModeTag");
    if (modeTag) modeTag.style.display = step.modeTag ? "flex" : "none";
    var buttons = document.querySelectorAll(".lrt-proto-step");
    buttons.forEach(function (b) {
      b.classList.toggle("is-active", parseInt(b.getAttribute("data-step"), 10) === i);
    });
  }

  (function initLrtProto() {
    var controls = document.getElementById("lrtProtoControls");
    if (!controls) return;
    // Only a few steps get their own dot: everything else is reachable by actually
    // clicking through the interface (send, Edit plan, Start, Pause, Cancel, etc.).
    // These are the ones nothing links to, plus Summary (9) since its left/right
    // split layout is worth calling out on its own: the starting point, the implicit
    // path (second way in, via judging complexity), Summary, and two narrative-only
    // states with no in-UI trigger (Needs approval, Failed).
    var keep = [0, 1, 6, 9, 11];
    for (var k = 0; k < keep.length; k++) {
      var i = keep[k];
      if (k > 0) {
        var arrow = document.createElement("span");
        arrow.className = "lrt-proto-step-arrow";
        arrow.textContent = "→";
        controls.appendChild(arrow);
      }
      var btn = document.createElement("span");
      btn.className = "lrt-proto-step";
      btn.setAttribute("data-step", i);
      btn.textContent = k + 1;
      btn.onclick = (function (idx) { return function () { lrtProtoGo(idx); }; })(i);
      controls.appendChild(btn);
    }
    lrtProtoGo(0);
  })();

  var LRT_AUTHOR_STEPS = [
    { caption: "Author, build time, in Agent builder. Turns on Long-running task mode, sets the budget ceiling, says where to be notified — all before anyone ever talks to the agent. In reality these could also be set by prompting the Agent builder’s own assistant, not just this form — not depicted here." },
    { isRunningCard: true, caption: "Once a session is running, the Author switches to Preview to check on it — the same compact status card a Consumer would see, plus a shortcut straight into the full Trace." },
    { isApprovalMode: true, caption: "" },
    { caption: "Author-only: the session hits its own cost cap ($5.00, set just above) with work still left. It warns and asks before stopping for good, rather than silently halting." },
    { isTrace: true, caption: "The Trace, with progress — the Author's view of any session. A persistent goal header and status/medium pills sit above the scrubber; subtask groups sit over the step list." },
    { isCanvasTrace: true, caption: "An alternate view of the same trace as a canvas instead of a list — closer to the Darwin tracing exploration. Still exploratory, shown here as a version of the trace rather than a separate concept." },
    { isBoardTrace: true, caption: "A third way to present the same trace — a Kanban board, grouped by status instead of time (list) or dependency (canvas). Not a switcher between the three — a separate, standalone way to show it, same as Canvas." },
    { isAssistantEdit: true, caption: "Editing the plan from the Trace view opens the AI Assistant on the left instead of reusing the chat footer — the editing pill lives in the Assistant’s own textarea. The trace stays visible (dimmed) on the right for reference." }
  ];

  function lrtAuthorGo(i) {
    var settingsView = document.getElementById("lrtAuthorSettingsView");
    var runningView = document.getElementById("lrtAuthorRunningView");
    var approvalModeView = document.getElementById("lrtAuthorApprovalModeView");
    var costCapView = document.getElementById("lrtAuthorCostCapView");
    var traceView = document.getElementById("lrtProtoTraceView");
    var canvasView = document.getElementById("lrtProtoCanvasView");
    var boardView = document.getElementById("lrtProtoBoardView");
    var assistantEditView = document.getElementById("lrtProtoAssistantEditView");
    var outerTopbar = document.getElementById("lrtAuthorOuterTopbar");
    var protoSide = document.getElementById("lrtAuthorProtoSide");
    var caption = document.getElementById("lrtAuthorProtoCaption");
    if (!settingsView || !LRT_AUTHOR_STEPS[i]) return;
    var step = LRT_AUTHOR_STEPS[i];
    settingsView.style.display = i === 0 ? "" : "none";
    runningView.style.display = step.isRunningCard ? "" : "none";
    approvalModeView.style.display = step.isApprovalMode ? "" : "none";
    costCapView.style.display = i === 3 ? "flex" : "none";
    traceView.style.display = step.isTrace ? "" : "none";
    canvasView.style.display = step.isCanvasTrace ? "" : "none";
    boardView.style.display = step.isBoardTrace ? "" : "none";
    assistantEditView.style.display = step.isAssistantEdit ? "" : "none";
    if (outerTopbar) outerTopbar.style.display = (i === 3 || step.isRunningCard || step.isTrace || step.isCanvasTrace || step.isBoardTrace || step.isAssistantEdit) ? "none" : "";
    if (protoSide) {
      if (step.isTrace) {
        protoSide.style.display = "";
        protoSide.innerHTML = '<div class="lrt-proto-side-title">Variant 1 &mdash; list view</div><p class="hint" style="margin:0;">The default trace: subtasks and tool calls in a single scrollable list, in time order.</p>';
      } else if (step.isCanvasTrace) {
        protoSide.style.display = "";
        protoSide.innerHTML = '<div class="lrt-proto-side-title">Variant 2 &mdash; canvas view</div><p class="hint" style="margin:0;">Same trace, as nodes instead of a list &mdash; closer to the Darwin tracing exploration. Branching, not a line: two subtasks can run side by side, and a node waiting on approval is a real state here too. Click a node to see what&#39;s happening inside it.</p>';
      } else if (step.isBoardTrace) {
        protoSide.style.display = "";
        protoSide.innerHTML = '<div class="lrt-proto-side-title">Variant 3 &mdash; kanban view</div><p class="hint" style="margin:0;">Same trace again, grouped by status (To do / Running / Needs approval / Done) instead of time or dependency. Click a card to see what&#39;s happening inside it.</p>';
      } else if (step.isApprovalMode) {
        protoSide.style.display = "";
        protoSide.innerHTML = '<div class="lrt-proto-side-title">Reference</div><p class="hint" style="margin:0 0 8px;">Same idea as GitHub Copilot&#39;s session-mode picker (Interactive / Plan / Autopilot) &mdash; framed here around risk instead of review cadence.</p><p class="hint" style="margin:0; font-style:italic; cursor:pointer; text-decoration:underline;" onclick="openApprovalDetailModal(event)">See the full comparison &rarr;</p>';
      } else {
        protoSide.style.display = "none";
      }
    }
    if (step.isCanvasTrace) {
      var canvasDetail = document.getElementById("lrtCanvasDetail");
      if (canvasDetail) canvasDetail.style.display = "none";
    }
    if (step.isBoardTrace) {
      var boardDetail = document.getElementById("lrtBoardDetail");
      if (boardDetail) boardDetail.style.display = "none";
    }
    caption.textContent = step.caption;
    var buttons = document.querySelectorAll("#lrtAuthorProtoControls .lrt-proto-step");
    buttons.forEach(function (b) {
      b.classList.toggle("is-active", parseInt(b.getAttribute("data-step"), 10) === i);
    });
    if (typeof fitWireframes === "function") requestAnimationFrame(fitWireframes);
  }

  (function initLrtAuthorProto() {
    var controls = document.getElementById("lrtAuthorProtoControls");
    if (!controls) return;
    for (var i = 0; i < LRT_AUTHOR_STEPS.length; i++) {
      if (i > 0) {
        var arrow = document.createElement("span");
        arrow.className = "lrt-proto-step-arrow";
        arrow.textContent = "→";
        controls.appendChild(arrow);
      }
      var btn = document.createElement("span");
      btn.className = "lrt-proto-step";
      btn.setAttribute("data-step", i);
      btn.textContent = i + 1;
      btn.onclick = (function (idx) { return function () { lrtAuthorGo(idx); }; })(i);
      controls.appendChild(btn);
    }
    lrtAuthorGo(0);
  })();

  var BN_TRACE_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12h-8"/><path d="M21 6h-8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/><circle cx="5" cy="6" r="2"/></svg>';
  var BN_NEWCHAT_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/><path d="M12 8v4M10 10h4"/></svg>';
  var BN_DOCK_HEADER = '<div style="display:flex; align-items:center; gap:6px; padding:8px 12px; border-bottom:1px solid var(--line);"><span style="font-size:12.5px; text-decoration:underline; cursor:pointer;">SESSION_NAME &#9662;</span><span class="spacer" style="flex:1;"></span><span class="icon-btn" title="View trace" style="cursor:pointer;" onclick="TRACE_CLICK">' + BN_TRACE_ICON + '</span><span class="icon-btn" title="New chat" style="cursor:pointer;">' + BN_NEWCHAT_ICON + '</span></div>';
  var BN_DOCK_CHAT_LEADS = '<div style="padding:12px 14px; overflow:auto; flex:1;"><div class="pv-bubble" style="margin:0 0 10px auto; font-size:12px;">Find 100 qualified leads and send outreach emails.</div><div class="pv-reply" style="font-size:12px;">Working on it &mdash; I&#39;ll keep you posted.</div></div>';
  var BN_DOCK_CHAT_DIGEST = '<div style="padding:12px 14px; overflow:auto; flex:1;"><div class="pv-bubble" style="margin:0 0 10px auto; font-size:12px;">Run the weekly digest.</div><div class="pv-reply" style="font-size:12px;">Done &mdash; posted the Monday digest to #sales-outreach.</div></div>';
  var BN_DOCK_CHAT_EMPTY = '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; padding:30px 20px; text-align:center;"><span class="avatar" style="margin-bottom:8px;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v3"/><circle cx="12" cy="6" r="1.2" fill="currentColor" stroke="none"/><rect x="4" y="9" width="16" height="12" rx="3"/></svg></span><div style="font-size:12.5px; color:var(--ink-faint);">New session &mdash; send a message to start</div></div>';
  var BN_DOCK_FOOTER = '<div class="pv-chat-footer"><div class="box"><div>Message Sales Outreach&hellip;</div><div class="box-actions"><span class="spacer"></span><span class="send-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg></span></div></div></div>';

  var BN_AGENT_CONFIG = '<div style="padding:18px 24px; overflow:auto; flex:1;">' +
    '<div class="agent-head"><div class="avatar"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v3"/><circle cx="12" cy="6" r="1.2" fill="currentColor" stroke="none"/><rect x="4" y="9" width="16" height="12" rx="3"/></svg></div><h2>Sales Outreach</h2></div>' +
    '<div class="tabbar"><span class="tab active">Agent</span><span class="tab">Knowledge</span><span class="tab">Sessions</span><span class="tab">Settings</span></div>' +
    '<div class="field-label">Channels</div>' +
    '<div style="margin-bottom:8px;"><span class="run-btn" style="cursor:pointer; padding:5px 12px; font-size:12.5px;" onclick="bnTraceGo(0)"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M6 4.5v15l13-7.5Z"/></svg> Preview</span></div>' +
    '<div class="pv-add-channel" style="max-width:260px;"><div class="row"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg> Add channel</div><div class="hint">Slack, Telegram, Linear, 1 more</div></div>' +
    '</div>';

  function bnTraceLog(rows) {
    var html = '<div class="pv-trace-scrubber" style="margin:14px 20px 0;"><div class="pv-trace-seg is-a" style="flex:2;"></div><div class="pv-trace-seg is-idle" style="flex:1;"></div><div class="pv-trace-seg is-b" style="flex:6;"></div></div><div class="pv-trace-list">';
    rows.forEach(function (r) { html += '<div class="pv-trace-row"><div class="who">' + r[0] + '</div><span class="time">' + r[1] + '</span></div>'; });
    return html + '</div>';
  }

  var BN_LEADS_TRACE = bnTraceLog([["search_companies", "17:00:12"], ["search_companies", "17:00:16"], ["check_competitor_usage", "17:00:29"]]);
  var BN_DIGEST_TRACE = bnTraceLog([["read_slack_channel", "09:00:02"], ["draft_digest", "09:00:14"], ["post_message", "09:00:21"]]);

  var BN_TP_STEPS = [
    {
      caption: "Preview docked open, always docked — no layout-mode option, no full-page. Trace icon is a real active toggle now, shown pressed since the trace panel is currently open.",
      content: '<div style="flex:1.4; min-width:0; overflow:auto;">' + BN_LEADS_TRACE + '</div><div style="flex:1; min-width:0; max-width:320px; border-left:1px solid var(--line); display:flex; flex-direction:column;">' +
        BN_DOCK_HEADER.replace("SESSION_NAME", "Find 100 qualified leads").replace("TRACE_CLICK", "bnTraceGo(1)") +
        BN_DOCK_CHAT_LEADS + BN_DOCK_FOOTER + '</div>',
      dockOpen: true,
      annotate: "trace-active"
    },
    {
      caption: "Clicking the trace icon collapses the trace panel — the agent view underneath appears instead. A real toggle, not a dead click.",
      content: '<div style="flex:1.6; min-width:0; display:flex; flex-direction:column;">' + BN_AGENT_CONFIG + '</div><div style="flex:1; min-width:0; max-width:320px; border-left:1px solid var(--line); display:flex; flex-direction:column;">' +
        BN_DOCK_HEADER.replace("SESSION_NAME", "Find 100 qualified leads").replace("TRACE_CLICK", "bnTraceGo(0)") +
        BN_DOCK_CHAT_LEADS + BN_DOCK_FOOTER + '</div>',
      dockOpen: true
    },
    {
      caption: "Switching session inside the dock (Weekly Monday digest) updates the trace panel too — both sides always agree on which session is showing.",
      content: '<div style="flex:1.4; min-width:0; overflow:auto;">' + BN_DIGEST_TRACE + '</div><div style="flex:1; min-width:0; max-width:320px; border-left:1px solid var(--line); display:flex; flex-direction:column;">' +
        BN_DOCK_HEADER.replace("SESSION_NAME", "Weekly Monday digest").replace("TRACE_CLICK", "bnTraceGo(1)") +
        BN_DOCK_CHAT_DIGEST + BN_DOCK_FOOTER + '</div>',
      dockOpen: true
    },
    {
      caption: "A new session with no messages yet gets a real empty state in the trace panel (Martina's addition, not in the ticket text) instead of going blank.",
      content: '<div style="flex:1.4; min-width:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px;"><span class="avatar" style="margin-bottom:10px;">' + BN_TRACE_ICON.replace('width="13" height="13"', 'width="22" height="22"') + '</span><div style="font-size:13px; color:var(--ink-faint);">When you talk to your agent, the trace will appear here</div></div><div style="flex:1; min-width:0; max-width:320px; border-left:1px solid var(--line); display:flex; flex-direction:column;">' +
        BN_DOCK_HEADER.replace("SESSION_NAME", "New session").replace("TRACE_CLICK", "bnTraceGo(1)") +
        BN_DOCK_CHAT_EMPTY + BN_DOCK_FOOTER + '</div>',
      dockOpen: true
    }
  ];

  function bnTraceGo(i) {
    var content = document.getElementById("bnTpContent");
    var caption = document.getElementById("bnTpCaption");
    var topPreviewBtn = document.getElementById("bnTpTopPreviewBtn");
    if (!content || !BN_TP_STEPS[i]) return;
    var step = BN_TP_STEPS[i];
    content.innerHTML = step.content;
    caption.textContent = step.caption;
    if (topPreviewBtn) topPreviewBtn.style.cssText = "cursor:pointer; margin-right:6px;" + (step.dockOpen ? "background:#e2e2e2; border:1px solid var(--line); border-radius:6px;" : "");
    if (step.annotate === "trace-active") {
      var traceIconActive = content.querySelector('.icon-btn[title="View trace"]');
      if (traceIconActive) traceIconActive.style.cssText += "background:#e2e2e2; border:1px solid var(--line); border-radius:6px;";
    }
    var buttons = document.querySelectorAll("#bnTpControls .lrt-proto-step");
    buttons.forEach(function (b) {
      b.classList.toggle("is-active", parseInt(b.getAttribute("data-step"), 10) === i);
    });
    requestAnimationFrame(fitWireframes);
  }

  (function initBnTraceProto() {
    var controls = document.getElementById("bnTpControls");
    if (!controls) return;
    for (var i = 0; i < BN_TP_STEPS.length; i++) {
      if (i > 0) {
        var arrow = document.createElement("span");
        arrow.className = "lrt-proto-step-arrow";
        arrow.textContent = "→";
        controls.appendChild(arrow);
      }
      var btn = document.createElement("span");
      btn.className = "lrt-proto-step";
      btn.setAttribute("data-step", i);
      btn.textContent = i + 1;
      btn.onclick = (function (idx) { return function () { bnTraceGo(idx); }; })(i);
      controls.appendChild(btn);
    }
    bnTraceGo(0);
  })();

  var CH_NEW_CHAT_RECENT = {
    aia: {
      name: "AI Assistant",
      pillIcon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5Z"/></svg>',
      pillBg: "#eef4ff", pillColor: "#3b82f6",
      rows: [
        { icon: "chat", title: "Fix broken canonical tags", detail: "Manual", date: "2d" },
        { icon: "chat", title: "Retry logic for HTTP node", detail: "Manual", date: "6d" },
        { icon: "clock", title: "Weekly workflow health check", detail: "Every Monday at 9:00 AM", date: "1w" }
      ]
    },
    seo: {
      name: "SEO Auditor",
      pillIcon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 8V4M9 4h6"/></svg>',
      pillBg: "#e5484d", pillColor: "#fff",
      rows: [
        { icon: "clock", title: "Audit /pricing metadata", detail: "Every week on Friday at 7:00 AM", date: "3d" },
        { icon: "chat", title: "Check canonical tags on blog", detail: "Manual", date: "1w" },
        { icon: "chat", title: "Audit new landing pages", detail: "Requested by Maya Chen", date: "Aug 21" }
      ]
    }
  };
  var CH_NEW_CHAT_ICONS = {
    chat: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" stroke-width="2"><path d="M4 5h16v11H8l-4 3V5Z"/></svg>',
    clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'
  };
  function chSelectAgent(key) {
    var d = CH_NEW_CHAT_RECENT[key];
    if (!d) return;
    var label = document.getElementById("chNewChatAgentPillLabel");
    var heading = document.getElementById("chNewChatRecentAgent");
    var list = document.getElementById("chNewChatRecentList");
    var pill = document.getElementById("chNewChatAgentPill");
    var pillIcon = document.getElementById("chNewChatAgentPillIcon");
    if (label) label.textContent = d.name;
    if (heading) heading.textContent = d.name;
    if (pillIcon) pillIcon.innerHTML = d.pillIcon;
    if (pill) { pill.style.background = d.pillBg; pill.style.color = d.pillColor; }
    if (list) {
      list.innerHTML = d.rows.map(function (r) {
        return '<div style="display:flex; align-items:center; gap:8px; padding:6px 2px; font-size:12.5px; border-top:1px solid var(--line);">' +
          CH_NEW_CHAT_ICONS[r.icon] +
          '<span style="font-weight:600;">' + r.title + '</span>' +
          '<span style="color:var(--ink-faint);">&mdash; ' + r.detail + '</span>' +
          '<span class="spacer" style="flex:1;"></span>' +
          '<span style="color:var(--ink-faint); font-size:11.5px;">' + r.date + '</span></div>';
      }).join("");
    }
  }

  route();
  requestAnimationFrame(fitWireframes);
