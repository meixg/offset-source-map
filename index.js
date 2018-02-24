/**
 * @file offset source map
 * @author meixg
 */

var SourceMapConsumer = require('source-map').SourceMapConsumer;
var SourceMapGenerator = require('source-map').SourceMapGenerator;

/**
 * copy all source content from consumer to generator
 * directly modify consumer, no return
 *
 * @param {Object} generator SourceMapGenerator
 * @param {Object} consumer SourceMapConsumer
 */
function copyResourceContent(generator, consumer) {
    consumer.sources.forEach(function (source) {
        generator.setSourceContent(
            source,
            consumer.sourceContentFor(source)
        );
    });
}

/**
 * offset source map
 *
 * @param {Object} sourceMap source map
 * @param {Object} offset offset
 * @param {number} offset.originalOffsetLine line number where original source map start
 * @param {number} offset.originalOffsetColumn column number where original source map start
 * @param {number} offset.generatedOffsetLine line number where generated source map start
 * @param {number} offset.generatedOffsetColumn column number where generated source map start
 * @return {Object}
 */
module.exports = function (sourceMap, offset) {
    var originalOffsetLine = offset.originalOffsetLine || 0;
    var originalOffsetColumn = offset.originalOffsetColumn || 0;
    var generatedOffsetLine = offset.generatedOffsetLine || 0;
    var generatedOffsetColumn = offset.generatedOffsetColumn || 0;

    var consumer = new SourceMapConsumer(sourceMap);
    var generator = new SourceMapGenerator({
        file: consumer.file,
        sourceRoot: consumer.sourceRoot
    });
    copyResourceContent(generator, consumer);
    consumer.eachMapping(function (m) {
        if (typeof m.originalLine === 'number' && 0 < m.originalLine
            && typeof m.originalColumn === 'number' && 0 <= m.originalColumn
            && m.source) {
            generator.addMapping({
                source: m.source,
                name: m.name,
                original: {
                    line: m.originalLine + originalOffsetLine,
                    column: m.originalColumn + originalOffsetColumn
                },
                generated: {
                    line: m.generatedLine + generatedOffsetLine,
                    column: m.generatedColumn + generatedOffsetColumn
                }
            });
        }
    });
    return generator.toString();
};
