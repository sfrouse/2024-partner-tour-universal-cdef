import actionsIndex from "../actionsIndex.mjs";
import loadFileAsText from "../prompts/utils/loadFileAsText.mjs";

export default async function getAction(actionId, res) {
    const action = actionsIndex.find(action => action.id === actionId);
    if (action) {
      let results = [];
      try {
        const contentResults = await loadFileAsText(
          `./src/generatedCode/${action.id}.json`
        );
        results = JSON.parse(contentResults);
      }catch(err) {
        console.log('err', err);
      }// nada

      let usage = {};
      try {
        const usageResults = await loadFileAsText(
          `./src/generatedCode/${action.id}.usage.json`
        );
        usage = JSON.parse(usageResults);
      }catch(err) {
        console.log('err', err);
      }// nada
  
      const finalAction = {
        ...action,
        prompts: await action.prompts(),
        results,
        usage
      }
  
      const rendering = await action.render(finalAction);
      finalAction.rendered = rendering;

      // const allPrompts = findAllPrompts({
      //   ...action,
      //   prompts: await action.prompts()
      // });
      // const tokenCount = tiktoken(allPrompts);
      // finalAction.tokenCount = tokenCount;
      
      if (res) {
        res.json(finalAction);
      }else{
        return finalAction;
      }
    }else{
      if (res) {
        return res.status(400).json({
          error: 'Action not found',
          actionId: actionId
        });
      }else{
        return false;
      }
    }
}