/*
 * Het onderdeel "Mensen": foto's van familie, verzorgers of huisdieren.
 * Tik op een foto om die groot te tonen. Met "Wijzigen" kun je foto's verwijderen.
 */
(function () {
  'use strict';

  const { peopleStore, tiles, stage } = window.LetsTalk;

  const els = Object.freeze({
    tiles: document.getElementById('people-tiles'),
    edit: document.getElementById('people-edit'),
    error: document.getElementById('people-error'),
    file: document.getElementById('people-file'),
    dialog: document.getElementById('person-dialog'),
    form: document.getElementById('person-form'),
    preview: document.getElementById('person-preview'),
    name: document.getElementById('person-name'),
    nameError: document.getElementById('person-name-error'),
    cancel: document.getElementById('person-cancel'),
  });

  let people = [];
  let photoUrls = new Map();
  let isEditing = false;
  let pendingPhoto = null;
  let onBeforeSelect = () => {};

  function showError(message) {
    els.error.textContent = message;
  }

  function syncPhotoUrls(nextPeople) {
    const nextUrls = new Map(nextPeople.map((person) => [
      person.id,
      photoUrls.get(person.id) ?? URL.createObjectURL(person.photo),
    ]));
    photoUrls.forEach((url, id) => {
      if (!nextUrls.has(id)) URL.revokeObjectURL(url);
    });
    photoUrls = nextUrls;
  }

  async function removePerson(person) {
    if (!window.confirm(`${person.name} verwijderen?`)) return;
    try {
      await peopleStore.deletePerson(person.id);
      await refresh();
    } catch (error) {
      console.error('Verwijderen is mislukt:', error);
      showError('Verwijderen is niet gelukt. Probeer het opnieuw.');
    }
  }

  function selectPerson(person, button) {
    if (isEditing) {
      removePerson(person);
      return;
    }
    onBeforeSelect();
    stage.showPhoto({ name: person.name, photoUrl: photoUrls.get(person.id) });
    tiles.markSelected(button);
  }

  function personTile(person) {
    const tile = tiles.createTile({
      label: person.name,
      picture: tiles.photoPicture(photoUrls.get(person.id)),
      variant: 'person',
      onSelect: (button) => selectPerson(person, button),
    });
    if (isEditing) tile.setAttribute('aria-label', `${person.name} verwijderen`);
    return tile;
  }

  function addTile() {
    const tile = tiles.createTile({
      label: 'Foto toevoegen',
      picture: tiles.drawingPicture('plus'),
      variant: 'add',
      onSelect: () => els.file.click(),
    });
    tile.removeAttribute('aria-pressed');
    return tile;
  }

  function render() {
    els.tiles.classList.toggle('is-editing', isEditing);
    els.edit.hidden = people.length === 0;
    els.edit.textContent = isEditing ? 'Klaar' : 'Wijzigen';
    els.edit.setAttribute('aria-pressed', String(isEditing));
    els.tiles.replaceChildren(...people.map(personTile), ...(isEditing ? [] : [addTile()]));
  }

  async function refresh() {
    const nextPeople = await peopleStore.listPeople();
    syncPhotoUrls(nextPeople);
    people = nextPeople;
    if (people.length === 0) isEditing = false;
    render();
  }

  function closeDialog() {
    if (els.preview.src) URL.revokeObjectURL(els.preview.src);
    els.preview.removeAttribute('src');
    pendingPhoto = null;
    els.dialog.close();
  }

  async function handleFileChosen() {
    const [file] = els.file.files;
    els.file.value = ''; // allow choosing the same file again
    if (!file) return;
    showError('');
    try {
      pendingPhoto = await peopleStore.preparePhoto(file);
    } catch (error) {
      console.error('Foto voorbereiden is mislukt:', error);
      showError(error.message || 'Deze foto kan niet worden gebruikt.');
      return;
    }
    els.preview.src = URL.createObjectURL(pendingPhoto);
    els.name.value = '';
    els.nameError.textContent = '';
    els.dialog.showModal();
    els.name.focus();
  }

  async function handleSave(event) {
    event.preventDefault();
    const result = peopleStore.validateName(els.name.value);
    els.nameError.textContent = result.isValid ? '' : result.message;
    if (!result.isValid) {
      els.name.focus();
      return;
    }
    try {
      await peopleStore.addPerson({ name: result.value, photo: pendingPhoto });
      closeDialog();
      await refresh();
    } catch (error) {
      console.error('Bewaren is mislukt:', error);
      els.nameError.textContent = 'Bewaren is niet gelukt. Probeer het opnieuw.';
    }
  }

  function toggleEditing() {
    isEditing = !isEditing;
    render();
  }

  /** @param {{ onBeforeSelect?: () => void }} options */
  async function init(options = {}) {
    onBeforeSelect = options.onBeforeSelect ?? onBeforeSelect;
    els.name.maxLength = peopleStore.MAX_NAME_LENGTH;
    els.file.addEventListener('change', handleFileChosen);
    els.form.addEventListener('submit', handleSave);
    els.cancel.addEventListener('click', closeDialog);
    els.dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeDialog(); });
    els.edit.addEventListener('click', toggleEditing);
    render();
    try {
      await refresh();
    } catch (error) {
      console.error('Mensen laden is mislukt:', error);
      showError('Foto\'s kunnen op dit apparaat niet worden bewaard.');
    }
  }

  window.LetsTalk = Object.freeze({
    ...window.LetsTalk,
    people: Object.freeze({ init }),
  });
})();
