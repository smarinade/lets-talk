/*
 * Tegels: de knoppen met een plaatje en een woord eronder.
 * Gedeeld door zinnen, antwoorden en mensen.
 */
(function () {
  'use strict';

  const { stage } = window.LetsTalk;

  function drawingPicture(key) {
    const picture = document.createElement('span');
    picture.className = 'tile__picture';
    picture.innerHTML = stage.drawingMarkup(key); // trusted static markup
    return picture;
  }

  function photoPicture(photoUrl) {
    const picture = document.createElement('span');
    picture.className = 'tile__picture tile__picture--photo';
    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = '';
    picture.append(img);
    return picture;
  }

  function markSelected(selectedButton) {
    document.querySelectorAll('.tile[aria-pressed]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === selectedButton));
    });
  }

  /**
   * @param {{ label: string, picture: Node, variant: string, tone?: string,
   *           onSelect: (button: HTMLButtonElement) => void }} options
   */
  function createTile({ label, picture, variant, tone, onSelect }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tile tile--${variant}${tone ? ` tile--${tone}` : ''}`;
    button.setAttribute('aria-pressed', 'false');

    const labelEl = document.createElement('span');
    labelEl.className = 'tile__label';
    labelEl.textContent = label;

    button.append(picture, labelEl);
    button.addEventListener('click', () => onSelect(button));
    return button;
  }

  window.LetsTalk = Object.freeze({
    ...window.LetsTalk,
    tiles: Object.freeze({ createTile, drawingPicture, photoPicture, markSelected }),
  });
})();
