import React, { useEffect, useState } from "react";
import "./App.scss";
import "./tokens/output/css/variables.css";
import {
  CDefLintResult,
  CDefManifest,
  lintContentfulComponent,
  htmlInstanceToDefinitionInstance,
} from "@contentful-demos/component-definitions/dist/index.js";
import fetchJson from "./utils/fetchJson.js";
import postMessagePromise, {
  addMessageListener,
  removeMessageListener
} from './utils/postMessagePromise.js';
import {
  AppPage,
  CodePageId,
  CreatePageId,
  LintPageId,
  MessageRequest,
  PageSize
} from "../shared-src/types.js";
import CUIToolbarHeader from "./ctfl-ui-editor/toolbar-header/ToolbarHeader.js";
import { Layout } from '@contentful/f36-layout';
import {
  GlobalStyles,
  ButtonGroup,
  ToggleButton,
  Flex
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
import getWebSocketStatusColor from "./utils/getWebSocketStatusColor.js";
import CodeContentfulPage from "./pages/codeContentfulPage/CodeContentfulPage.js";
import PushToCode from "./components/PushToCode.js";

function App() {

  const [manifest, setManifest] = useState<CDefManifest | undefined>();
  const [exampleCDefCode, setExampleCDefCode] = useState();
  const [exampleCode, setExampleCode] = useState<string>('');
  const [lintResults, setLintResults] = useState<CDefLintResult | undefined>();
  const [ctflLintResults, setCtflLintResults] = useState<CDefLintResult | undefined>();
  const [pageSize, setPageSize] = useState<PageSize>(PageSize.default);
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  // Tabs
  const [selectedPageId, setSelectedPageId] = useState<AppPage>(AppPage.component);
  const [selectedLintPageId, setSelectedLintPageId] = useState<LintPageId>(LintPageId.figma);
  const [selectedCodePageId, setSelectedCodePageId] = useState<CodePageId>(CodePageId.preview);
  const [selectedCreatePageId, setSelectedCreatePageId] = useState<CreatePageId>(CreatePageId.ctfl);

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
  const [websocketStatus, setWebsocketStatus] = useState('disconnected'); 

  const [webSocket, setWebSocket] = useState<WebSocketManager | null>(null);
  const [importCode, setImportCode] = useState<string>(`<dmo-container
        _backgroundColor="wc_background_default"
        _padding="wc_padding_2x"
        _cornerRadius="wc_border_radius_md"
        _borderColor="wc_border_on_bg_subdued"
        _borderWidth="wc_border_width_sm"
        _borderStyle="dashed"
        _horizontalResizing="hug"
        _verticalResizing="hug"
        _layoutDirection="column"
        _alignItems="center"
        _gap="wc_gap_2x"
        _width="300px">
        <dmo-text type="heading-md" _textColor="wc_text_tertiary_default" text="Jump back in!"></dmo-text>
        <dmo-text type="body-md" _textColor="wc_text_subdued" text="Course 54% completed"></dmo-text>
        <dmo-container
          _backgroundColor="wc_background_minimal"
          _padding="wc_padding_1x"
          _cornerRadius="wc_border_radius_md"
          _gap="wc_gap_1x"
          _layoutDirection="column">
          <dmo-text type="label-md" _textColor="wc_text_default" text="CURRENT LESSON:"></dmo-text>
          <dmo-text type="body-md" _textColor="wc_text_default" text="Objects in Javascript (Challenge)"></dmo-text>
        </dmo-container>
        <dmo-button design="primary" emphasis="bold" url="#" label="Go to lesson"></dmo-button>
    </dmo-container>`);

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocketManager('ws://localhost:8060', setWebsocketStatus);
    ws.addListener((evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === 'import') {
          setImportCode(data.code);
        }
      }catch(err){ console.error(err) }
    });
    setWebSocket(ws);

    window.addEventListener('focus', async () => {
      // Stage Component
      await postMessagePromise(
        MessageRequest.getStageComponentInfo
      ) as any;
    });

    // window.addEventListener('blur', () => {
    //   console.log('Plugin window lost focus');
    // });
  }, []);

  useEffect(() => {
    const handleWebSocketMessage = async (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'import') {
                setImportCode(data.code);
                const defInstance = await htmlInstanceToDefinitionInstance(
                    data.code, cDefRootUrl
                );
                postMessagePromise(
                    MessageRequest.renderFigmaComponentFromCDef,
                    {
                        defInstance,
                        cDefRootUrl
                    }
                );
            }else if (data.type === 'clear') {
                postMessagePromise(
                    MessageRequest.clearStage
                );
            }
        }catch(err){ console.error(err) }
    };
    webSocket?.addListener(handleWebSocketMessage);
    return () => {
        webSocket?.removeListener(handleWebSocketMessage);
    };
  }, [webSocket, cDefRootUrl]);

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
          (err: any) => {
            let message = 'Could not open the saved Contentful space.';
            try {
              message = JSON.parse(err?.message || '{}').message || message;
            } catch { /* keep fallback */ }
            setErrorMsg(message);
          }
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

      // Stage Component
      await postMessagePromise(
        MessageRequest.getStageComponentInfo
      ) as any;

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
      }else if (msg.request === MessageRequest.stageComponentChange) {
        setExampleCDefCode(msg.results.cdefInstance);
        setExampleCode(msg.results.webInstance);
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
            <Flex
              flexDirection="row"
              gap="spacingS">
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
              <ToggleButton icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                    <path d="M328 0l14.6 66.8c11.9 5.5 23.3 12 33.8 19.6l65.2-20.8 72 124.7-50.6 46.1c.6 6.4 .9 12.9 .9 19.5s-.3 13.1-.9 19.5l50.6 46.1-72 124.7-65.2-20.8c-10.6 7.5-21.9 14.1-33.8 19.6L328 512l-144 0-14.6-66.8c-11.9-5.5-23.3-12-33.8-19.6L70.3 446.4l-72-124.7 50.6-46.1c-.6-6.4-.9-12.9-.9-19.5s.3-13.1 .9-19.5L-1.7 190.4l72-124.7 65.2 20.8c10.6-7.5 21.9-14.1 33.8-19.6L184 0 328 0zm63 132.2l-22.9 7.3-19.5-13.9c-8.2-5.8-16.9-10.9-26-15.1l-21.8-10-5.1-23.4L289.4 48l-66.7 0-6.4 29.1-5.1 23.4-21.8 10c-9.2 4.2-17.9 9.3-26 15.1l-19.5 13.9L121 132.2l-28.4-9L59.2 180.9l22 20.1 17.7 16.1-2.2 23.8c-.5 5-.7 10-.7 15.1s.2 10.1 .7 15.1l2.2 23.8L81.2 311l-22 20.1 33.4 57.8 28.4-9 22.9-7.3 19.5 13.9c8.2 5.8 16.9 10.9 26 15.1l21.8 10 5.1 23.4 6.4 29.1 66.7 0 6.4-29.1 5.1-23.4 21.8-10c9.2-4.2 17.9-9.3 26-15.1l19.5-13.9 22.9 7.3 28.4 9 33.4-57.8L430.8 311l-17.7-16.1 2.2-23.8c.5-5 .7-10 .7-15.1s-.2-10.1-.7-15.1l-2.2-23.8L430.8 201l22.1-20.1-33.4-57.8-28.4 9zM304 256a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm-144 0a96 96 0 1 1 192 0 96 96 0 1 1 -192 0z"/>
                  </svg>}
                  size="small"
                  aria-label="Go to config"
                  onToggle={() => setSelectedPageId(AppPage.config)}
                  />
            </Flex>
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
            <CUIToolbarTab label={AppPage.component} tabId={AppPage.component} />
            <CUIToolbarTab label={AppPage.create} tabId={AppPage.create} />
            {/* <CUIToolbarTab label={AppPage.ctfl} tabId={AppPage.ctfl} />
            <CUIToolbarTab label={AppPage.import} tabId={AppPage.import} /> */}
            <CUIToolbarTab label={AppPage.lint} tabId={AppPage.lint} />
            {/* <CUIToolbarTab label={AppPage.config} tabId={AppPage.config} /> */}
            <div
                className="websocket-status"
                style={{
                    backgroundColor: getWebSocketStatusColor(websocketStatus),
                }}
            ></div>
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
            <CUIToolbarPanel panelId={AppPage.create}>
              <div style={{display: 'flex', flexDirection:'column', height: '100%', width: '100%'}}>
                <CUIToolbarTabs
                  selectedTab={selectedCreatePageId} secondary
                  onSelectedTabChange={(val: any) => setSelectedCreatePageId(val as CreatePageId)}>
                  <CUIToolbarTab secondary
                    label={CreatePageId.ctfl}
                    tabId={CreatePageId.ctfl} />
                  <CUIToolbarTab secondary
                    label={CreatePageId.import}
                    tabId={CreatePageId.import} />
                </CUIToolbarTabs>
                <CUIToolbarPanels
                    selectedPanel={selectedCreatePageId}>
                    <CUIToolbarPanel panelId={CreatePageId.ctfl}>
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
                    <CUIToolbarPanel panelId={CreatePageId.import}>
                      <ImportPage
                        cDefRootUrl={cDefRootUrl}
                        importCode={importCode}
                        setImportCode={setImportCode} />
                    </CUIToolbarPanel>
                  </CUIToolbarPanels>
                </div>
            </CUIToolbarPanel>
            {/* <CUIToolbarPanel panelId={AppPage.import}>
                <ImportPage
                  cDefRootUrl={cDefRootUrl}
                  importCode={importCode}
                  setImportCode={setImportCode} />
            </CUIToolbarPanel> */}
            {/* <CUIToolbarPanel panelId={AppPage.ctfl}>
              <ContentfulPage
                cDefRootUrl={cDefRootUrl}
                manifest={manifest}
                ctflCMAKey={ctflCMAKey}
                ctflCPAKey={ctflCPAKey}
                organizationId={organizationId}
                spaceId={spaceId}
                environmentId={environmentId}
                contentTypes={contentTypes} />
            </CUIToolbarPanel> */}
            <CUIToolbarPanel panelId={AppPage.component}>
              <div style={{display: 'flex', flexDirection:'column', height: '100%', width: '100%'}}>
                <CUIToolbarTabs
                  selectedTab={selectedCodePageId} secondary
                  onSelectedTabChange={(val: any) => setSelectedCodePageId(val as CodePageId)}>
                  <CUIToolbarTab secondary
                    label={CodePageId.cinst}
                    tabId={CodePageId.cinst} />
                  <CUIToolbarTab secondary
                    label={CodePageId.html}
                    tabId={CodePageId.html} />
                  <CUIToolbarTab secondary
                    label={CodePageId.preview}
                    tabId={CodePageId.preview} />
                  <CUIToolbarTab secondary
                    label={CodePageId.contentful}
                    tabId={CodePageId.contentful} />
                </CUIToolbarTabs>
                <CUIToolbarPanels
                  selectedPanel={selectedCodePageId}>
                  <CUIToolbarPanel panelId={CodePageId.cinst}>
                    <CodePage exampleCode={JSON.stringify(exampleCDefCode, null, 2)} />
                    <PushToCode code={exampleCode} webSocket={webSocket} />
                  </CUIToolbarPanel>
                  <CUIToolbarPanel panelId={CodePageId.html}>
                    <CodePage
                      exampleCode={exampleCode} />
                    <PushToCode code={exampleCode} webSocket={webSocket} />
                  </CUIToolbarPanel>
                  <CUIToolbarPanel panelId={CodePageId.preview}>
                    <HtmlPage
                      cDefRootUrl={cDefRootUrl}
                      manifest={manifest}
                      exampleCode={exampleCode} />
                  </CUIToolbarPanel>
                  <CUIToolbarPanel panelId={CodePageId.contentful}>
                    <CodeContentfulPage
                      cdefInstance={exampleCDefCode}
                      cDefRootUrl={cDefRootUrl}
                      ctflCPAKey={ctflCPAKey}
                      spaceId={spaceId}
                      environmentId={environmentId}
                      ctflCMAKey={ctflCMAKey} />
                  </CUIToolbarPanel>
                </CUIToolbarPanels>
              </div>
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
            Contentful Environment: org: {organizationId}, space: {spaceId}, env: {environment?.name}
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
