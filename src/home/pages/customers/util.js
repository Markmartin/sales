import ChinaRegionsData from "../../../common/components/form/china-regions/data";
import {split} from "lodash";

/**
 * @description 客户资料页面函数集合，抽出函数体，主页面逻辑会明显易懂
 */

// 根据customerNo 获取用户数据进行回显
export function setCustomerInfo(data) {
	// 分拆地址
	let addr1 = []
	if (data.province) {
		addr1.push({id: data.province, label: ChinaRegionsData[86][data.province]})
		if (data.city && ChinaRegionsData[data.province]) {
			addr1.push({id: data.city, label: ChinaRegionsData[data.province][data.city]})
			if (data.region && ChinaRegionsData[data.city]) {
				addr1.push({id: data.region, label: ChinaRegionsData[data.city][data.region]})
			}
		}
	}
	let addr2 = split(data.addr, ' ')[1]
	// 调用地区选择器设置默认数据方法
	//this.ChinaRegions.setDefault(addr1)

	// 组合意向信息
	if (data.satCustomerIntentionVO) {
		const VO = data.satCustomerIntentionVO
		// 如果catalogCode存在
		if (VO.catalogCode) {
			this.vehicle.getNodes(VO.catalogCode)
				.then(({listMap}) => {
					let catalogId = listMap
					let colorIdIn = {value: VO.colorInCode, label: VO.colorInName}
					let colorIdOut = {value: VO.colorOutCode, label: VO.colorOutName}
					const customerDesc = VO.customerDesc
					// 根据客户等级生成购买时间
					let planPayDate
					if (VO.planPayDate) {
						planPayDate = split(VO.planPayDate, ' ')[0]
					} else {
						if (data.level) {
							planPayDate = getPlanDate(data.level)
						}
					}
					// 设置预计购买时间限制
					if (data.level) {
						this.setPlanTime(data.level)
					}

					this.setState({
						user: {
							...data,
							addr1,
							addr2,
							catalogId,
							colorIdIn,
							colorIdOut,
							planPayDate,
							customerDesc
						},
						phoneEditable: false
					})

					// 设置型谱回显
					this.VehicleSpectrum.setDefault(listMap)
					this.ColorIn.setDefault(VO.colorInCode)
					this.ColorOut.setDefault(VO.colorOutCode)
				})
		} else {
			let customerDesc = VO.customerDesc
			let planPayDate
			if (VO.planPayDate) {
				planPayDate = split(VO.planPayDate, ' ')[0]
			} else {
				if (data.level) {
					planPayDate = getPlanDate(data.level)
				}
			}
			// 设置预计购买时间限制
			if (data.level) {
				this.setPlanTime(data.level)
			}
			this.setState({
				user: {
					...data,
					addr1,
					addr2,
					customerDesc,
					planPayDate
				},
				phoneEditable: false
			})
		}
	} else {
		this.setState({
			user: {...data, addr1, addr2},
			phoneEditable: false
		})
	}

	// 客户级别回显
	this.UserLevel.setDefault(data.level)
}

export function getFormData() {
	// 处理数据
	const {user} = this.state
	// 组合保存表单
	let formData = {
		name: user.name,
		sex: user.sex,
		level: user.level,
		phone: user.phone,
		telephone: user.telephone,
		source: user.source,
		customerDesc: user.customerDesc,
		isCanBuy: user.isCanBuy,
		isPlace: user.isPlace,
		isCharge: user.isCharge,
		buyNature: user.buyNature,
		competitorInfo: user.competitorInfo,
		partnerCode: this.store.user.partner.partnerCode,
		salesConsultantNo: this.store.user.staff.accountNo,
		childredState:user.childredState,
		ownCar:user.ownCar,
		userSource1:user.userSource1,
		userSource2:user.userSource2,
		userSource3:user.userSource3,
	}

	// 保存地址
	if (this.state.user.addr1[0]) formData.province = this.state.user.addr1[0].id
	if (this.state.user.addr1[1]) formData.city = this.state.user.addr1[1].id
	if (this.state.user.addr1[2]) formData.region = this.state.user.addr1[2].id

	// 组合地址
	formData.addr = user.addr2 ? this.renderAddr1 + ' ' + user.addr2 : this.renderAddr1

	// 联系人
	if (user.customerLinkVOList) {
		formData.customerLinkVOList = user.customerLinkVOList
	}

	// 分拆型谱
	formData.satCustomerIntentionVO = {
		vehicleName: this.renderCar,
		customerDesc: user.customerDesc,
		planPayDate: moment(user.planPayDate).format('YYYY-MM-DD HH:mm:ss')
	}

	// 颜色
	if (user.colorIdIn && user.colorIdIn.value) {
		formData.satCustomerIntentionVO.colorInCode = user.colorIdIn.value
		formData.satCustomerIntentionVO.colorInName = user.colorIdIn.label
	}
	if (user.colorIdOut && user.colorIdOut.value) {
		formData.satCustomerIntentionVO.colorOutCode = user.colorIdOut.value
		formData.satCustomerIntentionVO.colorOutName = user.colorIdOut.label
	}

	if (user.catalogId[0]) formData.satCustomerIntentionVO.audi = user.catalogId[0].value
	if (user.catalogId[2]) formData.satCustomerIntentionVO.catalogCode = user.catalogId[2].value

	// 如果存在 customerNo
	if (this.customerNo) {
		formData.customerNo = this.customerNo
		formData.customerId = this.state.user.customerId
	}

	// 如果存在线索数据
	if (user.clueId) {
		formData.clueId = user.clueId
		formData.clueType = user.clueType
	}

	if (user.clueNo) {
		formData.clueNo = user.clueNo
	}

	return formData
}

export function getEndDate(l) {
	const level = Number(l)
	switch (level) {
		case 2:
			// H级别 3天
			return moment().add(3, 'days').format('YYYY-MM-DD')
		case 3:
			// A级 7天
			return moment().add(7, 'days').format('YYYY-MM-DD')
		case 4:
			// B级 15天
			return moment().add(15, 'days').format('YYYY-MM-DD')
		case 5:
			// C级 1个月
			return moment().add(1, 'months').format('YYYY-MM-DD')
		case 6:
			// 其他 2个月
			return moment().add(2, 'months').format('YYYY-MM-DD')
		default:
			return undefined
	}
}

// 计划购买时间
export function getPlanDate(l) {
	const level = Number(l)
	switch (level) {
		case 1:
			// o级别 15天
			return moment().add(7, 'days').format('YYYY-MM-DD')
		case 2:
			// H级 30天
			return moment().add(15, 'days').format('YYYY-MM-DD')
		case 3:
			// A级 45天
			return moment().add(30, 'days').format('YYYY-MM-DD')
		case 4:
			// B级 1个月
			return moment().add(45, 'days').format('YYYY-MM-DD')
		case 5:
			// B级 1个月
			return moment().add(60, 'days').format('YYYY-MM-DD')
		default:
			return undefined
	}
}
