# 2024 Partner Tour Demo

## Servers / Watches
```
# http://localhost:3005
npm run local:start:api-ai

# http://localhost:3080
npm run local:start:app-ai-dsys-demo

# http://localhost:1234
npm run local:server:web-components

# http://localhost:3000
npm run local:start:contentful-web-components-app

# web-socket (communicate between Figma and App)
npm run local:start:web-socket

### Optional Watches
```
# http://localhost:3001   (?)
npm run local:start:figma-widget-cdef

npm run local:start:web-components
```

### Builds
```
cd ./packages/component-definitions
npm run build

cd ./packages/design-tokens
npm run build
```


## Packages
### app-ai-dsys-demo 
The actual demo presented during presentation

### api-ai
The api providing all the AI services to app-ai-dsys-demo

### figma-tokens-export-plugin
Way to get around not having an enterprise account

### design-tokens
This is the main tokens package. It gets tokens via the figma-tokens-export-plugin.

### web-components
Uses component-definitions and design-tokens, this builds all the web-components

### component-definitions
provides CLI to web-components to process into universal component definitions

### contentful-web-components-app
This shows up in Contentful, it knows how to render the inputs for component definitions.

### figam-widget-cdef
The Figma widget that manages component defintion stuff.

