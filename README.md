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

