


export default function renderFollowUpResults(action, defaultResults) {
    if (action.prompts.length < action.results.length) {
        return action.results[action.results.length-1];
    }
    if (!action.results) return '...no results';

    return defaultResults;
}