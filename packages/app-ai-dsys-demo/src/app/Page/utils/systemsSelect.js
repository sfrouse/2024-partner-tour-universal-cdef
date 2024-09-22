

const SystemSelect =({
    systemId,
    systemsList,
    setSystemId
}) => {
    return (
        <select
            value={systemId}
            onChange={(e) => {
                const selectedAction = systemsList?.systems?.find(system => system.id === e.target.value);
                if (selectedAction) {
                    setSystemId(selectedAction.id);
                }else{
                    setSystemId('text')
                }
            }}
        >
            {systemsList?.systems?.map((system, index) => {
            if (system.group) {
                return (
                    <optgroup label={system.group} key={index}>
                        {/* Add individual options for the systems inside the group */}
                        {systemsList?.systems
                        .filter(subAction => subAction.group === system.group && subAction.name && subAction.id)
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
                <option value={system.id} key={system.id}>
                    {system.name}
                </option>
            );
            })}
        </select>
    )
};

export default SystemSelect;