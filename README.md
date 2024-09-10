# 2024 Partner Tour Demo

## Servers / Watches
```
# http://localhost:3005
cd ./packages/api-ai
npm run dev

# http://localhost:3080
cd ./packages/app-ai-dsys-demo
npm run start

# http://localhost:1234
cd ./packages/web-components
npm run server

# http://localhost:3000
cd ./packages/contentful-web-components-app
npm run start

# revert to project base
cd ../../
```

### Optional Watches
```
# http://localhost:3001   (?)
cd ./packages/figma-widget-cdef
npm run start

cd ./packages/web-components
npm run start
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

