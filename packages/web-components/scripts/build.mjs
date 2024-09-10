import esbuild from "./esbuild.mjs";
import { distPath, srcPath } from "./config.mjs";

(async () => {
  const config = {
    distPath: `${distPath}`,
    srcPath,
    entryPoints: [
      `${srcPath}/index.ts`,
      `${srcPath}/dmo-button/DMOButton.ts`,
      `${srcPath}/wc-promotional-banner/WCPromotionalBanner.ts`,
      `${srcPath}/wc-image/WCImage.ts`,
      `${srcPath}/web-components-react/src/dmo-button/DMOButton.ts`,
    ],
    sassIncludePaths: [
        // `./dist/tokens/scss`, 
        `./dist/tokens`,
    ],
  };

  await esbuild(config);
  // await manifest(config);
})()
