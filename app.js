(function () {
  'use strict';
  var D = window.VPS_DATA, C = window.VPS_COMPILER;
  var $ = function (id) { return document.getElementById(id); };
  var state = { language: 'zh', lightingDirty: false, moodDirty: false };
  var SAVE_KEY = 'vps-saved-v1';

  // Purchase links — the ONLY place buy URLs live. Placeholder slugs until the
  // real Gumroad listings exist; swap both values here when they do.
  const BUY_URLS = { starter: "https://gumroad.com/l/ebcjyh", full: "https://gumroad.com/l/vneevp" };

  // Paid-pack numbers shown in the pricing section. These MUST equal
  // pack/dist/manifest.json (computed from the pack data at build time);
  // tests/run-tests.js cross-checks them — never hand-tweak one side only.
  var PACK_INFO = { libraryEntries: 120, xianxiaEntries: 20, xianxiaShots: 60, ecommerceEntries: 20, socialEntries: 20, totalEntries: 180, totalPromptTexts: 220, starterPrice: 19, fullPrice: 39 };

  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }
  function fillSelect(el, items, labelFn) {
    el.innerHTML = '';
    items.forEach(function (it) {
      var o = document.createElement('option'); o.value = it.id; o.textContent = labelFn(it); el.appendChild(o);
    });
  }

  function currentInput() {
    return {
      styleId: $('style-select').value,
      characterName: $('char-name').value,
      characterAttrs: $('char-attrs').value,
      scene: $('scene').value,
      lightingId: $('lighting-select').value,
      moodId: $('mood-select').value,
      shotId: $('shot-select').value,
      movementId: $('movement-select').value,
      platform: $('platform-select').value,
      aspectRatio: $('aspect-select').value,
      motion: parseInt($('motion').value, 10),
      language: state.language,
      customNegatives: $('custom-neg').value
    };
  }

  var lastResult = null;
  function render() {
    var input = currentInput();
    var style = byId(D.STYLES, input.styleId);
    $('style-desc').textContent = (state.language === 'zh' ? style.textureZh : style.textureEn) + ' · ' + (state.language === 'zh' ? style.paletteZh : style.paletteEn);
    lastResult = C.compile(input, D);
    $('output').textContent = lastResult.prompt;
    $('negative-output').textContent = lastResult.negative;
    $('char-count').textContent = lastResult.prompt.length + (state.language === 'zh' ? ' 字符' : ' chars');
    $('word-count').textContent = lastResult.prompt.split(/\s+/).filter(Boolean).length + (state.language === 'zh' ? ' 词' : ' words');
    var w = $('warnings');
    if (lastResult.warnings.length) {
      w.hidden = false;
      w.innerHTML = '';
      lastResult.warnings.forEach(function (t) { var d = document.createElement('div'); d.textContent = '⚠ ' + t; w.appendChild(d); });
    } else { w.hidden = true; w.innerHTML = ''; }
    $('dirty-note').hidden = !(state.lightingDirty || state.moodDirty);
    document.querySelectorAll('#preset-grid button').forEach(function (b) { b.classList.remove('active'); });
  }

  function applyStyleDefaults(force) {
    var style = byId(D.STYLES, $('style-select').value);
    if (force || !state.lightingDirty) $('lighting-select').value = style.defaultLighting;
    if (force || !state.moodDirty) $('mood-select').value = style.defaultMood;
  }

  function setLanguage(lang) {
    state.language = lang;
    $('lang-en').classList.toggle('active', lang === 'en');
    $('lang-zh').classList.toggle('active', lang === 'zh');
    // Re-fill character/scene from current preset language if a preset is active is complex;
    // fields keep user text; only compiled output language switches.
    render();
  }

  function applyPreset(p) {
    $('style-select').value = p.styleId;
    state.lightingDirty = false; state.moodDirty = false;
    $('char-name').value = p.characterName;
    $('char-attrs').value = state.language === 'zh' ? p.characterAttrsZh : p.characterAttrsEn;
    $('scene').value = state.language === 'zh' ? p.sceneZh : p.sceneEn;
    $('lighting-select').value = p.lighting;
    $('mood-select').value = p.mood;
    $('shot-select').value = p.shot;
    $('movement-select').value = p.movement;
    render();
    document.querySelectorAll('#preset-grid button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-id') === p.id);
    });
  }

  function copyText(text, btn) {
    function done() { if (btn) { var old = btn.textContent; btn.textContent = 'Copied ✓'; setTimeout(function () { btn.textContent = old; }, 1400); } }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, done); }
    else {
      var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); done();
    }
  }

  function getSaved() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); } catch (e) { return []; } }
  function setSaved(list) { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); renderSaved(); }
  function renderSaved() {
    var list = getSaved(), box = $('saved-list'); box.innerHTML = '';
    if (!list.length) { box.innerHTML = '<p class="hint">暂无保存</p>'; return; }
    list.forEach(function (item, idx) {
      var div = document.createElement('div'); div.className = 'saved-item';
      var strong = document.createElement('strong'); strong.textContent = item.title;
      var p = document.createElement('p'); p.textContent = item.prompt.slice(0, 120) + '…';
      var row = document.createElement('div'); row.className = 'mini-row';
      var load = document.createElement('button'); load.type = 'button'; load.className = 'secondary'; load.textContent = '载入';
      load.addEventListener('click', function () {
        $('output').textContent = item.prompt; $('negative-output').textContent = item.negative || '';
      });
      var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'secondary'; cp.textContent = '复制';
      cp.addEventListener('click', function () { copyText(item.prompt, cp); });
      var del = document.createElement('button'); del.type = 'button'; del.className = 'secondary'; del.textContent = '删除';
      del.addEventListener('click', function () { var l = getSaved(); l.splice(idx, 1); setSaved(l); });
      row.appendChild(load); row.appendChild(cp); row.appendChild(del);
      div.appendChild(strong); div.appendChild(p); div.appendChild(row); box.appendChild(div);
    });
  }

  function download(name, content, type) {
    var blob = new Blob([content], { type: type });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function renderVault() {
    $('vault-count').textContent = String(D.VAULT.length);
    var box = $('vault-list'); box.innerHTML = '';
    D.VAULT.forEach(function (v) {
      var div = document.createElement('div'); div.className = 'vault-item';
      var strong = document.createElement('strong'); strong.textContent = v.title;
      var tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = v.platform;
      strong.appendChild(tag);
      var p = document.createElement('p'); p.textContent = v.prompt;
      var row = document.createElement('div'); row.className = 'mini-row';
      var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'secondary'; cp.textContent = '复制';
      cp.addEventListener('click', function () { copyText(v.prompt, cp); });
      var load = document.createElement('button'); load.type = 'button'; load.className = 'secondary'; load.textContent = '载入编辑器';
      load.addEventListener('click', function () {
        $('style-select').value = v.style;
        $('platform-select').value = v.platform;
        state.lightingDirty = false; state.moodDirty = false;
        applyStyleDefaults(true);
        $('scene').value = v.prompt;
        render();
      });
      row.appendChild(cp); row.appendChild(load);
      div.appendChild(strong); div.appendChild(p); div.appendChild(row); box.appendChild(div);
    });
  }

  function initPricing() {
    var bs = $('buy-starter'), bf = $('buy-full');
    if (bs) bs.href = BUY_URLS.starter;
    if (bf) bf.href = BUY_URLS.full;
    var map = { 'pi-lib': PACK_INFO.libraryEntries, 'pi-xianxia': PACK_INFO.xianxiaEntries, 'pi-xianxia-shots': PACK_INFO.xianxiaShots, 'pi-ecom': PACK_INFO.ecommerceEntries, 'pi-social': PACK_INFO.socialEntries, 'pi-entries': PACK_INFO.totalEntries, 'pi-texts': PACK_INFO.totalPromptTexts };
    Object.keys(map).forEach(function (id) { var el = $(id); if (el) el.textContent = String(map[id]); });
  }

  function init() {
    initPricing();
    fillSelect($('style-select'), D.STYLES, function (s) { return s.nameZh + ' · ' + s.nameEn; });
    fillSelect($('lighting-select'), D.LIGHTINGS, function (s) { return state.language === 'zh' ? s.zh : s.en; });
    fillSelect($('mood-select'), D.MOODS, function (s) { return state.language === 'zh' ? s.zh : s.en; });
    fillSelect($('shot-select'), D.SHOTS, function (s) { return state.language === 'zh' ? s.zh : s.en; });
    fillSelect($('movement-select'), D.MOVEMENTS, function (s) { return state.language === 'zh' ? s.zh : s.en; });
    fillSelect($('platform-select'), D.PLATFORMS, function (s) { return s.nameZh; });

    var grid = $('preset-grid');
    D.PRESETS.forEach(function (p) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-id', p.id);
      b.textContent = p.titleZh;
      b.addEventListener('click', function () { applyPreset(p); });
      grid.appendChild(b);
    });

    $('style-select').addEventListener('change', function () { applyStyleDefaults(false); render(); });
    $('lighting-select').addEventListener('change', function () { state.lightingDirty = true; render(); });
    $('mood-select').addEventListener('change', function () { state.moodDirty = true; render(); });
    ['char-name', 'char-attrs', 'scene', 'shot-select', 'movement-select', 'platform-select', 'aspect-select', 'custom-neg'].forEach(function (id) {
      $(id).addEventListener('input', render); $(id).addEventListener('change', render);
    });
    $('motion').addEventListener('input', function () { $('motion-val').textContent = $('motion').value; render(); });
    $('lang-en').addEventListener('click', function () { setLanguage('en'); });
    $('lang-zh').addEventListener('click', function () { setLanguage('zh'); });

    $('expand-btn').addEventListener('click', function () {
      var input = currentInput();
      $('scene').value = C.expandScene(input.scene, input.styleId, D, state.language);
      render();
    });

    $('storyboard-btn').addEventListener('click', function () {
      var shots = C.generateStoryboard(currentInput(), D);
      var box = $('storyboard-output'); box.innerHTML = '';
      shots.forEach(function (s) {
        var div = document.createElement('div'); div.className = 'shot-item';
        var h = document.createElement('h4'); h.textContent = 'Shot ' + s.index + ' · ' + s.shotType;
        var pre = document.createElement('pre'); pre.textContent = s.prompt;
        var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'secondary'; cp.textContent = '复制这一镜';
        cp.addEventListener('click', function () { copyText(s.prompt, cp); });
        div.appendChild(h); div.appendChild(pre); div.appendChild(cp); box.appendChild(div);
      });
    });

    $('copy-btn').addEventListener('click', function () { if (lastResult) copyText(lastResult.prompt, $('copy-btn')); });
    $('save-btn').addEventListener('click', function () {
      if (!lastResult) return;
      var list = getSaved();
      list.unshift({ title: $('char-name').value + ' · ' + $('platform-select').value + ' · ' + new Date().toLocaleString(), prompt: lastResult.prompt, negative: lastResult.negative, input: currentInput() });
      setSaved(list);
    });
    $('export-json').addEventListener('click', function () {
      download('video-prompts-saved.json', JSON.stringify(getSaved(), null, 2), 'application/json');
    });
    $('export-vault-csv').addEventListener('click', function () {
      function esc(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }
      var rows = [['title', 'style', 'platform', 'prompt', 'negative'].join(',')];
      D.VAULT.forEach(function (v) { rows.push([esc(v.title), esc(v.style), esc(v.platform), esc(v.prompt), esc(v.negative)].join(',')); });
      download('prompt-vault.csv', '﻿' + rows.join('\n'), 'text/csv');
    });

    applyPreset(D.PRESETS[2]); // cyberpunk courier default: shows linked neon lighting, no ink-wash leftovers
    $('platform-select').value = 'kling';
    renderVault(); renderSaved(); render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
