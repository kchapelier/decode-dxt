/**
 *
 * Block Compression 3 : DXT4 (alpha premultiplied) and DXT5 (not alpha premultiplied)
 *
 */

"use strict";

var utils = require('./utils');

var getAlphaIndex = function getAlphaIndex (alphaIndices, pixelIndex) {
    return utils.extractBitsFromUin16Array(alphaIndices, (3 * (15 - pixelIndex)), 3);
};

module.exports = function decodeBC3 (imageData, width, height, premultiplied) {
    var rgba = new Uint8Array(width * height * 4),
        height_4 = (height / 4) | 0,
        width_4 = (width / 4) | 0,
        offset = 0,
        alphaValues,
        alphaIndices,
        alphaIndex,
        alphaValue,
        multiplier,
        colorValues,
        colorIndices,
        colorIndex,
        pixelIndex,
        rgbaIndex,
        h,
        w,
        x,
        y;

    for (h = 0; h < height_4; h++) {
        for (w = 0; w < width_4; w++) {
            alphaValues = utils.interpolateAlphaValues(imageData.getUint8(offset, true), imageData.getUint8(offset + 1, true), false);
            alphaIndices = [
                imageData.getUint16(offset + 6, true),
                imageData.getUint16(offset + 4, true),
                imageData.getUint16(offset + 2, true)
            ]; // reordered as big endian

            colorValues = utils.interpolateColorValues(imageData.getUint16(offset + 8, true), imageData.getUint16(offset + 10, true));
            colorIndices = imageData.getUint32(offset + 12, true);

            for (y = 0; y < 4; y++) {
                for (x = 0; x < 4; x++) {
                    pixelIndex = (3 - x) + (y * 4);
                    rgbaIndex = (h * 4 + 3 - y) * width * 4 + (w * 4 + x) * 4;
                    colorIndex = (colorIndices >> (2 * (15 - pixelIndex))) & 0x03;
                    alphaIndex = getAlphaIndex(alphaIndices, pixelIndex);
                    alphaValue = alphaValues[alphaIndex];

                    multiplier = premultiplied ? 255 / alphaValue : 1;

                    rgba[rgbaIndex] = utils.multiply(colorValues[colorIndex * 4], multiplier);
                    rgba[rgbaIndex + 1] = utils.multiply(colorValues[colorIndex * 4 + 1], multiplier);
                    rgba[rgbaIndex + 2] = utils.multiply(colorValues[colorIndex * 4 + 2], multiplier);
                    rgba[rgbaIndex + 3] = alphaValue
                }
            }

            offset += 16;
        }
    }

    return rgba;
};
