(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = factory(); }
  else { root.VPS_DATA = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var LIGHTINGS = [
    { id: 'mist-morning', en: 'soft diffused morning mist, ethereal golden light', zh: '柔和的晨雾漫射光，空灵的金色晨光' },
    { id: 'golden-hour', en: 'warm golden hour sunset illumination', zh: '温暖的黄昏日落光' },
    { id: 'neon-night', en: 'electric neon rain light, magenta and cyan reflections on wet surfaces, cinematic night haze', zh: '霓虹雨夜光，品红与青色在湿润表面的倒影，电影感夜雾' },
    { id: 'bright-softbox', en: 'bright soft studio lighting with cheerful highlights', zh: '明亮柔和的影棚光，欢快的高光' },
    { id: 'workshop-warm', en: 'warm practical workshop light with soft shadows', zh: '温暖的作坊实景光，柔和阴影' },
    { id: 'overcast-battle', en: 'cold overcast daylight, muted and desaturated', zh: '阴冷的白昼散射光，低饱和' },
    { id: 'candle-gloom', en: 'dim candlelight and cold moonlight through tall windows', zh: '昏暗烛光与高窗透入的冷月光' },
    { id: 'retro-sun', en: 'hard retro sunlight with deep film shadows', zh: '强烈的复古日光，深沉的胶片阴影' },
    { id: 'starlight', en: 'radiant starlight and soft moonbeams with ethereal glow', zh: '明亮的星光与柔和月光，带空灵光晕' },
    { id: 'dawn-sea', en: 'pale dawn light over the sea, soft silver reflections', zh: '海面上的淡色黎明光，银色微光倒影' }
  ];

  var MOODS = [
    { id: 'poetic-calm', en: 'poetic, calm and harmonious atmosphere', zh: '诗意、宁静、和谐的氛围' },
    { id: 'dreamy-hopeful', en: 'dreamy, hopeful and luminous mood', zh: '梦幻、充满希望、明亮的情绪' },
    { id: 'tense-electric', en: 'tense, electric, high-energy mood', zh: '紧张、带电、高能量的情绪' },
    { id: 'joyful-warm', en: 'joyful, warm and playful mood', zh: '欢快、温暖、俏皮的情绪' },
    { id: 'cozy-handmade', en: 'cozy, handmade and intimate mood', zh: '温馨、手作感、亲近的情绪' },
    { id: 'solemn-epic', en: 'solemn, epic and windswept mood', zh: '庄严、史诗感、风声呼啸的情绪' },
    { id: 'dark-ominous', en: 'dark, ominous and mysterious mood', zh: '阴暗、不祥、神秘的情绪' },
    { id: 'nostalgic-cool', en: 'nostalgic, cool and rebellious mood', zh: '怀旧、冷酷、叛逆的情绪' }
  ];

  var SHOTS = [
    { id: 'wide', en: 'wide establishing shot', zh: '远景建立镜头' },
    { id: 'medium', en: 'medium shot, waist-up framing', zh: '中景，腰部以上构图' },
    { id: 'closeup', en: 'close-up shot, face and expression in focus', zh: '特写，面部与表情清晰' },
    { id: 'aerial', en: 'aerial drone shot from above', zh: '高空航拍镜头' },
    { id: 'lowangle', en: 'low angle heroic shot', zh: '低角度英雄式镜头' },
    { id: 'over-shoulder', en: 'over-the-shoulder shot', zh: '过肩镜头' }
  ];

  var MOVEMENTS = [
    { id: 'push-in', en: 'cinematic slow push-in', zh: '电影感缓慢推镜' },
    { id: 'pan', en: 'smooth horizontal pan', zh: '平滑的水平摇镜' },
    { id: 'orbit', en: '360 degree circular orbit around the subject', zh: '环绕主体的 360 度轨道镜头' },
    { id: 'static', en: 'static locked-off camera', zh: '固定机位' },
    { id: 'tracking', en: 'tracking shot following the subject', zh: '跟随主体的移动镜头' },
    { id: 'handheld', en: 'subtle handheld camera with natural sway', zh: '带自然晃动的手持镜头' }
  ];

  var STYLES = [
    {
      id: 'inkwash', nameEn: 'Chinese Ink Wash', nameZh: '国风水墨',
      textureEn: 'traditional Chinese shan shui ink wash painting, expressive calligraphic brushstrokes, Xuan paper texture with subtle ink bleed',
      textureZh: '中国传统山水水墨画，书法感笔触，宣纸质感与轻微墨晕',
      paletteEn: 'muted ink blacks, pale mineral greens, delicate gold leaf accents',
      paletteZh: '淡墨黑、浅石绿、细腻的金箔点缀',
      defaultLighting: 'mist-morning', defaultMood: 'poetic-calm',
      negatives: ['photorealistic 3d render', 'harsh digital sharpness', 'neon colors', 'blurry', 'distorted anatomy'],
      conflicts: ['neon', 'cyberpunk', 'spaceship'],
      expansionEn: 'thin mist drifts between layered ridges, a few ink-dark pine silhouettes tremble, gold dust motes float in the light',
      expansionZh: '薄雾在层叠山脊间流动，几株墨色松影轻颤，金色微尘在光中漂浮'
    },
    {
      id: 'shinkai', nameEn: 'Makoto Shinkai Anime', nameZh: '新海诚动漫',
      textureEn: 'Makoto Shinkai style anime, luminous hand-painted skies, detailed cumulus clouds, lens flare and light bloom',
      textureZh: '新海诚式动漫，通透的手绘天空，细节丰富的积云，镜头光晕与光溢',
      paletteEn: 'vivid sky blues, warm sunset oranges, fresh greens',
      paletteZh: '鲜活的天蓝、温暖的落日橙、清新的绿',
      defaultLighting: 'golden-hour', defaultMood: 'dreamy-hopeful',
      negatives: ['photorealistic skin texture', 'muddy colors', 'low detail background', 'blurry', 'distorted anatomy'],
      conflicts: ['photorealistic', 'gritty'],
      expansionEn: 'towering cumulus clouds catch the light, tiny dust sparkles drift in sunbeams, distant birds cross the glowing sky',
      expansionZh: '高耸的积云被光照亮，细小微尘在光束中漂浮，远处飞鸟掠过发光的天空'
    },
    {
      id: 'cyberpunk', nameEn: 'Cyberpunk Neon', nameZh: '赛博朋克',
      textureEn: 'cyberpunk neon metropolis aesthetic, rain-slicked surfaces, holographic advertisements, volumetric rain haze, photographed on 35mm with fine film grain',
      textureZh: '赛博朋克霓虹都市美学，雨湿的表面，全息广告，体积感雨雾，35mm 细腻胶片颗粒',
      paletteEn: 'magenta and cyan neon against deep blue-black shadows',
      paletteZh: '品红与青色霓虹，深蓝黑的阴影',
      defaultLighting: 'neon-night', defaultMood: 'tense-electric',
      negatives: ['daylight pastoral look', 'watercolor wash', 'blurry', 'distorted anatomy', 'low light noise'],
      conflicts: ['ink wash', 'xuan paper', 'oriental morning', '水墨', '宣纸'],
      expansionEn: 'rain streaks cut through neon haze, steam rises from street vents, droplets bead on synthetic fabric and metal',
      expansionZh: '雨丝划破霓虹雾气，街道排气口升起蒸汽，水珠凝在合成面料与金属上'
    },
    {
      id: 'pixar3d', nameEn: 'Pixar-style 3D Animation', nameZh: '3D 动画',
      textureEn: 'high quality stylized 3D animation, soft subsurface skin, expressive characters, polished render with gentle depth of field',
      textureZh: '高品质风格化 3D 动画，柔和的皮肤次表面质感，表情丰富的角色，精致渲染与柔和景深',
      paletteEn: 'bright saturated primaries with warm highlights',
      paletteZh: '明亮饱和的原色，温暖的高光',
      defaultLighting: 'bright-softbox', defaultMood: 'joyful-warm',
      negatives: ['photorealistic horror', 'dull flat shading', 'blurry', 'distorted anatomy', 'uncanny valley'],
      conflicts: ['horror', 'gritty realism'],
      expansionEn: 'soft bokeh sparkles in the background, fabrics show fine woven detail, a gentle breeze ruffles hair and sleeves',
      expansionZh: '背景有柔和的光斑，织物呈现细腻编织质感，微风轻拂头发与衣袖'
    },
    {
      id: 'claymation', nameEn: 'Claymation Stop-Motion', nameZh: '黏土定格',
      textureEn: 'handmade claymation stop-motion, visible fingerprints in clay, miniature handcrafted sets, slight frame-by-frame charm',
      textureZh: '手作黏土定格动画，黏土上可见指纹，微缩手工布景，逐帧动画的质朴魅力',
      paletteEn: 'warm earthy clay tones, ochre, terracotta and cream',
      paletteZh: '温暖的大地黏土色调，赭石、陶土与米白',
      defaultLighting: 'workshop-warm', defaultMood: 'cozy-handmade',
      negatives: ['smooth cgi perfection', 'photorealistic', 'blurry', 'distorted anatomy'],
      conflicts: ['cgi', 'photorealistic'],
      expansionEn: 'tiny clay props wobble almost imperceptibly, warm light flickers like a real workshop lamp, flour-dust motes hang in the air',
      expansionZh: '微小的黏土道具几乎不可察地轻晃，暖光如真实作坊灯般微闪，面粉微尘悬在空气中'
    },
    {
      id: 'historical', nameEn: 'Cinematic Historical Film', nameZh: '历史电影感',
      textureEn: 'cinematic historical epic shot on 65mm film, authentic woven period fabrics, real locations, naturalistic detail',
      textureZh: '65mm 胶片拍摄的历史史诗电影感，真实编织的时代服饰，实景拍摄，自然主义细节',
      paletteEn: 'muted earth tones, iron grey and faded crimson',
      paletteZh: '低饱和大地色、铁灰与褪色深红',
      defaultLighting: 'overcast-battle', defaultMood: 'solemn-epic',
      negatives: ['modern clothing', 'plastic look', 'video game render', 'blurry', 'anachronisms'],
      conflicts: ['spaceship', 'neon', 'cyberpunk', '飞船'],
      expansionEn: 'wind tears at banner cloth, dust and ash drift across the frame, leather and iron catch dull light',
      expansionZh: '风撕扯着旗帜布面，尘土与灰烬飘过画面，皮革与铁器反射着暗淡的光'
    },
    {
      id: 'gothic', nameEn: 'Gothic Dark Fantasy', nameZh: '哥特暗黑',
      textureEn: 'gothic dark fantasy, ornate carved stone, wrought iron and stained glass, painterly chiaroscuro',
      textureZh: '哥特暗黑奇幻，华丽的石雕、锻铁与彩色玻璃，绘画感的强明暗对照',
      paletteEn: 'deep blacks, blood crimson, antique gold and cold silver',
      paletteZh: '深黑、血红、古金与冷银',
      defaultLighting: 'candle-gloom', defaultMood: 'dark-ominous',
      negatives: ['cheerful pastel colors', 'modern objects', 'blurry', 'distorted anatomy', 'flat lighting'],
      conflicts: ['pastel', 'cheerful'],
      expansionEn: 'candle flames bend in a cold draft, dust spirals through shafts of moonlight, stained glass throws faint colored shadows',
      expansionZh: '烛火在冷风中倾斜，尘埃在月光光束中旋转，彩色玻璃投下淡淡的彩色影子'
    },
    {
      id: 'retrofilm', nameEn: 'Retro 35mm Film', nameZh: '复古胶片',
      textureEn: 'retro 35mm film photograph look, Kodak color negative grain, halation on highlights, slightly faded vintage color science',
      textureZh: '复古 35mm 胶片质感，柯达彩色负片颗粒，高光光晕，略褪色的年代色彩',
      paletteEn: 'faded teals, warm ambers and creamy highlights',
      paletteZh: '褪色的青绿、温暖的琥珀与奶油色高光',
      defaultLighting: 'retro-sun', defaultMood: 'nostalgic-cool',
      negatives: ['clean digital look', 'over-sharpened', 'blurry', 'distorted anatomy', 'modern hdr'],
      conflicts: ['digital clean', 'hdr'],
      expansionEn: 'film grain dances over the frame, heat shimmer rises from asphalt, chrome trims flare with halation',
      expansionZh: '胶片颗粒在画面上跳动，热浪从沥青路面升起，镀铬饰条泛起光晕'
    }
  ];

  function P(id, titleZh, titleEn, styleId, charName, charAttrsEn, charAttrsZh, sceneEn, sceneZh, mood, lighting, shot, movement) {
    return { id: id, titleZh: titleZh, titleEn: titleEn, styleId: styleId, characterName: charName,
      characterAttrsEn: charAttrsEn, characterAttrsZh: charAttrsZh, sceneEn: sceneEn, sceneZh: sceneZh,
      mood: mood, lighting: lighting, shot: shot, movement: movement };
  }

  var PRESETS = [
    P('sword-immortal', '蜀山剑仙', 'Xianxia Sword Immortal', 'inkwash', 'Shushan Sword Immortal',
      'ethereal young man in white silk robes with silver cloud embroidery, dark hair flowing, holding a glowing teal sword',
      '白衣银纹云绣的年轻剑仙，长发飘动，手持青色发光长剑',
      'Standing on a solitary mountain peak above a sea of clouds, encircled by thousands of gold spectral flying swords',
      '独立于云海之上的孤峰，四周环绕上千把金色飞剑', 'poetic-calm', 'mist-morning', 'wide', 'push-in'),
    P('fox-fairy', '九尾狐仙', 'Nine-Tailed Fox Fairy', 'shinkai', 'Nine-Tailed Fox Fairy',
      'graceful fox fairy girl in a white and crimson shrine dress, long silver hair, nine flowing white tails',
      '白衣红纹神社服的狐仙少女，银色长发，九条飘动的白色狐尾',
      'Dancing slowly on a moonlit lake shrine path as petals and light particles swirl around her tails',
      '在月光下的湖畔神社小径上缓缓起舞，花瓣与光粒绕着狐尾旋转', 'dreamy-hopeful', 'starlight', 'medium', 'orbit'),
    P('cyber-courier', '霓虹快递员', 'Cyberpunk Courier', 'cyberpunk', 'Neon Courier Mei',
      'cyberpunk street courier girl, neon-blue braided ponytail, silver cybernetic eye implant, black techwear jacket with glowing cyan circuit lines',
      '赛博朋克街头快递女孩，霓虹蓝辫子高马尾，银色电子义眼，黑色机能夹克带青色发光线路',
      'Leaping between neon-soaked rooftops in a rain-drenched megacity, clutching a glowing data parcel as drones chase behind her',
      '在雨夜巨型都市的霓虹屋顶间跳跃，紧抱发光的数据包裹，身后有无人机追赶', 'tense-electric', 'neon-night', 'medium', 'tracking'),
    P('spaceship-harbor', '废土飞船港', 'Wasteland Spaceship Harbor', 'retrofilm', 'Harbor Mechanic Juno',
      'weathered spaceship mechanic in a patched flight jacket, goggles on her forehead, grease-stained gloves',
      '饱经风霜的飞船机械师，穿着打补丁的飞行夹克，额头上推着护目镜，手套沾着油污',
      'Walking through a dusty wasteland spaceship harbor at dusk, welding sparks falling around a grounded starship',
      '黄昏时分穿过尘土飞扬的废土飞船港，焊接火花在一艘停泊的星舰旁落下', 'nostalgic-cool', 'retro-sun', 'wide', 'pan'),
    P('fisherman', '黎明渔夫', 'Old Fisherman at Dawn', 'inkwash', 'Old Fisherman Chen',
      'elderly fisherman in a straw rain cape and bamboo hat, weathered hands, calm weathered face',
      '披蓑衣戴斗笠的老渔夫，双手粗糙，面容平静沧桑',
      'Casting a fishing net from a small wooden boat on a calm river at dawn, mist rolling over the water',
      '黎明时分在平静的江面上，从小木船上撒出渔网，雾气在水面流动', 'poetic-calm', 'dawn-sea', 'wide', 'static'),
    P('alchemist', '哥特炼金术士', 'Gothic Castle Alchemist', 'gothic', 'Alchemist Ravenna',
      'pale alchemist woman in a black velvet gown with silver embroidery, long dark hair, holding a vial of glowing crimson liquid',
      '苍白的女炼金术士，穿黑色天鹅绒长裙带银色刺绣，长黑发，手持一瓶发光的深红药剂',
      'Working at a stone altar inside a gothic castle laboratory as candles flicker and stained glass glows behind her',
      '在哥特城堡实验室的石台前工作，烛光摇曳，身后彩色玻璃透着微光', 'dark-ominous', 'candle-gloom', 'closeup', 'push-in'),
    P('bakery-cat', '面包房黏土猫', 'Claymation Bakery Cat', 'claymation', 'Baker Cat Momo',
      'round clay cat with cream fur and a tiny apron, pink nose, oversized curious eyes',
      '圆滚滚的黏土猫，奶油色毛发，系着小围裙，粉色鼻子，好奇的大眼睛',
      'Kneading a tiny loaf of dough on a wooden counter in a miniature clay bakery, flour dust in the warm air',
      '在微缩黏土面包房的木台面上揉一小团面团，温暖空气中飘着面粉', 'cozy-handmade', 'workshop-warm', 'medium', 'handheld'),
    P('toy-robot', '玩具机器人', '3D Toy Robot', 'pixar3d', 'Toy Robot Bolt',
      'small friendly toy robot with a round white body, big expressive eyes, orange backpack',
      '小巧友善的玩具机器人，圆润的白色身体，表情丰富的大眼睛，背着橙色小书包',
      'Taking its first wobbly steps across a sunny playroom floor, chasing a rolling red ball',
      '在阳光明媚的游戏室地板上迈出摇摇晃晃的第一步，追赶一只滚动的红球', 'joyful-warm', 'bright-softbox', 'lowangle', 'tracking'),
    P('messenger', '战场信使', 'Historical Battlefield Messenger', 'historical', 'Messenger Liang',
      'young battlefield messenger in worn leather armor and a faded crimson scarf, carrying a sealed bamboo scroll case',
      '年轻的战场信使，穿磨损的皮甲与褪色深红围巾，背着密封的竹筒文书',
      'Riding hard across a windswept battlefield at dawn, banners and dust streaming behind him',
      '黎明时分在狂风战场上策马疾驰，身后旗帜与尘土翻卷', 'solemn-epic', 'overcast-battle', 'wide', 'tracking'),
    P('tokyo-racer', '东京街头车手', 'Retro Tokyo Street Racer', 'retrofilm', 'Tokyo Racer Kenji',
      'confident street racer in a vintage leather jacket and aviator sunglasses, short black hair',
      '自信的街头车手，穿复古皮夹克戴飞行员墨镜，黑色短发',
      'Leaning against his vintage sports car on a 1980s Tokyo street at night, neon signs reflected on wet asphalt',
      '夜里靠在复古跑车旁，站在 1980 年代东京街头，霓虹招牌倒映在湿润的沥青上', 'nostalgic-cool', 'retro-sun', 'medium', 'pan'),
    P('crane-dancer', '水墨鹤舞者', 'Ink-Wash Crane Dancer', 'inkwash', 'Crane Dancer Yue',
      'elegant dancer in flowing white hanfu with ink-black ribbon sleeves, hair in a high bun with a silver pin',
      '优雅的舞者，穿飘逸的白色汉服带墨黑缎带水袖，高发髻插银簪',
      'Performing a slow crane-inspired dance on a misty bamboo bridge as white cranes circle above',
      '在雾气弥漫的竹桥上跳鹤形慢舞，白鹤在上空盘旋', 'poetic-calm', 'mist-morning', 'aerial', 'orbit'),
    P('train-girl', '电车窗边的少女', 'Anime Train-Window Girl', 'shinkai', 'Train Girl Hina',
      'quiet school girl with a chestnut bob haircut and a navy uniform, holding a paperback novel',
      '安静的女学生，栗色波波头，深蓝制服，手里拿着一本平装小说',
      'Sitting by a train window at sunset, watching coastal towns and glittering sea pass by, reflection faint on the glass',
      '黄昏时坐在电车窗边，看着海滨小镇与闪光的海面掠过，玻璃上有淡淡的倒影', 'dreamy-hopeful', 'golden-hour', 'over-shoulder', 'pan')
  ];

  function V(title, styleId, platform, prompt, negative) {
    return { title: title, style: styleId, platform: platform, prompt: prompt, negative: negative };
  }

  var VAULT = [
    V('云海剑仙 · Runway', 'inkwash', 'runway', 'Wide establishing shot with a cinematic slow push-in. A young sword immortal in white silk robes stands on a lone peak above a sea of clouds, gold spectral swords circling him, in traditional Chinese ink wash style with Xuan paper texture and morning mist.', 'photorealistic 3d render, neon colors, blurry, distorted anatomy'),
    V('狐仙湖畔 · Kling', 'shinkai', 'kling', 'Subject: a nine-tailed fox fairy in a white shrine dress. Action: dancing slowly on a moonlit lake path. Scene: petals and light particles swirling under radiant starlight, Makoto Shinkai anime style with luminous painted skies.', 'photorealistic skin, muddy colors, blurry, distorted anatomy'),
    V('霓虹快递 · Sora', 'cyberpunk', 'sora', 'The camera tracks a cyberpunk courier girl with a neon-blue ponytail as she leaps between rain-soaked rooftops in a magenta-and-cyan megacity, drones closing in behind her, steam and neon haze filling the night air.', 'daylight pastoral look, watercolor wash, blurry, low light noise'),
    V('废土飞船港 · 通用', 'retrofilm', 'generic', 'A weathered mechanic walks through a dusty wasteland spaceship harbor at dusk, welding sparks falling beside a grounded starship, shot in retro 35mm film with faded colors and highlight halation.', 'clean digital look, over-sharpened, blurry, modern hdr'),
    V('江上渔夫 · Runway', 'inkwash', 'runway', 'A static wide shot of an elderly fisherman in a straw rain cape casting his net from a wooden boat at dawn, mist rolling over a calm ink-wash river, pale silver light on the water.', 'photorealistic 3d render, harsh sharpness, blurry, distorted anatomy'),
    V('炼金术士 · Kling', 'gothic', 'kling', 'Subject: a pale alchemist in a black velvet gown. Action: raising a vial of glowing crimson liquid. Scene: a gothic castle laboratory with flickering candles and stained glass, cold moonlight through tall windows.', 'cheerful pastel colors, modern objects, blurry, flat lighting'),
    V('面包房小猫 · 通用', 'claymation', 'generic', 'A round clay cat in a tiny apron kneads dough on a wooden counter inside a miniature handmade bakery, flour dust floating in warm workshop light, charming stop-motion movement with visible clay fingerprints.', 'smooth cgi perfection, photorealistic, blurry'),
    V('玩具机器人 · Sora', 'pixar3d', 'sora', 'A small round toy robot with big expressive eyes takes wobbly first steps across a sunny playroom, chasing a rolling red ball, in bright stylized 3D animation with soft depth of field and joyful energy.', 'photorealistic horror, dull shading, blurry, uncanny valley'),
    V('战场信使 · Runway', 'historical', 'runway', 'A wide tracking shot follows a young messenger in worn leather armor riding hard across a windswept battlefield at dawn, banners streaming, dust and ash drifting, cinematic historical film on 65mm.', 'modern clothing, plastic look, video game render, blurry'),
    V('东京车手 · Kling', 'retrofilm', 'kling', 'Subject: a street racer in a vintage leather jacket. Action: leaning on his retro sports car, looking down the street. Scene: a 1980s Tokyo street at night, neon reflected on wet asphalt, retro 35mm film grain and halation.', 'clean digital look, over-sharpened, blurry, modern hdr'),
    V('鹤舞竹桥 · 通用', 'inkwash', 'generic', 'An elegant dancer in white hanfu performs a slow crane-inspired dance on a misty bamboo bridge, white cranes circling above, Chinese ink wash painting style with gold leaf accents.', 'photorealistic 3d render, neon colors, blurry'),
    V('电车少女 · Sora', 'shinkai', 'sora', 'Over-the-shoulder shot of a school girl by a train window at sunset, coastal towns and a glittering sea sliding past outside, her faint reflection on the glass, luminous Shinkai anime skies overhead.', 'photorealistic skin, muddy colors, blurry'),
    V('墨竹剑客 · Kling', 'inkwash', 'kling', 'Subject: a swordsman in dark ink-wash robes. Action: drawing his sword in one fluid motion. Scene: a bamboo forest in morning mist, ink brushstroke leaves and Xuan paper texture, poetic calm mood.', 'photorealistic 3d render, neon colors, blurry, distorted anatomy'),
    V('赛博神社 · Runway', 'cyberpunk', 'runway', 'A medium shot, slow orbit around a cybernetic shrine maiden in a neon-lit cyberpunk temple, holographic torii gates glowing magenta, rain haze and holographic koi drifting through the air.', 'daylight pastoral look, watercolor wash, blurry'),
    V('哥特婚礼 · 通用', 'gothic', 'generic', 'A solemn gothic wedding procession moves through a candlelit stone cathedral, black lace and antique gold details, cold moonlight through stained glass, painterly chiaroscuro.', 'cheerful pastel colors, modern objects, blurry, flat lighting'),
    V('黏土花园 · Sora', 'claymation', 'sora', 'In a miniature clay garden, a tiny clay gardener waters oversized clay sunflowers as a clay sun rises frame by frame, warm workshop light and handmade stop-motion charm throughout.', 'smooth cgi perfection, photorealistic, blurry'),
    V('3D 小龙 · Kling', 'pixar3d', 'kling', 'Subject: a baby dragon with big eyes and tiny wings. Action: sneezing a puff of harmless sparkles. Scene: a cozy storybook cave with glowing crystals, bright stylized 3D animation, joyful warm mood.', 'photorealistic horror, dull shading, blurry, uncanny valley'),
    V('唐风长安 · Runway', 'historical', 'runway', 'A sweeping aerial shot over a Tang dynasty capital at dawn, tiled roofs and market lanterns below, a lone rider crossing a stone bridge, cinematic historical film with muted earth tones.', 'modern clothing, plastic look, blurry, anachronisms'),
    V('胶片海港 · 通用', 'retrofilm', 'generic', 'Fishing boats rock gently in a 1970s harbor at golden hour, gulls circling, retro 35mm film colors with faded teals and warm amber highlights and soft halation.', 'clean digital look, over-sharpened, blurry, modern hdr'),
    V('新海诚云海列车 · Kling', 'shinkai', 'kling', 'Subject: a boy and girl on opposite platforms. Action: turning to look at each other as a train passes. Scene: a sky station above a sea of clouds at sunset, luminous Shinkai anime clouds and lens flare.', 'photorealistic skin, muddy colors, blurry'),
    V('水墨鲤鱼 · Sora', 'inkwash', 'sora', 'Two ink-wash koi fish swim in slow circles through clear water as lotus petals drift down, the camera gliding above them, Chinese shan shui style with delicate gold leaf accents.', 'photorealistic 3d render, neon colors, blurry'),
    V('霓虹武士 · 通用', 'cyberpunk', 'generic', 'A cyberpunk ronin with a glowing katana stands in a rain-drenched alley, neon signs in magenta and cyan reflecting off wet asphalt, volumetric haze and fine film grain.', 'daylight pastoral look, watercolor wash, blurry'),
    V('暗黑图书馆 · Runway', 'gothic', 'runway', 'A slow push-in through a vast gothic library, a hooded scholar reading by candlelight at a carved oak table, dust spiraling in cold moonlight shafts from tall arched windows.', 'cheerful pastel colors, modern objects, blurry, flat lighting'),
    V('黏土宇航员 · Kling', 'claymation', 'kling', 'Subject: a tiny clay astronaut with a round helmet. Action: planting a clay flag on a miniature moon. Scene: handmade clay craters and paper stars, warm workshop light, stop-motion charm.', 'smooth cgi perfection, photorealistic, blurry'),
    V('3D 海底邮局 · 通用', 'pixar3d', 'generic', 'A cheerful 3D animated octopus postman delivers bubble letters through a bright coral reef post office, soft subsurface light and playful saturated colors throughout.', 'photorealistic horror, dull shading, blurry, uncanny valley'),
    V('丝路驼队 · Sora', 'historical', 'sora', 'A camel caravan crosses golden dunes at dawn along the Silk Road, bells swaying, dust glowing in early light, cinematic historical epic shot on 65mm film with naturalistic detail.', 'modern clothing, plastic look, blurry, anachronisms'),
    V('胶片滑板少年 · Runway', 'retrofilm', 'runway', 'A handheld tracking shot follows a teenager skateboarding down a sunlit 1990s California street, palm trees and faded storefronts, retro 35mm grain and warm halation on highlights.', 'clean digital look, over-sharpened, blurry, modern hdr'),
    V('动漫樱花站台 · 通用', 'shinkai', 'generic', 'Cherry blossom petals blow across a rural train platform as a girl in a school uniform waits under a luminous spring sky, Makoto Shinkai anime style with detailed clouds and light bloom.', 'photorealistic skin, muddy colors, blurry'),
    V('赛博茶馆 · Sora', 'cyberpunk', 'sora', 'Inside a cyberpunk teahouse, a robotic tea master pours glowing tea for masked guests, steam curling through magenta neon haze, holographic menus flickering above wooden tables.', 'daylight pastoral look, watercolor wash, blurry'),
    V('水墨雪山 · Kling', 'inkwash', 'kling', 'Subject: a lone traveler in a fur cloak. Action: climbing a snowy ink-wash mountain path. Scene: pine silhouettes and drifting snow in morning mist, Xuan paper texture, poetic and solemn mood.', 'photorealistic 3d render, neon colors, blurry, distorted anatomy')
  ];

  return {
    LIGHTINGS: LIGHTINGS, MOODS: MOODS, SHOTS: SHOTS, MOVEMENTS: MOVEMENTS,
    STYLES: STYLES, PRESETS: PRESETS, VAULT: VAULT,
    PLATFORMS: [
      { id: 'runway', nameEn: 'Runway', nameZh: 'Runway' },
      { id: 'kling', nameEn: 'Kling', nameZh: 'Kling 可灵' },
      { id: 'sora', nameEn: 'Sora', nameZh: 'Sora' },
      { id: 'generic', nameEn: 'Generic', nameZh: '通用' }
    ],
    ASPECTS: ['16:9', '9:16', '1:1']
  };
});
