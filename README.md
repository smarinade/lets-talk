# Laten we praten

<img src="icons/icon.svg" alt="App-icoon: twee tekstballonnen met een hartje" width="96" align="right">

Een eenvoudige webapp om samen te praten met iemand voor wie lezen of horen moeilijk is.
Tik op een zin en die verschijnt groot op het scherm, met een duidelijke tekening erbij.
De app kan de zin ook hardop voorlezen.

**Open de app:** <https://smarinade.github.io/lets-talk/>

## Wat kan de app?

- **Vragen en zinnen.** Kant-en-klare zinnen zoals "Alles goed?", "Wil je iets drinken?" of "Ik hou van je", elk met een eigen tekening.
- **Antwoorden.** Grote knoppen voor *Ja*, *Nee* en *Weet ik niet*.
- **Zelf typen.** Typ een eigen woord of zin (max. 120 tekens) en toon die groot op het scherm.
- **Voorlezen.** Met de luidsprekerknop leest het toestel de zin voor in het Nederlands, als het toestel dat ondersteunt.
- **Scherm blijft aan.** Tijdens het gebruik gaat het scherm niet vanzelf op zwart, als de browser dat toelaat.
- **Installeerbaar en offline.** Zet de app op je beginscherm. Na het eerste bezoek werkt hij ook zonder internet.

## Installeren op je toestel

| Toestel | Hoe |
| --- | --- |
| iPhone / iPad | Open de link in **Safari** → tik op **Deel** → **Zet op beginscherm**. |
| Android | Open de link in **Chrome** → menu (⋮) → **App installeren**. |
| Computer | In Chrome of Edge: klik op het installatie-icoon rechts in de adresbalk. |

## Zinnen aanpassen

Alle zinnen staan in [`js/phrases.js`](js/phrases.js). Een nieuwe zin voeg je toe met één regel:

```js
{ id: 'koffie', text: 'Wil je een kopje koffie?', drawing: 'cup' },
```

- `id`: een unieke naam zonder spaties.
- `text`: de zin die op het scherm komt.
- `drawing`: een van de tekeningen uit [`js/drawings.js`](js/drawings.js):
  `hand`, `smiley`, `plate`, `gym`, `cup`, `bed`, `bandage`, `walk`, `house`,
  `weather`, `tv`, `heart`, `yes`, `no`, `unknown`, `bubble`.

Een nieuwe tekening maak je in `drawings.js` als SVG met een `viewBox` van 200×200 en dezelfde kleuren en lijndikte als de andere tekeningen.

## Lokaal draaien

De app is gewone HTML, CSS en JavaScript, zonder build-stap of dependencies.

```sh
python3 -m http.server 8000
```

Open daarna <http://localhost:8000>. De service worker werkt alleen via `http://localhost` of `https://`, niet als je `index.html` rechtstreeks opent.

## Projectstructuur

```
index.html              Pagina-opbouw
css/styles.css          Opmaak en kleuren
js/drawings.js          Tekeningen (inline SVG)
js/phrases.js           Zinnen en antwoorden
js/app.js               Werking: tegels, tonen, voorlezen, zelf typen
js/pwa.js               Registreert de service worker
sw.js                   Offline-ondersteuning (cache)
manifest.webmanifest    App-gegevens voor installatie
icons/                  App-iconen (SVG-bron + PNG's)
```

### Iconen opnieuw maken

De PNG's worden gemaakt uit de SVG-bestanden met [`rsvg-convert`](https://gitlab.gnome.org/GNOME/librsvg) (`brew install librsvg`):

```sh
rsvg-convert -w 192 -h 192 icons/icon.svg          -o icons/icon-192.png
rsvg-convert -w 512 -h 512 icons/icon.svg          -o icons/icon-512.png
rsvg-convert -w 512 -h 512 icons/icon-maskable.svg -o icons/icon-maskable-512.png
rsvg-convert -w 180 -h 180 icons/icon-maskable.svg -o icons/apple-touch-icon.png
```

## Publiceren

De app staat op GitHub Pages en wordt gepubliceerd vanaf de branch `main` (map `/`).
Elke push naar `main` staat na een paar minuten online.

Wie de app al geopend heeft, ziet een update meestal pas bij de tweede keer openen.
De service worker toont eerst de bewaarde versie en haalt op de achtergrond de nieuwe op.
Hernoem je bestanden of voeg je bestanden toe? Pas dan de lijst `APP_SHELL` in `sw.js` aan en verhoog `CACHE_VERSION`.
