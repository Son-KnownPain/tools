
/**
 * Handle render csv table in CSVEditor page
 * @param {Object} param0 
 * @param {Array} param0.header - The CSV header row
 * @param {Array} param0.rows - The CSV data rows
 * @param {boolean} param0.hasHeader - Whether the CSV has a header row (default: true)
 * @param {Object} param0.elements - The DOM elements to render the table into
 * @param {Object} param0.pageParam - The page parameters (used for event listeners and other interactions)
 */
export default function renderCsv({
    header,
    rows,
    hasHeader = true,
    elements,
    pageParam,
}) {
    const thList = elements?.thList;
    const trList = elements?.trList;
    // Has header, render the header row
    if (hasHeader) {
        thList.innerHTML = header.map((cell, cellIndex) => {
            let cellDiff = "";
            if (cellIndex % 2 === 0) {
                cellDiff = "bg-gray-100 dark:bg-gray-800";
            }
            return `<th data-cell-index="${cellIndex}" scope="col" class="px-4 py-2 ${cellDiff}">${cell}</th>`;
        }).join("\n");
    } else {
        thList.innerHTML = "";
    }
    // Render the data rows
    trList.innerHTML = rows.map((row, rowIndex) => {
        // If the row is empty (all cells are empty), render a disabled input to maintain the table structure and allow adding new data
        if (row.length === 0) {
            return `<td class="bg-gray-100 dark:bg-gray-800">
                        <input disabled="true" type="text" class="px-4 py-2 border border-transparent text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-inherit" spellcheck="false" />
                    </td>`;
        }
        // Render each cell in the row, applying different background for even/odd cells for better readability
        const rowTdHtml = row.map((cell, cellIndex) => {
            let cellDiff = "";
            if (cellIndex % 2 === 0) {
                cellDiff = "bg-gray-100 dark:bg-gray-800";
            }
            return `<td csv-editor-cell data-col-index="${cellIndex}" data-row-index="${rowIndex}" class="${cellDiff}">
                        <input type="text" class="px-4 py-2 border border-transparent text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-inherit" value="${cell}" spellcheck="false" />
                    </td>`;
        }).join("\n");
        return `<tr csv-editor-row data-row-index="${rowIndex}">
                    ${rowTdHtml}
                </tr>`;
    }).join("\n");

    // Call listenEvent to add event listeners to the rendered table for editing cells, adding/deleting rows/columns, etc.
    listenEvent(pageParam, rows);
}

/**
 * Add event listeners to the rendered CSV table for editing cells, adding/deleting rows/columns, etc.
 * (This function is a placeholder and should be implemented to handle the specific interactions needed for the CSV editor)
 * @param {Object} pageParam - The page parameters (used for accessing data, query parameters, and other interactions)
 * @param {Array} rows - The array of rows to be rendered
 */
function listenEvent(pageParam, rows) {
    // Get the page data and query parameters
    const { data, query: { $, $$ } } = pageParam;
    const totalRow = $("#CSVEditor_totalRow");
    const totalCol = $("#CSVEditor_totalCol");

    const cells = $$("[csv-editor-cell]");
    cells.forEach(cell => {
        cell.addEventListener("click", (e) => {
            const colIndex = parseInt(cell.getAttribute("data-col-index"));
            const rowIndex = parseInt(cell.getAttribute("data-row-index"));
            // Update current cell position in the page data for reference in other interactions (like adding/deleting rows/columns)
            const totalRowCount = totalRow.textContent.split("/")[1];
            const totalColCount = totalCol.textContent.split("/")[1];

            totalRow.textContent = `${rowIndex + 1} / ${totalRowCount}`;
            totalCol.textContent = `${colIndex + 1} / ${totalColCount}`;
        });
    });
}