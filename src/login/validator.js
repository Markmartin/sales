import validator from "beeshell/dist/common/utils/validator";

function ruleName(value, targetValue) {
	if (!value) {
		return {
			valid: false,
			msg: '请输入用户名'
		}
	} else {
		return {
			valid: true
		}
	}
}

function rulePassword(value, targetValue) {
	if (!value) {
		return {
			valid: false,
			msg: '请输入密码'
		}
	} else {
		return {
			valid: true
		}
	}
}

const validate = validator.dispatch(
	validator.register('userName', (key, value, callback) => {
		callback(ruleName(value))
	}),
	validator.register('password', (key, value, callback) => {
		callback(rulePassword(value))
	})
)

export default validate
