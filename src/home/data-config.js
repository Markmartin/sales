export const clueType = {
	1: '潜客',
	2: '试驾',
	3: '订单'
}
export const isGet = {
	1: '已领取',
	0: '未领取'
}
export const isOverClueTime = {
	1: '是',
	0: '否'
}
// 选项卡数据
export const tabData = [
	{
		value: 1,
		label: '客户资料'
	},
	{
		value: 2,
		label: '跟进信息'
	},
	{
		value: 3,
		label: '订单管理'
	}
]

// 线索选项卡数据
export const clueTabData = [
	{
		value: 0,
		label: '未领取'
	},
	{
		value: 1,
		label: '已领取'
	}
]

// 客户等级
export const userLevel = [
	{ value: 2, label: 'H' },
	{ value: 3, label: 'A' },
	{ value: 4, label: 'B' },
	{ value: 5, label: 'C' },
	// { value: 6, label: '其他' }
]

// 客户等级Hash
export const userLevelHash = {
	1: 'O级',
	2: 'H级',
	3: 'A级',
	4: 'B级',
	5: 'C级',
	// 6: '其他',
	7: '战败'
}

// 一级来源
export const firstSources = {
	1: '门店线下',
}

export const first = [
	{ value: 1, label: '门店线下' }
]

// 二级来源
export const secondSources = {
	1: '展厅留资',
	2: '区域活动',
	3: '区域外拓',
	4: '区域车展',
}

export const second = [
	{ value: 1, label: '展厅留资' },
	{ value: 2, label: '区域活动' },
	{ value: 3, label: '区域外拓' },
	{ value: 4, label: '区域车展' }
]

// 新意向等级
export const newLevel = [
	{ value: 2, label: 'H' },
	{ value: 3, label: 'A' },
	{ value: 4, label: 'B' },
	{ value: 5, label: 'C' },
	{ value: 6, label: '其他' },
	{ value: 7, label: '战败' }
]

// 新意向级别Hash
export const newLevelHash = {
	1: 'O级',
	2: 'H级',
	3: 'A级',
	4: 'B级',
	5: 'C级',
	// 6: '其他',
	7: '战败'
}

// 战败原因
export const lostReason = [
	{ value: 1, label: '失控' },
	{ value: 2, label: '失联' },
	{ value: 3, label: '其他' }
]
// 战败原因Hash
export const lostReasonHash = {
	1: '失控',
	2: '失联',
	3: '其他'
}

// 跟进事项
export const followItem = [
	{ value: 1, label: '线下-首次来店' },
	{ value: 2, label: '线下-试乘试驾' },
	{ value: 9, label: '线下-门店看车' },
	{ value: 7, label: '线下-上门拜访' },
	{ value: 13, label: '线下-参与市场活动' },
	{ value: 6, label: '线上-电话跟进' },
	{ value: 15, label: '线上-试驾邀约' },
	{ value: 14, label: '线上-日常关怀' },
	{ value: 16, label: '线上-节日问候' },
	{ value: 17, label: '线上-申请战败' },
	{ value: 18, label: '线上-战败再跟进'},
	{ value: 10, label: '线下-门店沟通' },
	{ value: 11, label: '线下-签署合同' },
	{ value: 12, label: '线下-用户成交' }
   ]

export const followItemHash = {
	1:'线下-首次来店',
	2:'线下-试乘试驾',
	9:'线下-门店看车',
	7:'线下-上门拜访',
	13:'线下-参与市场活动',
	6:'线上-电话跟进',
	15:'线上-试驾邀约',
	14:'线上-日常关怀',
	16:'线上-节日问候',
	17:'线上-申请战败',
	18:'线上-战败再跟进',
	10:'线下-门店沟通',
	11:'线下-签署合同',
	12:'线下-用户成交',
}

export const historyFollowItemHash = {
	1:'线下-首次来店',
	2:'线下-试乘试驾',
	3:'定金订单',
	4:'开票',
	5:'交车',
	6:'线上-电话跟进',
	7:'线下-上门拜访',
	8:'战败回访',
	9:'线下-门店看车',
	10:'线下-门店沟通',
	11:'线下-签署合同',
	12:'线下-用户成交',
	13:'线下-参与市场活动',
	14:'线上-日常关怀',
	15:'线上-试驾邀约',
	16:'线上-节日问候',
	17:'线上-申请战败',
	18:'线上-战败再跟进'
}

// 跟进方式
export const followStyle = [
	{ value: 1, label: '电话' },
	{ value: 2, label: '展厅' },
	{ value: 3, label: '短信' },
	{ value: 4, label: '市场活动' }
]
export const followStyleHash = {
	1: '电话',
	2: '展厅',
	3: '短信',
	4: '市场活动'
}

// 购买性质
export const buyNature = [
	{ value: 1, label: '首购' },
	{ value: 2, label: '增购' },
	{ value: 3, label: '换购' }
]
export const buyNatureHash = {
	1: '首购',
	2: '增购',
	3: '换购'
}
// 竞品信息
export const competitorInfo = [
	{ value: 1, label: '蔚来' },
	{ value: 2, label: '小鹏' },
	{ value: 3, label: '北汽' }
]
export const competitorInfoHash = {
	1: '蔚来',
	2: '小鹏',
	3: '北汽'
}

// 客户状态
export const custStatus = {
	0: '意向',
	1: '订单',
	2: '战败',
	3: '基盘',
	4: '线索'
}
// 客户状态
export const orderStatus = {
	'': '',
	0: '',
	1: '待付款',
	2: '小订付款完成',
	3: '大订已付款',
	4: '订单已评价',
	5: '已超时',
	6: '小订已取消',
	7: '小订申请退款',
	8: '小订退款成功',
	9: '小订退款失败',
	10: '同意取消',
	11: '驳回取消'
}
// 客户状态
export const buyTypeHash = {
	'': '',
	1: '购车',
	2: '体验车',
	3: '畅想车'
}

// 线索来源
export const cluesTypes = {
	'1': 'app',
	'2': '小程序',
	'3': '媒体投放',
	'4': '新电商 京东',
	'5': '新电商 汽车之家',
	'6': '新电商 天猫',
	'7': '官网',
	'8': '微博',
	'9': '微信',
	'10': 'A级车展',
	'11': '区域车展',
	'12': '其他展会',
	'13': '全国主题巡展',
	'14': '用户集中试驾',
	'15': '超级伙伴日 新品发布',
	'16': '新店开业仪式',
	'17': '区域活动',
	'18': 'CCC',
	'19': '总部线上',
	'20': '总部线下',
	'21': '经销商'
}

export const defaultList = {
	"dictValue": "没有可选项",
	"dictKey": "-999",
}