/**
 * 服务用来操作首页右上角通知图标
 * remind 设置图标显示红点
 * clear 清除图标红点
 *
 */

let bell;

const setBell = ref => bell = ref

const remind = () => {
	if (!bell) return
	bell.setNotice(true)
}
const clear = () => {
	if (!bell) return
	bell.setNotice(false)
}

export {remind, setBell, clear}
