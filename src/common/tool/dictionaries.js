 // 暂存的数据字典
 const level = [
     {
         dictKey: '1',
         dictValue: 'O级'
     },
     {
         dictKey: '2',
         dictValue: 'H级'
     },
     {
         dictKey: '3',
         dictValue: 'A级'
     },
     {
         dictKey: '4',
         dictValue: 'B级'
     },
     {
         dictKey: '5',
         dictValue: 'C级'
     },
     {
         dictKey: '6',
         dictValue: '其他'
     },
     {
         dictKey: '7',
         dictValue: '战败'
     }
 ]

 const sex = [
     {
         dictKey: '1',
         dictValue: '男'
     },
     {
         dictKey: '2',
         dictValue: '女'
     },
     {
         dictKey: '3',
         dictValue: '其他'
     },
 ]

 const orderStatus = [
     {
         dictKey: '1',
         dictValue: '已确认,待付款'
     },
     {
         dictKey: '2',
         dictValue: '小订已付款'
     },
     {
         dictKey: '3',
         dictValue: '大订已付款'
     },
     {
         dictKey: '4',
         dictValue: '订单已评价'
     },
     {
         dictKey: '5',
         dictValue: '已超时'
     },
     {
         dictKey: '6',
         dictValue: '小订已取消'
     },
     {
         dictKey: '7',
         dictValue: '小订申请退款'
     },
     {
         dictKey: '8',
         dictValue: '小订退款成功'
     },
     {
         dictKey: '9',
         dictValue: '小订退款失败'
     },
     {
         dictKey: '10',
         dictValue: '同意取消订单'
     },
     {
         dictKey: '11',
         dictValue: '驳回取消订单'
     }
 ]

// 战败原因
 const lostReason = [
     {
         dictKey: '1',
         dictValue: '失控'
     },
     {
         dictKey: '2',
         dictValue: '失联'
     },
     {
         dictKey: '3',
         dictValue: '其他'
     }
 ]

 // 跟进事项
 const followItem = [
     {
         dictKey: '1',
         dictValue: '首次来店'
     },
     {
         dictKey: '2',
         dictValue: '试乘试驾'
     },
     {
         dictKey: '3',
         dictValue: '定金订单'
     },
     {
         dictKey: '4',
         dictValue: '开票'
     },
     {
         dictKey: '5',
         dictValue: '交车'
     },
     {
         dictKey: '6',
         dictValue: '电话跟进'
     },
     {
         dictKey: '7',
         dictValue: '上门拜访'
     },
     {
         dictKey: '8',
        dictValue: '战败'
    },
 ]

 const customerStatus = [
     {
         dictKey: 4,
         dictValue: '线索'
     },
     {
         dictKey: 1,
         dictValue: '订单'
     },
     {
         dictKey: 0,
         dictValue: '意向'
     },
     {
         dictKey: 3,
         dictValue: '基盘'
     },
     {
         dictKey: 2,
         dictValue: '战败'
     },
 ]


// 跟进方式
 const followStyle = [
     {
         dictKey: '1',
         dictValue: '电话'
     },
     {
         dictKey: '2',
         dictValue: '展厅'
     },
     {
         dictKey: '3',
         dictValue: '短信'
     },
     {
         dictKey: '4',
         dictValue: '市场活动'
     }
 ]

 // 申请类型
 const apply = [
     {
         dictKey: 1,
         dictValue: 'APP申请'
     },
     {
         dictKey: 2,
         dictValue: '展厅申请'
     }
 ]
 // 适用选择框申请类型
 const applySelect = [
     {
         value: '1',
         label: 'APP申请'
     },
     {
         value: '2',
         label: '展厅申请'
     }
 ]

 // 试驾类型
 const driveSelect = [
     {label: '本人试驾',value: '1'},
     {label: '家人试驾',value: '2'}
 ]

 // 试驾方式
 const driveStyleSelect = [
     {label: '上门试驾',value: '1'},
     {label: '到店试驾',value: '2'}
 ]

 // 证件类型
 const certType = [
     {label: '身份证',value: '1'},
     {label: '驾驶证',value: '2'}
 ]

 // 订车类型
 const bookingType = [
     {
         dictKey: '1',
         dictValue: '个人'
     },
     {
         dictKey: '2',
         dictValue: '企业'
     }
 ]

 // 消息类型
 const messageType = [
     {
         /** 类型code */
         dictKey: '1',
         /** 类型name */
         dictValue: '线索分配',
         /** 操作角色 - 系统自动 */
         pushRoleCode: '',
         /** 接收角色 - 销售经理 */
         getRoleCode: 'rolePartnerSaleManager',
         /** 路由 - 线索大厅 */
         routerName: 'Clues'
     },
     {
         /** 类型code */
         dictKey: '1',
         /** 类型name */
         dictValue: '线索分配',
         /** 操作角色 - 销售经理 */
         pushRoleCode: 'rolePartnerSaleManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'Customers'
     },
     {
         /** 类型code */
         dictKey: '2',
         /** 类型name */
         dictValue: '申请试驾',
         /** 操作角色 - 试驾接口 */
         pushRoleCode: '',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 试驾协议页 */
         routerName: 'AddAgreement'
     },
     {
         /** 类型code */
         dictKey: '3',
         /** 类型name */
         dictValue: '订单创建',
         /** 操作角色 - 订单接口(第三方App) */
         pushRoleCode: '',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 订单资料页 */
         routerName: 'OrderInquireDetails'
     },
     {
         /** 类型code */
         dictKey: '4',
         /** 类型name */
         dictValue: '战败申请',
         /** 操作角色 - 销售顾问 */
         pushRoleCode: 'rolePartnerSale',
         /** 接收角色 - 销售经理 */
         getRoleCode: 'rolePartnerSaleManager',
         /** 路由 - 战败客户审批页 */
         routerName: 'LostDetail'
     },
     {
         /** 类型code */
         dictKey: '5',
         /** 类型name */
         dictValue: '交车',
         /** 操作角色 - 销售顾问 */
         pushRoleCode: 'rolePartnerSale',
         /** 接收角色 - 交付小驰 */
         getRoleCode: 'rolePartnerHandleVehicle',
         /** 路由 - 办理交车 */
         routerName: 'Handle'
     },
     {
         /** 类型code */
         dictKey: '21',
         /** 类型name */
         dictValue: '试驾',
         /** 操作角色 - 销售顾问 */
         pushRoleCode: 'rolePartnerSale',
         /** 接收角色 - 试驾专员 */
         getRoleCode: 'rolePartnerTestDrive',
         /** 路由 - 试驾详情 */
         routerName: 'DriveDetails'
     },
     {
         /** 类型code */
         dictKey: '22',
         /** 类型name */
         dictValue: '试驾成功',
         /** 操作角色 - 试驾专员 */
         pushRoleCode: 'rolePartnerTestDrive',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 试驾详情 */
         routerName: 'DriveDetails'
     },
     {
        /** 类型code */
        dictKey: '22',
        /** 类型name */
        dictValue: '试驾成功',
        /** 操作角色 - 销售顾问 */
        pushRoleCode: 'rolePartnerSale',
        /** 接收角色 - 销售顾问 */
        getRoleCode: 'rolePartnerSale',
        /** 路由 - 试驾详情 */
        routerName: 'DriveDetails'
    },
     {
         /** 类型code */
         dictKey: '23',
         /** 类型name */
         dictValue: '试驾评价',
         /** 操作角色 - 试驾评价接口(第三方App) */
         pushRoleCode: '',
         /** 接收角色 - 试驾专员 */
         getRoleCode: 'rolePartnerTestDrive',
         /** 路由 - 试驾详情(包含评价内容) */
         routerName: 'DriveDetails'
     },
     {
        /** 类型code */
        dictKey: '23',
        /** 类型name */
        dictValue: '试驾评价',
        /** 操作角色 - 试驾评价接口(第三方App) */
        pushRoleCode: '',
        /** 接收角色 - 试驾专员 */
        getRoleCode: 'rolePartnerSale',
        /** 路由 - 试驾详情(包含评价内容) */
        routerName: 'DriveDetails'
    },
     {
         /** 类型code */
         dictKey: '31',
         /** 类型name */
         dictValue: '订单取消（退订）',
         /** 操作角色 - 订单接口(第三方App) */
         pushRoleCode: '',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 订单资料页 */
         routerName: 'OrderInquireDetails'
     },
     {
         /** 类型code */
         dictKey: '31',
         /** 类型name */
         dictValue: '订单取消（退订）',
         /** 操作角色 - 销售顾问 */
         pushRoleCode: 'rolePartnerSale',
         /** 接收角色 - 销售经理 */
         getRoleCode: 'rolePartnerSaleManager',
         /** 路由 - 订单资料页 */
         routerName: 'OrderInquireDetails'
     },
     {
         /** 类型code */
         dictKey: '31',
         /** 类型name */
         dictValue: '订单取消（退订）',
         /** 操作角色 - 销售经理 */
         pushRoleCode: 'rolePartnerSaleManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 订单资料页 */
         routerName: 'OrderInquireDetails'
     },
     {
         /** 类型code */
         dictKey: '31',
         /** 类型name */
         dictValue: '订单取消（退订）',
         /** 操作角色 - 总经理 */
         pushRoleCode: 'rolePartnerManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 订单资料页 */
         routerName: 'OrderInquireDetails'
     },
     {
         /** 类型code */
         dictKey: '31',
         /** 类型name */
         dictValue: '订单取消（退订）',
         /** 操作角色 - 财务审核后 (第三方App) */
         pushRoleCode: '',
         /** 接收角色 - 交付小驰 */
         getRoleCode: 'rolePartnerHandleVehicle',
         /** 路由 - 交车资料页 */
         routerName: 'Detail'
     },
     {
         /** 类型code */
         dictKey: '32',
         /** 类型name */
         dictValue: '撤销订单取消（退订）',
         /** 操作角色 - 订单接口(第三方App) */
         pushRoleCode: '',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 订单资料页 */
         routerName: 'OrderInquireDetails'
     },
     {
         /** 类型code */
         dictKey: '41',
         /** 类型name */
         dictValue: '战败审批',
         /** 操作角色 - 销售经理 */
         pushRoleCode: 'rolePartnerSaleManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'LostDetail'
     },
     {
         /** 类型code */
         dictKey: '41',
         /** 类型name */
         dictValue: '战败审批',
         /** 操作角色 - 总经理 */
         pushRoleCode: 'rolePartnerManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'LostDetail'
     },
     {
         /** 类型code */
         dictKey: '42',
         /** 类型name */
         dictValue: '战败分配',
         /** 操作角色 - 销售经理 */
         pushRoleCode: 'rolePartnerSaleManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'LostDetail'
     },
     {
         /** 类型code */
         dictKey: '42',
         /** 类型name */
         dictValue: '战败分配',
         /** 操作角色 - 总经理 */
         pushRoleCode: 'rolePartnerManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'Customers'
     },
     {
         /** 类型code */
         dictKey: '42',
         /** 类型name */
         dictValue: '战败分配',
         /** 操作角色 - 总经理 */
         pushRoleCode: 'rolePartnerSaleManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'Customers'
     },
     {
         /** 类型code */
         dictKey: '43',
         /** 类型name */
         dictValue: '同意战败',
         /** 操作角色 - 总经理 */
         pushRoleCode: 'rolePartnerManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'LostDetail'
     },
     {
         /** 类型code */
         dictKey: '44',
         /** 类型name */
         dictValue: '驳回战败',
         /** 操作角色 - 总经理 */
         pushRoleCode: 'rolePartnerManager',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 客户资料 */
         routerName: 'LostDetail'
     },
     {
         /** 类型code */
         dictKey: '51',
         /** 类型name */
         dictValue: '交车成功',
         /** 操作角色 - 交付小驰 */
         pushRoleCode: 'rolePartnerHandleVehicle',
         /** 接收角色 - 销售顾问 */
         getRoleCode: 'rolePartnerSale',
         /** 路由 - 订单信息页 */
         routerName: 'OrderInquireDetails'
     },
     {
         /** 类型code */
         dictKey: '52',
         /** 类型name */
         dictValue: '交车评价',
         /** 操作角色 - 交车评价接口(第三方App) */
         pushRoleCode: '',
         /** 接收角色 - 交付小驰 */
         getRoleCode: 'rolePartnerHandleVehicle',
         /** 路由 - 历史交车信息 */
         routerName: 'Detail'
     }
 ]

 // 退订申请状态
 const cancelOrderType = [
    {
        dictKey: '1',
        dictValue: '待审核'
    },
    {
        dictKey: '2',
        dictValue: '审核通过'
    },
    {
        dictKey: '3',
        dictValue: '审核驳回'
    }
 ]

 export {
     level,
     orderStatus,
     sex,
     lostReason,   // 战败原因
     followItem,   // 跟进事项
     followStyle,  // 跟进方式
     customerStatus,
     apply,
     messageType,
     applySelect,
     driveSelect,
     driveStyleSelect,
     certType,
     bookingType,
     cancelOrderType
 }
