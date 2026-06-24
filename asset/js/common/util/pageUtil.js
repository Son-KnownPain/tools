/**
 * asset/js/common/util/pageUtil.js
 * */

// Query selectors for the document
export const d$ = document.querySelector.bind(document);
// Query selectors for all elements matching a selector
export const d$$ = document.querySelectorAll.bind(document);
// Function to change the page by its name
export const judgeWayToDestroy = ({ isHomePage = false }) => {
    const methodPreDestroy = isHomePage ? 'remove' : 'add';
    const methodDestroy = isHomePage ? 'add' : 'remove';
    return {
        preDestroy: function() {
            // Get the elements needed for this component
            const elements = getElement();
            // Show/Hide the search input element
            elements.searchInputDiv.classList[methodPreDestroy]('hidden');
            // Show/Hide the search icon in the navbar
            elements.searchIconNavbar.classList[methodPreDestroy]('hidden');
            elements.searchIconNavbar.classList[methodDestroy]('flex');
        },
        destroy: function() {
            // Get the elements needed for this component
            const elements = getElement();
            // Show/Hide the search input element
            elements.searchInputDiv.classList[methodDestroy]('hidden');
            // Show/Hide the search icon in the navbar
            elements.searchIconNavbar.classList[methodDestroy]('hidden');
            elements.searchIconNavbar.classList[methodPreDestroy]('flex');
        }
    }
};
// Function to get the current page name from the URL
export const getPageName = () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'Home';
    return page;
}
// Function to get common elements used in the page
export default function getElement() {
    // Function to get a single element by selector
    return {
        searchInputDiv: d$('#search-navbar'),
        searchIconNavbar: d$('#search-icon-navbar'),
    };
}