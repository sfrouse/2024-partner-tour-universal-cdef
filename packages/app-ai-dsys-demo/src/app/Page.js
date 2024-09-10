// import actionsIndex from 'api-ai/src/actionsIndex.mjs';
import './Page.css';
import '../tokens/dist/ctfl/css/tokens.css';
import React, { useState, useEffect } from 'react';
import findActionPrompts from '../utils/findActionPrompts';

const AI_SERVICE_URL = 'http://localhost:3005';

function Page() {

    const [actionList, setActionList] = useState(null);
    const [actionId, setActionId] = useState(null);
    // const [action, setAction] = useState(null);
    // const [action, setAction] = useState(null);
    // const [actionRender, setActionRender] = useState(null);
    const [action, setAction] = useState(null);
    const [prompts, setPrompts] = useState(null);
    const [actionToRun, setActionToRun] = useState(null);
    const [actionToReset, setActionToReset] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);

    const establishActionInfo = () => {
      const actionId = window.location.pathname.substring(1);
      // const action = actionsIndex.find(actionIndex => actionIndex.id === actionId);
      setActionId(actionId);
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
        .then((actionList) => {
          setActionList(actionList);
          setLoading(false);
        })
        .catch((error) => {
          setError(`load actions: ${error.message}`);
          setLoading(false);
        });
    }, []);

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
            .then((results) => {
              setIsRunning(false);
              setActionToReset(null);
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
            </div>
          </div>

          {/* PROMPTS */}
          <div className="page-prompt-box">
              <h2>Prompt</h2>
              <div className="page-prompt-display">
                {prompts}
              </div>
              <div className="page-prompt-nav">
                <div className="page-prompt-button clear"
                  onClick={() => {
                    setActionToReset(actionId);
                  }}>
                  Clear
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
              {/* <div className="page-result-display">
                {isRunning ? 'running...' : actionRender || 
                  (<div className="empty">(empty)</div>)}
              </div> */}
              <div className="page-result-display">
                <iframe title="dog" srcDoc={action?.rendered} style={{width: '100%', height: '100%'}}></iframe>
              </div>
              <div className="page-result-display code">
                {isRunning ? 'running...' : 
                  action?.rendered ||
                  (<div className="empty">(empty)</div>)}
              </div>
          </div>
        </div>
    );
}

export default Page;