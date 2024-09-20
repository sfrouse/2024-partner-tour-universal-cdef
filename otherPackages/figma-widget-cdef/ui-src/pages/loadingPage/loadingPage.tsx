import React from "react";
import { Layout } from '@contentful/f36-layout';
import { ButtonGroup, GlobalStyles, Spinner, ToggleButton } from '@contentful/f36-components';
import CUIToolbarHeader from "../../ctfl-ui-editor/toolbar-header/ToolbarHeader.js";
import tokens from "../../tokens/output/typescript/tokens.js";
import * as icons from '@contentful/f36-icons';

const LoadingPage = (
  args: {
    errorMsg?: string
  }
) => {

  const {
    errorMsg 
  } = args;

  return (<>
        <GlobalStyles />
        <Layout
          className="app"
          header={
            <Layout.Header>
              <CUIToolbarHeader header="Component Definition" style="app">
                <ButtonGroup>
                  <ToggleButton
                      icon={<icons.MinusIcon />}
                      aria-label='Default Display'
                      size="small"
                      isActive={false}
                      isDisabled
                      onToggle={() => false}
                    />
                  <ToggleButton
                      icon={<icons.ArrowForwardTrimmedIcon />}
                      aria-label='Wide Display'
                      size="small"
                      isActive={false}
                      isDisabled
                      onToggle={() => false}
                    />
                  <ToggleButton
                      icon={<icons.ArrowDownwardIcon />}
                      aria-label='Tall Display'
                      size="small"
                      isActive={false}
                      isDisabled
                      onToggle={() => false}
                    />
                  <ToggleButton
                      icon={<icons.EnvironmentIcon />}
                      aria-label='Tall and Wide Display'
                      size="small"
                      isActive={false}
                      isDisabled
                      onToggle={() => false}
                    />
                </ButtonGroup>
              </CUIToolbarHeader>
              {errorMsg ? (<div className="error-msg">{errorMsg}</div>) : ''}
            </Layout.Header>
          }
          style={{height: '100%'}}
        >
          <Layout.Body
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: tokens.ctfl.spacing["4Xl"]
            }}>
            <Spinner />
          </Layout.Body>
        </Layout>
      </>
      );
}

export default LoadingPage;
