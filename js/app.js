(function () {
  'use strict';

  const { PHRASES, ANSWERS, INTRO, stage, tiles, people, captions } = window.LetsTalk;

  const MAX_CUSTOM_LENGTH = 120;
  const LISTENING_PLACEHOLDER = '…';

  const els = Object.freeze({
    speak: document.getElementById('speak-button'),
    mic: document.getElementById('mic-button'),
    phrases: document.getElementById('phrase-tiles'),
    contextAnswers: document.getElementById('context-answers'),
    answers: document.getElementById('answer-tiles'),
    form: document.getElementById('custom-form'),
    input: document.getElementById('custom-input'),
    error: document.getElementById('custom-error'),
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const captioning = captions.createCaptions({
    onText: (text) => stage.setText(text || LISTENING_PLACEHOLDER),
    onListeningChange: renderMicState,
    onError: (message) => stage.show({ text: message, drawing: 'mic' }),
  });

  // Anything chosen on screen replaces live captions.
  function stopCaptions() {
    captioning.stop();
  }

  function drawingTile(item, variant, onSelect) {
    return tiles.createTile({
      label: item.text,
      picture: tiles.drawingPicture(item.drawing),
      variant,
      tone: item.tone,
      onSelect,
    });
  }

  function selectItem(item, button) {
    stopCaptions();
    stage.show(item);
    tiles.markSelected(button);
  }

  function scrollIntoViewGently(element) {
    element.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  }

  function renderContextAnswers(phrase) {
    const answers = phrase?.answers ?? [];
    els.contextAnswers.hidden = answers.length === 0;
    els.contextAnswers.replaceChildren(
      ...answers.map((answer) => drawingTile(answer, 'answer', (button) => selectItem(answer, button))),
    );
    if (answers.length > 0) scrollIntoViewGently(els.contextAnswers);
  }

  function selectPhrase(phrase, button) {
    selectItem(phrase, button);
    renderContextAnswers(phrase);
  }

  function renderStaticTiles() {
    els.phrases.replaceChildren(
      ...PHRASES.map((phrase) => drawingTile(phrase, 'phrase', (button) => selectPhrase(phrase, button))),
    );
    els.answers.replaceChildren(
      ...ANSWERS.map((answer) => drawingTile(answer, 'answer', (button) => selectItem(answer, button))),
    );
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
    selectItem({ text: result.value, drawing: stage.FALLBACK_DRAWING }, null);
    renderContextAnswers(null);
    els.input.value = '';
    els.input.blur(); // hide the on-screen keyboard so the stage is visible
  }

  function renderMicState(isListening) {
    els.mic.classList.toggle('is-listening', isListening);
    els.mic.setAttribute('aria-pressed', String(isListening));
    els.mic.setAttribute('aria-label', isListening ? 'Ondertiteling stoppen' : 'Ondertiteling starten');
  }

  function handleMicClick() {
    if (captioning.isListening()) {
      stopCaptions();
      return;
    }
    stage.stopSpeaking(); // otherwise the app would caption its own voice
    tiles.markSelected(null);
    stage.show({ text: LISTENING_PLACEHOLDER, drawing: 'mic' });
    captioning.start();
  }

  function setUpBarButtons() {
    if (stage.canSpeak) {
      els.speak.addEventListener('click', () => {
        stopCaptions();
        stage.speak();
      });
    } else {
      els.speak.hidden = true;
    }

    if (captioning.isSupported) {
      els.mic.addEventListener('click', handleMicClick);
    } else {
      els.mic.hidden = true;
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
    renderStaticTiles();
    stage.show(INTRO);
    setUpBarButtons();

    els.form.addEventListener('submit', handleCustomSubmit);
    els.input.maxLength = MAX_CUSTOM_LENGTH;

    people.init({ onBeforeSelect: () => {
      stopCaptions();
      renderContextAnswers(null);
    } });

    document.addEventListener('pointerdown', requestWakeLock, { once: true });
    document.addEventListener('visibilitychange', requestWakeLock);
  }

  init();
})();
