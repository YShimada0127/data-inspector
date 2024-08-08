export let useDataInspector: typeof import('./useDataInspector').useDataInspector;

// @ts-ignore process.env.NODE_ENV is defined by metro transform plugins
if (process.env.NODE_ENV !== 'production') {
  useDataInspector = require('./useDataInspector').useDataInspector;
} else {
  useDataInspector = () => {};
}
