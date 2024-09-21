
export enum MessageName {
  globalDataUpdate = 'globalDataUpdate',
  tokenGroupUpdate = 'tokenGroupUpdate',
  promiseBounce = 'promiseBounce',
}

export type MessagePromiseResult = {
  request: MessageRequest,
  promiseId: string,
  [key: string]: any,
}

export enum MessageRequest {
  selectionChange = 'selectionChange',
  resizeWindow = 'resizeWindow',
  saveToFileStorage = 'saveToFileStorage',
  getFromFileStorage = 'getFromFileStorage',
  saveToWidgetStorage = 'saveToWidgetStorage',
  getFromWidgetStorage = 'getFromWidgetStorage',
  saveToClientStorage = 'saveToClientStorage',
  getFromClientStorage = 'getFromClientStorage',
  clearAllStorage = 'clearAllStorage',
  renderFigmaComponentFromContentfulComponent = 'renderFigmaComponentFromContentfulComponent',
  renderFigmaComponentFromCDef = 'renderFigmaComponentFromCDef',
  clearStage = 'clearStage',
  stageComponentChange = 'stageComponentChange',
  getStageComponentInfo = 'getStageComponentInfo'
}

export enum PageSize {
  default = 'default',
  wide = 'wide',
  tall = 'tall',
  wideAndTall = 'wideAndTall'
}

export enum AppPage {
  lint = 'Lint',
  // ctflLint = 'CTFL Lint',
  component = 'Component',
  // html = 'HTML',
  ctfl = 'Contentful',
  config = 'Config',
  import = 'Import',
  create = 'Create'
}

export enum LintPageId {
  figma = 'Figma',
  ctfl = 'Contentful',
}

export enum CreatePageId {
  ctfl = 'Contentful',
  import = 'From HTML',
}

export enum CodePageId {
  // cdef = 'Definition',
  cinst = 'CDef',
  html = 'HTML',
  preview = 'Preview',
  contentful = 'Contentful'
}