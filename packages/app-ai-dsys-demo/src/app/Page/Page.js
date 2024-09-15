// import actionsIndex from 'api-ai/src/actionsIndex.mjs';
import './css/Page.css';
import './css/PageActionsNav.css';
import './css/PageResults.css';
import './css/PagePrompt.css';
import React, { useState, useEffect } from 'react';
import findActionPrompts from '../../utils/findActionPrompts';
import ImageUploader from '../../components/imageUpload';
import RefreshButton from '../../components/refreshButton';
import renderAsText from '@partner-tour-2024/api-ai/src/prompts/utils/renderAsText.mjs';
import LoadingSpinner from '../../components/loadingSpinner/loadingSpinner';
import startVoiceRecognition, { stopVoiceRecognition } from './utils/speechToText';

const AI_SERVICE_URL = 'http://localhost:3005';

function Page() {

    const [actionList, setActionList] = useState(null);
    const [actionId, setActionId] = useState(null);
    const [action, setAction] = useState(null);
    const [prompts, setPrompts] = useState(null);
    const [actionToRun, setActionToRun] = useState(null);
    const [actionToReset, setActionToReset] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);

    const [webSocket, setWebSocket] = useState(null);
    const [lastUploadedImageIndex, setLastUploadedImageIndex] = useState(new Date().getTime());

    const [invalidate, setInvalidate] = useState(0);

    const [focusedTab, setFocusedTab] = useState('html');
    const [scratchPad, setScratchPad] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    

    const invalidatePage = () => setInvalidate(i => i+1);

    const establishActionInfo = () => {
      const actionId = window.location.pathname.substring(1);
      setActionId(actionId);
    }

    // Establish WebSocket
    useEffect(() => {
      // Connect to the WebSocket server
      const ws = new WebSocket('ws://localhost:8060');

      ws.onopen = () => {
        console.log('Connected to the WebSocket server');
      };

      ws.onmessage = (event) => {
        console.log('event', event);
      };

      ws.onclose = () => {
        console.log('Disconnected from the WebSocket server');
      };
      setWebSocket(ws);
    }, []);

    // Load Actions
    useEffect(() => {
      const originalPushState = window.history.pushState;
      const originalPopState= window.history.popState;
      window.history.pushState = function(state, title, url) {
        originalPushState.apply(this, arguments);
        establishActionInfo();
      };
      window.history.popState = function(state, title, url) {
        originalPopState.apply(this, arguments);
        establishActionInfo();
      };
      window.addEventListener('popstate', function(event) {
        establishActionInfo();
      });
      establishActionInfo();

      const apiUrl = `${AI_SERVICE_URL}/actions`;
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((actionList) => {
          setActionList(actionList);
          setLoading(false);
        })
        .catch((error) => {
          setError(`load actions: ${error.message}`);
          setLoading(false);
        });
    }, [invalidate]);

    // Load Action
    useEffect(() => {
      if (actionId) {
        const apiResultUrl = `${AI_SERVICE_URL}/action/${actionId}`;
        fetch(apiResultUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((action) => {
            setAction(action);
            setPrompts(findActionPrompts(action))
          })
          .catch((error) => {
            setError(`result: ${error.message} ${apiResultUrl}`);
          });
      }
    }, [
      actionId,
      // setAction,
      setPrompts,
      // setActionRender,
      setAction
    ]);

    // Run Action
    useEffect(() => {
      if (actionToRun) {
          const apiUrl = `${AI_SERVICE_URL}/ai/${actionToRun}`;
          setIsRunning(true);
          fetch(apiUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((action) => {
              setIsRunning(false);
              setAction(action);
              setActionToRun(null);
            })
            .catch((error) => {
              setError(`run action: ${error.message}`);
              setLoading(false);
            });
      }
    }, [
      actionToRun,
      setIsRunning,
      setAction,
      setError,
      setLoading
    ]);

    // Delete Action
    useEffect(() => {
      if (actionToReset) {
          const apiUrl = `${AI_SERVICE_URL}/reset/${actionToReset}`;
          setIsRunning(true);
          fetch(apiUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(() => {
              setIsRunning(false);
              setActionToReset(null);
              setAction(null);
            })
            .catch((error) => {
              setError(`run action: ${error.message}`);
              setLoading(false);
            });
      }
    }, [
      actionToReset,
      setActionToReset,
      setIsRunning,
      setError,
      setLoading
    ]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }
    
    return (
        <div className="Page">

          {/* ACTIONS NAV */}
          <div className='page-actions-list'>
            <h2>Actions</h2>
            <div className='page-actions-pane scroll-bar'>
              {actionList?.actions.map(action => {
                if (action.group) {
                  return (
                    <div className='page-action-group'
                      key={action.group}>
                      {action.group}
                    </div>
                  );
                }
                return (
                  <div className={`page-action-item ${actionId === action.id ? 'selected' : ''}`}
                    key={action.id}
                    onClick={() => {
                      const newUrl = `${window.location.origin}/${action.id}`;
                      if (newUrl !== window.location.href) {
                        window.history.pushState({ path: newUrl }, '', newUrl);
                        setAction(null);
                        setActionToRun(null);
                      }
                    }}>
                    {action.name}
                  </div>
                );
              })}
              <div className={`page-action-item`}
                onClick={() => {
                  webSocket.send(
                    JSON.stringify({type:'import', code:'<dmo-button label="test"></dmo-button>'})
                  );
                }}>
                WebSock Test
              </div>
            </div>
            <div className="page-actions-bottom-nav">
              <div className="last-upload-thumb">
                <div className="last-upload-thumb-image"
                  style={{
                    backgroundImage: `url(http://localhost:3005/uploads/lastUpload.png?${lastUploadedImageIndex})`
                  }}>
                </div>
              </div>
              <RefreshButton
                onClick={() => invalidatePage()} />
            </div>
          </div>

          {/* PROMPTS */}
          <div className="page-prompt-box">
              <h2>Prompt</h2>
              <div className="page-prompt-display scroll-bar-grey">
                {prompts?.map(prompt => {
                  if (prompt === '(upload last image)') {
                    return (
                      <div
                        key={`lastkupdated-${lastUploadedImageIndex}`}
                        className="page-prompt-display-prompt-image">
                        <img
                          src={`http://localhost:3005/uploads/lastUpload.png?${lastUploadedImageIndex}`}
                          
                          alt=""
                          width="400" />
                      </div>);
                  }
                  return <div className="page-prompt-display-prompt" key={prompt}>{prompt}</div>;
                })}
                {isRunning ? (
                  <div className="page-loading">
                    <LoadingSpinner />
                  </div>  
                ) : null}
              </div>
              <div className="page-prompt-scratchpad scroll-bar">
                <textarea
                  value={scratchPad} className='scroll-bar'
                  onChange={(e) => setScratchPad(e.target.value)}
                  placeholder="Scratch pad..."
                  spellCheck={false}
                />
              </div>
              <div className="page-prompt-nav">
                <div className={`page-prompt-button speech ${isRecording ? 'recording' : ''}`}
                  onClick={() => {
                    if (isRecording) {
                      stopVoiceRecognition(
                        setIsRecording
                      )
                    }else{
                      startVoiceRecognition(
                        (transcription) => setScratchPad(transcription),
                        isRecording,
                        setIsRecording
                      );
                    }
                  }}>
                  {isRecording ? 'Stop' : 'Record'}
                </div>
                <div className="fill"></div>
                <div className="page-prompt-button clear"
                  onClick={() => {
                    setActionToReset(actionId);
                  }}>
                  Clear
                </div>
                <div className="page-prompt-button upload">
                   <ImageUploader onSuccess={(result) => {
                      invalidatePage()
                      setLastUploadedImageIndex(i => i+1)
                    }} />
                    Upload
                </div>
                <div className="page-prompt-button run"
                  onClick={() => {
                    setActionToRun(actionId);
                  }}>
                  Run
                </div>
              </div>
          </div>
          
          {/* RESULTS */}
          <div className="page-result-box">
            <h2>Result</h2>
            <div className="page-result-body">
              <div className="page-result-tabs-body">
                <div className={`page-result-tabs-page ${focusedTab === 'html' ? 'selected' : ''}`}>
                  <iframe
                    title="html"
                    srcDoc={action?.rendered}
                    style={{width: '100%', height: '100%'}}></iframe>
                </div>
                <div className={`page-result-tabs-page ${focusedTab === 'source' ? 'selected' : ''}`}>
                  <div className="page-result-display code scroll-bar-dark"
                    dangerouslySetInnerHTML={{__html:renderAsText(action?.rendered)}}>
                  </div>
                </div>
                <div className={`page-result-tabs-page ${focusedTab === 'figma' ? 'selected' : ''}`}>
                  <iframe
                    title="dog"
                    style={{width: '100%', height: '100%'}}
                    src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fs1Ohf6N6CrkVNeNCmrXEzT%2F2024-Partner-Tour---Design-System---Strong%3Fnode-id%3D4002-1247%26t%3D7uorNQ5whr1AIPoA-1"></iframe>
                </div>
                {isRunning ? (
                  <div className="page-loading">
                    <LoadingSpinner />
                  </div>
                ) : null}
              </div>
              <div className="page-result-tabs">
                <div
                  className={`page-result-tab ${focusedTab === 'html' ? 'selected' : ''}`}
                  onClick={() => setFocusedTab('html')}>
                  HTML
                </div>
                <div
                  className={`page-result-tab ${focusedTab === 'source' ? 'selected' : ''}`}
                  onClick={() => setFocusedTab('source')}>
                  Source
                </div>
                <div
                  className={`page-result-tab ${focusedTab === 'figma' ? 'selected' : ''}`}
                  onClick={() => setFocusedTab('figma')}>
                  Figma
                </div>                
              </div>
            </div> 
          </div>
        </div>
    );
}

export default Page;