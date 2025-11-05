// asset/js/pages/event.js
function createPageHandler(redirectPage) {
    return function(event) {
        event.preventDefault();
        const pageUrl = event.currentTarget.getAttribute('data-page-redirect');
        if (pageUrl) {
            // Update the URL with the new page
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('page', pageUrl);
            window.history.pushState({}, '', newUrl);
            
            // Redirect to the specified page
            redirectPage();
        }
    };
}
export default function listenEventTogglePage(redirectPage) {
    // Select all buttons with the data-page-redirect attribute
    const buttons = document.querySelectorAll('[data-page-redirect]');
    // Add click event listener to each button
    buttons.forEach(button => {
        // Check if the button already has a handler
        if (button._handler) {
            // If the button already has a handler, remove it
            button.removeEventListener('click', button._handler);
        }
        // Create a new handler for each button
        const handler = createPageHandler(redirectPage);
        // Add the click event listener
        button.addEventListener('click', handler);
        // Store the handler for potential future use
        button._handler = handler;
    });
}