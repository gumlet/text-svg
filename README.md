[![NPM](https://nodei.co/npm/text2png.png)](https://nodei.co/npm/text2png/)
[![npm version](https://badge.fury.io/js/text2png.svg)](https://badge.fury.io/js/text2png)
[![Build Status](https://travis-ci.org/tkrkt/text2png.svg?branch=master)](https://travis-ci.org/tkrkt/text2png)

# text-svg: Text to SVG generator for Node.js

```js
textToSvg('Create png image\nfrom multi-line text!');
```

![text2png](./img/text2png.png)

## Quick start

text-svg depends on [node-canvas](https://github.com/Automattic/node-canvas).
See [node-canvas wiki](https://github.com/Automattic/node-canvas/wiki) on installing node-canvas.

```
$ npm install text-svg
```

```js
var fs = require('fs');
var text2Svg = require('text-svg');
fs.writeFileSync('out.svg', text2Svg('Hello!', {color: 'blue'}));
```

## Option

``text2svg(text, option)``

|param|default|
|---|---|
|text|(required)|
|option.font|'30px sans-serif'|
|option.textAlign|'left'|
|option.color (or option.textColor)|'black'|
|option.backgroundColor (or option.bgColor)|'transparent'|
|option.lineSpacing|0|
|option.strokeWidth|0|
|option.strokeColor|'white'|
|option.padding|0|
|option.padding(Left\|Top\|Right\|Bottom)|0|
|option.borderWidth|0|
|option.border(Left\|Top\|Right\|Bottom)Width|0|
|option.borderColor|'black'|
|option.localFontPath||
|option.localFontName||
|option.output|'buffer'|
|option.width||
|option.height||

``option.color = '#000' | 'rgb(0, 0, 0)' | 'black' | ...``

``option.output = 'buffer' | 'stream' | 'dataURL' | 'canvas'``

``option.strokeWidth = 1 | 2 | ... `` A padding may have to be set to avoid cutoff of stroke

``'canvas'`` returns [node-canvas](https://github.com/Automattic/node-canvas) object.

If you want to use any custom fonts without installing, use `localFontPath` and `localFontName` property.

```js
text2Svg('with custom fonts', {
  font: '50px Lobster',
  localFontPath: 'fonts/Lobstar-Regular.ttf',
  localFontName: 'Lobster'
});
```

## Command line interface

```
$ npm install -g text-svg
$ text2Svg --help
$ text2Svg -t "Hello!" -o "output.svg"
```

## Example

```js
text2Svg('Example\nText', {
  font: '80px Futura',
  color: 'teal',
  backgroundColor: 'linen',
  lineSpacing: 10,
  padding: 20
});
```

![ExampleText](./img/exampleText.png)

Enjoy!
