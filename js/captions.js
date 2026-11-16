/*
 * Live ondertiteling: wat jij zegt verschijnt groot in de balk.
 * Gebruikt de spraakherkenning van de browser. Let op: in Chrome gaat het
 * geluid daarvoor naar een server van Google; Safari herkent soms op het apparaat zelf.
 */
(function () {
  'use strict';

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const RECOGNITION_LANG = 'nl-NL';
  const MAX_CAPTION_LENGTH = 120;
  const RESTART_DELAY_MS = 250;

  const FATAL_ERRORS = Object.freeze({
    'not-allowed': 'De microfoon mag niet worden gebruikt. Sta dit toe in de instellingen.',
    'service-not-allowed': 'Ondertiteling is niet beschikbaar in deze browser.',
    'audio-capture': 'Er is geen microfoon gevonden.',
    network: 'Ondertiteling werkt alleen met internet.',
    'language-not-supported': 'Nederlands wordt hier niet herkend.',
  });

  /** Keeps the newest words when a caption gets too long for the screen. */
  function trimCaption(text, maxLength = MAX_CAPTION_LENGTH) {
    const clean = text.trim().replace(/\s+/g, ' ');
    if (clean.length <= maxLength) return clean;
    const tail = clean.slice(-maxLength);
    const firstSpace = tail.indexOf(' ');
    return `…${firstSpace === -1 ? tail : tail.slice(firstSpace + 1)}`;
  }

  function latestTranscript(event) {
    const latest = event.results[event.results.length - 1];
    return latest ? latest[0].transcript : '';
  }

  /**
   * @param {{ onText: (text: string) => void, onListeningChange: (isListening: boolean) => void,
   *           onError: (message: string) => void }} handlers
   */
  function createCaptions({ onText, onListeningChange, onError }) {
    if (!Recognition) {
      return Object.freeze({ isSupported: false, start() {}, stop() {}, toggle() {}, isListening: () => false });
    }

    let recognition = null;
    let shouldListen = false;

    function setListening(value) {
      shouldListen = value;
      onListeningChange(value);
    }

    function startRecognition() {
      recognition = new Recognition();
      recognition.lang = RECOGNITION_LANG;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => onText(trimCaption(latestTranscript(event)));
      recognition.onerror = (event) => {
        const message = FATAL_ERRORS[event.error];
        if (!message) return; // e.g. "no-speech" or "aborted": just keep listening
        console.warn('Ondertiteling gestopt:', event.error);
        setListening(false);
        onError(message);
      };
      // Browsers stop by themselves after a silence; start again while still wanted.
      recognition.onend = () => {
        if (shouldListen) window.setTimeout(restartIfWanted, RESTART_DELAY_MS);
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Ondertiteling starten is mislukt:', error);
        setListening(false);
        onError('Ondertiteling kon niet starten.');
      }
    }

    function restartIfWanted() {
      if (shouldListen) startRecognition();
    }

    function start() {
      if (shouldListen) return;
      setListening(true);
      startRecognition();
    }

    function stop() {
      if (!shouldListen) return;
      setListening(false);
      recognition?.abort();
      recognition = null;
    }

    return Object.freeze({
      isSupported: true,
      start,
      stop,
      toggle: () => (shouldListen ? stop() : start()),
      isListening: () => shouldListen,
    });
  }

  window.LetsTalk = Object.freeze({
    ...window.LetsTalk,
    captions: Object.freeze({ createCaptions, trimCaption }),
  });
})();
