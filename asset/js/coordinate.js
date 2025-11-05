import listenEventTogglePage from "./pages/event.js";
import data from "./common/data.js";
import routes from "./config/routes.js";
import messageNotification, { messageTypes } from "./common/util/messageUtil.js";
import getMessage, { messagesIds } from "./common/messages/messages.js";
import usedNumberServiceInvoke from "./common/services/usedNumberService.js";

/// Global variable to hold the destroy function for the current page component
var destroyFunction = null;
let onLoad = true;

/**
 * Coordinate the website by managing page transitions and query parameters.
 */
function coordinate() {
    // Define query selectors for the document
    const d$ = document.querySelector.bind(document);
    const d$$ = document.querySelectorAll.bind(document);
    // Define query selectors for the pages
    let $ = null;
    let $$ = null;

    // Function to handle the click event on the "Choose" button
    async function changePage(pageName) {
        // Define the error function to handle page error
        function errFunction() {
            messageNotification({
                type: messageTypes.ERROR,
                messages: getMessage({
                    arrayInit: true,
                    messageId: messagesIds.__404,
                }),
                onLoad,
            });
        }
        // Define the warning function to handle page error
        function warnFunction() {
            messageNotification({
                type: messageTypes.WARNING,
                messages: getMessage({
                    arrayInit: true,
                    messageId: messagesIds.W0001,
                }),
                onLoad,
            });
        }
        // Get the page element based on the provided page name
        const pageElm = d$(`[data-page="${pageName}"]`);
        // Check if the page element exists
        if (pageElm) {
            // Hide all pages
            d$$('[data-page]').forEach(elm => {
                elm.classList.add('hidden');
            });
            // Show the selected page
            pageElm.classList.remove('hidden');

            // Reset the query selectors to the new page context
            $ = pageElm.querySelector.bind(pageElm);
            $$ = pageElm.querySelectorAll.bind(pageElm);

            // Create a page parameter object with data and query selectors
            const pageParam = {
                data,
                query: {
                    $,
                    $$
                },
                relistenTogglePage() {
                    listenEventTogglePage(redirectPage);
                }
            };
            const pageRoute = routes[pageName];
            // Check if the page has a component and call it with the page parameters
            if (pageRoute && pageRoute.component) {
                // Reset the onLoad variable to false for the new page
                onLoad = false;
                // Reset page title
                document.title = (pageRoute.title + ' | JGen') || 'Unknown Page';
                // If a destroy function exists, call it to clean up the previous page
                if (destroyFunction && typeof destroyFunction === 'function') {
                    destroyFunction();
                }
                // Call the component function with the page parameters
                destroyFunction = await pageRoute.component(pageParam);
                // Invoke increment the used number for the page
                usedNumberServiceInvoke({
                    pageName,
                });
            } else {
                // If the page does not have a component, show an error message
                warnFunction();
            }
        } else {
            // If the page element does not exist, show an error message
            errFunction();
        }
    }

    // Function to listen for the current page based on query parameters
    function redirectPage() {
        // Initialize query parameters
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || 'Home';
        // Capitalize the first letter of each word in the page name
        const pageName = page.split('-').map(page => page.charAt(0).toUpperCase() + page.slice(1)).join('');
        // Redirect to the specified page
        changePage(pageName);
    }

    return {
        // Initialize the website
        init: function() {
            // Listen for the toggle page event on the home page
            listenEventTogglePage(redirectPage);
            // Listen for the current page
            redirectPage();
        }
    };
}
// Coordinate the website
document.addEventListener('DOMContentLoaded', () => {
    const app = coordinate();
    // Initialize the app
    app.init();
});