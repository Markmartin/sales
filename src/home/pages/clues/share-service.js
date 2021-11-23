/**
 * 服务用来操作线索页面两边的按钮操作
 *
 */

let shareBtn
let cancelBtn
let changeShareCheckbox
let sharePartner
export let shareClues = [] //选择分享线索数据
export let showShareIcon = false

export const setShareBtn = ref => shareBtn = ref
export const setCancelBtn = ref => cancelBtn = ref
export const setChangeCheckBox = ref => changeShareCheckbox = ref
export const setSharePartner = ref => sharePartner = ref
export const setShareClues = ref => shareClues = ref

// 显示取消按钮
export const showCancel = () => {
    if (!cancelBtn) return
    showShareIcon = true
    cancelBtn.change(showShareIcon)
    changeShareCheckbox(true)
}

// 点击取消按钮
export const cancel = () => {
    if (!shareBtn) return
    showShareIcon = false
    shareBtn.wrappedInstance.change(showShareIcon)
    changeShareCheckbox(false)
    shareClues = []
}

// 打开选择渠道商
export const sharePartnerOpen = () => {
    if (sharePartner) sharePartner.wrappedInstance.open()
}

// 弹窗使用的取消按钮
export const modalUseCancel = () => {
    cancel()
    cancelBtn.change(false)
}

// 显示或者隐藏分享按钮
export const showByTab = show => shareBtn.wrappedInstance.showByTab(show)