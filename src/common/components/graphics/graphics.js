import React from 'react';
import Marker from "react-native-image-marker"
import {Platform} from "react-native"
import userStore from '../../../store/user'
import {certType} from "../../tool/dictionaries";


// 合同的size: 793 × 1122  1587 x 2245
// const order_Contract_F = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/0_1.png';
// const order_Contract_S = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/0_2.png';
// const order_Contract_T = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/0_3.png';
// const order_Contract_E = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/0_4.png';

const order_Contract_F = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/high_0_1.png';
const order_Contract_S = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/high_0_2.png';
const order_Contract_T = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/high_0_3.png';
const order_Contract_E = 'https://pms-image.oss-cn-shenzhen.aliyuncs.com/uploadFiles/sales/high_0_4.png';


/***
 * 根据数据源，水印订单合同
 * @param responseDic
 * @returns {Promise<any> | Promise<*>}
 * @private
 */
const _createWaterImages = function (responseDic) {
    return new Promise(async function (resolve) {
        let orderPathArr = [];
        // 合同仅开头和结束需要水印
        let FirstTextsOption = _getOrderContractFirstOptions(responseDic);
        let waterF = await _createMultipleWatersImages(order_Contract_F, FirstTextsOption);
        let waterS = await _createMultipleWatersImages(order_Contract_S, []);
        let waterT = await _createMultipleWatersImages(order_Contract_T, []);
        let LastTextsOption = _getOrderContractLastOptions(responseDic);
        let waterE = await _createMultipleWatersImages(order_Contract_E, LastTextsOption);
        // 替换开头和结尾的合同
        orderPathArr.push(waterF);
        orderPathArr.push(waterS);
        orderPathArr.push(waterT);
        orderPathArr.push(waterE);

        // orderPathArr.push(order_Contract_F);
        // orderPathArr.push(order_Contract_S);
        // orderPathArr.push(order_Contract_T);
        // orderPathArr.push(order_Contract_E);
        // 返回结果
        resolve(orderPathArr);
    })
}

/***
 * 水印订单合同的第一张
 * @param responseDic
 * @returns {Array}
 * @private
 */
const _getOrderContractFirstOptions = function (responseDic) {
    let textOption = [];
    if (!responseDic) return textOption;
    // 甲方
    let company_option = getOption(responseDic.companyName, 245, 242);
    textOption.push(company_option);
    // 合同编号
    let no_option = getOption(responseDic.contractNo, 1061, 156);
    textOption.push(no_option);
    // 销售顾问
    let sale_option = getOption(userStore.realName, 928, 242);
    textOption.push(sale_option);
    // 乙方姓名
    let customerName_option = getOption(responseDic.customerName, 480, 327);
    textOption.push(customerName_option);
    // 乙方电话
    let customerPhone_option = getOption(responseDic.customerMobile, 853, 370);
    textOption.push(customerPhone_option);
    // 证件类型
    let cerType_option = getOption(dicStringForKey(responseDic.certType), 203, 370);
    textOption.push(cerType_option);
    // 证件号码
    let cerNo_option = getOption(responseDic.certNo, 459, 370);
    textOption.push(cerNo_option);
    // 地址
    let customerAddress_option = getOption(responseDic.customerAddress, 160, 412);
    textOption.push(customerAddress_option);

    if (responseDic.orderCustomerDetailVO) {
        // 车型
        let carModel_option = getOption(responseDic.orderCustomerDetailVO.vehicleName, 113, 556);
        textOption.push(carModel_option);
        // 配置

        // 车身颜色
        let carBodyColor_option = getOption(responseDic.orderCustomerDetailVO.colorNameOut, 757, 556);
        textOption.push(carBodyColor_option);
    }

    // 定金金额
    let frontMoney_option = getOption(responseDic.frontMoney, 499, 599);
    textOption.push(frontMoney_option);
    // 定金金额 大写
    let chineseFrontMoney = toChineseMoney(responseDic.frontMoney);
    let chineseFrontMoney_option = getOption(chineseFrontMoney, 685, 599);
    textOption.push(chineseFrontMoney_option);
    // 购车余款
    if (responseDic.finalAmount && responseDic.frontMoney) {
        let finalAmount = parseFloat(responseDic.finalAmount);
        let frontMoney = parseFloat(responseDic.frontMoney);
        if (finalAmount > 0 && frontMoney > 0 && finalAmount >= frontMoney) {
            // 购车余款
            let leftMoney = finalAmount - frontMoney;
            let leftMoney_option = getOption((leftMoney).toString(), 995, 599);
            textOption.push(leftMoney_option);

            // 购车余款大写
            let chineseLeftMoney = toChineseMoney(leftMoney);
            let chineseLeftMoney_option = getOption(chineseLeftMoney, 1222, 599);
            textOption.push(chineseLeftMoney_option);
        }
    }
    // 乙方向甲方支付定金
    let payFrontMoney_option = getOption(responseDic.frontMoney, 350, 1377);
    textOption.push(payFrontMoney_option);
    // 乙方向甲方支付定金 大写
    let chinesePayFrontMoney = toChineseMoney(responseDic.frontMoney);
    let chinesePayFrontMoney_option = getOption(chinesePayFrontMoney, 596, 1377);
    textOption.push(chinesePayFrontMoney_option);
    return textOption;
}

/***
 * 水印合同的最后一张
 * @param responseDic
 * @returns {Array}
 * @private
 */
const _getOrderContractLastOptions = function (responseDic) {
    let textOption = [];
    if (!responseDic) return textOption;
    // 合同编号
    let no_option = getOption(responseDic.contractNo, 208, 282);
    textOption.push(no_option);
    // 乙方姓名
    let customerName_option = getOption(responseDic.customerName, 303, 337);
    textOption.push(customerName_option);
    // 身份证号
    if (responseDic.certType == 1) {
        // 证件号码
        let cerNo_option = getOption(responseDic.certNo, 590, 337);
        textOption.push(cerNo_option);
    }
    // 公司
    let company_option = getOption(responseDic.companyName, 855, 337);
    textOption.push(company_option);
    // 车型
    if (responseDic.orderCustomerDetailVO) {
        let carModel_option = getOption(responseDic.orderCustomerDetailVO.vehicleName, 1330, 337);
        textOption.push(carModel_option);
    }
    // vin
    let vin_option = getOption(responseDic.vin, 316, 376);
    textOption.push(vin_option);
    // 乙方姓名
    let customerName_option_1 = getOption(responseDic.customerName, 907, 376);
    textOption.push(customerName_option_1);
    // 乙方姓名
    let customerName_option_2 = getOption(responseDic.customerName, 545, 414);
    textOption.push(customerName_option_2);
    // 乙方姓名
    let customerName_option_3 = getOption(responseDic.customerName, 170, 452);
    textOption.push(customerName_option_3);
    // 乙方姓名
    let customerName_option_4 = getOption(responseDic.customerName, 255, 531);
    textOption.push(customerName_option_4);
    // 乙方姓名
    let customerName_option_5 = getOption(responseDic.customerName, 317, 1575);
    textOption.push(customerName_option_5);
    // 乙方姓名
    let customerName_option_6 = getOption(responseDic.customerName, 388, 1737);
    textOption.push(customerName_option_6);
    // 乙方姓名
    let customerName_option_7 = getOption(responseDic.customerName, 795, 1778);
    textOption.push(customerName_option_7);

    return textOption;
}

/**
 * 数字价格转中文大写
 * @param n
 * @returns {string}
 */
const toChineseMoney = function (price) {
    if (!price) return '';
    let n = 0;
    if (toString.call(price) == '[object String]') {
        n = parseFloat(price);
    }else if (toString.call(price) == '[object Number]') {
        n = price;
    }else {
        n = 0;
    }
    if (n == 0) return '';
    let fraction = ['角', '分']
    let digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    let unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    let head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    let s = ''
    for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(Math.floor(n * 1000 * 10 * Math.pow(10, i)) % (10 * 1000) / 1000)] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = ''
        for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p
            n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
}

/**
 * 将key转换成对应的字符串
 * @param key
 * @returns {*}
 */
const dicStringForKey = function (key) {
    if (!key) return '';
    let obj = null;
    certType.filter(item => {
        if (item.value == key) obj = item
    })
    if (!obj) return '';
    return obj.label;
}

/**
 * >> 注意 << - 该model字段(key)不可改变
 * 获取水印文字的model
 * @param text 文字
 * @param x    起始点的x坐标
 * @param y    起始点的y坐标
 * @returns {{fontName: string, shadowStyle: {}, color: string, x: number, y: number, fontSize: number, text: string, textBackgroundStyle: {}}}
 */
const getOption = function (text = '', x = 0, y = 0) {
    if (!text || text == 'NaN' || text == 'undefined') text = '';
    return {
        text: text,
        x: x,
        y: y,
        color: '#333333',
        fontName: 'Arial-BoldItalicMT',
        fontSize: 18,
        shadowStyle: {},
        textBackgroundStyle: {}
    }
}

/**
 * @param url
 * @param textsOption
 * @private
 */
const _createMultipleWatersImages = async function (url = '', textsOption = []) {
    return Marker.markMultipleTexts({
        src: url,
        textOptions: textsOption,
        scale: 1,
        quality: 70,
        saveFormat: 'png'
    }).then(path => {
        let urlPath = Platform.OS === 'android' ? 'file://' + path : path;
        return urlPath;
    }).catch(err => {
        console.log(err)
    })
}

/**
 * @param uri
 * @param waterText
 * @param location_x
 * @param location_y
 * @returns {Promise<Promise|Promise<*>|*|Promise<T | never>>}
 * @private
 */
const _createWaterImage = async function (uri, waterText = '', location_x = 0, location_y = 0) {
    return Marker.markText({
        src: uri,
        text: waterText,
        X: location_x,
        Y: location_y,
        color: '#333333',
        fontName: 'Arial-BoldItalicMT',
        fontSize: 10,
        scale: 1,
        quality: 100,
        saveFormat: 'png'
    }).then(path => {
        let urlPath = Platform.OS === 'android' ? 'file://' + path : path;
        return urlPath;
    }).catch(err => {
        console.log(err)
    })
}


export {
    _createWaterImages,
    _createWaterImage
}
