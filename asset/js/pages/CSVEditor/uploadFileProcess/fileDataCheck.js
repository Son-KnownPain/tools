
import messageNotification, { messageTypes } from "../../../common/util/messageUtil.js";
import getMessage, { messagesIds } from "../../../common/messages/messages.js";

/**
 * Check the CSV file data and return the result to process and display in CSVEditor page
 * @param {Object} param0 
 * @param {string} param0.contents - The CSV file contents
 * @param {string} param0.delimiter - The CSV delimiter (default: ",")
 * @param {boolean} param0.hasHeader - Whether the CSV has a header row (default: true)
 * @param {boolean} param0.skipEmptyLine - Whether to skip empty lines (default: true)
 */
export default function fileDataCheck({
    contents
}) {
    // Split the contents into lines
    const lines = contents.split(/\r?\n/);
    // If there are no lines or only empty lines, return an error message
    if (lines.length === 0 || lines.every(line => line.trim() === "")) {
        messageNotification({
            messages: getMessage({ messageId: messagesIds.E0007 }),
            type: messageTypes.ERROR
        });
        return false;
    }
    return true;
}