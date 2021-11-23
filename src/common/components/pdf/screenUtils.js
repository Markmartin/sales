import {PixelRatio,Dimensions} from 'react-native';


export var screenW = Dimensions.get('window').width;
export var screenH = Dimensions.get('window').height;
let fontScale = PixelRatio.getFontScale();
export var pixelRatio =PixelRatio.get();

export const DEFAULT_DENSITY=2;
const w2 = 750/DEFAULT_DENSITY;
const h2 = 1334/DEFAULT_DENSITY;

export function setSpText(size:Number) {
    let scaleWidth = screenW / w2;
    let scaleHeight = screenH / h2;
    let scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
    return size;
}
/**
 * 屏幕适配,缩放size
 * @param size
 * @returns {Number}
 * @constructor
 */
export function scaleSize(size:Number) {
    let scaleWidth = screenW / w2;
    let scaleHeight = screenH / h2;
    let scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round((size * scale + 0.5));
    return size/DEFAULT_DENSITY;
}