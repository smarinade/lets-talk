/*
 * Grote, eenvoudige tekeningen (inline SVG) die een zin verduidelijken.
 * Alle tekeningen gebruiken dezelfde viewBox (200x200) en kleurenset,
 * zodat ze als één geheel ogen.
 */
(function () {
  'use strict';

  const INK = '#2B2420';
  const SKIN = '#F4C99B';
  const TEAL = '#1F6F78';
  const ORANGE = '#E8833A';
  const YELLOW = '#F2C14E';
  const RED = '#D64545';
  const GREEN = '#3E8E57';
  const GREY = '#8A8F98';
  const WHITE = '#FFFFFF';
  const BROWN = '#8B5A3C';

  const LINE = `stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;

  function svg(content) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${content}</svg>`;
  }

  const hand = svg(`
    <g fill="${SKIN}" ${LINE}>
      <rect x="48" y="95" width="20" height="60" rx="10" transform="rotate(-35 58 125)"/>
      <rect x="58" y="40" width="20" height="80" rx="10"/>
      <rect x="80" y="26" width="20" height="92" rx="10"/>
      <rect x="102" y="30" width="20" height="88" rx="10"/>
      <rect x="124" y="46" width="19" height="72" rx="9.5"/>
      <rect x="58" y="88" width="85" height="80" rx="32"/>
    </g>
    <g fill="none" stroke="${ORANGE}" stroke-width="6" stroke-linecap="round">
      <path d="M36 62 Q24 46 36 28"/>
      <path d="M22 70 Q4 46 22 20"/>
      <path d="M160 34 Q174 52 164 72"/>
      <path d="M174 24 Q194 52 178 82"/>
    </g>`);

  const smiley = svg(`
    <circle cx="92" cy="112" r="66" fill="${YELLOW}" ${LINE}/>
    <circle cx="70" cy="98" r="8" fill="${INK}"/>
    <circle cx="114" cy="98" r="8" fill="${INK}"/>
    <path d="M62 128 Q92 160 122 128" fill="none" ${LINE} stroke-width="7"/>
    <circle cx="160" cy="42" r="30" fill="${TEAL}"/>
    <text x="160" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="${WHITE}">?</text>`);

  const plate = svg(`
    <circle cx="100" cy="105" r="58" fill="${WHITE}" ${LINE}/>
    <circle cx="100" cy="105" r="40" fill="none" stroke="#E3D9C9" stroke-width="4"/>
    <ellipse cx="88" cy="96" rx="18" ry="12" fill="${YELLOW}" ${LINE} stroke-width="3"/>
    <rect x="96" y="104" width="30" height="10" rx="5" fill="${ORANGE}" transform="rotate(-20 111 109)" ${LINE} stroke-width="3"/>
    <circle cx="86" cy="122" r="6" fill="${GREEN}"/>
    <circle cx="98" cy="126" r="6" fill="${GREEN}"/>
    <circle cx="110" cy="124" r="6" fill="${GREEN}"/>
    <g fill="${GREY}" ${LINE} stroke-width="4">
      <rect x="23" y="78" width="9" height="98" rx="4.5"/>
      <path d="M16 36 L16 66 Q27 84 39 66 L39 36" fill="none"/>
      <path d="M27.5 36 L27.5 70" fill="none"/>
      <rect x="168" y="104" width="10" height="72" rx="5"/>
      <path d="M168 108 L168 34 Q186 54 178 108 Z"/>
    </g>`);

  const gym = svg(`
    <g ${LINE} fill="none">
      <path d="M70 8 L70 58"/>
      <path d="M130 8 L130 58"/>
      <circle cx="70" cy="72" r="13" stroke-width="7" stroke="${BROWN}"/>
      <circle cx="130" cy="72" r="13" stroke-width="7" stroke="${BROWN}"/>
      <path d="M70 84 L90 114" stroke-width="8"/>
      <path d="M130 84 L110 114" stroke-width="8"/>
      <path d="M100 152 L86 192" stroke-width="8"/>
      <path d="M100 152 L114 192" stroke-width="8"/>
    </g>
    <path d="M100 114 L100 154" stroke="${ORANGE}" stroke-width="22" stroke-linecap="round"/>
    <circle cx="100" cy="96" r="14" fill="${SKIN}" ${LINE}/>
    <g fill="${YELLOW}">
      <path d="M30 120 l4 9 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z"/>
      <path d="M168 130 l3 7 l7 1 l-5 4 l2 7 l-7 -4 l-6 4 l2 -7 l-5 -4 l7 -1 Z"/>
    </g>`);

  const cup = svg(`
    <ellipse cx="100" cy="170" rx="72" ry="13" fill="${WHITE}" ${LINE}/>
    <path d="M146 104 Q182 106 172 134 Q164 150 142 146" fill="none" ${LINE} stroke-width="10"/>
    <path d="M50 90 L150 90 L140 158 Q100 172 60 158 Z" fill="${TEAL}" ${LINE}/>
    <g fill="none" stroke="${GREY}" stroke-width="5" stroke-linecap="round">
      <path d="M78 74 Q68 60 78 46 Q88 32 78 18"/>
      <path d="M100 74 Q90 60 100 46 Q110 32 100 18"/>
      <path d="M122 74 Q112 60 122 46 Q132 32 122 18"/>
    </g>`);

  const bed = svg(`
    <g ${LINE}>
      <path d="M38 154 L38 182" fill="none" stroke-width="7"/>
      <path d="M176 154 L176 182" fill="none" stroke-width="7"/>
      <rect x="22" y="82" width="16" height="100" rx="6" fill="${BROWN}"/>
      <rect x="36" y="128" width="146" height="28" rx="6" fill="${WHITE}"/>
      <ellipse cx="62" cy="122" rx="24" ry="12" fill="${WHITE}"/>
      <circle cx="66" cy="110" r="15" fill="${SKIN}"/>
      <rect x="80" y="112" width="102" height="44" rx="10" fill="${TEAL}"/>
    </g>
    <g font-family="Arial, sans-serif" font-weight="700" fill="${TEAL}">
      <text x="104" y="84" font-size="34">Z</text>
      <text x="132" y="58" font-size="26">z</text>
      <text x="156" y="36" font-size="20">z</text>
    </g>`);

  const bandage = svg(`
    <g transform="rotate(-35 100 100)">
      <rect x="22" y="70" width="156" height="60" rx="30" fill="#F2C9A0" ${LINE}/>
      <rect x="74" y="70" width="52" height="60" fill="#E2A877" ${LINE}/>
      <g fill="#C98A5A">
        <circle cx="44" cy="90" r="3.5"/><circle cx="56" cy="110" r="3.5"/>
        <circle cx="44" cy="110" r="3.5"/><circle cx="56" cy="90" r="3.5"/>
        <circle cx="144" cy="90" r="3.5"/><circle cx="156" cy="110" r="3.5"/>
        <circle cx="144" cy="110" r="3.5"/><circle cx="156" cy="90" r="3.5"/>
      </g>
    </g>
    <g stroke="${RED}" stroke-width="6" stroke-linecap="round">
      <path d="M150 22 L142 40"/><path d="M174 40 L158 50"/><path d="M180 70 L162 70"/>
    </g>`);

  const walk = svg(`
    <circle cx="164" cy="38" r="18" fill="${YELLOW}"/>
    <path d="M10 182 L190 182" ${LINE} stroke-width="6"/>
    <rect x="150" y="118" width="12" height="64" fill="${BROWN}"/>
    <circle cx="156" cy="104" r="30" fill="${GREEN}"/>
    <g fill="none" ${LINE} stroke-width="8">
      <path d="M78 118 L58 176"/>
      <path d="M78 118 L100 174"/>
      <path d="M80 78 L60 104"/>
      <path d="M80 78 L100 98"/>
    </g>
    <path d="M100 98 L110 180" stroke="${BROWN}" stroke-width="6" stroke-linecap="round"/>
    <path d="M80 70 L78 118" stroke="${TEAL}" stroke-width="20" stroke-linecap="round"/>
    <circle cx="81" cy="48" r="15" fill="${SKIN}" ${LINE}/>`);

  const house = svg(`
    <g ${LINE}>
      <rect x="42" y="92" width="116" height="90" fill="${YELLOW}"/>
      <path d="M26 98 L100 34 L174 98 Z" fill="${RED}"/>
      <rect x="84" y="124" width="34" height="58" fill="${BROWN}"/>
      <rect x="54" y="110" width="22" height="22" fill="${WHITE}"/>
      <rect x="126" y="110" width="22" height="22" fill="${WHITE}"/>
    </g>
    <circle cx="111" cy="156" r="3.5" fill="${YELLOW}"/>
    <circle cx="166" cy="40" r="26" fill="${TEAL}"/>
    <text x="166" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="${WHITE}">?</text>`);

  const weather = svg(`
    <g stroke="${ORANGE}" stroke-width="7" stroke-linecap="round">
      <path d="M78 14 L78 30"/><path d="M78 126 L78 142"/>
      <path d="M14 78 L30 78"/><path d="M126 78 L142 78"/>
      <path d="M33 33 L44 44"/><path d="M112 112 L123 123"/>
      <path d="M33 123 L44 112"/><path d="M112 44 L123 33"/>
    </g>
    <circle cx="78" cy="78" r="36" fill="${YELLOW}" ${LINE}/>
    <path d="M62 172 Q38 172 38 150 Q38 126 64 128 Q70 102 100 104 Q124 90 142 112 Q172 108 172 138 Q178 172 144 172 Z" fill="${WHITE}" ${LINE}/>`);

  const tv = svg(`
    <g ${LINE} fill="none" stroke-width="6">
      <path d="M100 52 L74 18"/><path d="M100 52 L128 20"/>
      <path d="M78 152 L66 180"/><path d="M122 152 L134 180"/>
    </g>
    <rect x="26" y="50" width="148" height="104" rx="14" fill="${INK}"/>
    <rect x="40" y="63" width="120" height="78" rx="8" fill="#9ED3D8"/>
    <circle cx="80" cy="104" r="14" fill="${YELLOW}"/>
    <path d="M40 141 L80 110 L108 130 L130 112 L160 136 L160 141 Z" fill="${GREEN}"/>`);

  const heart = svg(`
    <path d="M100 176 C40 134 16 98 36 66 C54 38 90 42 100 72 C110 42 146 38 164 66 C184 98 160 134 100 176 Z" fill="${RED}" ${LINE}/>
    <path d="M56 74 Q62 62 74 62" fill="none" stroke="${WHITE}" stroke-width="7" stroke-linecap="round"/>`);

  const yes = svg(`
    <circle cx="100" cy="100" r="80" fill="${GREEN}"/>
    <path d="M58 102 L88 132 L144 70" fill="none" stroke="${WHITE}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`);

  const no = svg(`
    <circle cx="100" cy="100" r="80" fill="${RED}"/>
    <g stroke="${WHITE}" stroke-width="18" stroke-linecap="round">
      <path d="M66 66 L134 134"/><path d="M134 66 L66 134"/>
    </g>`);

  const unknown = svg(`
    <circle cx="100" cy="100" r="80" fill="${GREY}"/>
    <text x="100" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="96" font-weight="700" fill="${WHITE}">?</text>`);

  const bubble = svg(`
    <path d="M30 40 Q30 24 46 24 L154 24 Q170 24 170 40 L170 120 Q170 136 154 136 L92 136 L56 172 L60 136 L46 136 Q30 136 30 120 Z" fill="${WHITE}" ${LINE}/>
    <circle cx="70" cy="80" r="10" fill="${TEAL}"/>
    <circle cx="100" cy="80" r="10" fill="${TEAL}"/>
    <circle cx="130" cy="80" r="10" fill="${TEAL}"/>`);

  window.LetsTalk = Object.freeze({
    ...(window.LetsTalk || {}),
    DRAWINGS: Object.freeze({
      hand, smiley, plate, gym, cup, bed, bandage, walk,
      house, weather, tv, heart, yes, no, unknown, bubble,
    }),
  });
})();
