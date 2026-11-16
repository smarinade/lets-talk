/*
 * De zinnen en antwoorden die op het scherm staan.
 * Nieuwe zin toevoegen? Voeg een regel toe met de tekst en een tekening
 * uit drawings.js of drawings-answers.js.
 * Een zin kan eigen antwoorden hebben (answers); die verschijnen boven
 * Ja / Nee / Weet ik niet zodra de zin gekozen is.
 */
(function () {
  'use strict';

  const freezeAll = (items) => Object.freeze(items.map((item) => Object.freeze({
    ...item,
    ...(item.answers ? { answers: freezeAll(item.answers) } : {}),
  })));

  const FEELING_ANSWERS = [
    { id: 'blij', text: 'Blij', drawing: 'happy' },
    { id: 'moe', text: 'Moe', drawing: 'tired' },
    { id: 'verdrietig', text: 'Verdrietig', drawing: 'sad' },
    { id: 'boos', text: 'Boos', drawing: 'angry' },
  ];

  const DRINK_ANSWERS = [
    { id: 'koffie', text: 'Koffie', drawing: 'coffee' },
    { id: 'thee', text: 'Thee', drawing: 'tea' },
    { id: 'water', text: 'Water', drawing: 'water' },
    { id: 'sap', text: 'Sap', drawing: 'juice' },
  ];

  const PAIN_PLACE_ANSWERS = [
    { id: 'hoofd', text: 'Hoofd', drawing: 'painHead' },
    { id: 'buik', text: 'Buik', drawing: 'painBelly' },
    { id: 'rug', text: 'Rug', drawing: 'painBack' },
    { id: 'benen', text: 'Benen', drawing: 'painLegs' },
  ];

  const PAIN_SCALE_ANSWERS = [
    { id: 'pijn-1', text: '1 · Geen pijn', drawing: 'pain1' },
    { id: 'pijn-2', text: '2 · Een beetje', drawing: 'pain2' },
    { id: 'pijn-3', text: '3 · Best veel', drawing: 'pain3' },
    { id: 'pijn-4', text: '4 · Veel', drawing: 'pain4' },
    { id: 'pijn-5', text: '5 · Heel veel', drawing: 'pain5' },
  ];

  const PHRASES = freezeAll([
    { id: 'hallo', text: 'Hallo!', drawing: 'hand' },
    { id: 'alles-goed', text: 'Alles goed?', drawing: 'smiley', answers: FEELING_ANSWERS },
    { id: 'gegeten', text: 'Wat heb je gegeten vandaag?', drawing: 'plate' },
    { id: 'geturnd', text: 'Heb je geturnd vandaag?', drawing: 'gym' },
    { id: 'drinken', text: 'Wil je iets drinken?', drawing: 'cup', answers: DRINK_ANSWERS },
    { id: 'geslapen', text: 'Heb je goed geslapen?', drawing: 'bed' },
    { id: 'pijn', text: 'Heb je ergens pijn?', drawing: 'bandage', answers: PAIN_PLACE_ANSWERS },
    { id: 'hoeveel-pijn', text: 'Hoeveel pijn doet het?', drawing: 'bandage', answers: PAIN_SCALE_ANSWERS },
    { id: 'wandelen', text: 'Zullen we een stukje wandelen?', drawing: 'walk' },
    { id: 'bezoek', text: 'Wie is er op bezoek geweest?', drawing: 'house' },
    { id: 'weer', text: 'Wat voor weer is het buiten?', drawing: 'weather' },
    { id: 'tv', text: 'Zullen we tv kijken?', drawing: 'tv' },
    { id: 'liefde', text: 'Ik hou van je', drawing: 'heart' },
    { id: 'tot-ziens', text: 'Tot ziens!', drawing: 'hand' },
  ]);

  const ANSWERS = freezeAll([
    { id: 'ja', text: 'Ja', drawing: 'yes', tone: 'yes' },
    { id: 'nee', text: 'Nee', drawing: 'no', tone: 'no' },
    { id: 'weet-niet', text: 'Weet ik niet', drawing: 'unknown', tone: 'unknown' },
  ]);

  const INTRO = Object.freeze({ text: 'Kies hieronder een zin', drawing: 'bubble' });

  window.LetsTalk = Object.freeze({
    ...(window.LetsTalk || {}),
    PHRASES,
    ANSWERS,
    INTRO,
  });
})();
