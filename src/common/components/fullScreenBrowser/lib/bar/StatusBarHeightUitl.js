
import {
    Dimensions,
    Platform,
    NativeModules
} from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');
const { StatusBarManager } = NativeModules;


/**
 *  判断是否为iphoneX系列
 */
const isIphoneX = function() {
    if (Platform.OS === 'web') return false;
    return (
        Platform.OS === 'ios' &&
        ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
            (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
    );
}

/**
 *  获取状态栏的高度
 */
const getStatusBarHeight = function () {
    return  Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : StatusBarManager.HEIGHT;
}

/**
 *  获取OS平台
 */
const getPlatForm = function () {
    return Platform.OS;
}


export {
    isIphoneX,
    getPlatForm,
    getStatusBarHeight
}
