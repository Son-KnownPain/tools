import getElement, { judgeWayToDestroy } from "../../common/util/pageUtil.js";

export default function FieldComment(pageParam) {
    // Get the page data and query parameters
    const { data, query: { $, $$ } } = pageParam;
    // Get the elements needed for this component
    const elements = getElement();
    
    // Judge whether to show or hide the search input based on the page context
    judgeWayToDestroy({ isHomePage: false }).preDestroy();
    
    // Destroy function to clean up the page when it is no longer needed
    return function() {
        judgeWayToDestroy({ isHomePage: false }).destroy();
    }
}