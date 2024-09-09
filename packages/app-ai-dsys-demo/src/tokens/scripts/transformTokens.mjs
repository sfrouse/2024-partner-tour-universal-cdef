import findTokenNameMetrics from './utils/findTokenNameMetrics.mjs';
import postProcessTokens from './utils/postProcessTokens.mjs';
import contentfulAliasTokenCheck from './contentful/contentfulAliasTokenCheck.mjs';
import contentfulDimensionTokenCheck from './contentful/contentfulDimensionTokenCheck.mjs';
import contentfulPostProcess from './contentful/contentfulPostProcess.mjs';
import contentfulRender from './contentful/contentfulRender.mjs';
import typescriptRender from './typescript/typescriptRender.mjs';
import cssRender from './css/cssRender.mjs';
import scssRender from './scss/scssRender.mjs';
import tailwindRender from './tailwind/tailwindRender.mjs';
import fs from 'fs';
import tokenValuesToCssProps from './utils/tokenValuesToCssProps.mjs';

export default async function transformTokens(
    tokens,
    prefix,
    dest
) {
    const tokensByMode = {};
    const contentfulTokens = {
        sizing: {},
        spacing: {},
        color: {},
        border: {},
        fontSize: {},
        lineHeight: {},
        letterSpacing: {},
        textColor: {},
        borderRadius: {},
    };

    // find rem-base first...dimensionBase
    let remBase;
    tokens.collections.find(collection => {
        return collection.modes.find(mode => {
            return mode.tokens.find(token => {
                if (token.name === 'rem-base') {
                    remBase = token.value;
                    return true;
                }
                return false;
            });
        })
    });

    tokens.collections.map(collection => {
        const collectionName = collection.name;
        collection.modes.map((mode, modeIndex) => {
            const modeLookupName = modeIndex === 0 ? 'default' : mode.name;

            if (!tokensByMode[modeLookupName]) {
                tokensByMode[modeLookupName] = {};
            }
            const tokenNode = tokensByMode[modeLookupName];

            mode.tokens.map(token => {
                const {
                    tokenNameArr,
                    tokenLeafName,
                } = findTokenNameMetrics(
                    token.name,
                    collection.name,
                    prefix
                );

                // create missing objects
                let tokenNodeTarget = tokenNode;
                tokenNameArr.map(segment => {
                    if (!tokenNodeTarget[segment]) tokenNodeTarget[segment] = {};
                    tokenNodeTarget = tokenNodeTarget[segment];
                });
                
                switch (token.type) {
                    case 'COLOR' :
                        const alpha = `${((token.value.a / 1  * 1000) / 1000 ).toFixed(2)}`;
                        const colorStr = `rgba( ${
                                Math.round((token.value.r / 1 ) * 255)
                            }, ${
                                Math.round((token.value.g / 1 ) * 255)
                            }, ${
                                Math.round((token.value.b / 1 ) * 255)
                            }, ${
                                alpha === '1.00' ? '1' : alpha
                            } )`;
                        tokenNodeTarget[tokenLeafName] = colorStr;
                        break;
                    case 'ALIAS' : 
                        const aliasNameMetrics = findTokenNameMetrics(
                            token.value.variableName,
                            token.value.collectionName,
                            prefix
                        );
                        tokenNodeTarget[tokenLeafName] = aliasNameMetrics.tokenCSSProperty;
                        contentfulAliasTokenCheck(
                            modeIndex,
                            collectionName,
                            token,
                            contentfulTokens,
                            aliasNameMetrics
                        )
                        break;
                    case 'BOOLEAN' :
                        // not sure what this would be in css
                        tokenNodeTarget[tokenLeafName] = token.value ? '1' : '0';
                        break;
                    case 'STRING' :
                        tokenNodeTarget[tokenLeafName] = token.value;
                        break;
                    case 'DIMENSION' :
                        const isPixel = (token.name.indexOf('breakpoint') === 0);
                        if (remBase && !isPixel) {
                            const em = token.value / remBase;
                            tokenNodeTarget[tokenLeafName] = `${em.toFixed(4)}rem`;
                        }else{
                            tokenNodeTarget[tokenLeafName] = `${token.value}px`;
                        }
                        contentfulDimensionTokenCheck(
                            modeIndex,
                            collectionName,
                            token,
                            contentfulTokens
                        );
                        break;
                    case 'INT' :
                    case 'FLOAT' :
                        tokenNodeTarget[tokenLeafName] = `${token.value}`;
                        break;
                    default :
                        break;
                }
                return false;
            });
        });
    });
    
    // Typography Clustering
    postProcessTokens( tokensByMode );
    contentfulPostProcess( tokensByMode.default , contentfulTokens, remBase );

    const writeFileArr = [];

    // === CTFL TOKENS ===
    contentfulRender(dest, writeFileArr, contentfulTokens);

    // === CSS ===========
    cssRender(dest, writeFileArr, tokensByMode, prefix, remBase);

    // ---------- CSS PROPS ONLY -----------------
    // The below only need to refer to their css props instead of actual values
    const defaultTokensWithCssProps = tokenValuesToCssProps(tokensByMode.default, prefix);

    // === TYPESCRIPT ====
    typescriptRender(dest, writeFileArr, defaultTokensWithCssProps, prefix);

    // === SCSS ==========
    scssRender(dest, writeFileArr, defaultTokensWithCssProps, prefix);

    // === TAILWIND ==========
    tailwindRender(dest, writeFileArr, defaultTokensWithCssProps, prefix);

    // tokensByMode for reference
    writeFileArr.push(fs.promises.writeFile(
        `${dest}/tokensByMode.json`,
        `${JSON.stringify(tokensByMode, null, 2)}`
    ));

    // finish up...
    await Promise.all(writeFileArr);
}
