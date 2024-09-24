// import actionsIndex from 'api-ai/src/actionsIndex.mjs';
import './css/Page.css';
import './css/PageActionsNav.css';
import './css/PageResults.css';
import './css/PagePrompt.css';
import React, { useState, useEffect } from 'react';
import findActionPrompts from '../../utils/findActionPrompts';
import ImageUploader from '../../components/imageUpload';
import RefreshButton from '../../components/refreshButton';
import LoadingSpinner from '../../components/loadingSpinner/loadingSpinner';
import formatDuration from './utils/formatTimer';
import getWebSocketStatusColor from './utils/getWebSocketStatusColor';
import ActionSelect from './utils/actionSelect';
import SystemSelect from './utils/systemsSelect';
import runAIConvo from './utils/runAIConvo';
import runAI from './utils/runAI';
import RecordButton from './components/RecordButton';
import runAIOpenEnded from './utils/runAIOpenEnded';
import countTokens from './utils/countTokens';
import findAllPrompts from '../../utils/findAllPrompts';
import getLatestUsage from './utils/getLatestUsage';
import pithyDateTime from './utils/pithyDateTime.mjs';
import resetAll from './utils/resetAll';
import updateCode from './utils/updateCode';

export const AI_SERVICE_URL = 'http://localhost:3005';

function Page() {

    // Actions
    const [actionList, setActionList] = useState(null);
    const [actionId, setActionId] = useState(null);
    const [action, setAction] = useState(null);
    const [actionSourceCode, setActionSourceCode] = useState(null);
    const [openEndedPrompt, setOpenEndedPrompt] = useState(null);

    const [prompts, setPrompts] = useState(null);
    const [actionToReset, setActionToReset] = useState(null);

    // Systems
    const [systemsList, setSystemsList] = useState(null);
    const [systemId, setSystemId] = useState('text');
    const [system, setSystem] = useState();

    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState('');

    const [webSocket, setWebSocket] = useState(null);
    const [lastUploadedImageIndex, setLastUploadedImageIndex] = useState(new Date().getTime());

    const [invalidate, setInvalidate] = useState(0);

    const [focusedTab, setFocusedTab] = useState('html');
    const [scratchPad, setScratchPad] = useState('');
    const [scratchPadPromtTokenCount, setScratchPadPromtTokenCount] = useState(0);

    const [durationStart, setDurationStart] = useState(0);
    const [durationEnd, setDurationEnd] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [websocketStatus, setWebsocketStatus] = useState('disconnected');

    const [promtTokenCount, setPromtTokenCount] = useState(0);
    const [latestUsage, setLatestUsage] = useState();
    
    const invalidatePage = () => setInvalidate(i => i+1);

    const establishActionInfo = () => {
      const actionId = window.location.pathname.substring(1);
      setActionId(actionId);
    }

    // Establish WebSocket
    useEffect(() => {
      // Connect to the WebSocket server
      const ws = new WebSocket('ws://localhost:8060');
      setWebsocketStatus('connecting');

      ws.onopen = () => {
        console.log('Connected to the WebSocket server');
        setWebsocketStatus('connected');
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg) {
            switch (msg.type) {
              case "figma-export" : {
                await updateCode(
                  action.id,
                  `${msg.code}`,
                  setError,
                  setLoading
                );
                setInvalidate(Date.now());
                return;
              }
              default: {}
            }
          }
          
        }catch(err) {
          console.error(err);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from the WebSocket server');
        setWebsocketStatus('disconnected');
      };
      setWebSocket(ws);
    }, []);

    // Scratchpad and open ended prompt
    useEffect(() => {
      const savedValue = localStorage.getItem('scratchPad');
      if (savedValue) {
        setScratchPad(savedValue);
      }

      const savedOpenEndedPrompt = localStorage.getItem('openEndedPrompt');
      if (savedOpenEndedPrompt) {
        setOpenEndedPrompt(savedOpenEndedPrompt);
        (async () => {
          setPromtTokenCount( await countTokens(savedOpenEndedPrompt) );
        })()
      }
    }, []);

    // Update latest usage
    useEffect(() => {
      setActionSourceCode(action?.rendered);
      getLatestUsage(setLatestUsage);
    }, [action]);

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

      // Load Actions
      const actionsUrl = `${AI_SERVICE_URL}/actions`;
      fetch(actionsUrl)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(JSON.stringify(await response.json(), null, 2));
          }
          return response.json();
        })
        .then((actionList) => {
          setActionList(actionList);
          setLoading(false);
        })
        .catch((error) => {
          setIsRunning(false);
          setError(`load actions: ${error}`);
          setLoading(false);
        });

      // // Load Systems
      const systemsUrl = `${AI_SERVICE_URL}/systems`;
      fetch(systemsUrl)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(JSON.stringify(await response.json(), null, 2));
          }
          return response.json();
        })
        .then((systemsList) => {
          setSystemsList(systemsList);
        })
        .catch((error) => {
          setIsRunning(false);
          setError(`load actions: ${error}`);
          setLoading(false);
        });

      // Latest Usage
      getLatestUsage(setLatestUsage);

    }, [invalidate, setSystem, systemId, setLatestUsage]);

    // System default
    useEffect(() => {
      const selectedSystem = systemsList?.systems?.find(system => system.id === systemId);
      setSystem(selectedSystem);
    }, [systemsList, systemId]);

    // Load Action
    useEffect(() => {
      if (actionId) {
        const apiResultUrl = `${AI_SERVICE_URL}/action/${actionId}`;
        fetch(apiResultUrl)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(JSON.stringify(await response.json(), null, 2));
            }
            return response.json();
          })
          .then(async (action) => {
            setIsRunning(false);
            setAction(action);
            const prompts = findActionPrompts(action);
            setPrompts(prompts);
            // Count tokens
            setPromtTokenCount( await countTokens(findAllPrompts(action)) );
          })
          .catch((error) => {
            setIsRunning(false);
            setError(`result: ${error} ${apiResultUrl}`);
          });
      }
    }, [
      actionId,
      setPrompts,
      setAction,
      invalidate
    ]);

    // Poll during service running
    useEffect(() => {
      if (durationEnd === null) {
        const interval = setInterval(() => {
          setCurrentDuration(Date.now() - durationStart);
        }, 1000); // update every second
  
        return () => clearInterval(interval);
      }
    }, [durationEnd, durationStart]);

    // Delete Action
    useEffect(() => {
      if (actionToReset) {
          const apiUrl = `${AI_SERVICE_URL}/reset/${actionToReset}`;
          setIsRunning(true);
          fetch(apiUrl)
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(JSON.stringify(await response.json(), null, 2));
              }
              return response.json();
            })
            .then(() => {
              setIsRunning(false);
              setActionToReset(null);
              setAction(null);
            })
            .catch((error) => {
              setIsRunning(false);
              setError(`run action: ${error}`);
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

    // if (error) {
    //   return <div>Error: {error}</div>;
    // }

    const updateScratchPad = async ( newScratch ) => {
      localStorage.setItem('scratchPad', newScratch);
      setScratchPad(newScratch);

      setScratchPadPromtTokenCount( await countTokens(newScratch) );
    }

    const updateOpenEndedPrompt = async ( newPrompt ) => {
      localStorage.setItem('openEndedPrompt', newPrompt);
      setOpenEndedPrompt(newPrompt);

      setPromtTokenCount( await countTokens(newPrompt) );
    }

    return (
        <div className="Page">
          {/* PROMPTS */}
          <div className="page-prompt-box">
              <div className="page-prompt-header">
                <h2>Prompt</h2>
              </div>
              <div className="page-prompt-display-canned">
                <div className="page-prompt-display-header">
                  <ActionSelect
                      actionId={actionId}
                      actionList={actionList}
                      setAction={setAction} />
                </div>
                <div className="page-prompt-display-body">
                  <div className="page-prompt-display prompt scroll-bar-grey">
                    {action?.isOpen === true ? (
                      <div className='page-prompt-display-open-input'>
                        <div className="page-prompt-open-input-header">
                          <SystemSelect
                              systemsList={systemsList}
                              systemId={systemId}
                              setSystemId={setSystemId}
                              setSystem={setSystem} />
                        </div>
                        <textarea
                          value={openEndedPrompt}
                          className='scroll-bar'
                          onChange={(e) => {
                            updateOpenEndedPrompt(e.target.value);
                          }}
                          placeholder='...enter prompt'
                          spellCheck={false}
                        />
                      </div>) : 
                      prompts?.map(prompt => {
                        if (prompt === '(upload last image)') {
                          return (
                            <div
                              key={`lastupdated-${lastUploadedImageIndex}`}
                              className="page-prompt-display-prompt-image">
                              <img
                                src={`http://localhost:3005/uploads/lastUpload.png?${lastUploadedImageIndex}`}
                                alt=""
                                width="400" />
                            </div>);
                        }
                        return (
                          <div className="page-prompt-display-prompt" key={prompt}>
                            {prompt}
                          </div>
                        );
                      })}
                  </div>
                  {isRunning ? (
                    <div className="page-loading">
                      <LoadingSpinner />
                    </div>  
                  ) : null}
                </div>
              </div>
              <div className="page-prompt-nav">
                {action?.isOpen === true ? (
                  <RecordButton
                    onDone={updateOpenEndedPrompt} />
                ) : null}
                <RefreshButton
                  onClick={() => invalidatePage()} />
                <div className='tokenCount'>{promtTokenCount}</div>
                <div className="fill"></div>
                <div className="page-prompt-button clear"
                  onClick={() => {
                    setActionToReset(actionId);
                    setTimeout(() => invalidatePage(), 500);
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
                <button className="page-prompt-button run"
                  onClick={async () => {
                    if (action.isOpen === true) {
                      runAIOpenEnded(
                        system,
                        openEndedPrompt,
                        setDurationStart,
                        setDurationEnd,
                        setCurrentDuration,
                        setIsRunning,
                        setAction,
                        setError,
                        setLoading
                      );
                    }else{
                      runAI(
                        actionId,
                        setDurationStart,
                        setDurationEnd,
                        setCurrentDuration,
                        setIsRunning,
                        setAction,
                        setError,
                        setLoading
                      );
                    }
                  }}>
                  Run
                </button>
              </div>

              <div className="page-prompt-scratchpad">
                <textarea
                  value={scratchPad} className='scroll-bar'
                  onChange={(e) => {
                    updateScratchPad(e.target.value);
                  }}
                  placeholder="...enter prompt"
                  spellCheck={false}
                />
              </div>
              <div className="page-prompt-nav">
                <RecordButton
                  onDone={updateScratchPad} />
                <div className='tokenCount'>
                  {scratchPadPromtTokenCount}
                </div>
                <div className="fill"></div>
                <div className="page-prompt-button clear"
                  onClick={() => {
                    updateScratchPad('')
                  }}>
                  Clear
                </div>
                <button className="page-prompt-button run"
                  onClick={() => {
                    runAIConvo(
                      actionId,
                      // systemId,
                      scratchPad,

                      setDurationStart,
                      setDurationEnd,
                      setCurrentDuration,
                      setIsRunning,
                      setAction,
                      setError,
                      setLoading
                    );
                  }}>
                  Update
                </button>
              </div>
              
          </div>
          
          {/* RESULTS */}
          <div className="page-result-box">
            <div className="page-result-header">
              <h2>Result</h2>
              <div className="page-prompt-button clear"
                onClick={() => {
                  resetAll(setLoading, setIsRunning, setError, setInvalidate);
                }}>
                Reset All
              </div>
            </div>
            <div className="page-result-body">
              <div className="page-result-tabs-body">
                <div className={`page-result-tabs-page ${focusedTab === 'html' ? 'selected' : ''}`}>
                  <iframe
                    title="html"
                    srcDoc={actionSourceCode}
                    style={{width: '100%', height: '100%'}}></iframe>
                </div>
                <div className={`page-result-tabs-page ${focusedTab === 'source' ? 'selected' : ''}`}>
                  <textarea
                    value={actionSourceCode}
                    className='page-result-display code scroll-bar-dark'
                    onChange={(e) => {
                      setActionSourceCode(e.target.value);
                    }}
                    placeholder="...enter prompt"
                    spellCheck={false}
                  />
                  <div className="page-prompt-button dark save-button"
                    onClick={async () => {
                      await updateCode(
                        action.id,
                        actionSourceCode,
                        setError,
                        setLoading
                      );
                      setInvalidate(Date.now());
                    }}>
                    Save
                  </div>
                </div>
                <div className={`page-result-tabs-page ${focusedTab === 'figma' ? 'selected' : ''}`}>
                  <iframe
                    title="Figma Iframe"
                    style={{width: '100%', height: '100%'}}
                    src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fs1Ohf6N6CrkVNeNCmrXEzT%2F2024-Partner-Tour---Design-System---Strong%3Fnode-id%3D4002-1247%26t%3D7uorNQ5whr1AIPoA-1"></iframe>
                </div>
                {isRunning ? (
                  <div className="page-loading">
                    <LoadingSpinner />
                  </div>
                ) : null}
              </div>
              <div className='page-result-usage'>
                <div>
                  {latestUsage ? `${latestUsage?.model || ''} || OVERALL tokens:${
                      latestUsage?.ratelimit_remaining_tokens?.toLocaleString('en-US') || '?'
                    }/${
                      latestUsage?.ratelimit_limit_tokens?.toLocaleString('en-US') || '?'
                    } | requests:${
                      latestUsage?.rate_limit_remaining_requests?.toLocaleString('en-US') || '?'
                    }/${
                      latestUsage?.rate_limit_limit_requests?.toLocaleString('en-US') || '?'
                    } | last: ${pithyDateTime(latestUsage.timestamp)}` : ''}
                </div>
                <div>
                  {action?.usage ? `CALL time:${
                    action.usage?.time_taken ? (action.usage?.time_taken / 1000).toFixed(1) : '?'
                  }s, prompt:${
                    action.usage?.prompt_tokens?.toLocaleString('en-US') || '?'
                  } | answer:${
                    action.usage?.completion_tokens?.toLocaleString('en-US') || '?'
                  } | total:${
                    action.usage?.total_tokens?.toLocaleString('en-US') || '?'
                  }` : ''}
                </div>
              </div>
              <div className="page-result-tabs">
                <div
                    className="page-result-websocket-status"
                    style={{
                        backgroundColor: getWebSocketStatusColor(websocketStatus),
                    }}
                ></div>
                <div className='page-result-time'>
                  {durationEnd ? formatDuration(durationEnd - durationStart) : formatDuration(currentDuration)}
                </div>
                <div
                  className={`page-prompt-button`}
                  onClick={() => {
                    webSocket.send(
                      JSON.stringify({
                        type:'import',
                        code: actionSourceCode
                      })
                    );
                  }}>
                  To Figma
                </div>
                <div
                  className={`page-prompt-button`}
                  onClick={() => {
                    webSocket.send(
                      JSON.stringify({type:'clear'})
                    );
                  }}>
                  Clear Figma
                </div>
                <div className='fill'></div>
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
          {error ? (
            <div className="error-modal">
              <div class="content">
                <span class="close" onClick={() => setError('')}>&times;</span>
                <div class="message">{error}</div>
              </div>
            </div>
          ) : ''}
        </div>
    );
}

export default Page;