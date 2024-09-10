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
  getFromClientStorage,
  getFromClientStorageBounce,
  getFromFileStorage,
  getFromFileStorageBounce,
  getFromWidgetStorage,
  getFromWidgetStorageBounce,
  saveToClientStorage,
  saveToFileStorage,
  saveToWidgetStorage
} from "./actions/storage.js";
import renderFigmaComponent from "./actions/renderFigmaComponent.js";

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

export const DEFAULT_PAGE_WIDTH = 400;
export const DEFAULT_PAGE_HEIGHT = 600;

function Widget() {
  const nodeId = useWidgetNodeId();

  const [environmentId, setEnvironmentId] = useSyncedState(
    'environmentId', ''
  );
  const [cDefRootUrl, setCDefRootUrl] = useSyncedState(
    'cDefRootUrl', ''
  );
  const [widgetWidth, setWidgetWidth] = useSyncedState(
    'widgetWidth', 'hug-contents'
  );

  const initWidget = () => {
    // useEffect(() => {
    const widgetNode = figma.getNodeById(nodeId);
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
  }

  const windowSetup = () => {
    figma.on('selectionchange', () => processSelection(nodeId));
    figma.on('documentchange',  () => processSelection(nodeId));
    processSelection(nodeId);

    figma.ui.onmessage = async (message) => {
      console.log('-> RECIEVE MSG', message);
      switch (message.name) {
        case MessageName.promiseBounce :
          switch (message.request) {
            case MessageRequest.stateUpdate: {
              bounceBack(message, {nodeId});
              break;
            }
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
              const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
              saveToWidgetStorage(message, widgetNode);
              break;
            } 
            case MessageRequest.getFromWidgetStorage: {
              const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
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
              getFromClientStorageBounce(message);

              // piggy back on the UI having to ask...
              // useEffect infinitely regresses
              const clientProps = await getFromClientStorage(['environmentId']);
              setEnvironmentId(clientProps['environmentId']);
              break;
            }
            case MessageRequest.clearAllStorage: {
              await clearAllClientStorage();
              clearAllFileStorage();
              const widgetNode = figma.getNodeById(nodeId) as WidgetNode;
              clearAllWidgetStorage(widgetNode);
              bounceBack(message);
              break;
            }
            case MessageRequest.renderFigmaComponent: {
              renderFigmaComponent(
                message.entry,
                message.cDefRootUrl,
                nodeId
              );
              break;
            } 
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
            src={`<svg class="css-j3q0cj" data-test-id="cf-ui-icon" viewBox="0 0 13.5 18" aria-hidden="true" role="img"><path d="M0 12.9v2.8h2.8l8.3-8.3-2.8-2.8L0 12.9zm13.3-7.6c.3-.3.3-.8 0-1.1l-1.8-1.8c-.3-.3-.8-.3-1.1 0L9.1 3.8l2.8 2.8c0 .1 1.4-1.3 1.4-1.3z"></path><path d="M0 0h13.5v18H0V0z" fill="none"></path></svg>`}
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
            CDef
          </Text>
          <Text
            fontFamily="Inter"
            fontSize={10}
            fill="#777">
            Component Definition Root: {cDefRootUrl}
          </Text>
          <Text
            fontFamily="Inter"
            fontSize={10}
            fill="#777">
            Contentful Environment: {environmentId}
          </Text>
        </AutoLayout>
       
      </AutoLayout>
      <Rectangle height={1} width="fill-parent" fill="#aaaaaa"></Rectangle>
    </AutoLayout>
  );
}

widget.register(Widget);
