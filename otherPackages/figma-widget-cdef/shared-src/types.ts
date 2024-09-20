
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
  stateUpdate = 'stateUpdate',
  selectionChange = 'selectionChange',
  resizeWindow = 'resizeWindow',
  saveToFileStorage = 'saveToFileStorage',
  getFromFileStorage = 'getFromFileStorage',
  saveToWidgetStorage = 'saveToWidgetStorage',
  getFromWidgetStorage = 'getFromWidgetStorage',
  saveToClientStorage = 'saveToClientStorage',
  getFromClientStorage = 'getFromClientStorage',
  clearAllStorage = 'clearAllStorage',
  renderFigmaComponent = 'renderFigmaComponent',
  renderFigmaComponentFromCDef = 'renderFigmaComponentFromCDef',
  clearStage = 'clearStage'
}

export enum PageSize {
  default = 'default',
  wide = 'wide',
  tall = 'tall',
  wideAndTall = 'wideAndTall'
}

export enum AppPage {
  lint = 'Lint',
  ctflLint = 'CTFL Lint',
  code = 'Code',
  html = 'HTML',
  ctfl = 'Contentful',
  config = 'Config'
}

export enum LintPageId {
  figma = 'Figma',
  ctfl = 'Contentful',
}

export enum CodePageId {
  // cdef = 'Definition',
  cinst = 'CDef',
  html = 'HTML',
  preview = 'Preview',
  import = 'Import',
  contentful = 'Contentful'
}