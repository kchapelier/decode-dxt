# decode-dxt

Decoder for the DXT texture formats.

## Features

 * Supports Block Compression 1, 2 and 3 (DXT1-5)
 * Works in node and in browsers with Typed Array [support](http://caniuse.com/#feat=typedarrays)

## Example

An example using decode-dxt with [parse-dds](https://www.npmjs.com/package/parse-dds) to decode the first mipmap texture of a DDS file using a DXT format.

```js
var decodeDXT = require('decode-dxt'),
    parseDDS = require('parse-dds');

// parse the dds
var ddsBuffer = new Uint8Array(... DDS file ...),
    ddsData = parseDDS(ddsBuffer);

// get the first mipmap texture
var image = ddsData.images[0],
    imageWidth = image.shape[0],
    imageHeight = image.shape[1],
    imageDataView = new DataView(ddsBuffer.buffer, image.offset, image.length);

// convert the DXT texture to an Uint8Array containing RGBA data
var rgbaData = decodeDXT(imageDataView, imageWidth, imageHeight, ddsData.format);
```

## Public API

### Method

**decode(imageDataView, imageWidth, imageHeight[, format = 'dxt1'])**

Decode a given DXT image to an Uint8Array containing the RGBA data of the image.

 - *imageDataView :* A DataView pointing directly to the data of the DXT image.
 - *imageWidth:* The width of the image.
 - *imageHeight:* The height of the image.
 - *format:* The format of the image (dxt1, dxt2, dxt3, dxt4 or dxt5), default to dxt1.

### Format flags

**decode.dxt1**, **decode.dxt2**, **decode.dxt3**, **decode.dxt4** and **decode.dxt5**

## Changelog

### [1.0.1](https://github.com/kchapelier/decode-dxt/tree/1.0.1) (2017-12-01) :

 * Fix black artifacts in some edge cases for BC2 and BC3.

### [1.0.0](https://github.com/kchapelier/decode-dxt/tree/1.0.0) (2016-08-06) :

 * First publication.

## License

MIT
