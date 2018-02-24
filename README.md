# offset-source-map

offset source map, including original and generated line and column.

## quick start

```javascript
var offsetSourceMap = require('offset-source-map');

var generatedSourceMap = offsetSourceMap(originalSourceMap, {
    originalOffsetLine: 10,
    originalOffsetColumn: 0,
    generatedOffsetLine: 10,
    generatedOffsetColumn: 0
});
```