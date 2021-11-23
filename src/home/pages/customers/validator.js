import validator from "beeshell/dist/common/utils/validator";
import {isNil, isArray, map, isObject, isEmpty} from 'lodash'

function required(value) {
	if (isNil(value) || value === '' || (isObject(value) && isEmpty(value)) || (isArray(value) && isEmpty(value))) {
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
	if (/1\d{10}/.test(value)) {
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

function ruleAddr(value) {
	if (isArray(value) && value.length >= 2) {
		return {
			valid: true
		}
	} else {
		return {
			valid: false,
			msg: '请选择地区'
		}
	}
}

const requiredForm = ['name', 'sex', 'level', 'source','userSource1','userSource2','userSource3','catalogId']
const validate = validator.dispatch(
	...map(requiredForm, function (item) {
		return validator.register(item, (key, value, callback) => {
			callback(required(value))
		})
	}),
	validator.register('phone', (key, value, callback) => {
		callback(rulePhone(value))
	}),
	validator.register('addr1', (key, value, callback) => {
		callback(ruleAddr(value))
	})
)

// 跟进表单验证
const FollowUpPlan = ['planFollowItem', 'planFollowStyle', 'planFollowTime']
const follow = ['followItem', 'followStyle', 'followReasult']
const followUpFirst = [...follow, ...FollowUpPlan]
const followUp = [...followUpFirst, 'newCustlevel']
const followUpLost = [...follow, 'newCustlevel', 'lostReason']

const followUpValidate = validator.dispatch(
	...map([...followUp, 'lostReason'], function (item) {
		return validator.register(item, (key, value, callback) => {
			callback(required(value))
		})
	})
)

export {validate, requiredForm, followUpFirst, followUp, followUpLost, followUpValidate}
