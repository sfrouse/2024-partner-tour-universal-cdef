
import React from "react";
import CUIToolbarButton from "../ctfl-ui-editor/toolbar-button/ToolbarButton.js";
import WebSocketManager from "../utils/WebSocketManager.js";

const PushToCode = (
    args: {
        code: string,
        webSocket: WebSocketManager | undefined | null
    }
) => {
  
    const {
        code,
        webSocket
    } = args;

    return (
        <div style={{
            position: 'absolute',
            right: 30,
            bottom: 30,
        }}>
            <CUIToolbarButton
                label="Push"
                onClick={() => {
                    webSocket?.send(
                        JSON.stringify({
                            type: 'figma-export',
                            code: code
                        })
                    );
                }} />        
        </div>
                    
    );
}

export default PushToCode;
