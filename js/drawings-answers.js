/*
 * Tekeningen voor de antwoorden die bij een vraag horen:
 * gezichtjes (gevoel en pijnschaal), drankjes en een lichaam met een pijnplek.
 * Ze worden opgebouwd uit kleine bouwstenen, zodat ze als één set ogen.
 */
(function () {
  'use strict';

  const { svg, LINE, COLORS } = window.LetsTalk.DRAWING_KIT;
  const { INK, SKIN, TEAL, ORANGE, YELLOW, RED, GREEN, WHITE, BROWN } = COLORS;

  const WATER_BLUE = '#8CCBE0';
  const TEAR_BLUE = '#4A9BD1';
  const TEA_AMBER = '#C77B30';
  const COFFEE_BROWN = '#6B4226';
  const PANTS = '#4A5A66';
  const LIGHT_GREEN = '#9CC85A';
  const DARK_ORANGE = '#E06A2C';

  /* ---------- Gezichtjes ---------- */

  const EYES = Object.freeze({
    open: `<circle cx="72" cy="86" r="10" fill="${INK}"/><circle cx="128" cy="86" r="10" fill="${INK}"/>`,
    closed: `<path d="M58 86 Q72 98 86 86 M114 86 Q128 98 142 86" fill="none" ${LINE} stroke-width="6"/>`,
    squeezed: `<path d="M60 74 L84 86 L60 98 M140 74 L116 86 L140 98" fill="none" ${LINE} stroke-width="6"/>`,
  });

  const MOUTHS = Object.freeze({
    bigSmile: `<path d="M58 118 Q100 172 142 118 Z" fill="${WHITE}" ${LINE}/>`,
    smile: `<path d="M64 124 Q100 156 136 124" fill="none" ${LINE} stroke-width="7"/>`,
    flat: `<path d="M70 136 L130 136" fill="none" ${LINE} stroke-width="7"/>`,
    frown: `<path d="M66 146 Q100 118 134 146" fill="none" ${LINE} stroke-width="7"/>`,
    cry: `<path d="M60 152 Q100 104 140 152 Z" fill="${INK}" ${LINE}/>`,
  });

  const BROWS = Object.freeze({
    none: '',
    angry: `<path d="M54 60 L88 74 M146 60 L112 74" fill="none" ${LINE} stroke-width="7"/>`,
    sad: `<path d="M56 72 L86 60 M144 72 L114 60" fill="none" ${LINE} stroke-width="7"/>`,
  });

  const TEAR = `<path d="M60 104 Q52 120 60 128 Q68 120 60 104 Z" fill="${TEAR_BLUE}"/>`;
  const SLEEPY_Z = `<text x="156" y="44" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="${TEAL}">z</text>
    <text x="176" y="22" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="${TEAL}">z</text>`;

  function face({ fill, eyes, mouth, brows = 'none', extra = '' }) {
    return svg(`
      <circle cx="100" cy="100" r="80" fill="${fill}" ${LINE}/>
      ${BROWS[brows]}${EYES[eyes]}${MOUTHS[mouth]}${extra}`);
  }

  const feelings = {
    happy: face({ fill: YELLOW, eyes: 'open', mouth: 'bigSmile' }),
    tired: face({ fill: YELLOW, eyes: 'closed', mouth: 'flat', extra: SLEEPY_Z }),
    sad: face({ fill: YELLOW, eyes: 'open', mouth: 'frown', brows: 'sad', extra: TEAR }),
    angry: face({ fill: DARK_ORANGE, eyes: 'open', mouth: 'frown', brows: 'angry' }),
  };

  const painScale = {
    pain1: face({ fill: GREEN, eyes: 'open', mouth: 'bigSmile' }),
    pain2: face({ fill: LIGHT_GREEN, eyes: 'open', mouth: 'smile' }),
    pain3: face({ fill: YELLOW, eyes: 'open', mouth: 'flat' }),
    pain4: face({ fill: ORANGE, eyes: 'open', mouth: 'frown', brows: 'sad' }),
    pain5: face({ fill: RED, eyes: 'squeezed', mouth: 'cry', brows: 'sad', extra: TEAR }),
  };

  /* ---------- Drankjes ---------- */

  const STEAM = `<g fill="none" stroke="#8A8F98" stroke-width="5" stroke-linecap="round">
      <path d="M78 58 Q68 44 78 30 Q88 16 78 4"/>
      <path d="M108 58 Q98 44 108 30 Q118 16 108 4"/>
    </g>`;

  function mug(liquid, extra = '') {
    return svg(`
      ${STEAM}
      <path d="M142 96 Q178 96 176 122 Q174 148 142 146" fill="none" ${LINE} stroke-width="10"/>
      <rect x="44" y="66" width="100" height="112" rx="16" fill="${WHITE}" ${LINE}/>
      <ellipse cx="94" cy="80" rx="40" ry="8" fill="${liquid}"/>
      ${extra}`);
  }

  const TEA_BAG = `<path d="M74 80 Q60 64 40 80" fill="none" stroke="${INK}" stroke-width="3"/>
    <rect x="22" y="80" width="30" height="34" rx="4" fill="${YELLOW}" ${LINE}/>`;

  const GLASS_SHAPE = 'M52 34 L148 34 L136 180 L64 180 Z';
  const GLASS_LIQUID = 'M58 82 L142 82 L136 176 L64 176 Z';

  function glass(liquid, extra = '') {
    return svg(`
      <path d="${GLASS_SHAPE}" fill="${WHITE}"/>
      <path d="${GLASS_LIQUID}" fill="${liquid}"/>
      <path d="${GLASS_SHAPE}" fill="none" ${LINE}/>
      <path d="M72 50 L68 160" fill="none" stroke="${WHITE}" stroke-width="7" stroke-linecap="round" opacity="0.8"/>
      ${extra}`);
  }

  const ORANGE_SLICE = `<circle cx="146" cy="38" r="24" fill="${ORANGE}" ${LINE}/>
    <path d="M146 18 L146 58 M126 38 L166 38 M132 24 L160 52 M160 24 L132 52" stroke="${YELLOW}" stroke-width="3"/>`;

  const drinks = {
    coffee: mug(COFFEE_BROWN),
    tea: mug(TEA_AMBER, TEA_BAG),
    water: glass(WATER_BLUE),
    juice: glass(ORANGE, ORANGE_SLICE),
  };

  /* ---------- Lichaam met pijnplek ---------- */

  function bodyFigure(isBackView) {
    const head = isBackView
      ? `<circle cx="76" cy="42" r="7" fill="${SKIN}" ${LINE}/><circle cx="124" cy="42" r="7" fill="${SKIN}" ${LINE}/>
         <circle cx="100" cy="40" r="25" fill="${BROWN}" ${LINE}/>`
      : `<circle cx="100" cy="40" r="25" fill="${SKIN}" ${LINE}/>
         <circle cx="91" cy="38" r="3.5" fill="${INK}"/><circle cx="109" cy="38" r="3.5" fill="${INK}"/>
         <path d="M92 50 Q100 55 108 50" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    return `
      <rect x="74" y="132" width="22" height="58" rx="10" fill="${PANTS}" ${LINE}/>
      <rect x="104" y="132" width="22" height="58" rx="10" fill="${PANTS}" ${LINE}/>
      <rect x="42" y="76" width="20" height="62" rx="10" fill="${TEAL}" ${LINE}/>
      <rect x="138" y="76" width="20" height="62" rx="10" fill="${TEAL}" ${LINE}/>
      <circle cx="52" cy="146" r="9" fill="${SKIN}" ${LINE}/>
      <circle cx="148" cy="146" r="9" fill="${SKIN}" ${LINE}/>
      <rect x="62" y="70" width="76" height="72" rx="18" fill="${TEAL}" ${LINE}/>
      ${head}`;
  }

  function painSpot(x, y) {
    const rays = [0, 90, 180, 270]
      .map((angle) => `<path d="M${x} ${y - 20} L${x} ${y - 28}" transform="rotate(${angle + 45} ${x} ${y})"/>`)
      .join('');
    return `<circle cx="${x}" cy="${y}" r="13" fill="${RED}" stroke="${WHITE}" stroke-width="3"/>
      <g stroke="${RED}" stroke-width="5" stroke-linecap="round">${rays}</g>`;
  }

  function bodyWithPain(spots, isBackView = false) {
    return svg(`${bodyFigure(isBackView)}${spots.map(([x, y]) => painSpot(x, y)).join('')}`);
  }

  const bodyParts = {
    painHead: bodyWithPain([[100, 24]]),
    painBelly: bodyWithPain([[100, 116]]),
    painBack: bodyWithPain([[100, 100]], true),
    painLegs: bodyWithPain([[85, 176], [115, 176]]),
  };

  window.LetsTalk = Object.freeze({
    ...window.LetsTalk,
    DRAWINGS: Object.freeze({
      ...window.LetsTalk.DRAWINGS,
      ...feelings,
      ...painScale,
      ...drinks,
      ...bodyParts,
    }),
  });
})();
