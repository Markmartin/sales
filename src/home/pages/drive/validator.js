import validator from "beeshell/dist/common/utils/validator";
import {isNil, forEach, map, isObject, isEmpty} from 'lodash'

function required(value) {
    if (isNil(value) || value === '' || (isObject(value) && isEmpty(value))) {
        return {
            valid: false,
            msg: '此项为必填项'
        }
    } else {
        return {
            valid: true
        }
    }
}

function rulePhone(value) {
    console.warn('rulePhone', value)
    if (/^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/.test(value)) {
        return {
            valid: true
        }
    } else {
        return {
            valid: false,
            msg: '请填写正确的手机号码'
        }
    }
}

const requiredForm = ['phone', 'customerName', 'testDriveExpert', 'planDriveTime', 'applyType', 'driveType', 'driveStyle', 'certType', 'imgPath1', 'imgPath2']

const validate = validator.dispatch(
    ...map(requiredForm, function (item) {
        return validator.register(item, (key, value, callback) => {
            callback(required(value))
        })
    }),
    validator.register('phone', (key, value, callback) => {
        callback(rulePhone(value))
    })
)

const itineraryForm = ['audi']
const itineraryValidate = validator.dispatch(
    ...map(itineraryForm, function (item) {
        return validator.register(item, (key, value, callback) => {
            callback(required(value))
        })
    })
)

const detailForm = ['testDriveExpert', 'date', 'time', 'driveType', 'testDriveRouteId', 'audi']
const detailFormValidate = validator.dispatch(
    ...map(detailForm, function (item) {
        return validator.register(item, (key, value, callback) => {
            callback(required(value))
        })
    })
)

//创建试驾订单验证
const requiredAddTestForm = ['customerName', 'contacterPhoneOne', 'driveType', 'driveStyle', 'catalogId', 'date', 'startTime', 'endTime']
const validateAddTest = validator.dispatch(
    ...map(requiredAddTestForm, function (item) {
        return validator.register(item, (key, value, callback) => {
            callback(required(value))
        })
    }),
    validator.register('contacterPhoneOne', (key, value, callback) => {
        callback(rulePhone(value))
    }),
)

//办理试驾验证
const requiredHandleTestForm = ['catalogId', 'endTime', 'startTime', 'date', 'certPicFront','agreementPicPath']
const validateHandleTest = validator.dispatch(
    ...map(requiredHandleTestForm, function (item) {
        return validator.register(item, (key, value, callback) => {
            callback(required(value))
        })
    }),
    validator.register('contacterPhoneOne', (key, value, callback) => {
        callback(rulePhone(value))
    }),
)


export {
    validate,
    requiredForm,
    itineraryForm,
    itineraryValidate,
    detailForm,
    detailFormValidate,
    requiredAddTestForm,
    validateAddTest,
    requiredHandleTestForm,
    validateHandleTest
}
