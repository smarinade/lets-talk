/*
 * Het podium: de grote tekening (of foto) en de tekstbalk eronder.
 * Ook het voorlezen zit hier, omdat dat altijd de tekst in de balk betreft.
 */
(function () {
  'use strict';

  const { DRAWINGS } = window.LetsTalk;

  const LONG_TEXT_THRESHOLD = 22;
  const VERY_LONG_TEXT_THRESHOLD = 60;
  const SPEECH_RATE = 0.85;
  const SPEECH_LANG = 'nl-NL';
  const FALLBACK_DRAWING = 'bubble';

  const pictureEl = document.getElementById('stage-picture');
  const textEl = document.getElementById('stage-text');

  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  // Drawings are static, trusted markup from drawings*.js — never user input.
  function drawingMarkup(key) {
    return DRAWINGS[key] || DRAWINGS[FALLBACK_DRAWING];
  }

  function restartEnterAnimation() {
    pictureEl.classList.remove('is-entering');
    void pictureEl.offsetWidth; // force reflow so the animation replays
    pictureEl.classList.add('is-entering');
  }

  function setText(text) {
    textEl.textContent = text;
    textEl.classList.toggle('is-long', text.length > LONG_TEXT_THRESHOLD);
    textEl.classList.toggle('is-very-long', text.length > VERY_LONG_TEXT_THRESHOLD);
  }

  function show(item) {
    pictureEl.innerHTML = drawingMarkup(item.drawing);
    setText(item.text);
    restartEnterAnimation();
  }

  // Photos come from the user, so they are added as DOM nodes, never as markup.
  function showPhoto({ name, photoUrl }) {
    const img = document.createElement('img');
    img.className = 'stage__photo';
    img.src = photoUrl;
    img.alt = name;
    pictureEl.replaceChildren(img);
    setText(name);
    restartEnterAnimation();
  }

  function findDutchVoice() {
    return window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('nl'));
  }

  function speak() {
    const text = textEl.textContent;
    if (!canSpeak || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = SPEECH_LANG;
      utterance.rate = SPEECH_RATE;
      const voice = findDutchVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Voorlezen is mislukt:', error);
    }
  }

  function stopSpeaking() {
    if (canSpeak) window.speechSynthesis.cancel();
  }

  window.LetsTalk = Object.freeze({
    ...window.LetsTalk,
    stage: Object.freeze({
      show, showPhoto, setText, speak, stopSpeaking, canSpeak, drawingMarkup, FALLBACK_DRAWING,
    }),
  });
})();
