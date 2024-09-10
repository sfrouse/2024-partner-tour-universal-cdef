import React, { useState } from "react";
import { Flex, IconButton } from '@contentful/f36-components';
import {
    CDEF_LAYOUT_VALUE_TYPES,
    CDefLintResult,
    cDefToString
} from "@contentful-demos/component-definitions/dist/index.js";
import './LintPage.scss';
import CUIToolbarLabel from "../../ctfl-ui-editor/toolbar-label/ToolbarLabel.js";
import { ExternalLinkTrimmedIcon } from '@contentful/f36-icons';

const LintPage = (
    args: {
        lintResults: CDefLintResult | undefined,
        link?: string
    }
) => {
  
    const {
        lintResults,
        link
    } = args;

    const [openErrors, setOpenErrors] = useState<{[key:string]: boolean}>({});

    if (!lintResults) {
        return <div className="lint-page no-selection">No selected node or no component found to lint.</div>;
    }

    return (
        <Flex 
            className="lint-page"
            flexDirection="column">
            <Flex
                flexDirection="row"
                alignItems="baseline"
                paddingTop="spacingXs"
                paddingBottom="spacing2Xs"
                paddingLeft="spacingS"
                paddingRight="spacingS">
                <CUIToolbarLabel
                    value={lintResults.id}
                    style={{flex: 1}}
                    medium strong />
                {link ? (
                    <IconButton
                        icon={<ExternalLinkTrimmedIcon />}
                        aria-label="Lint Entry"
                        as="a"
                        href={link}
                        target="_new" />) : null}
                <CUIToolbarLabel
                    value={`${lintResults.valid ? 'Valid' : `${lintResults.totalErrors} errors`}`}
                    strong />
                <div className="indicator-box">
                    <div className={`indicator ${lintResults.valid ? 'valid' : 'invalid'}`}></div>
                </div>
            </Flex>
            <div className="properties">
                <div className="body scroll-bar">
                    <div className="passed properties-list">
                        {lintResults.properties.map((property: any) => {
                            let typeStr = 'missing';
                            const key = property.name || 'no name';
                            const keyAny = key as any;
                            if (property.property) {
                                if (property.property.enum) {
                                    typeStr = '[enum]';
                                }else{
                                    typeStr = `[${property.property.type}]` || 'unknown';
                                }
                                if ((property.property["x-cdef"] as any)?.hidden === true) {
                                    typeStr = `${typeStr} (hidden)`;
                                }
                                if (typeStr === 'array') {
                                    if (property.property?.items &&
                                        property.property?.items !== true &&
                                        !Array.isArray(property.property?.items)) {
                                        typeStr = `[array of ${cDefToString((property.property.items as any).$ref)}]`
                                    } 
                                }
                                if (typeStr === 'object') {
                                    if (property.property ) {
                                        typeStr = `[${cDefToString(property.property.$ref)}]`
                                    } 
                                }

                                if ((property.property["x-cdef"] as any)?.output?.content?.content === true) {
                                    typeStr = `${typeStr} (content)`;
                                }

                                if ((property.property["x-cdef"] as any)?.output?.webComponent?.slot === true) {
                                    typeStr = `${typeStr} (slot)`;
                                }

                                if (CDEF_LAYOUT_VALUE_TYPES.includes(`${property.property["x-cdef"]?.input?.inputType}`)) {
                                    typeStr = `${typeStr} (layout)`;
                                }
                            }
                            if (property.name === 'componentInstance') typeStr = '(Content Only)';
                            return (
                                <div className="property-row" key={`name_${key}`}>
                                    <div className={`property ${property.valid ? 'valid' : 'invalid'}`}
                                        onClick={() => {
                                            setOpenErrors((val: any) => {
                                                const newValue = val[keyAny] !== undefined ? !val[keyAny] : true;
                                                return {...val, [keyAny]: newValue};
                                            })
                                        }}>
                                        <div className="name">
                                            {property.name}&nbsp;
                                            <span>
                                                {typeStr}
                                            </span>
                                        </div>
                                        <div className="result">
                                            {property.valid ? 'passed' : `issues`}
                                        </div>
                                    </div>
                                    {property.errors.length > 0 && openErrors[keyAny] === true ? (
                                        <ul className="errors">
                                            {property.errors.map((error: { message: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; code: { web: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }; }) => {
                                                return (
                                                    <li className="error">
                                                        {error.message}
                                                        {error.code?.web ? (
                                                            <pre>{error.code.web}</pre>
                                                        ) : ''}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : ''}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Flex>
    );
}

export default LintPage;
