import './css/styles.css';
import './css/cardStyle.css';
import {fetchCountries} from './js/fetchCountries.js'
import { countryСardTeemplate, countryListTemplate } from './js/murcupTemplates'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import dedounce from 'lodash.debounce'

const DEBOUNCE_DELAY = 300;
let selectCountry = null

const input = document.querySelector('#search-box')
const countryList = document.querySelector('ul.country-list')
const countryCard = document.querySelector('div.country-info')

input.addEventListener('input', dedounce(onInput, DEBOUNCE_DELAY))

function onInput(event) {
    console.log('start')
    selectCountry = event.target.value.trim()
    if (selectCountry === '') {
        countryList.innerHTML = '';
        countryCard.innerHTML = '';
        return;
    }
     console.log('start 2')
    fetchCountries(selectCountry)
        .then(countrys => {
            if (countrys.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                countryList.innerHTML = '';
                countryCard.innerHTML = '';
            }
            if (countrys.length <= 10 || countrys.lengts > 1) {
                const listMarkup = countrys.map(country => countryListTemplate(country));
                countryList.innerHTML = listMarkup.join()
                countryCard.innerHTML = '';
            }
            if (countrys.length === 1) {
                 console.log(countrys)
                const cardMarkup = countrys.map(country => countryСardTeemplate(country));
                countryCard.innerHTML = cardMarkup.join()
                countryList.innerHTML = '';
            }
        }).catch(error => {
            Notify.failure('Oops, there is no country with that name')
            countryList.innerHTML = '';
            countryCard.innerHTML = '';
            return error
        })
    // console.log(fetchCountries(selectCountry))
}

