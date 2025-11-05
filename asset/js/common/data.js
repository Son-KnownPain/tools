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
    }
};

// Export the data object for use in other modules
export default data;