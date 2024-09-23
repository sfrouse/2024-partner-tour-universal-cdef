import {
  MessageName,
  MessageRequest,
  PageSize
} from "../shared-src/types.js";
import processSelection from "./actions/processSelection.js";
import resizeWindow from "./actions/resizeWindow.js";
import bounceBack from "./utils/postMessagePromise.js";
import {
  clearAllClientStorage,
  clearAllFileStorage,
  clearAllWidgetStorage,
  getFromClientStorageBounce,
  getFromFileStorage,
  getFromFileStorageBounce,
  getFromWidgetStorage,
  getFromWidgetStorageBounce,
  saveToClientStorage,
  saveToFileStorage,
  saveToWidgetStorage
} from "./actions/storage.js";
import renderFigmaComponentFromCDef from "./actions/renderFigmaComponentFromCDef.js";
import clearStage from "actions/clearStage.js";
import renderFigmaComponentFromContentfulEntry from "actions/renderFigmaComponentFromContentfulEntry.js";
import findWidgetSiblings from "actions/findWidgetSiblings.js";
import stageComponentChange from "utils/stageComponentChange.js";

const { widget } = figma;
const {
  useSyncedState,
  useWidgetNodeId,
  // useEffect
} = widget;
const {
  AutoLayout,
  Text,
  Rectangle,
  SVG
} = widget;

export const DEFAULT_PAGE_WIDTH = 600;
export const DEFAULT_PAGE_HEIGHT = 600;

function Widget() {
  const widgetNodeId = useWidgetNodeId();

  const [contentfulInfo, setContentfulInfo] = useSyncedState(
    'contentfulInfo', ''
  );
  const [cDefRootUrl, setCDefRootUrl] = useSyncedState(
    'cDefRootUrl', ''
  );
  const [widgetWidth, setWidgetWidth] = useSyncedState(
    'widgetWidth', 'hug-contents'
  );

  const [renderedCompTitle, setRenderedCompTitle] = useSyncedState(
    'renderedCompTitle', 'Component Definition'
  );

  const initWidget = () => {
    // useEffect(() => {
    const widgetNode = figma.getNodeById(widgetNodeId);
    if (
      widgetNode?.type === "WIDGET" &&
      widgetNode.parent?.type === "FRAME"
    ) {
      widgetNode.x = 50;
      widgetNode.y = 0;
      setWidgetWidth(
        widgetNode.parent.width - 100 as any
      );
    }else{
      setWidgetWidth('hug-contents')
    }

    const siblings = findWidgetSiblings(widgetNodeId);
    if (siblings.length === 0) {
      setRenderedCompTitle('Component Definitions');
    }
  }

  const windowSetup = () => {
    figma.on('selectionchange', () => {
      stageComponentChange(widgetNodeId, cDefRootUrl);
      processSelection(widgetNodeId);
    });
    // figma.on('documentchange',  () => processSelection(widgetNodeId));
    processSelection(widgetNodeId);

    figma.ui.onmessage = async (message) => {
      console.log('-> RECIEVE MSG', message);
      switch (message.name) {
        case MessageName.promiseBounce :
          switch (message.request) {
            case MessageRequest.resizeWindow: {
              const pageSize = message.pageSize as PageSize;
              resizeWindow(pageSize);
              bounceBack(message, {});
              break;
            }
            // FILE STORAGE
            case MessageRequest.saveToFileStorage: {
              saveToFileStorage(message);
              break;
            } 
            case MessageRequest.getFromFileStorage: {
              getFromFileStorageBounce(message);

              // piggy back on the UI having to ask...
              // useEffect infinitely regresses
              const fileProps = await getFromFileStorage(['cDefRootUrl']);
              setCDefRootUrl(fileProps['cDefRootUrl']);
              break;
            }
            // WIDGET STORAGE
            case MessageRequest.saveToWidgetStorage: {
              const widgetNode = figma.getNodeById(widgetNodeId) as WidgetNode;
              saveToWidgetStorage(message, widgetNode);
              break;
            } 
            case MessageRequest.getFromWidgetStorage: {
              const widgetNode = figma.getNodeById(widgetNodeId) as WidgetNode;
              getFromWidgetStorageBounce(message, widgetNode);

              // piggy back on the UI having to ask...
              // useEffect infinitely regresses
              const fileProps = await getFromWidgetStorage(['cDefRootUrl'], widgetNode);
              setCDefRootUrl(fileProps['cDefRootUrl']);
              break;
            }
            // saveToWidgetStorage
            // getFromWidgetStorage
            // CLIENT STORAGE
            case MessageRequest.saveToClientStorage: {
              saveToClientStorage(message);
              break;
            } 
            case MessageRequest.getFromClientStorage: {
              const widgetNode = figma.getNodeById(widgetNodeId) as WidgetNode;
              await getFromClientStorageBounce(message);
              const fileProps = await getFromWidgetStorage(['organizationId', 'spaceId', 'environmentId'], widgetNode);
              setContentfulInfo(`org: ${fileProps.organizationId}, space: ${fileProps.spaceId}, env: ${fileProps.environmentId}`);
              break;
            }
            case MessageRequest.clearAllStorage: {
              await clearAllClientStorage();
              clearAllFileStorage();
              const widgetNode = figma.getNodeById(widgetNodeId) as WidgetNode;
              clearAllWidgetStorage(widgetNode);
              bounceBack(message);
              break;
            }
            // ===============================================
            // CREATING STAGE COMPONENT
            // ===============================================
            case MessageRequest.renderFigmaComponentFromContentfulComponent: {
              // const entryTitle = message.entry?.fields?.internalTitle
              setRenderedCompTitle(
                `Contentful Entry: ${message.entry?.sys?.id || 'unknown'}`
              );
              await renderFigmaComponentFromContentfulEntry(
                message.entry,
                message.cDefRootUrl, 
                widgetNodeId
              );
              await stageComponentChange(widgetNodeId, cDefRootUrl);
              bounceBack(message);
              break;
            } 
            case MessageRequest.renderFigmaComponentFromCDef: { 
              setRenderedCompTitle(
                `CDef Instance: ${message.defInstance?.$schema || 'unknown'}`
              );
              await renderFigmaComponentFromCDef(
                message.defInstance,
                message.cDefRootUrl, 
                widgetNodeId
              );
              await stageComponentChange(widgetNodeId, cDefRootUrl);
              bounceBack(message);
              break;
            }
            case MessageRequest.getStageComponentInfo: {
              await stageComponentChange(widgetNodeId, cDefRootUrl);
              bounceBack(message);
              break;
            }
            case MessageRequest.clearStage: {
              clearStage(widgetNodeId);
              bounceBack(message);
              break;
            }
            // ===============================================
          }
          break;
      }

    }

    figma.ui.on("message", (msg) => {
      if (msg === "close") {
        figma.closePlugin();
      }
    });
  };

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="start"
      verticalAlignItems="start"
      height="hug-contents"
      fill="#ffffff"
      spacing={2}
      padding={{top: 10, left: 0, right: 0, bottom:0}}
      width={widgetWidth as WidgetJSX.AutolayoutSize | undefined}>
      <AutoLayout
        padding={12}
        direction="horizontal"
        horizontalAlignItems="start"
        verticalAlignItems="center"
        width={"fill-parent"}
        spacing={10}>
        <AutoLayout
          width={30} height={30}
          cornerRadius={6}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          hoverStyle={{fill: "#fff"}} 
            onClick={async () => {
              initWidget();
              await new Promise(() => {
                figma.showUI(__html__, {
                  width: DEFAULT_PAGE_WIDTH,
                  height: DEFAULT_PAGE_HEIGHT
                });
                windowSetup();
              });
            }}>
          <SVG
            src={`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20">
                <path d="M416 0l48 0 0 43c0 38.2 15.2 74.8 42.2 101.8l21 21c21 21 32.8 49.5 32.8 79.2l0 43-48 0 0-43c0-17-6.7-33.3-18.7-45.3l-21-21C436.2 142.7 416 93.9 416 43l0-43zM640 288l-48 0 0-43c0-38.2-15.2-74.8-42.2-101.8l-21-21c-21-21-32.8-49.5-32.8-79.2l0-43 48 0 0 43c0 17 6.7 33.3 18.7 45.3l21 21c36 36 56.2 84.8 56.2 135.8l0 43zm-80 88l0 112 0 24-48 0 0-24 0-112 0-24 48 0 0 24zm80 0l0 112 0 24-48 0 0-24 0-112 0-24 48 0 0 24zM224 464l208 0 0-64-208 0 0 64zM0 352l48 0 384 0 48 0 0 48 0 64 0 48-48 0L48 512 0 512l0-48 0-64 0-48z"/>
              </svg>`}
          />
        </AutoLayout>
        <AutoLayout
          direction="vertical"
          horizontalAlignItems="start"
          verticalAlignItems="start">
          <Text
            fontFamily="Inter"
            fontSize={16}
            fill="#333">
            {renderedCompTitle}
          </Text>
          <Text
            fontFamily="Inter"
            fontSize={10}
            fill="#777">
            Component Definition: {cDefRootUrl}
          </Text>
          <Text
            fontFamily="Inter"
            fontSize={10}
            fill="#777">
            Contentful: {contentfulInfo}
          </Text>
        </AutoLayout>
       
      </AutoLayout>
      <Rectangle height={1} width="fill-parent" fill="#aaaaaa"></Rectangle>
    </AutoLayout>
  );
}

widget.register(Widget);
