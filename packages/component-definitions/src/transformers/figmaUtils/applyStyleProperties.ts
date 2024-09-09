import { CDefDesignProperty } from "../../decorators/defineComponent";
import { CDefInstance, CDefTokenLookup } from "../../types";
import {
    findFigmaCompositePropViaTokenLookup,
    findFigmaPropViaTokenLookup
} from "../../utils/findViaTokenLookup";

export async function applyStyleProperties(
    figmaInstance: InstanceNode,
    defInstance: CDefInstance,
    tokenLookup: CDefTokenLookup | undefined,
    allVarsLookup: {[name:string]: {}[]},
    figma: any, // Figma API
) {
    // get variables once
    // const allVarsLookup = await getAllVariablesLookup(figma);

    // external library styles don't work...
    // let allStyles: any[] = [];
    // allStyles = [...allStyles, ...await figma.getLocalPaintStylesAsync()];
    // allStyles = [...allStyles, ...await figma.getLocalTextStylesAsync()];
    // allStyles = [...allStyles, ...await figma.getLocalEffectStylesAsync()];
    // allStyles = [...allStyles, ...await figma.getLocalGridStylesAsync()];

    const defInstanceEntries = Object.entries(defInstance);
    for (const [key, value] of defInstanceEntries) {
        switch (key) {
            case CDefDesignProperty.BACKGROUND_COLOR : {
                const figmaProp = findFigmaPropViaTokenLookup(`${value}`, tokenLookup);
                const figmaPropVar = await findPropertyObjectVariable(figmaProp, allVarsLookup, figma);
                if (figmaPropVar) {
                    figmaInstance.fills = [
                        figma.variables.setBoundVariableForPaint(
                            figma.util.solidPaint('#000000ff'),
                            'color',
                            figmaPropVar
                        )
                    ];
                }
                // TODO: find style...
                break;
            }
            case CDefDesignProperty.TEXT_COLOR : {
                const figmaProp = findFigmaPropViaTokenLookup(`${value}`, tokenLookup);
                const figmaPropVar = await findPropertyObjectVariable(figmaProp, allVarsLookup, figma);
                if (figmaPropVar) {
                    figmaInstance.children.map((child: any) => {
                        if (child.type === 'TEXT') {
                            child.fills = [
                                figma.variables.setBoundVariableForPaint(
                                    figma.util.solidPaint('#000000ff'),
                                    'color',
                                    figmaPropVar
                                )
                            ];
                        }
                    });
                }
                break;
            }
            case CDefDesignProperty.FONT : {
                const figmaProp = findFigmaCompositePropViaTokenLookup(`${value}`, tokenLookup);
                if (figmaProp && typeof figmaProp === 'object') {
                    const weightFigmaProp = findFigmaPropViaTokenLookup(`${figmaProp.weight}`, tokenLookup);
                    const weightFigmaPropVar = await findPropertyObjectVariable(weightFigmaProp, allVarsLookup, figma);

                    const sizeFigmaProp = findFigmaPropViaTokenLookup(`${figmaProp.size}`, tokenLookup);
                    const sizeFigmaPropVar = await findPropertyObjectVariable(sizeFigmaProp, allVarsLookup, figma);

                    const lineHeightFigmaProp = findFigmaPropViaTokenLookup(`${figmaProp.lineHeight}`, tokenLookup);
                    const lineHeightFigmaPropVar = await findPropertyObjectVariable(lineHeightFigmaProp, allVarsLookup, figma);

                    const familyFigmaProp = findFigmaPropViaTokenLookup(`${figmaProp.family}`, tokenLookup);
                    const familyFigmaPropVar = await findPropertyObjectVariable(familyFigmaProp, allVarsLookup, figma);

                    figmaInstance.children.map((child: any) => {
                        if (child.type === 'TEXT') {
                            child.setBoundVariable(
                                'fontWeight',
                                weightFigmaPropVar
                            );
                            child.setBoundVariable(
                                'fontSize',
                                sizeFigmaPropVar
                            );
                            child.setBoundVariable(
                                'lineHeight',
                                lineHeightFigmaPropVar
                            );
                            // TODO: see if font needs to be loaded?
                            child.setBoundVariable(
                                'fontFamily',
                                familyFigmaPropVar
                            );
                        }
                    });
                }
                break;
            }
            case CDefDesignProperty.BORDER_COLOR : {
                const figmaProp = findFigmaPropViaTokenLookup(`${value}`, tokenLookup);
                const figmaPropVar = await findPropertyObjectVariable(figmaProp, allVarsLookup, figma);
                if (figmaPropVar) {
                    const newStrokes: any[] = [
                        figma.variables.setBoundVariableForPaint(
                            figma.util.solidPaint('#000000ff'),
                            'color',
                            figmaPropVar
                        )
                    ];
                    figmaInstance.strokes = newStrokes;
                }
                // TODO: find style...
                break;
            }
            case CDefDesignProperty.PADDING : {
                // TODO: split into four...
                const figmaProp = findFigmaPropViaTokenLookup(`${value}`, tokenLookup);
                const figmaPropVar = await findPropertyObjectVariable(figmaProp, allVarsLookup, figma);
                if (figmaPropVar) {
                    figmaInstance.setBoundVariable('paddingLeft', figmaPropVar);
                    figmaInstance.setBoundVariable('paddingRight', figmaPropVar);
                    figmaInstance.setBoundVariable('paddingTop', figmaPropVar);
                    figmaInstance.setBoundVariable('paddingBottom', figmaPropVar);
                }
                break;
            }
            case CDefDesignProperty.CORNER_RADIUS : {
                // TODO: split into four...
                const figmaProp = findFigmaPropViaTokenLookup(`${value}`, tokenLookup);
                const figmaPropVar = await findPropertyObjectVariable(figmaProp, allVarsLookup, figma);
                if (figmaPropVar) {
                    figmaInstance.setBoundVariable('topLeftRadius', figmaPropVar);
                    figmaInstance.setBoundVariable('topRightRadius', figmaPropVar);
                    figmaInstance.setBoundVariable('bottomLeftRadius', figmaPropVar);
                    figmaInstance.setBoundVariable('bottomRightRadius', figmaPropVar);
                }
                break;
            }
            case CDefDesignProperty.BORDER_WIDTH : {
                // TODO: split into four...
                const figmaProp = findFigmaPropViaTokenLookup(`${value}`, tokenLookup);
                const figmaPropVar = await findPropertyObjectVariable(figmaProp, allVarsLookup, figma);
                if (figmaPropVar) {
                    figmaInstance.setBoundVariable('strokeTopWeight', figmaPropVar);
                    figmaInstance.setBoundVariable('strokeRightWeight', figmaPropVar);
                    figmaInstance.setBoundVariable('strokeBottomWeight', figmaPropVar);
                    figmaInstance.setBoundVariable('strokeLeftWeight', figmaPropVar);
                }
                break;
            }
            // case CDefDesignProperty.BORDER_STYLE : {
            //     // TODO: split into four...
            //     const figmaProp = findFigmaPropViaTokenLookup(`${value}`, tokenLookup);
            //     const figmaPropVar = await findPropertyObjectVariable(figmaProp, allVarsLookup, figma);
            //     if (figmaPropVar) {
            //         figmaInstance.setBoundVariable('strokeTopWeight', figmaPropVar);
            //     }
            //     break;
            // }
        }

    }
}

export async function findPropertyObjectVariable(
    figmaPropStr: string | undefined,
    allVarsLookup: any,
    figma: any
) {
    if (!figmaPropStr) return;
    if (figmaPropStr.indexOf('variable:') === 0) {
        const figmaVarName = figmaPropStr.substring('variable:'.length);
        const varObjReference = allVarsLookup[figmaVarName];
        if (varObjReference && varObjReference.length > 0) {
            const varObj = await figma.variables.importVariableByKeyAsync(varObjReference[0].key);
            return varObj;
        }
    }
    return;
}

export async function getAllVariablesLookup(figma: any) {
    const allVarsLookup: {[name:string]: {}[]}= {};
    const localVariables = await figma.variables.getLocalVariablesAsync();
    const libraryVariableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    for (const libraryVarCollection of libraryVariableCollections) {
        const teamVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libraryVarCollection.key);
        teamVariables.map((teamVar: any) => {
            if (!allVarsLookup[teamVar.name]) allVarsLookup[teamVar.name] = [];
            allVarsLookup[teamVar.name].push(teamVar); // could be dups...just using first however...
        });
    }
    // put local as last...
    localVariables.map((localVar: any) => {
        if (!allVarsLookup[localVar.name]) allVarsLookup[localVar.name] = [];
        allVarsLookup[localVar.name].push(localVar); // could be dups...just using first however...
    })
    return allVarsLookup;
}