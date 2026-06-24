
import { checkboxRemember, selectRemember } from "../../common/services/localStorageUtil.js";
import messageNotification, { messageTypes } from "../../common/util/messageUtil.js";
import getMessage, { messagesIds } from "../../common/messages/messages.js";
import uploadFileProcess from "./uploadFileProcess/index.js";
import renderCsv from "./renderCsv/index.js";
import handleDownload from "./download/index.js"; "./download/index.js";

export default function CSVEditor(pageParam) {
    // Get the page data and query parameters
    const { data, query: { $, $$ } } = pageParam;
    // Setting defulat format and remember it
    checkboxRemember('CSVEditor_hasHeader', true);
    checkboxRemember('CSVEditor_skipEmptyLine', true);
    selectRemember('CSVEditor_delitmiter', ',');
    selectRemember('CSVEditor_encoding', 'utf-8');
    // Get file input element
    const fileInputElm = $("#CSVEditor_fileInput");
    const delimiterInputElm = $("#CSVEditor_delitmiter");
    const encodingInputElm = $("#CSVEditor_encoding");
    const hasHeaderElm = $("#CSVEditor_hasHeader");
    const skipEmptyLineElm = $("#CSVEditor_skipEmptyLine");
    const tableContent = $("#CSVEditor_tableContent");
    const thList = $("#CSVEditor_tableContent_thList");
    const trList = $("#CSVEditor_tableContent_trList");
    const totalRow = $("#CSVEditor_totalRow");
    const totalCol = $("#CSVEditor_totalCol");
    // Btn elements
    const downloadCSVBtn = $("#CSVEditor_downloadCSVBtn");
    // Add event listener to the file input element
    delimiterInputElm.addEventListener("change", handleCsv);
    encodingInputElm.addEventListener("change", handleCsv);
    fileInputElm.addEventListener("input", handleCsv);
    hasHeaderElm.addEventListener("change", handleCsv);
    skipEmptyLineElm.addEventListener("change", handleCsv);
    // Function to handle the CSV file input and process it
    function handleCsv() {
        const file = fileInputElm.files[0];
        if (file && file.type === "text/csv") {
            const reader = new FileReader();
            // Load file with the specified encoding
            reader.readAsText(file, (encodingInputElm.value || "utf-8"));
            reader.onload = function(e) {
                const contents = e.target.result;
                // Process the CSV contents here
                const result = uploadFileProcess({
                    contents,
                    delimiter: delimiterInputElm.value || ",",
                    hasHeader: hasHeaderElm.checked,
                    skipEmptyLine: skipEmptyLineElm.checked,
                });
                // Reset input if result is null (means file data check failed)
                if (result) {
                    // Render the CSV table with the processed data
                    renderCsv({
                        header: result.header,
                        rows: result.rows,
                        hasHeader: hasHeaderElm.checked,
                        elements: {
                            thList,
                            trList
                        },
                        pageParam
                    });
                    tableContent.classList.remove("hidden");
                    // Apply the total row and column count to the page
                    totalRow.textContent = `_/${result.rows.length}`;
                    totalCol.textContent = `_/${result.colLength}`;
                } else {
                    tableContent.classList.add("hidden");
                    fileInputElm.value = "";
                }
            }
        } else if (file && file.type !== "text/csv") {
            // Show error message if the file is not a CSV
            messageNotification({
                messages: getMessage({ messageId: messagesIds.E0006 }),
                type: messageTypes.ERROR
            });
        }
    }
    // Add event listener to the download CSV button
    downloadCSVBtn.addEventListener("click", function() {
        handleDownload({
            pageParam,
            options: {
                hasHeader: hasHeaderElm.checked,
                delimiter: delimiterInputElm.value || ",",
                encoding: encodingInputElm.value || "utf-8",
            },
            elements: {
                thList,
                trList
            }
        });
    });
    
    // Destroy function to clean up the page when it is no longer needed
    return function() {
        
    }
}