// 提供日期选择器的服务，供右上角调用

let calendar

const set = ref => calendar = ref

const open = () => {
	if (!calendar) return
	calendar.open()
}
const close = () => {
	if (!calendar) return
	calendar.close()
}
export {set, open,close}
