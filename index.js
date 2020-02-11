const {
  registerFont,
  createCanvas
} = require("canvas");

const stream = require('stream');

/**
 * Convert text to PNG image.
 * @param text
 * @param [options]
 * @param [options.font="30px sans-serif"] css style font
 * @param [options.textAlign="left"] text alignment (left, center, right)
 * @param [options.color="black"] (or options.textColor) text color
 * @param [options.backgroundColor] (or options.bgColor) background color
 * @param [options.lineSpacing=0]
 * @param [options.strokeWidth=0]
 * @param [options.strokeColor='white']
 * @param [options.padding=0] width of the padding area (left, top, right, bottom)
 * @param [options.paddingLeft]
 * @param [options.paddingTop]
 * @param [options.paddingRight]
 * @param [options.paddingBottom]
 * @param [options.borderWidth=0] width of border (left, top, right, bottom)
 * @param [options.borderLeftWidth=0]
 * @param [options.borderTopWidth=0]
 * @param [options.borderRightWidth=0]
 * @param [options.borderBottomWidth=0]
 * @param [options.borderColor="black"] border color
 * @param [options.localFontPath] path to local font (e.g. fonts/Lobster-Regular.ttf)
 * @param [options.localFontName] name of local font (e.g. Lobster)
 * @param [options.maxWidth] maximum width of text
 * @param [options.wrap] whether text should be wrapped when it exceeds max width
 * @param [options.output="buffer"] 'buffer', 'stream', 'dataURL', 'canvas's
 * @returns {string} svg image buffer
 */
const text2png = (text, options = {}) => {
  // Options
  options = parseOptions(options);

  // Register a custom font
  if (options.localFontPath && options.localFontName) {
    registerFont(options.localFontPath, {
      family: options.localFontName
    });
  }

  const canvas = createCanvas(0, 0, 'svg');
  const ctx = canvas.getContext("2d");

  const max = {
    left: 0,
    right: 0,
    ascent: 0,
    descent: 0
  };

  let lastDescent;
  const lineProps = [];
  text.split("\n").forEach(line => {
    ctx.font = options.font;

    let words = line.split(' ');
    let newLine = '';
    let left, right, ascent, descent;

    for (var n = 0; n < words.length; n++) {
      let testLine;
      if (n == 0) {
        testLine = words[n];
      } else {
        testLine = newLine + " " + words[n];
      }

      const metrics = ctx.measureText(testLine);

      if (options.wrap && metrics.width > options.maxWidth && n > 0) {
        const metrics = ctx.measureText(newLine);
        left = -1 * metrics.actualBoundingBoxLeft;
        right = metrics.actualBoundingBoxRight;
        ascent = metrics.actualBoundingBoxAscent;
        descent = metrics.actualBoundingBoxDescent;

        max.left = Math.max(max.left, left);
        max.right = Math.max(max.right, right);
        max.ascent = Math.max(max.ascent, ascent);
        max.descent = Math.max(max.descent, descent);
        lastDescent = descent;
        lineProps.push({
          line: newLine,
          left,
          right,
          ascent,
          descent
        });
        newLine = words[n];
      } else {
        newLine = testLine;
      }
    }

    const metrics = ctx.measureText(newLine);

    left = -1 * metrics.actualBoundingBoxLeft;
    right = metrics.actualBoundingBoxRight;
    ascent = metrics.actualBoundingBoxAscent;
    descent = metrics.actualBoundingBoxDescent;

    max.left = Math.max(max.left, left);
    max.right = Math.max(max.right, right);
    max.ascent = Math.max(max.ascent, ascent);
    max.descent = Math.max(max.descent, descent);
    lastDescent = descent;

    lineProps.push({
      line: newLine,
      left,
      right,
      ascent,
      descent
    });

  });

  const lineHeight = max.ascent + max.descent + options.lineSpacing;

  const contentWidth = max.left + max.right;
  const contentHeight =
    lineHeight * lineProps.length -
    options.lineSpacing -
    (max.descent - lastDescent);

  canvas.width =
    contentWidth +
    options.borderLeftWidth +
    options.borderRightWidth +
    options.paddingLeft +
    options.paddingRight;

  canvas.height =
    contentHeight +
    options.borderTopWidth +
    options.borderBottomWidth +
    options.paddingTop +
    options.paddingBottom;

  const hasBorder =
    false ||
    options.borderLeftWidth ||
    options.borderTopWidth ||
    options.borderRightWidth ||
    options.borderBottomWidth;

  if (hasBorder) {
    ctx.fillStyle = options.borderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (options.backgroundColor) {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(
      options.borderLeftWidth,
      options.borderTopWidth,
      canvas.width - (options.borderLeftWidth + options.borderRightWidth),
      canvas.height - (options.borderTopWidth + options.borderBottomWidth)
    );
  } else if (hasBorder) {
    ctx.clearRect(
      options.borderLeftWidth,
      options.borderTopWidth,
      canvas.width - (options.borderLeftWidth + options.borderRightWidth),
      canvas.height - (options.borderTopWidth + options.borderBottomWidth)
    );
  }

  ctx.font = options.font;
  ctx.fillStyle = options.textColor;
  ctx.antialias = "gray";
  ctx.textAlign = options.textAlign;
  ctx.lineWidth = options.strokeWidth;
  ctx.strokeStyle = options.strokeColor;

  let offsetY = options.borderTopWidth + options.paddingTop;
  lineProps.forEach(lineProp => {
    // Calculate Y
    let x = 0;
    let y = max.ascent + offsetY;

    // Calculate X
    switch (options.textAlign) {
      case "start":
      case "left":
        x = lineProp.left + options.borderLeftWidth + options.paddingLeft;
        break;

      case "end":
      case "right":
        x =
          canvas.width -
          lineProp.left -
          options.borderRightWidth -
          options.paddingRight;
        break;

      case "center":
        x = contentWidth / 2 + options.borderLeftWidth + options.paddingLeft;
        break;
    }

    ctx.fillText(lineProp.line, x, y);

    if (options.strokeWidth > 0) {
      ctx.strokeText(lineProp.line, x, y);
    }

    offsetY += lineHeight;
  });

  switch (options.output) {
    case "buffer":
      return canvas.toBuffer();
    case "stream":
      const readable = new stream.Readable()
      readable._read = () => {
        readable.push(canvas.toBuffer());
        readable.push(null);
      }
      return readable;
    case "dataURL":
      return canvas.toDataURL("image/svg");
    case "canvas":
      return canvas;
    default:
      throw new Error(`output type:${options.output} is not supported.`);
  }
};

function parseOptions(options) {
  return {
    font: options.font || "30px sans-serif",
    textAlign: options.textAlign || "left",
    textColor: options.textColor || options.color || "black",
    backgroundColor: options.bgColor || options.backgroundColor || null,
    lineSpacing: options.lineSpacing || 0,

    strokeWidth: options.strokeWidth || 0,
    strokeColor: options.strokeColor || "white",

    paddingLeft: options.paddingLeft || options.padding || 0,
    paddingTop: options.paddingTop || options.padding || 0,
    paddingRight: options.paddingRight || options.padding || 0,
    paddingBottom: options.paddingBottom || options.padding || 0,

    borderLeftWidth: options.borderLeftWidth || options.borderWidth || 0,
    borderTopWidth: options.borderTopWidth || options.borderWidth || 0,
    borderBottomWidth: options.borderBottomWidth || options.borderWidth || 0,
    borderRightWidth: options.borderRightWidth || options.borderWidth || 0,
    borderColor: options.borderColor || "black",

    localFontName: options.localFontName || null,
    localFontPath: options.localFontPath || null,

    wrap: options.wrap || false,
    maxWidth: options.maxWidth || undefined,

    output: options.output || "buffer"
  };
}

module.exports = text2png;
