// import actionsIndex from 'api-ai/src/actionsIndex.mjs';
import './Page.css';
import '../tokens/dist/ctfl/css/tokens.css';
import React, { useState, useEffect } from 'react';
import findActionPrompt from '../utils/findActionPrompt';

const AI_SERVICE_URL = 'http://localhost:3001';

function Page() {

    const [actionsInfo, setActionsInfo] = useState(null);
    const [actionInfo, setActionInfo] = useState(null);
    const [action, setAction] = useState(null);
    // const [actionRender, setActionRender] = useState(null);
    const [actionResult, setActionResult] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [actionToRun, setActionToRun] = useState(null);
    const [actionToReset, setActionToReset] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);

    const establishActionInfo = () => {
      const actionId = window.location.pathname.substring(1);
      // const action = actionsIndex.find(actionIndex => actionIndex.id === actionId);
      setActionInfo(actionId);
    }

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
        .then((actionsInfo) => {
          setActionsInfo(actionsInfo);
          setLoading(false);
        })
        .catch((error) => {
          setError(`load actions: ${error.message}`);
          setLoading(false);
        });
    }, []);

    // Load Action
    useEffect(() => {
      if (actionInfo) {
        const apiResultUrl = `${AI_SERVICE_URL}/action/${actionInfo}`;
        fetch(apiResultUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((actionResult) => {
            setActionResult(actionResult.result);
            setPrompt(findActionPrompt(actionResult))
          })
          .catch((error) => {
            setError(`result: ${error.message} ${apiResultUrl}`);
          });
      }
    }, [
      actionInfo,
      setAction,
      setPrompt,
      // setActionRender,
      setActionResult
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
            .then((results) => {
              setIsRunning(false);
              setActionResult(results.result);
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
      setActionResult,
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
            .then((results) => {
              setIsRunning(false);
              setActionToReset(null);
            })
            .catch((error) => {
              setError(`run action: ${error.message}`);
              setLoading(false);
            });
      }
    }, [actionToReset, setActionToReset, setIsRunning, setError, setLoading]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }
    
    return (
        <div className="Page">
          <div className='page-actions-list'>
            <h2>Prompts</h2>
            <div className='page-actions-pane'>
              {actionsInfo?.actions.map(action => {
                if (action.group) {
                  return (
                    <div className='page-action-group'
                      key={action.group}>
                      {action.group}
                    </div>
                  );
                }
                return (
                  <div className={`page-action-item ${actionInfo?.id === action.id ? 'selected' : ''}`}
                    key={action.id}
                    onClick={() => {
                      const newUrl = `${window.location.origin}/${action.id}`;
                      window.history.pushState({ path: newUrl }, '', newUrl);
                      // setActionInfo(action);
                      setActionResult(null);
                      setActionToRun(null);
                      // setActionRender(null);
                    }}>
                    {action.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="page-prompt-box">
              <h2>Prompt</h2>
              <div className="page-prompt-display">
                {prompt}
              </div>
              <div className="page-prompt-nav">
                <div className="page-prompt-button clear"
                  onClick={() => {
                    setActionToReset(actionInfo);
                  }}>
                  Clear
                </div>
                <div className="page-prompt-button run"
                  onClick={() => {
                    setActionToRun(actionInfo);
                  }}>
                  Run
                </div>
              </div>
          </div>
          <div className="page-result-box">
              <h2>Result</h2>
              {/* <div className="page-result-display">
                {isRunning ? 'running...' : actionRender || 
                  (<div className="empty">(empty)</div>)}
              </div> */}
              <div className="page-result-display code">
                {isRunning ? 'running...' : actionResult ||
                  (<div className="empty">(empty)</div>)}
              </div>
          </div>
        </div>
    );
}

export default Page;