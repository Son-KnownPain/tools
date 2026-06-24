/**
 * asset/js/common/data.js
 * */

// Define the data structure for the page context
const data = {
    home: {
        tools: async function() {
            // Fetch the home data from the JSON file
            return fetch('./asset/js/data/home.json')
            .then(response => response.json())
        }
    },
    genGetterSetter: {
        defaultGetterCommentFormat: `/**\n * {%c}を取得します。\n *\n * @return {%c}\n */`,
        defaultSetterCommentFormat: `/**\n * {%c}を設定します。\n *\n * @param {%v} {%c}\n */`,
    },
    csvEditor: {
        encodingOptions: [
            { value: "utf-8", label: "UTF-8" },
            { value: "shift-jis", label: "Shift_JIS" },
        ],
        delimiterOptions: [
            { value: ",", label: "Dấu phẩy (,)" },
            { value: ";", label: "Dấu chấm phẩy (;)" },
            { value: "|", label: "Gạch đứng (|)" },
            { value: "\t", label: "Tab" },
            { value: " ", label: "Khoảng trắng" },
        ],
    },
};

// Export the data object for use in other modules
export default data;