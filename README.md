### webpack plugin for css deduplication, remove duplicated css rules

---

```bash
npm install dedupcss-webpack-plugin --save-dev
```

```js
var DedupCSSPlugin = require('dedupcss-webpack-plugin');

...

{
  plugins: [new DedupCSSPlugin({})]
}

```

Options:
- suffix: a suffix for the deduped asset. Defaults to '.css'
- override: if set to true the original asset will be overriden. Defaults to false.
