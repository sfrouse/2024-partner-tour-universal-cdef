import { PageSize } from "../../shared-src/types.js";
import { DEFAULT_PAGE_HEIGHT, DEFAULT_PAGE_WIDTH } from "../code.js";

export default function resizeWindow(pageSize: PageSize | undefined) {
    const zoom = figma.viewport.zoom;
    const bounds = figma.viewport.bounds;
    const maxWidth = Math.min(1300, bounds.width * zoom);
    const maxHeight = (bounds.height * zoom) - 100;// Math.min(800, (bounds.height * zoom) - 50);
    switch (pageSize) {
        case PageSize.wide : {
            figma.ui.resize(
                maxWidth,
                500
            )
            break;
        }
        case PageSize.tall : {
            figma.ui.resize(
                DEFAULT_PAGE_WIDTH,
                maxHeight
            )
            break;
        }
        case PageSize.wideAndTall : {
            // figma.ui.reposition(10, 10); doesn't really work
            figma.ui.resize( 
                maxWidth,
                maxHeight
            )
            break;
        }
        default:
        case PageSize.default : {
            figma.ui.resize(
                DEFAULT_PAGE_WIDTH,
                DEFAULT_PAGE_HEIGHT
            )
            break;
        }
    }
}