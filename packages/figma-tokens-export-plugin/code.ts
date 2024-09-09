// Causes errors... "export {};" at end of page
// import { DMOTokenSheet } from '../shared/types'; 

figma.showUI(__html__, {height: 500, width: 400});

figma.ui.onmessage =  (msg: {type: string, count: number}) => {
  if (msg.type === 'generateTokens') {
    (async () => {
      const tokenSheet = await generateTokensFromVariables();
      const tokenSheetStyles = await generateTokensFromStyles();
      tokenSheet.styles = tokenSheetStyles;
      figma.ui.postMessage({
        tokenSheet,
      });
    })();
  }
  // figma.closePlugin();
};

let variableLookup: {[key:string]: Variable};
async function getVariablesLookup(): Promise<{ [key: string]: Variable; }> {
  if (variableLookup) return variableLookup;
  const variables = await figma.variables.getLocalVariablesAsync();

  // create a variable lookup
  variableLookup = {};
  variables.map((variable: Variable) => variableLookup[variable.id] = variable);
  return variableLookup;
}

async function generateTokensFromVariables(): Promise<any> {
  let internalId = 0;
  const varLookup = await getVariablesLookup();

  // create a variable collection lookup
  const varCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const varCollLookup: {[key:string]: VariableCollection} = {};
  varCollections.map((varColl: VariableCollection) => varCollLookup[varColl.id] = varColl);

  const tokenSheet: any = {
    name: figma.root.name,
    id: `id-${internalId++}`,
    // figmaId: 
    collections: varCollections.map((varColl: VariableCollection) => {
      return {
        name: varColl.name,
        id: `id-${internalId++}`,
        figmaId: varColl.id,
        modes: varColl.modes.map((mode: { modeId: string; name: string }) => {
          return {
            name: mode.name,
            id: `id-${internalId++}`,
            figmaId: mode.modeId,
            tokens: varColl.variableIds.map((varId: string) => {
              const variable = varLookup[varId];
              const value = variable.valuesByMode[mode.modeId] as any;
              let finalType: any = variable.resolvedType;

              // Type Alternatives...
              if (value && isObject(value) && (value as any).type === "VARIABLE_ALIAS") {
                const aliasVariable = varLookup[(value as VariableAlias).id];
                const aliasVariableColl = varCollLookup[aliasVariable.variableCollectionId];
                value.variableName = aliasVariable.name;
                value.collectionName = aliasVariableColl.name;
                finalType = 'ALIAS';
              }

              if (finalType === 'FLOAT') {
                if (variable.name.indexOf('/weight/') !== -1 ) {
                  finalType = 'INT';
                }else{
                  finalType = 'DIMENSION';
                }
              }
              
              return {
                name: variable.name,
                id: `id-${internalId++}`,
                figmaId: varId,
                type: finalType,
                value
              }
            })
          }
        })
      }
    })
  };

  return tokenSheet
}

async function generateTokensFromStyles(): Promise<any> {
  const varLookup = await getVariablesLookup();
  const textStyles = await figma.getLocalTextStylesAsync();
  const textStyleTokens = [];
  for (const textStyle of textStyles) {
    console.log('textStyle', (textStyle as any).boundVariables );
    const boundVars = (textStyle as any).boundVariables;
    const fontFamily = boundVars.fontFamily;
    const fontSize = boundVars.fontSize;
    const fontWeight = boundVars.fontWeight;
    const lineHeight = boundVars.lineHeight;

    if (
      !fontFamily ||
      !fontSize ||
      !fontWeight ||
      !lineHeight
    ) {
      console.log('Text Style missing variables', textStyle.name);
      return;
    }
    const variable = varLookup[fontFamily.id];
    console.log('variable', fontFamily);
    textStyleTokens.push({
      name: textStyle.name,
      id: textStyle.id,
      type: 'textStyle',
      fontFamily: varLookup[fontFamily.id].name,
      fontSize: varLookup[fontSize.id].name,
      fontWeight: varLookup[fontWeight.id].name,
      lineHeight: varLookup[lineHeight.id].name,
    })
  }
  return textStyleTokens;
}

function isObject(a: any) {
  return (typeof a === "object" || typeof a === 'function') && (a !== null) && !Array.isArray(a);
}
