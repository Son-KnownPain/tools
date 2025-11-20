
import { judgeWayToDestroy } from "../../common/util/pageUtil.js";
import before from "./logic/before.js";
import check from "./logic/check.js";
import execute from "./logic/execute.js";
import after from "./logic/after.js";
import commonLogic from "../../common/logic/commonLogic.js";
import { checkboxRemember, textareaRemember } from "../../common/services/localStorageUtil.js";
import messageNotification, { messageTypes } from "../../common/util/messageUtil.js";
import getMessage, { messagesIds } from "../../common/messages/messages.js";

export default function GenGetterSetter(pageParam) {
    // Judge whether to show or hide the search input based on the page context
    judgeWayToDestroy({ isHomePage: false }).preDestroy();
    // Get the page data and query parameters
    const { data, query: { $, $$ } } = pageParam;
    // Setting defulat format and remember it
    textareaRemember('GenGetterSetter_getterFormat', data.genGetterSetter.defaultGetterCommentFormat);
    textareaRemember('GenGetterSetter_setterFormat', data.genGetterSetter.defaultSetterCommentFormat);
    textareaRemember('GenGetterSetter_fieldToGen', '');
    checkboxRemember('GenGetterSetter_isGetterGen', true);
    checkboxRemember('GenGetterSetter_isSetterGen', true);
    checkboxRemember('GenGetterSetter_autoGenCheckbox', false);
    checkboxRemember('GenGetterSetter_listenFieldCommentGen', false);
    checkboxRemember('GenGetterSetter_autoCopy', false);

    // Generate button
    const generateBtn = $('.generate-btn');
    // Copy to clipboard button
    const copyBtn = $('.copy-btn');
    // Getter comment format textarea
    const getterFormatTextarea = $('#GenGetterSetter_getterFormat');
    // Setter comment format textarea
    const setterFormatTextarea = $('#GenGetterSetter_setterFormat');
    // Is getter generate checkbox
    const isGetterGenCheckbox = $('#GenGetterSetter_isGetterGen');
    // Is setter generate checkbox
    const isSetterGenCheckbox = $('#GenGetterSetter_isSetterGen');
    // Auto generate checkbox
    const autoGenCheckbox = $('#GenGetterSetter_autoGenCheckbox');
    // Auto copy checkbox
    const autoCopyCheckbox = $('#GenGetterSetter_autoCopy');
    // Get the state of the auto generate checkbox
    const autoGenCheckboxChecked = autoGenCheckbox.checked;
    // If auto generate is checked, hide the generate button
    const fieldToGenTextarea = $('#GenGetterSetter_fieldToGen');
    // Get the state of the auto copy checkbox
    const autoCopyCheckboxChecked = autoCopyCheckbox.checked;
    // When clicking the generate button
    generateBtn.onclick = function() {
        const contentGen = fieldToGenTextarea.value.trim();
        const getterFormat = getterFormatTextarea.value;
        const setterFormat = setterFormatTextarea.value;
        const isGetterGen = isGetterGenCheckbox.checked;
        const isSetterGen = isSetterGenCheckbox.checked;
        if (contentGen) {
            // Execute common logic with the provided parameters
            const result = commonLogic({
                beforeLogic: before,
                checkLogic: check,
                executeLogic: execute,
                afterLogic: after,
                param: {
                    content: contentGen,
                    getterFormat: getterFormat,
                    setterFormat: setterFormat,
                    isGetterGen: isGetterGen,
                    isSetterGen: isSetterGen,
                }
            });

            // If there is an error, show an error message
            if (result.error) {
                messageNotification({
                    title: 'Xử lí bị hủy bỏ do dữ liệu không hợp lệ',
                    type: messageTypes.ERROR,
                    messages: result.messages,
                });
            } else {
                $('#GenGetterSetter_result').value = result.generatedContent;
            }
        } else {
            messageNotification({
                type: messageTypes.ERROR,
                messages: getMessage({
                    arrayInit: true,
                    messageId: messagesIds.E0001,
                }),
            });
        }
    };
    if (autoGenCheckboxChecked) {
        generateBtn.click();
        fieldToGenTextarea.onchange = function() {
            generateBtn.click();
            if (autoCopyCheckboxChecked) {
                copyBtn.click();
            }
        };
    }
    // When clicking the copy to clipboard button
    copyBtn.onclick = function() {
        const resultTextarea = $('#GenGetterSetter_result');
        resultTextarea.select(); // Select the text field
        resultTextarea.setSelectionRange(0, 99999); // For mobile devices

        navigator.clipboard.writeText(resultTextarea.value);
    }

    // Destroy function to clean up the page when it is no longer needed
    return function() {
        judgeWayToDestroy({ isHomePage: false }).destroy();
    }
}