(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = factory(); }
  else { root.VPS_COMPILER = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function byId(list, id) {
    for (var i = 0; i < (list || []).length; i++) { if (list[i].id === id) return list[i]; }
    return (list || [])[0] || { en: '', zh: '' };
  }
  function pick(obj, lang, base) {
    if (!obj) return '';
    return lang === 'zh' ? (obj[base + 'Zh'] || obj[base + 'En'] || '') : (obj[base + 'En'] || '');
  }
  function dedupeTerms(terms) {
    var seen = {}, out = [];
    terms.forEach(function (t) {
      var k = String(t).trim().toLowerCase();
      if (k && !seen[k]) { seen[k] = 1; out.push(String(t).trim()); }
    });
    return out;
  }
  function dedupeSentences(text) {
    var seen = {}, out = [];
    String(text).split(/(?<=[.!?])\s+/).forEach(function (s) {
      var k = s.trim().toLowerCase();
      if (k && !seen[k]) { seen[k] = 1; out.push(s.trim()); }
    });
    return out.join(' ');
  }

  // Slim character lock: 13 words EN, one short line ZH. No near-duplicate phrases.
  function getCharacterLock(lang) {
    return lang === 'zh'
      ? '角色锁定：同一张脸、同一发型与服装，不要重新设计角色。'
      : 'Consistent character: same face, hairstyle, and outfit in every shot; do not redesign.';
  }

  var ANIMATION_BANS = {
    shinkai: ['anime', 'cartoon', '2d animation', '动漫', '卡通'],
    pixar3d: ['3d render', '3d animation', 'cgi', 'cartoon', '3d 动画', '卡通'],
    claymation: ['stop-motion', 'stop motion', 'claymation', 'clay', '定格', '黏土']
  };

  function buildNegatives(style, lang, warnings, customNegatives) {
    var terms = (style.negatives || []).slice();
    if (customNegatives) {
      String(customNegatives).split(/[,，、]/).forEach(function (t) { if (t.trim()) terms.push(t.trim()); });
    }
    terms = dedupeTerms(terms);
    var banned = ANIMATION_BANS[style.id] || [];
    var kept = [];
    terms.forEach(function (t) {
      var low = t.toLowerCase();
      var hit = banned.some(function (b) { return low.indexOf(b) !== -1; });
      if (hit) {
        warnings.push(lang === 'zh'
          ? '负面词「' + t + '」与当前风格冲突，已自动移除（否则会把该风格本身禁掉）。'
          : 'Negative term "' + t + '" conflicts with this style and was removed automatically.');
      } else { kept.push(t); }
    });
    return kept.join(', ');
  }

  function detectConflicts(input, style, combined, lang, warnings) {
    var low = combined.toLowerCase();
    var has = function () {
      for (var i = 0; i < arguments.length; i++) { if (low.indexOf(arguments[i].toLowerCase()) !== -1) return true; }
      return false;
    };
    var day = has('golden hour', 'sunset', '黄昏', '日落', '落日');
    var night = has('moonlight', 'moonbeams', 'starlight', '月光', '星光');
    if (day && night) {
      warnings.push(lang === 'zh'
        ? '光线冲突：同时出现黄昏日光与月光/星光，请二选一，否则画面光线会自相矛盾。'
        : 'Lighting conflict: golden-hour sunlight and moonlight/starlight appear together; pick one.');
    }
    if (style.id === 'cyberpunk' && has('ink wash', 'xuan paper', 'oriental morning', '水墨', '宣纸', '东方晨')) {
      warnings.push(lang === 'zh'
        ? '风格冲突：赛博朋克画面中混入了水墨/宣纸等东方水墨元素，已保留你的原文，请确认是否有意混搭。'
        : 'Style conflict: ink-wash / oriental terms appear in a cyberpunk prompt.');
    }
    if ((style.conflicts || []).indexOf('spaceship') !== -1 || style.id === 'historical') {
      if (has('spaceship', 'starship', '飞船', '星舰') && has('period clothing', 'period fabrics', '古代服饰', '时代服饰')) {
        warnings.push(lang === 'zh'
          ? '元素冲突：科幻飞船场景中混入了时代服饰描述，可能是模板残留，请检查。'
          : 'Element conflict: period-clothing terms appear in a sci-fi spaceship scene.');
      }
    }
    if (style.id === 'historical' && has('spaceship', 'starship', '飞船', '星舰')) {
      warnings.push(lang === 'zh'
        ? '风格提醒：历史电影感风格中出现了飞船/星舰等科幻元素。'
        : 'Style note: sci-fi spaceship elements appear in a historical-film style.');
    }
  }

  function aspectPhrase(aspect, lang) {
    if (lang === 'zh') {
      if (aspect === '9:16') return '竖屏 9:16 格式';
      if (aspect === '1:1') return '方形 1:1 格式';
      return '横屏 16:9 宽银幕格式';
    }
    if (aspect === '9:16') return 'vertical 9:16 format';
    if (aspect === '1:1') return 'square 1:1 format';
    return 'horizontal 16:9 widescreen format';
  }
  function motionPhrase(motion, lang) {
    var m = parseInt(motion, 10) || 5;
    if (lang === 'zh') {
      var w = m <= 3 ? '动作轻柔缓慢' : (m <= 6 ? '动作流畅自然' : '动作有力、节奏快速');
      return '运动强度 ' + m + '/10，' + w;
    }
    var wEn = m <= 3 ? 'gentle, subtle movement' : (m <= 6 ? 'smooth, natural movement' : 'energetic, fast-paced movement');
    return 'motion intensity ' + m + '/10, ' + wEn;
  }

  function compile(input, data) {
    data = data || (typeof VPS_DATA !== 'undefined' ? VPS_DATA : null);
    if (!data) throw new Error('compiler: data is required');
    var lang = input.language === 'zh' ? 'zh' : 'en';
    var style = byId(data.STYLES, input.styleId);
    var lightingObj = byId(data.LIGHTINGS, input.lightingId || style.defaultLighting);
    var moodObj = byId(data.MOODS, input.moodId || style.defaultMood);
    var shotObj = byId(data.SHOTS, input.shotId);
    var moveObj = byId(data.MOVEMENTS, input.movementId);
    var lighting = pick(lightingObj, lang, '' ) || (lang === 'zh' ? lightingObj.zh : lightingObj.en);
    var mood = (lang === 'zh' ? moodObj.zh : moodObj.en) || '';
    var shot = (lang === 'zh' ? shotObj.zh : shotObj.en) || '';
    var movement = (lang === 'zh' ? moveObj.zh : moveObj.en) || '';
    var texture = pick(style, lang, 'texture');
    var palette = pick(style, lang, 'palette');
    var name = (input.characterName || '').trim();
    var attrs = (input.characterAttrs || '').trim();
    var scene = (input.scene || '').trim();
    var lock = getCharacterLock(lang);
    var warnings = [];
    var negative = buildNegatives(style, lang, warnings, input.customNegatives);

    var charDesc = lang === 'zh'
      ? ('角色「' + name + '」：' + attrs)
      : ('Character "' + name + '": ' + attrs);
    var aspect = aspectPhrase(input.aspectRatio || '16:9', lang);
    var motion = motionPhrase(input.motion || 5, lang);
    var combined = [scene, lighting, mood, texture, input.customText || ''].join(' ');
    detectConflicts(input, style, combined, lang, warnings);

    var text;
    if (input.platform === 'kling') {
      if (lang === 'zh') {
        text = [
          '主体：' + name + '，' + attrs + '。' + lock,
          '动作：' + scene,
          '场景：' + texture + '，' + palette,
          '镜头：' + shot + '，' + movement + '，' + aspect + '，' + motion,
          '光影：' + lighting + '，' + mood,
          '负面提示词：' + negative
        ].join('\n');
      } else {
        text = [
          'Subject: ' + name + ', ' + attrs + '. ' + lock,
          'Action: ' + scene,
          'Scene: ' + texture + ', ' + palette,
          'Camera: ' + shot + ', ' + movement + ', ' + aspect + ', ' + motion,
          'Lighting: ' + lighting + ', ' + mood,
          'Negative prompt: ' + negative
        ].join('\n');
      }
    } else if (input.platform === 'sora') {
      text = lang === 'zh'
        ? ('镜头以' + shot + '开场，' + movement + '。' + charDesc + '。' + scene + '。画面延续这一动作，情绪逐渐展开：' + mood + '。整体风格为' + texture + '，色彩为' + palette + '。光线：' + lighting + '。' + lock + '画面采用' + aspect + '，' + motion + '。')
        : ('The shot opens with a ' + shot + ', ' + movement + '. ' + charDesc + '. ' + scene + '. The action unfolds in one continuous beat: ' + mood + '. The world is rendered as ' + texture + ', with ' + palette + '. Lighting: ' + lighting + '. ' + lock + ' Presented in ' + aspect + ', ' + motion + '.');
      text = dedupeSentences(text);
    } else if (input.platform === 'generic') {
      var body = lang === 'zh'
        ? (shot + '，' + movement + '。' + charDesc + '。' + scene + '。风格：' + texture + '，' + palette + '。光线：' + lighting + '，' + mood + '。' + lock + aspect + '，' + motion + '。')
        : (shot + ', ' + movement + '. ' + charDesc + '. ' + scene + '. Style: ' + texture + ', ' + palette + '. Lighting: ' + lighting + ', ' + mood + '. ' + lock + ' ' + aspect + ', ' + motion + '.');
      text = dedupeSentences(body) + (lang === 'zh' ? ('\n\n负面提示词：' + negative) : ('\n\nNegative prompt: ' + negative));
    } else { // runway
      var runwayBody = lang === 'zh'
        ? (charDesc + '。' + scene + '。风格：' + texture + '，' + palette + '。光线：' + lighting + '，' + mood + '。' + lock + '画面采用' + aspect + '，' + motion + '。')
        : (charDesc + '. ' + scene + '. Style: ' + texture + ', ' + palette + '. Lighting: ' + lighting + ', ' + mood + '. ' + lock + ' Presented in ' + aspect + ', ' + motion + '.');
      var cameraSentence = lang === 'zh'
        ? ('镜头：' + shot + '，' + movement + '。')
        : ('Camera: ' + shot + ', ' + movement + '.');
      text = dedupeSentences(runwayBody) + ' ' + cameraSentence;
    }

    return { prompt: text, text: text, negative: negative, warnings: warnings, characterLock: lock, styleId: style.id };
  }

  function expandScene(scene, styleId, data, lang) {
    data = data || (typeof VPS_DATA !== 'undefined' ? VPS_DATA : null);
    var style = byId(data.STYLES, styleId);
    var extra = lang === 'zh' ? style.expansionZh : style.expansionEn;
    var base = String(scene || '').trim();
    if (!extra || base.indexOf(extra) !== -1) return base;
    var sep = lang === 'zh' ? '；' : '; ';
    var end = /[。.!?]$/.test(base) ? '' : (lang === 'zh' ? '。' : '.');
    return base + end + (lang === 'zh' ? '细节：' : ' Details: ') + extra + (lang === 'zh' ? '。' : '.');
  }

  var STORYBOARD_SHOTS = [
    { shotId: 'wide', key: 'wide establishing', zh: '远景建立', movementId: 'push-in' },
    { shotId: 'medium', key: 'medium action', zh: '中景动作', movementId: 'tracking' },
    { shotId: 'closeup', key: 'close-up emotional', zh: '特写情绪', movementId: 'push-in' }
  ];

  function generateStoryboard(input, data) {
    return STORYBOARD_SHOTS.map(function (s, i) {
      var sub = Object.assign({}, input, { shotId: s.shotId, movementId: s.movementId });
      var out = compile(sub, data);
      return {
        index: i + 1,
        shotType: input.language === 'zh' ? s.zh : s.key,
        shotKey: s.key,
        prompt: out.prompt,
        negative: out.negative,
        warnings: out.warnings
      };
    });
  }

  return {
    compile: compile, compilePrompt: compile,
    generateStoryboard: generateStoryboard,
    expandScene: expandScene,
    getCharacterLock: getCharacterLock,
    aspectPhrase: aspectPhrase, motionPhrase: motionPhrase,
    _byId: byId
  };
});
