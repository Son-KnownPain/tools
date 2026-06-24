import { d$ } from "../util/pageUtil.js"; 

const KEY = 'REMEMBER_'

/**
 * Remember checkbox status when onchange
 * @param {string} id element id
 * @param {boolean} defaultValue default status is check / uncheck
 */
export function checkboxRemember(id, defaultValue) {
    // Define local storage key
    const keyCompiled = KEY + id;
    // Get value from local storage
    const value = JSON.parse(localStorage.getItem(keyCompiled));
    // Get checkbox element
    const elm = d$('#' + id);
    // Check if element and value is existing
    if (elm && (value || value === false)) {
        elm.checked = value;
    }
    // Else if only element is existing
    else if (elm) {
        elm.checked = defaultValue;
    }
    // Listen onchange
    elm.onchange = function(e) {
        localStorage.setItem(keyCompiled, e.target.checked);
    }
}

/**
 * Remember textarea content
 * @param {string} id element id
 * @param {boolean} defaultValue default content
 */
export function textareaRemember(id, defaultValue) {
    // Define local storage key
    const keyCompiled = KEY + id;
    // Get value from local storage
    const value = JSON.parse(localStorage.getItem(keyCompiled));
    // Get checkbox element
    const elm = d$('#' + id);
    // Check if element and value is existing
    if (elm && value) {
        elm.textContent = value;
    }
    // Else if only element is existing
    else if (elm) {
        elm.textContent = defaultValue;
    }
    // Listen onchange
    elm.oninput = function(e) {
        localStorage.setItem(keyCompiled, JSON.stringify(e.target.value));
    }
}

/**
 * Remember select content
 * @param {string} id element id
 * @param {boolean} defaultValue default content
 */
export function selectRemember(id, defaultValue) {
    // Define local storage key
    const keyCompiled = KEY + id;
    // Get value from local storage
    const value = JSON.parse(localStorage.getItem(keyCompiled));
    // Get select element
    const elm = d$('#' + id);
    // Check if element and value is existing
    if (elm && value) {
        elm.value = value;
    }
    // Else if only element is existing
    else if (elm) {
        elm.value = defaultValue;
    }
    // Listen onchange
    elm.onchange = function(e) {
        localStorage.setItem(keyCompiled, JSON.stringify(e.target.value));
    }
}