

const ActionSelect =({
    actionId,
    actionList,
    setAction
}) => {
    return (
        <select
            value={actionId}
            onChange={(e) => {
            const selectedAction = actionList?.actions?.find(action => action.id === e.target.value);
            if (selectedAction) {
                const newUrl = `${window.location.origin}/${selectedAction.id}`;
                if (newUrl !== window.location.href) {
                    window.history.pushState({ path: newUrl }, '', newUrl);
                    setAction(null);
                }
            }
            }}
        >
            {actionList?.actions?.map((action, index) => {
            if (action.group) {
                return (
                    <optgroup label={action.group} key={index}>
                        {/* Add individual options for the actions inside the group */}
                        {actionList?.actions
                        .filter(subAction => subAction.group === action.group && subAction.name && subAction.id)
                        .map(subAction => (
                            <option value={subAction.id} key={subAction.id}>
                            {subAction.name}
                            </option>
                        ))}
                    </optgroup>
                );
            }
            // If there's no group, return the option directly
            return (
                <option value={action.id} key={action.id}>
                    {action.name}
                </option>
            );
            })}
        </select>
    )
};

export default ActionSelect;