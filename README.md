# 2024 Partner Tour Demo

## Packages
### component-definitions
provides CLI to web-components to process into universal component definitions

### app-ai-dsys-demo 
The actual demo presented during presentation
```
npm run start
```

### api-ai
The api providing all the AI services


### design-tokens
Using figma-tokens-export-plugin run the build process against the exported tokens
```
npm run build
```

### figma-tokens-export-plugin
Way to get around not having pro account

### web-components
Uses component-definitions and design-tokens, this builds all the web-components

This will start the code watch
```
cd ./packages/web-components
npm run server
```

start the server that presents the cdefs
```
cd ./packages/web-components
npm run server
```
