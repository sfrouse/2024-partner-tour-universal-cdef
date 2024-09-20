import getFullStyleDictionary from "./dictionaries/fullStyleDictionary.mjs";
import getCssStyleDictionary from "./dictionaries/cssStyleDictionary.mjs";
import './transformers/sizeDimensionTransform.mjs';
import { PREFIX, srcPath } from './config.mjs';

const lightStyleDictionary = getFullStyleDictionary([
  `${srcPath}/primitive.global.tokens.json`,
  `${srcPath}/semantic*.light.tokens.json`
], `
@import "variables-dark.css";

:root, .${PREFIX}-light`);
lightStyleDictionary.buildAllPlatforms();

const darkStyleDictionary = getCssStyleDictionary([
  `${srcPath}/semantic*.dark.tokens.json`
], [
  `${srcPath}/primitive.global.tokens.json`,
], 'dark');
darkStyleDictionary.buildAllPlatforms();
