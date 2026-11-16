(function () {
  'use strict';

  const { DRAWINGS, PHRASES, ANSWERS, INTRO } = window.LetsTalk;

  const MAX_CUSTOM_LENGTH = 120;
  const LONG_TEXT_THRESHOLD = 22;
  const SPEECH_RATE = 0.85;
  const SPEECH_LANG = 'nl-NL';
  const FALLBACK_DRAWING = 'bubble';

  const els = Object.freeze({
    picture: document.getElementById('stage-picture'),
    text: document.getElementById('stage-text'),
    speak: document.getElementById('speak-button'),
    phrases: document.getElementById('phrase-tiles'),
    answers: document.getElementById('answer-tiles'),
    form: document.getElementById('custom-form'),
    input: document.getElementById('custom-input'),
    error: document.getElementById('custom-error'),
  });

  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  // Drawings are static, trusted markup from drawings.js — never user input.
  function drawingFor(key) {
    return DRAWINGS[key] || DRAWINGS[FALLBACK_DRAWING];
  }

  function restartEnterAnimation(element) {
    element.classList.remove('is-entering');
    void element.offsetWidth; // force reflow so the animation replays
    element.classList.add('is-entering');
  }

  function showOnStage(item) {
    els.picture.innerHTML = drawingFor(item.drawing);
    els.text.textContent = item.text;
    els.text.classList.toggle('is-long', item.text.length > LONG_TEXT_THRESHOLD);
    restartEnterAnimation(els.picture);
  }

  function markSelected(selectedButton) {
    document.querySelectorAll('.tile[aria-pressed]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === selectedButton));
    });
  }

  function createTile(item, variant) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tile tile--${variant}${item.tone ? ` tile--${item.tone}` : ''}`;
    button.setAttribute('aria-pressed', 'false');

    const picture = document.createElement('span');
    picture.className = 'tile__picture';
    picture.innerHTML = drawingFor(item.drawing);

    const label = document.createElement('span');
    label.className = 'tile__label';
    label.textContent = item.text;

    button.append(picture, label);
    button.addEventListener('click', () => {
      showOnStage(item);
      markSelected(button);
    });
    return button;
  }

  function renderTiles(container, items, variant) {
    const fragment = document.createDocumentFragment();
    items.forEach((item) => fragment.append(createTile(item, variant)));
    container.replaceChildren(fragment);
  }

  function validateCustomText(rawValue) {
    const value = rawValue.trim();
    if (value.length === 0) {
      return { isValid: false, message: 'Typ eerst een woord of zin.' };
    }
    if (value.length > MAX_CUSTOM_LENGTH) {
      return { isValid: false, message: `Gebruik maximaal ${MAX_CUSTOM_LENGTH} tekens.` };
    }
    return { isValid: true, value };
  }

  function handleCustomSubmit(event) {
    event.preventDefault();
    const result = validateCustomText(els.input.value);
    els.error.textContent = result.isValid ? '' : result.message;
    if (!result.isValid) {
      els.input.focus();
      return;
    }
    showOnStage({ text: result.value, drawing: FALLBACK_DRAWING });
    markSelected(null);
    els.input.value = '';
    els.input.blur(); // hide the on-screen keyboard so the stage is visible
  }

  function findDutchVoice() {
    return window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('nl'));
  }

  function speak(text) {
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

  // Keep the tablet screen awake during a conversation (where supported).
  async function requestWakeLock() {
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    try {
      await navigator.wakeLock.request('screen');
    } catch (error) {
      console.warn('Scherm wakker houden is niet gelukt:', error);
    }
  }

  function init() {
    renderTiles(els.phrases, PHRASES, 'phrase');
    renderTiles(els.answers, ANSWERS, 'answer');
    showOnStage(INTRO);

    els.form.addEventListener('submit', handleCustomSubmit);
    els.input.maxLength = MAX_CUSTOM_LENGTH;

    if (canSpeak) {
      els.speak.addEventListener('click', () => speak(els.text.textContent));
    } else {
      els.speak.hidden = true;
    }

    document.addEventListener('pointerdown', requestWakeLock, { once: true });
    document.addEventListener('visibilitychange', requestWakeLock);
  }

  init();
})();
