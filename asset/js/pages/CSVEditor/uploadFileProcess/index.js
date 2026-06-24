import fileDataCheck from "./fileDataCheck.js";

/**
 * Handle upload file csv to process and display in CSVEditor page
 * @param {Object} pageParam - The page parameters
 * @param {string} pageParam.contents - The CSV file contents
 * @param {string} pageParam.delimiter - The CSV delimiter (default: ",")
 * @returns {Object} The processed CSV data including header and rows
 */
export default function uploadFileProcess({
    contents,
    delimiter = ",",
    hasHeader = true,
    skipEmptyLine = true
}) {
    if (!fileDataCheck({contents})) {
        return null;
    }
    // Split the contents into lines
    const lines = contents.split(/\r?\n/);
    // Process the lines into an array of arrays
    const data = lines.map(line => line.length > 0 ? line.split(delimiter) : []);
    // If skipEmptyLine is true, filter out empty lines
    const filteredData = skipEmptyLine ? data.filter(line => line.some(cell => cell.trim() !== "")) : data;
    // If hasHeader is true, separate the header from the data
    const header = hasHeader ? filteredData[0] : null;
    const rows = hasHeader ? filteredData.slice(1) : filteredData;
    return {
        header,
        rows,
        colLength: header ? header.length : (rows[0] ? rows[0].length : 0)
    }
}