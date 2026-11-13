(function () {
  'use strict';
  var D = window.VPS_DATA, C = window.VPS_COMPILER;
  var $ = function (id) { return document.getElementById(id); };
  var state = { language: 'zh', uiLang: 'zh', lightingDirty: false, moodDirty: false, presetId: null };
  var SAVE_KEY = 'vps-saved-v1';
  var UI_LANG_KEY = 'vps-ui-lang';

  // Purchase links — the ONLY place buy URLs live. Placeholder slugs until the
  // real Gumroad listings exist; swap both values here when they do.
  const BUY_URLS = { starter: "https://gumroad.com/l/ebcjyh", full: "https://gumroad.com/l/vneevp" };

  // Paid-pack numbers shown in the pricing section. These MUST equal
  // pack/dist/manifest.json (computed from the pack data at build time);
  // tests/run-tests.js cross-checks them — never hand-tweak one side only.
  var PACK_INFO = { libraryEntries: 120, xianxiaEntries: 20, xianxiaShots: 60, ecommerceEntries: 20, socialEntries: 20, filmEntries: 20, foodEntries: 10, petsEntries: 10, travelEntries: 10, totalEntries: 230, totalPromptTexts: 270, starterPrice: 19, fullPrice: 39 };

  // Interface strings. The UI language follows the visitor's browser language
  // on first load (Chinese → zh, anything else → en) and can be switched with
  // the header toggle; the choice is remembered. The prompt OUTPUT language is
  // a separate toggle and starts out matching the UI language.
  var UI_STRINGS = {
    zh: {
      docTitle: '光影提示词工坊 · AI 视频提示词生成器',
      brand: '光影提示词工坊',
      subtitle: 'AI 视频提示词生成器 · 按平台分别编译，不混用参数',
      uiLangLabel: '界面', outLangLabel: '输出', outEn: 'EN 输出', outZh: '中文输出',
      s1: '01 · 画面风格', styleLabel: '艺术风格',
      s2: '02 · 场景预设',
      s3: '03 · 角色锁定', charName: '角色锚点名', charAttrs: '外貌 / 服装 / 标志物',
      charLockHint: '角色锁定句已压缩为一句短句，不再重复堆砌同义词。',
      s4: '04 · 场景与镜头', sceneLabel: '场景 / 动作',
      expandBtn: '细节扩写（规则生成，按当前风格补充感官细节）',
      lighting: '光线', mood: '氛围', shot: '景别', movement: '运镜', platform: '目标平台', aspect: '画幅',
      aspect169: '16:9 横屏', aspect916: '9:16 竖屏', aspect11: '1:1 方形',
      motion: '运动强度', customNeg: '自定义负面词（可选，逗号分隔）', customNegPh: '例如：水印, 低清',
      dirtyNote: '光线/氛围已被你手动调整，切换风格时不会自动覆盖。',
      s5: '05 · 3 镜分镜（规则生成）',
      storyboardHint: '本地规则即时生成：远景建立 → 中景动作 → 特写情绪，共享同一角色锚点。不是 AI 生成，不转圈假装处理。',
      storyboardBtn: '生成 3 镜分镜',
      s6: '06 · 提示词库',
      vaultHint: '共 <span id="vault-count">0</span> 条，数字由数据本身计算。每条可复制或载入编辑器。',
      exportCsvBtn: '导出提示词库 CSV',
      outputTitle: '生成结果', negLabel: '负面提示词（与正文分开）',
      copyBtn: '复制提示词', saveBtn: '保存', exportJsonBtn: '导出已保存 JSON', savedTitle: '已保存',
      fineprint: '说明：纯文字提示词不能保证角色脸部完全一致，建议配合参考图 / I2V（图生视频）使用。本工具所有生成均为本地规则拼装，不调用任何 AI 接口。',
      pricingTitle: '定价 · 付费数据包',
      pricingSub: '上面的生成器和 30 条提示词库永久免费。付费包卖的是整理好的数据文件：买断制，无订阅，文件本身就是产品。',
      starterName: 'Starter 入门包', fullName: 'Full 全量包', once: '一次性买断', badge: '推荐',
      starterLi1: '全量提示词库 <b id="pi-lib">120</b> 条：8 种风格 × 15 个全新概念，与免费 30 条不重复',
      starterLi2: 'JSON + CSV 双格式（CSV 带 BOM，Excel 直接打开不乱码）',
      starterLi3: '离线版网页应用，本地打开即用',
      starterLi4: '《使用指南》：各平台粘贴方法、画幅与负面词说明',
      starterLi5: '商业授权：提示词及所生成视频可商用',
      buyStarter: '在 Gumroad 购买 Starter', buyFull: '在 Gumroad 购买 Full',
      fullLiAll: 'Starter 入门包的全部内容',
      fullLiXianxia: '仙侠短剧包：<b id="pi-xianxia">20</b> 个三镜分镜条目，共 <b id="pi-xianxia-shots">60</b> 条镜头提示词（竖屏 9:16，Kling 格式，同一角色锚点）',
      fullLiEcom: '电商产品视频包：<b id="pi-ecom">20</b> 条（横屏 / 竖屏变体已逐条注明）',
      fullLiSocial: '竖屏社媒包：<b id="pi-social">20</b> 条（TikTok / 小红书 / 抖音，开场钩子前置）',
      fullLiFilm: '影视包：<b id="pi-film">20</b> 条（宽银幕 16:9：构图 / 镜头语言 / 类型片 / 三镜叙事，2026-10-21 周更加入）',
      fullLiFood: '美食与饮品特写包：<b id="pi-food">10</b> 条（蒸汽 / 浇注 / 切开 / 滋滋作响 / 拉丝 / 组装特写，9:16 与 16:9 逐条标注，2026-11-02 周更加入）',
      fullLiPets: '宠物日常包：<b id="pi-pets">10</b> 条（晨光 / 玩耍 / 洗护 / 好奇 / 陪伴日常，9:16 与 16:9 逐条标注，2026-11-02 周更加入）',
      fullLiTravel: '旅行风光包：<b id="pi-travel">10</b> 条（山岳 / 海岸 / 沙漠 / 城市 / 乡野与远北，9:16 与 16:9 逐条标注，2026-11-09 周更加入）',
      fullLiKit: '角色一致性套件：角色设定表模板 + 各平台参考图工作流',
      pricingNote1: '购买后由 Gumroad 邮件发货 · 支持信用卡/PayPal · 文件为 JSON/CSV，可直接导入使用',
      pricingNote2: '付费内容两个计数口径：共 <b id="pi-entries">230</b> 个条目；按单条提示词文本计共 <b id="pi-texts">270</b> 条（仙侠包按 60 条镜头计）。两个数字的定义见包内 manifest.json，均由数据自动统计。商品已在 Gumroad 上架（卖家 Charlie xiao），购买后由 Gumroad 邮件发货。',
      pricingNote3: '<a href="changelog.html">更新日志</a> · 最近更新：2026-11-09 旅行风光包（10 条）加入 Full 全量包',
      charsSuffix: ' 字符', wordsSuffix: ' 词',
      noSaved: '暂无保存', loadBtn: '载入', copySmall: '复制', deleteBtn: '删除',
      vaultCopy: '复制', vaultLoad: '载入编辑器', copyShot: '复制这一镜', copied: '已复制 ✓'
    },
    en: {
      docTitle: 'Video Prompt Studio · AI Video Prompt Generator',
      brand: 'Video Prompt Studio',
      subtitle: 'AI video prompt generator · compiled separately for each platform, no mixed parameters',
      uiLangLabel: 'Interface', outLangLabel: 'Output', outEn: 'EN output', outZh: '中文 output',
      s1: '01 · Visual style', styleLabel: 'Art style',
      s2: '02 · Scene presets',
      s3: '03 · Character lock', charName: 'Character anchor name', charAttrs: 'Appearance / outfit / signature items',
      charLockHint: 'The character-lock sentence is compressed to one short line, with no repeated synonyms.',
      s4: '04 · Scene & camera', sceneLabel: 'Scene / action',
      expandBtn: 'Expand details (rule-based, adds sensory detail for the current style)',
      lighting: 'Lighting', mood: 'Mood', shot: 'Shot size', movement: 'Camera movement', platform: 'Target platform', aspect: 'Aspect ratio',
      aspect169: '16:9 landscape', aspect916: '9:16 vertical', aspect11: '1:1 square',
      motion: 'Motion intensity', customNeg: 'Custom negative terms (optional, comma-separated)', customNegPh: 'e.g. watermark, low-res',
      dirtyNote: 'You adjusted lighting/mood manually, so switching styles will not overwrite them.',
      s5: '05 · 3-shot storyboard (rule-based)',
      storyboardHint: 'Generated instantly by local rules: wide establishing → medium action → close-up emotion, all sharing one character anchor. Not AI-generated, no fake processing spinner.',
      storyboardBtn: 'Generate 3-shot storyboard',
      s6: '06 · Prompt vault',
      vaultHint: '<span id="vault-count">0</span> prompts, counted from the data itself. Copy any entry or load it into the editor.',
      exportCsvBtn: 'Export vault as CSV',
      outputTitle: 'Result', negLabel: 'Negative prompt (kept separate)',
      copyBtn: 'Copy prompt', saveBtn: 'Save', exportJsonBtn: 'Export saved as JSON', savedTitle: 'Saved',
      fineprint: 'Note: text-only prompts cannot guarantee a perfectly consistent face; pair them with a reference image / I2V (image-to-video) workflow. Everything here is assembled by local rules — no AI API is called.',
      pricingTitle: 'Pricing · Paid data packs',
      pricingSub: 'The generator above and the 30-prompt vault are free forever. The paid packs are curated data files: one-time purchase, no subscription — the files are the product.',
      starterName: 'Starter Pack', fullName: 'Full Pack', once: 'one-time purchase', badge: 'Recommended',
      starterLi1: 'Full prompt library: <b id="pi-lib">120</b> entries — 8 styles × 15 all-new concepts, no overlap with the free 30',
      starterLi2: 'JSON + CSV (CSV carries a BOM, opens cleanly in Excel)',
      starterLi3: 'Offline web app — open it locally and use it anywhere',
      starterLi4: 'User guide: how to paste per platform, aspect ratios and negative terms explained',
      starterLi5: 'Commercial license: prompts and the videos you generate with them can be used commercially',
      buyStarter: 'Buy Starter on Gumroad', buyFull: 'Buy Full on Gumroad',
      fullLiAll: 'Everything in the Starter Pack',
      fullLiXianxia: 'Xianxia short-drama pack: <b id="pi-xianxia">20</b> three-shot storyboard entries, <b id="pi-xianxia-shots">60</b> shot prompts in total (vertical 9:16, Kling format, one character anchor per entry)',
      fullLiEcom: 'E-commerce product video pack: <b id="pi-ecom">20</b> entries (landscape / vertical variants noted per entry)',
      fullLiSocial: 'Vertical social pack: <b id="pi-social">20</b> entries (TikTok / Xiaohongshu / Douyin, hook first)',
      fullLiFilm: 'Film pack: <b id="pi-film">20</b> entries (widescreen 16:9: composition / camera language / genres / 3-shot narratives, added 2026-10-21)',
      fullLiFood: 'Food & beverage close-ups pack: <b id="pi-food">10</b> entries (steam / pour / cut / sizzle / pull / assemble, 9:16 and 16:9 noted per entry, added 2026-11-02)',
      fullLiPets: 'Pets daily pack: <b id="pi-pets">10</b> entries (morning / play / grooming / curiosity / companionship, 9:16 and 16:9 noted per entry, added 2026-11-02)',
      fullLiTravel: 'Travel & landscapes pack: <b id="pi-travel">10</b> entries (mountains / coast / desert / city / countryside & far north, 9:16 and 16:9 noted per entry, added 2026-11-09)',
      fullLiKit: 'Character-consistency kit: character sheet template + per-platform reference-image workflows',
      pricingNote1: 'Delivered by Gumroad email after purchase · Cards/PayPal accepted · JSON/CSV files, ready to import',
      pricingNote2: 'Two ways to count the paid content: <b id="pi-entries">230</b> entries in total; <b id="pi-texts">270</b> individual prompt texts (the xianxia pack counts as 60 shot prompts). Both numbers are computed from the data — see manifest.json inside the pack. Listed on Gumroad (seller: Charlie xiao), delivered by email.',
      pricingNote3: '<a href="changelog.html">Changelog</a> · Last update: 2026-11-09 — travel & landscapes pack (10 entries) added to Full',
      charsSuffix: ' chars', wordsSuffix: ' words',
      noSaved: 'Nothing saved yet', loadBtn: 'Load', copySmall: 'Copy', deleteBtn: 'Delete',
      vaultCopy: 'Copy', vaultLoad: 'Load into editor', copyShot: 'Copy this shot', copied: 'Copied ✓'
    }
  };
  function t(key) { return UI_STRINGS[state.uiLang][key] || UI_STRINGS.zh[key] || key; }

  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }
  function fillSelect(el, items, labelFn) {
    el.innerHTML = '';
    items.forEach(function (it) {
      var o = document.createElement('option'); o.value = it.id; o.textContent = labelFn(it); el.appendChild(o);
    });
  }
  function refillSelect(el, items, labelFn) {
    var v = el.value;
    fillSelect(el, items, labelFn);
    if (v) el.value = v;
  }
  function styleLabel(s) { return state.uiLang === 'zh' ? (s.nameZh + ' · ' + s.nameEn) : s.nameEn; }
  function termLabel(s) { return state.uiLang === 'zh' ? s.zh : s.en; }
  function platformLabel(s) { return state.uiLang === 'zh' ? s.nameZh : s.nameEn; }

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
    $('style-desc').textContent = (state.uiLang === 'zh' ? style.textureZh : style.textureEn) + ' · ' + (state.uiLang === 'zh' ? style.paletteZh : style.paletteEn);
    lastResult = C.compile(input, D);
    $('output').textContent = lastResult.prompt;
    $('negative-output').textContent = lastResult.negative;
    $('char-count').textContent = lastResult.prompt.length + t('charsSuffix');
    $('word-count').textContent = lastResult.prompt.split(/\s+/).filter(Boolean).length + t('wordsSuffix');
    var w = $('warnings');
    if (lastResult.warnings.length) {
      w.hidden = false;
      w.innerHTML = '';
      lastResult.warnings.forEach(function (txt) { var d = document.createElement('div'); d.textContent = '⚠ ' + txt; w.appendChild(d); });
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

  function applyUiTexts() {
    document.documentElement.lang = state.uiLang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('docTitle');
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    $('ui-lang-zh').classList.toggle('active', state.uiLang === 'zh');
    $('ui-lang-en').classList.toggle('active', state.uiLang === 'en');
  }

  function buildPresetGrid() {
    var grid = $('preset-grid');
    grid.innerHTML = '';
    D.PRESETS.forEach(function (p) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-id', p.id);
      b.textContent = state.uiLang === 'zh' ? p.titleZh : p.titleEn;
      b.classList.toggle('active', state.presetId === p.id);
      b.addEventListener('click', function () { applyPreset(p); });
      grid.appendChild(b);
    });
  }

  function setUiLang(lang, skipSave) {
    state.uiLang = lang;
    if (!skipSave) { try { localStorage.setItem(UI_LANG_KEY, lang); } catch (e) {} }
    applyUiTexts();
    initPricing();
    refillSelect($('style-select'), D.STYLES, styleLabel);
    refillSelect($('lighting-select'), D.LIGHTINGS, termLabel);
    refillSelect($('mood-select'), D.MOODS, termLabel);
    refillSelect($('shot-select'), D.SHOTS, termLabel);
    refillSelect($('movement-select'), D.MOVEMENTS, termLabel);
    refillSelect($('platform-select'), D.PLATFORMS, platformLabel);
    buildPresetGrid();
    renderVault();
    renderSaved();
    var sb = $('storyboard-output'); if (sb) sb.innerHTML = '';
    render();
  }

  function detectUiLang() {
    try {
      var saved = localStorage.getItem(UI_LANG_KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {}
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function applyPreset(p) {
    state.presetId = p.id;
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
    function done() { if (btn) { var old = btn.textContent; btn.textContent = t('copied'); setTimeout(function () { btn.textContent = old; }, 1400); } }
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
    if (!list.length) { box.innerHTML = '<p class="hint">' + t('noSaved') + '</p>'; return; }
    list.forEach(function (item, idx) {
      var div = document.createElement('div'); div.className = 'saved-item';
      var strong = document.createElement('strong'); strong.textContent = item.title;
      var p = document.createElement('p'); p.textContent = item.prompt.slice(0, 120) + '…';
      var row = document.createElement('div'); row.className = 'mini-row';
      var load = document.createElement('button'); load.type = 'button'; load.className = 'secondary'; load.textContent = t('loadBtn');
      load.addEventListener('click', function () {
        $('output').textContent = item.prompt; $('negative-output').textContent = item.negative || '';
      });
      var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'secondary'; cp.textContent = t('copySmall');
      cp.addEventListener('click', function () { copyText(item.prompt, cp); });
      var del = document.createElement('button'); del.type = 'button'; del.className = 'secondary'; del.textContent = t('deleteBtn');
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
    var vc = $('vault-count'); if (vc) vc.textContent = String(D.VAULT.length);
    var box = $('vault-list'); box.innerHTML = '';
    D.VAULT.forEach(function (v) {
      var div = document.createElement('div'); div.className = 'vault-item';
      var strong = document.createElement('strong'); strong.textContent = v.title;
      var tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = v.platform;
      strong.appendChild(tag);
      var p = document.createElement('p'); p.textContent = v.prompt;
      var row = document.createElement('div'); row.className = 'mini-row';
      var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'secondary'; cp.textContent = t('vaultCopy');
      cp.addEventListener('click', function () { copyText(v.prompt, cp); });
      var load = document.createElement('button'); load.type = 'button'; load.className = 'secondary'; load.textContent = t('vaultLoad');
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
    var map = { 'pi-lib': PACK_INFO.libraryEntries, 'pi-xianxia': PACK_INFO.xianxiaEntries, 'pi-xianxia-shots': PACK_INFO.xianxiaShots, 'pi-ecom': PACK_INFO.ecommerceEntries, 'pi-social': PACK_INFO.socialEntries, 'pi-film': PACK_INFO.filmEntries, 'pi-food': PACK_INFO.foodEntries, 'pi-pets': PACK_INFO.petsEntries, 'pi-travel': PACK_INFO.travelEntries, 'pi-entries': PACK_INFO.totalEntries, 'pi-texts': PACK_INFO.totalPromptTexts };
    Object.keys(map).forEach(function (id) { var el = $(id); if (el) el.textContent = String(map[id]); });
  }

  function init() {
    state.uiLang = detectUiLang();
    state.language = state.uiLang; // output language starts out matching the UI language
    $('lang-en').classList.toggle('active', state.language === 'en');
    $('lang-zh').classList.toggle('active', state.language === 'zh');

    initPricing();
    fillSelect($('style-select'), D.STYLES, styleLabel);
    fillSelect($('lighting-select'), D.LIGHTINGS, termLabel);
    fillSelect($('mood-select'), D.MOODS, termLabel);
    fillSelect($('shot-select'), D.SHOTS, termLabel);
    fillSelect($('movement-select'), D.MOVEMENTS, termLabel);
    fillSelect($('platform-select'), D.PLATFORMS, platformLabel);
    buildPresetGrid();
    applyUiTexts();
    initPricing();

    $('style-select').addEventListener('change', function () { applyStyleDefaults(false); render(); });
    $('lighting-select').addEventListener('change', function () { state.lightingDirty = true; render(); });
    $('mood-select').addEventListener('change', function () { state.moodDirty = true; render(); });
    ['char-name', 'char-attrs', 'scene', 'shot-select', 'movement-select', 'platform-select', 'aspect-select', 'custom-neg'].forEach(function (id) {
      $(id).addEventListener('input', render); $(id).addEventListener('change', render);
    });
    $('motion').addEventListener('input', function () { $('motion-val').textContent = $('motion').value; render(); });
    $('lang-en').addEventListener('click', function () { setLanguage('en'); });
    $('lang-zh').addEventListener('click', function () { setLanguage('zh'); });
    $('ui-lang-en').addEventListener('click', function () { setUiLang('en'); });
    $('ui-lang-zh').addEventListener('click', function () { setUiLang('zh'); });

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
        var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'secondary'; cp.textContent = t('copyShot');
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

