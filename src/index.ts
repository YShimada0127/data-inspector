export let useDataInspector = process.env.NODE_ENV !== 'production'
  ? require('./useDataInspector').useDataInspector
  : () => { };
