import test from './prompts/tests/test.mjs';
import webComp from './prompts/tests/webcomp.mjs';
import webcompCDef from './prompts/tests/webcompCDef.mjs';

const actionsIndex = [
    {
        group: "Simple",
    },
    test,
    webComp,
    webcompCDef
];

export default actionsIndex;