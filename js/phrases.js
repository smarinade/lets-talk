/*
 * De zinnen en antwoorden die op het scherm staan.
 * Nieuwe zin toevoegen? Voeg een regel toe met de tekst en een tekening
 * uit drawings.js.
 */
(function () {
  'use strict';

  const freezeAll = (items) => Object.freeze(items.map((item) => Object.freeze(item)));

  const PHRASES = freezeAll([
    { id: 'hallo', text: 'Hallo!', drawing: 'hand' },
    { id: 'alles-goed', text: 'Alles goed?', drawing: 'smiley' },
    { id: 'gegeten', text: 'Wat heb je gegeten vandaag?', drawing: 'plate' },
    { id: 'geturnd', text: 'Heb je geturnd vandaag?', drawing: 'gym' },
    { id: 'drinken', text: 'Wil je iets drinken?', drawing: 'cup' },
    { id: 'geslapen', text: 'Heb je goed geslapen?', drawing: 'bed' },
    { id: 'pijn', text: 'Heb je ergens pijn?', drawing: 'bandage' },
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
