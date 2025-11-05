/**
 * Common logic function that executes a series of logic functions in sequence.
 * @param {Object} params - The options object containing logic functions and parameters.
 */
export default function commonLogic({ beforeLogic, checkLogic, executeLogic, afterLogic, param }) {
    // Define result variable to hold the final result
    let result = {
        error: false,
        messages: []
    };
    // Check if all required parameters are not provided
    if (param === undefined || param === null) {
        throw new Error("Parameter 'param' is required and cannot be null or undefined.");
    }
    // Check if all logic functions are provided and are not of type function
    if (typeof checkLogic !== 'function' || typeof executeLogic !== 'function') {
        throw new Error("All logic functions must be provided and must be of type function.");
    }
    // Execute before logic to prepare the environment
    if (typeof beforeLogic === 'function') {
        result = beforeLogic(param);
        // Check result of before logic
        if (result.error) {
            return result;
        }
    }
    // Execute check logic to validate the parameters
    result = checkLogic(param);
    // Check result of check logic
    if (result.error) {
        return result;
    }
    // Execute main logic to perform the operation
    result = executeLogic(param);
    // Check result of execute logic
    if (result.error) {
        return result;
    }
    // Execute after logic to finalize the operation
    if (typeof afterLogic === 'function') {
        result = afterLogic(param);
    }
    // Return the final result after all logic functions have been executed
    return result;
}