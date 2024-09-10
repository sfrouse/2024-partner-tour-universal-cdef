import express from 'express';
import aiApi from './aiApi.mjs';
// import { exec } from 'child_process';
import cors from 'cors';
import actionsIndex from './actionsIndex.mjs';
import writeStringToFile from './prompts/utils/writeStringToFile.mjs';
import loadFileAsText from './prompts/utils/loadFileAsText.mjs';
import pullHTMLComponent from './pullHTMLComponent.mjs';

const app = express();
const port = 3005;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/reset', async (req, res) => {
  for (const action of actionsIndex) {
    deleteAction(action);
  }
  
  res.json({
    success: true
  });
});

app.get('/cssTricks', async (req, res) => {
  const htmlComp = await pullHTMLComponent();
  const final = `<style>${htmlComp.css}</style>${htmlComp.html}`;
  const outputFile = `./src/generatedCode/cssTricksSource.mjs`;
  await writeStringToFile(
    outputFile,
    `const output = \`${final.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\nexport default output;`
  );
  
  res.json({
    success: true
  });
});



// LIST OF ACTIONS
app.get('/actions', (req, res) => {
  res.json({
    actions: actionsIndex
  });
});

// ACTION INFO
app.get('/action/:actionId', async (req, res) => {
  return await getAction(req.params.actionId, res);
});

// RUN AI
app.get('/ai/:actionId', async (req, res) => {
    const action = actionsIndex.find(action => action.id === req.params.actionId);
    if (action) {
      await aiApi(action);
      return await getAction(req.params.actionId, res);
    }else{
      return res.status(400).json({
        success: false,
        error: 'Action not found',
        actionId: req.params.actionId
      });
    }
});

app.get('/resetlist', async (req, res) => {
  const output = [`<a href="/reset">ALL</a>`];
  actionsIndex.map((action) => {
    if (action.group) {
      output.push(`<div style="margin-top: 20px;">${action.group}</div>`);
      return false;
    }
    output.push(`<a style="display: block;" href="/reset/${action.id}">${action.name}</a>`);
    return false;
  })
  res.send(`<div>${output.join('')}</div>`);
});

app.get('/reset/:actionId', async (req, res) => {
  const action = actionsIndex.find(action => action.id === req.params.actionId);
  if (action) {
    deleteAction(action);
    res.json({
      success: true
    });
  }else{
    res.json({
      success: false,
      message: 'no action found'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function deleteAction(action) {
  const outputFile = `./src/generatedCode/${action.id}.json`;
  await writeStringToFile(
    outputFile,
    ``
  );
  // const outputFileCompiled = `./src/generatedCode/${action.id}-compiled.json`;
  // await writeStringToFile(
  //   outputFileCompiled,
  //   ``
  // );
}

async function getAction(actionId, res) {
  const action = actionsIndex.find(action => action.id === actionId);
  if (action) {
    let results = '';
    try {
      results = await loadFileAsText(
        `./src/generatedCode/${action.id}.json`
      );
      results = JSON.parse(results);
    }catch(err) {
      console.log('err', err);
    }// nada

    const finalAction = {
      ...action,
      prompts: await action.prompts(),
      results
    }
    res.json({
      ...finalAction,
      rendered: await action.render(finalAction)
    });
  }else{
    return res.status(400).json({
      error: 'Action not found',
      actionId: actionId
    });
  }
}

