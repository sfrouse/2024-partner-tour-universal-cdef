import React, { useEffect, useState } from "react";
import "./App.scss";
import "./tokens/output/css/variables.css";
import {
  CDefLintResult,
  CDefManifest,
  lintContentfulComponent
} from "@contentful-demos/component-definitions/dist/index.js";
import fetchJson from "./utils/fetchJson.js";
import postMessagePromise, {
  addMessageListener,
  removeMessageListener
} from './utils/postMessagePromise.js';
import {
  AppPage,
  CodePageId,
  LintPageId,
  MessageRequest,
  PageSize
} from "../shared-src/types.js";
import CUIToolbarHeader from "./ctfl-ui-editor/toolbar-header/ToolbarHeader.js";
import { Layout } from '@contentful/f36-layout';
import {
  GlobalStyles,
  ButtonGroup,
  ToggleButton
} from '@contentful/f36-components';
import * as icons from '@contentful/f36-icons';
import ctflTokens from '@contentful/f36-tokens';
import CUIToolbarTab from "./ctfl-ui-editor/toolbar-tab/ToolbarTab.js";
import CUIToolbarTabs from "./ctfl-ui-editor/toolbar-tabs/ToolbarTabs.js";
import CUIToolbarPanel from "./ctfl-ui-editor/toolbar-panel/ToolbarPanel.js";
import CUIToolbarPanels from "./ctfl-ui-editor/toolbar-panels/ToolbarPanels.js";
import ConfigPage from "./pages/configPage/ConfigPage.js";
import HtmlPage from "./pages/htmlPage/HtmlPage.js";
import CodePage from "./pages/codePage/CodePage.js";
import ImportPage from "./pages/importPage/ImportPage.js";
import LoadingPage from "./pages/loadingPage/loadingPage.js";
import LintPage from "./pages/lintPage/LintPage.js";
import ContentfulPage from "./pages/contentfulPage/ContentfulPage.js";
import * as contentful from 'contentful-management';
import WebSocketManager from "./utils/WebSocketManager.js";
// import "web-components/dist/tokens/dmo/tokens.css";

function App() {

  const [manifest, setManifest] = useState<CDefManifest | undefined>();
  const [exampleCode, setExampleCode] = useState<string>('');
  const [lintResults, setLintResults] = useState<CDefLintResult | undefined>();
  const [ctflLintResults, setCtflLintResults] = useState<CDefLintResult | undefined>();
  const [pageSize, setPageSize] = useState<PageSize>(PageSize.default);
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  // Tabs
  const [selectedPageId, setSelectedPageId] = useState<AppPage>(AppPage.ctfl);
  const [selectedLintPageId, setSelectedLintPageId] = useState<LintPageId>(LintPageId.figma);
  const [selectedCodePageId, setSelectedCodePageId] = useState<CodePageId>(CodePageId.html);

  // Stored Info
  const [cDefRootUrl, setCDefRootUrl] = useState<string | undefined>();
  const [ctflCMAKey, setCtflCMAKey] = useState<string | undefined>();
  const [ctflCPAKey, setCtflCPKey] = useState<string | undefined>();
  const [organizationId, setOrganizationId] = useState<string | undefined>();
  const [spaceId, setSpaceId] = useState<string | undefined>();
  const [environmentId, setEnvironmentId] = useState<string | undefined>();

  // State Control
  const [initialized, setInitialized] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<contentful.Environment | void>();
  const [contentTypes, setContentTypes] = useState<contentful.ContentType[] | void>();

  const [webSocket, setWebSocket] = useState<WebSocketManager | null>(null);
  const [importCode, setImportCode] = useState<string>('<dmo-button label="test"></dmo-button>');

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocketManager('ws://localhost:8060');
    ws.addListener((evt) => {
      console.log('ROOT', evt);
      try {
        const data = JSON.parse(evt.data);
        if (data.type === 'import') {
            setImportCode(data.code);
        }
      }catch(err){ console.error(err) }
    });
    setWebSocket(ws);
  }, []);

  // Initialization
  useEffect(() => {
    (async() => {
      setErrorMsg(undefined);

      // STORAGE PULLS
      const widgetStorageInfo = await postMessagePromise(
        MessageRequest.getFromWidgetStorage,
        {properties: ['cDefRootUrl', 'organizationId', 'spaceId', 'environmentId']}
      ) as any;
      const widgetStoredProps = widgetStorageInfo?.properties;
      const loadedCdefRootUrl = widgetStoredProps?.cDefRootUrl;
      setCDefRootUrl(loadedCdefRootUrl);
      setOrganizationId(widgetStoredProps?.organizationId || '');
      setSpaceId(widgetStoredProps?.spaceId || '');
      setEnvironmentId(widgetStoredProps?.environmentId || '');

      const userStorageInfo = await postMessagePromise(
        MessageRequest.getFromClientStorage,
        {properties: ['ctflCMAKey', 'ctflCPAKey']}
      ) as any;
      const storedProps = userStorageInfo?.properties;
      setCtflCMAKey(storedProps?.ctflCMAKey || '');
      setCtflCPKey(storedProps?.ctflCPAKey || '');


      // CONTENTFUL MAPPINGS
      if (
        storedProps?.ctflCMAKey &&
        widgetStoredProps?.spaceId && 
        widgetStoredProps?.environmentId
      ) {
        const client = contentful.createClient({
            accessToken: storedProps.ctflCMAKey
        });
        const space = await client.getSpace(widgetStoredProps.spaceId).catch(
          err => setErrorMsg(err.message)
        );
        if (space) {
          const environment = await space.getEnvironment(widgetStoredProps.environmentId).catch(
            err => setErrorMsg(err.message)
          );
          setEnvironment(environment);
          if (environment) {
            const contentTypes = await environment.getContentTypes().catch(
              err => setErrorMsg(err.message)
            );
            setContentTypes(contentTypes?.items);
          }
        }
      }


      if (!loadedCdefRootUrl) {
        setInitialized(true);
        setErrorMsg(`No content definition root url`);
        return;
      }
      // MANIFEST
      const manifest = await fetchJson(`${loadedCdefRootUrl}/manifest.json`) as CDefManifest;
      setManifest(manifest);
      if (!manifest) {
        setInitialized(true);
        setErrorMsg(`Manifest was not found for ${loadedCdefRootUrl}/manifest.json`)
      }

      setInitialized(true);
    })()
  }, [
    setCDefRootUrl,
    setCtflCMAKey,
    setCtflCPKey,
    setInitialized,
    initialized,
    setEnvironment,
    setContentTypes,
    setErrorMsg
  ]);

  // Selection Change
  useEffect(() => {
    const listener = (msg: any) => {
      if (msg.request === MessageRequest.selectionChange) {
        setExampleCode(msg.results.webInstance);
        setLintResults(msg.results.lintResults);
        if (msg.results.lintResults) {
          const contentType = contentTypes?.find(cType => cType.sys.id === msg.results.lintResults.id );
          if (contentType && cDefRootUrl) {
            (async() => {
              const ctfLintResults = await lintContentfulComponent(contentType, cDefRootUrl);
              setCtflLintResults(ctfLintResults);
            })();
          }else{
            setCtflLintResults(undefined);
          }
        }
      }
    }
    addMessageListener(listener);

    // contentTypes are async
    // TODO: make this run once...
    (async() => {
      if (contentTypes && lintResults && !ctflLintResults) {
        const contentType = contentTypes?.find(cType => cType.sys.id === lintResults.id);
        if (contentType && cDefRootUrl) {
          const ctfLintResults = await lintContentfulComponent(contentType, cDefRootUrl);
          setCtflLintResults(ctfLintResults);
        }else{
          setCtflLintResults(undefined);
        }
      }
    })();
    
    return () => {
      removeMessageListener(listener);
    }
  }, [
    setExampleCode,
    setLintResults,
    setCtflLintResults,
    contentTypes,
    cDefRootUrl,
    initialized
  ]);

  useEffect(() => {
    postMessagePromise(MessageRequest.resizeWindow, {pageSize});
  }, [pageSize]);

  const configUpdate = async (
    cDefRootUrl: string | undefined,
    ctflCMAKey: string | undefined,
    ctflCPAKey: string | undefined,
    organizationId: string | undefined,
    spaceId: string | undefined,
    environmentId: string | undefined,
  ) => {
    setErrorMsg(undefined);
    await postMessagePromise(
      MessageRequest.saveToWidgetStorage,
      {properties: {
        cDefRootUrl,
        organizationId,
        spaceId,
        environmentId
      }}
    );
    await postMessagePromise(
      MessageRequest.saveToClientStorage,
      {properties: {
        ctflCMAKey,
        ctflCPAKey
      }}
    );
    setManifest(undefined);
    setExampleCode('');
    setLintResults(undefined);
    setCtflLintResults(undefined);
    setInitialized(false);// invalidate
  }

  // make sure everything is pulled from storage
  if (initialized !== true) {
    return (<LoadingPage errorMsg={errorMsg} />);
  }

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
                  isActive={pageSize === PageSize.default}
                  onToggle={() => setPageSize(PageSize.default)}
                />
              <ToggleButton
                  icon={<icons.ArrowForwardIcon />}
                  aria-label='Wide Display'
                  size="small"
                  isActive={pageSize === PageSize.wide}
                  onToggle={() => setPageSize(PageSize.wide)}
                />
              <ToggleButton
                  icon={<icons.ArrowDownwardIcon />}
                  aria-label='Tall Display'
                  size="small"
                  isActive={pageSize === PageSize.tall}
                  onToggle={() => setPageSize(PageSize.tall)}
                />
              <ToggleButton
                  icon={<icons.EnvironmentIcon />}
                  aria-label='Tall and Wide Display'
                  size="small"
                  isActive={pageSize === PageSize.wideAndTall}
                  onToggle={() => setPageSize(PageSize.wideAndTall)}
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
          marginTop: ctflTokens.spacingXs,
          display: "flex",
          flexDirection: "column"
        }}>
        {manifest && cDefRootUrl ? (<>
          <CUIToolbarTabs
            selectedTab={selectedPageId}
            onSelectedTabChange={(val: any) => setSelectedPageId(val as AppPage)}>
            <CUIToolbarTab label={AppPage.lint} tabId={AppPage.lint} />
            <CUIToolbarTab label={AppPage.code} tabId={AppPage.code} />
            <CUIToolbarTab label={AppPage.ctfl} tabId={AppPage.ctfl} />
            <CUIToolbarTab label={AppPage.config} tabId={AppPage.config} />
          </CUIToolbarTabs>
          <CUIToolbarPanels
            selectedPanel={selectedPageId}>
            <CUIToolbarPanel panelId={AppPage.lint}>
              <div style={{display: 'flex', flexDirection:'column', height: '100%', width: '100%'}}>
                <CUIToolbarTabs
                  selectedTab={selectedLintPageId} secondary
                  onSelectedTabChange={(val: any) => setSelectedLintPageId(val as LintPageId)}>
                  <CUIToolbarTab secondary
                    label={`${LintPageId.figma} ${lintResults ? `(${lintResults?.totalErrors})` : ''}`}
                    tabId={LintPageId.figma} />
                  <CUIToolbarTab secondary
                    label={`${LintPageId.ctfl} ${ctflLintResults ? `(${ctflLintResults?.totalErrors})` : ''}`}
                    tabId={LintPageId.ctfl} />
                </CUIToolbarTabs>
                <CUIToolbarPanels
                  selectedPanel={selectedLintPageId}>
                  <CUIToolbarPanel panelId={LintPageId.figma}>
                    <LintPage
                      lintResults={lintResults} />
                  </CUIToolbarPanel>
                  <CUIToolbarPanel panelId={LintPageId.ctfl}>
                    <LintPage
                      lintResults={ctflLintResults}
                      link={`https://app.contentful.com/spaces/${
                          spaceId
                      }/environments/${
                          environmentId
                      }/content_types/${
                        ctflLintResults?.id
                      }`} />
                  </CUIToolbarPanel>
                </CUIToolbarPanels>
              </div>
            </CUIToolbarPanel>
            <CUIToolbarPanel panelId={AppPage.code}>
              <div style={{display: 'flex', flexDirection:'column', height: '100%', width: '100%'}}>
                <CUIToolbarTabs
                  selectedTab={selectedCodePageId} secondary
                  onSelectedTabChange={(val: any) => setSelectedCodePageId(val as CodePageId)}>
                  <CUIToolbarTab secondary
                    label={CodePageId.html}
                    tabId={CodePageId.html} />
                  <CUIToolbarTab secondary
                    label={CodePageId.preview}
                    tabId={CodePageId.preview} />
                  <CUIToolbarTab secondary
                    label={CodePageId.import}
                    tabId={CodePageId.import} />
                </CUIToolbarTabs>
                <CUIToolbarPanels
                  selectedPanel={selectedCodePageId}>
                  <CUIToolbarPanel panelId={CodePageId.html}>
                    <CodePage
                      exampleCode={exampleCode} />
                  </CUIToolbarPanel>
                  <CUIToolbarPanel panelId={CodePageId.preview}>
                    <HtmlPage
                      cDefRootUrl={cDefRootUrl}
                      manifest={manifest}
                      exampleCode={exampleCode} />
                  </CUIToolbarPanel>
                  <CUIToolbarPanel panelId={CodePageId.import}>
                    <ImportPage
                      cDefRootUrl={cDefRootUrl}
                      webSocket={webSocket}
                      importCode={importCode}
                      setImportCode={setImportCode} />
                  </CUIToolbarPanel>
                </CUIToolbarPanels>
              </div>
            </CUIToolbarPanel>
            <CUIToolbarPanel panelId={AppPage.ctfl}>
              <ContentfulPage
                cDefRootUrl={cDefRootUrl}
                manifest={manifest}
                ctflCMAKey={ctflCMAKey}
                ctflCPAKey={ctflCPAKey}
                organizationId={organizationId}
                spaceId={spaceId}
                environmentId={environmentId}
                contentTypes={contentTypes} />
            </CUIToolbarPanel>
            <CUIToolbarPanel panelId={AppPage.config}>
              <ConfigPage
                cDefRootUrl={cDefRootUrl}
                ctflCMAKey={ctflCMAKey}
                ctflCPAKey={ctflCPAKey}
                organizationId={organizationId}
                spaceId={spaceId}
                environmentId={environmentId}
                configUpdate={configUpdate}
                invalidate={() => setInitialized(false)} />
            </CUIToolbarPanel>
          </CUIToolbarPanels>
          <div className="cdef-root-url">
            Component Definition: {cDefRootUrl}<br/>
            Contentful Environment: {environment?.name}
          </div>
        </>

        ) : (
          <ConfigPage
            cDefRootUrl={cDefRootUrl}
            ctflCMAKey={ctflCMAKey}
            ctflCPAKey={ctflCPAKey}
            organizationId={organizationId}
            spaceId={spaceId}
            environmentId={environmentId}
            configUpdate={configUpdate}
            invalidate={() => setInitialized(false)} />
        )}
      </Layout.Body>
    </Layout>
  </>
  );
}

export default App;
