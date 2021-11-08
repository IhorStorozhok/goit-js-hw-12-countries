import '/sass/main.scss';
import fetchCountries from '../js/fetchCountries';
import { defaults, error, Stack } from '@pnotify/core';

import '@pnotify/core/dist/BrightTheme.css';
import listMarkup from './templates/markupList.hbs';
import countryMarkup from './templates/countryMarkup.hbs';
import debounce from 'lodash.debounce';

defaults.width = '600px';
defaults.maxTextHeight = '200px';
defaults.closer = false;
defaults.sticker = false;
defaults.delay = 1000;

const stackBottomModal = new Stack({
  dir1: 'top', // With a dir1 of "up", the stacks will start appearing at the bottom.
  dir2: 'right',
  // Without a `dir2`, this stack will be horizontally centered, since the `dir1` axis is vertical.
  firstpos1: 20, // The notices will appear 25 pixels from the bottom of the context.
  // Without a `spacing1`, this stack's notices will be placed 25 pixels apart.
  push: 'top', // Each new notice will appear at the bottom of the screen, which is where the "top" of the stack is. Other notices will be pushed up.
  modal: true, // When a notice appears in this stack, a modal overlay will be created.
  overlayClose: true, // When the user clicks on the overlay, all notices in this stack will be closed.
  context: document.body, // The notices will be placed in the "page-container" element.
});

const refs = {
  countryInput: document.querySelector('.countryInput-js'),
  countriesList: document.querySelector('.countrieslist'),
};

refs.countryInput.addEventListener('input', debounce(onInputGetCountries, 500));

function onInputGetCountries(ev) {
  let inputValue = '';
  inputValue = ev.target.value.trim();
  if (inputValue.match('^[a-zA-Zs" "]+$')) {
    fetchCountries(inputValue).then(response => {
      refs.countriesList.innerHTML = '';

      if (response.length > 10) {
        return makeAlartNotification();
      }
      if (response.length > 1) {
        return makeCountriesList(response);
      }

      return makeMarkup(response[0]);
    });
  } else {
  }
}

function makeAlartNotification() {
  if (stackBottomModal.length < 1) {
    error({
      text: 'Too many matches found. Please enter a more specific query!',
      stack: stackBottomModal,
    });
  }
}
function makeCountriesList(data) {
  const markup = listMarkup(data);
  refs.countriesList.insertAdjacentHTML('beforeend', markup);
}
function makeMarkup(data) {
  const markup = countryMarkup(data);
  refs.countriesList.insertAdjacentHTML('beforeend', markup);
}
