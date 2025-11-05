import getElement, { judgeWayToDestroy } from "../../common/util/pageUtil.js";
import usedNumberServiceInvoke from "../../common/services/usedNumberService.js";
import pageNameConvertServiceInvoke, { ConvertTypes } from "../../common/services/pageNameConvertService.js";

export default async function Home(pageParam) {
    // Get the data and query selectors from the page parameters
    const { data, query: { $, $$ }, relistenTogglePage } = pageParam;
    // Get the elements needed for the home page
    const elements = getElement();
    // Get table body element
    const tableBody = $('table tbody');
    // Get tools list
    const toolsObj = await data.home.tools();
    const toolList = toolsObj.tools;
    
    // Render the tools in the table body
    renderToolList(tableBody, toolList, relistenTogglePage);

    elements.searchInputDiv.addEventListener('input', (event) => {
        const searchValue = event.target.value;
        const filteredToolList = toolList.filter(tool => tool.name
            .normalize("NFD") // Tách dấu
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );
        renderToolList(tableBody, filteredToolList, relistenTogglePage);
    });

    // Judge whether to show or hide the search input based on the page context
    judgeWayToDestroy({ isHomePage: true }).preDestroy();
    
    // Destroy function to clean up the page when it is no longer needed
    return function() {
        judgeWayToDestroy({ isHomePage: true }).destroy();
    }
}

// Function to render a button redirect to a page based on the button click
function renderPageRouting(isLocal, page) {
    if (isLocal) {
        return `<button data-page-redirect="${page || ''}" type="button" class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            <span class="sr-only">Icon description</span>
        </button>`;
    } else {
        return `<a href="${page || ''}" target="_blank" class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            <span class="sr-only">Icon description</span>
        </a>`;
    }
}

// Function to render the tool list in the table body
function renderToolList(tableBody, toolList, relistenTogglePage) {
    // Sort the tool list with used number
    toolList.sort((a, b) => {
        const usedA = usedNumberServiceInvoke({ pageName: pageNameConvertServiceInvoke(ConvertTypes.COMPONENT, a.page), increment: false });
        const usedB = usedNumberServiceInvoke({ pageName: pageNameConvertServiceInvoke(ConvertTypes.COMPONENT, b.page), increment: false });
        return usedB - usedA; // Sort in descending order
    });
    // Render the tool list in the table body
    tableBody.innerHTML = toolList.map(tool => {
        return `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${tool.name || 'Unknown Tool'}
            </th>
            <td class="px-6 py-4">
                ${tool.local ? 'Nội bộ' : tool.external || 'Unknown'}
            </td>
            <td class="px-6 py-4">
                ${usedNumberServiceInvoke({ pageName: pageNameConvertServiceInvoke(ConvertTypes.COMPONENT, tool.page), increment: false })}
            </td>
            <td class="px-6 py-4">
                ${renderPageRouting(tool.local, tool.page)}
            </td>
        </tr>`;
    }).join('');
    // Add event listener to the table body for dynamic page redirection
    relistenTogglePage();
}