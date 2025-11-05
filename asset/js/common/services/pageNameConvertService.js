/**
 * Convert page name
 * @param {ConvertTypes} convertType convert type for page name conversion
 * @param {string} arg arg to convert
 */
export default function pageNameConvertServiceInvoke(convertType, arg) {
    switch (convertType) {
        case ConvertTypes.COMPONENT:
            return arg.split("-").map(a => a.charAt(0).toUpperCase() + a.slice(1)).join('');
        case ConvertTypes.REDIRECT:
            return arg.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        default:
            console.warn(`Unknown convert type: ${convertType}`);
            return '';
    }
}

/**
 * Convert types for page name conversion
 * @typedef {Object} ConvertTypes
 */
export const ConvertTypes = {
    COMPONENT: 1,
    REDIRECT: 2
};