import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import AccessoryProtocolView from './accessoryProtocolView'
import OperationView from './orderDetailOperate'
import LineView from './lineView'
import { cancelOrderType, orderStatus } from '../../../common/tool/dictionaries'
import { TopviewGetInstance, Tip, Actionsheet, Button } from 'beeshell'
import RejectCancelOrderApplyView from './rejectApply'
import { Loading } from '../../../common/components/loading'
import { DisplayPDFView, createOrderContractPDF } from '../../../common/components/pdf/pdfManager'
import { size } from '../../../style/variables'
import HandleInfo from './components/handle-info'
import { RowLineView, BottomSpaceView, ColumnContentView } from './style'
import { buyTypeHash } from '../../data-config'
import { replace } from 'lodash'
import { inject } from 'mobx-react'
@inject(['dictStore']) // 注入对应的store
export default class OrderDetail extends Component {
  constructor(props) {
    super(props)
    const { navigation } = this.props
    const orderNo = navigation.getParam('orderNo')
    this.state = {
      orderNo: orderNo,
      orderStatus: '',
      responseDic: {},
      isShowCancelOrderInfo: false
    }
    this.dictStore = this.props.dictStore
    // 绑定
    this.getOrderDetail = this.getOrderDetail.bind(this)
    this.getIsExistChargingPoint = this.getIsExistChargingPoint.bind(this)
    this.dicStringForKey = this.dicStringForKey.bind(this)
    this.showOrderContract = this.showOrderContract.bind(this)
    this.rejectCancelOrderApply = this.rejectCancelOrderApply.bind(this)
    this.agreeCancelOrderApply = this.agreeCancelOrderApply.bind(this)
    this.rejectViewClickEvent = this.rejectViewClickEvent.bind(this)
    this.dealTimeFormat = this.dealTimeFormat.bind(this)
    this.closeContractPDF = this.closeContractPDF.bind(this)
    this.submitRejectCancelOrderApply = this.submitRejectCancelOrderApply.bind(this)
    this.filterOrderCustomerDetailVOIsNull = this.filterOrderCustomerDetailVOIsNull.bind(this)
  }

  // 组件加载完成
  componentDidMount() {
    // 调接口
    this.getOrderDetail()
  }

  // 获取数据
  getOrderDetail() {
    if (!this.state.orderNo) return
    Loading.show()
    axios
      .get('/admin/orderCustomer/loadByApp?orderNo=' + this.state.orderNo)
      .then((res) => {
        Loading.hidden()
        if (!res || !res.code || !res.data) return
        // 处理数据
        if (res.code === 200 && res.data.orderStatus) {
          let orderStatus = res.data.orderStatus
          let isShow = orderStatus == 7 || orderStatus == 8 || orderStatus == 9
          this.setState({
            responseDic: res.data,
            isShowCancelOrderInfo: isShow,
            handleUser: { label: res.data.handleStaffName }
          })
        }
      })
      .catch((error) => {
        Loading.hidden()
      })
  }

  // 处理时间字符 - 精确到分钟，无需秒
  dealTimeFormat(time) {
    if (!time) return ''
    return moment(time).format('YYYY-MM-DD HH:mm')
  }

  // 将key转换成对应的字符串
  dicStringForKey(key, type) {
    if (!key) return ''
    let obj = null
    let tempArr = []
    if (type == 'orderStatus') {
      tempArr = orderStatus
    } else if (type == 'cancelOrderType') {
      tempArr = cancelOrderType
    }
    if (tempArr.length == 0) return ''
    tempArr.filter((item) => {
      if (item.dictKey == key) obj = item
    })
    if (!obj) return ''
    return obj.dictValue
  }

  // 获取定金金额 - 更加订单状态来取（大定取大定金额，小定取小定今晚）
  getIsExistChargingPoint(code) {
    if (code == 0) {
      return '否'
    } else if (code == 1) {
      return '是'
    } else {
      return ''
    }
  }

  // 对客户详情的字典做非null判断
  filterOrderCustomerDetailVOIsNull(type) {
    if (!this.state.responseDic || !this.state.responseDic.orderCustomerDetailVO) {
      return ''
    } else {
      let content = ''
      switch (type) {
        case 0: {
          // 车系车型
          content = this.state.responseDic.orderCustomerDetailVO.vehicleName
          break
        }
        case 1: {
          // 外观颜色
          content = this.state.responseDic.orderCustomerDetailVO.colorNameOut
          break
        }
        case 2: {
          // 内饰颜色
          content = this.state.responseDic.orderCustomerDetailVO.colorNameIn
          break
        }
        case 3: {
          // 选装包
          if (!this.state.responseDic.orderCustomerDetailVO.customPackName) return ''
          content = replace(this.state.responseDic.orderCustomerDetailVO.customPackName, '["', '')
          content = replace(content, '"]', '')
          break
        }
        default:
          break
      }
      return content
    }
  }

  // 生成合同
  showOrderContract() {
    Loading.show()
    createOrderContractPDF(this.state.responseDic)
      .then((pdfPath) => {
        Loading.hidden()
        // 显示生成的PDF
        TopviewGetInstance()
          .add(<DisplayPDFView pdfPath={pdfPath} title="生成合同" closeCallBack={this.closeContractPDF} />)
          .then((id) => {
            this.setState({
              contractID: id
            })
          })
      })
      .catch((err) => {
        Loading.hidden()
        Tip.show(err, 1000, 'center')
      })
  }

  // 关闭PDF
  closeContractPDF() {
    // 移除驳回界面
    TopviewGetInstance().remove(this.state.contractID)
  }

  // 驳回申请
  rejectCancelOrderApply() {
    // 显示驳回申请的界面
    TopviewGetInstance()
      .add(<RejectCancelOrderApplyView btnClickEvent={this.rejectViewClickEvent} />)
      .then((id) => {
        this.setState({
          rejectApplyID: id
        })
      })
  }

  // 同意申请 cancelAudit 退订审核状态 1待审核 2审核通过 3审核驳回
  agreeCancelOrderApply() {
    let param = { orderCustomerId: this.state.responseDic.orderCustomerId }
    Loading.show()
    axios
      .post('/admin/orderCustomer/autoNext', param)
      .then((response) => {
        Loading.hidden()
        if (response.code === 200) {
          Tip.show('提交同意成功!', 1000, 'center')
        }
      })
      .catch((error) => {
        Loading.hidden()
        Tip.show('提交同意失败!', 1000, 'center')
      })
  }

  // 驳回界面点击的取消/确定事件
  rejectViewClickEvent(isSure, reason) {
    if (isSure) {
      this.submitRejectCancelOrderApply(reason)
    }
    // 移除驳回界面
    TopviewGetInstance().remove(this.state.rejectApplyID)
  }

  // 提交驳回申请 cancelAudit 退订审核状态 1待审核 2审核通过 3审核驳回
  submitRejectCancelOrderApply(reason) {
    let param = { cancelAudit: '2', orderCustomerNo: this.state.orderNo, rejectReason: reason }
    Loading.show()
    axios
      .post('/admin/satOrderCustomer/cancelAudit', {
        params: param
      })
      .then((response) => {
        Loading.hidden()
        if (response.code === 200) {
          Tip.show('提交驳回成功!', 1000, 'center')
        }
      })
      .catch((error) => {
        Loading.hidden()
        Tip.show('提交驳回失败!', 1000, 'center')
      })
  }

  // 初始化界面
  render() {
    const { hashData } = this.dictStore
    const { retailOrderStatus } = hashData
    const { responseDic } = this.state
    const buyTypeName = responseDic.buyType ? buyTypeHash[responseDic.buyType] : ''
    return (
      <ColumnContentView style={styles.contentStyle}>
        <ScrollView style={styles.scrollStyle}>
          <View style={{ backgroundColor: '#fff' }}>
            <LineView title="订单编号：" content={responseDic.orderCustomerNo} style={{ marginTop: 24 }} />
            <LineView
              title="订单状态："
              content={responseDic.orderStatus ? retailOrderStatus[responseDic.orderStatus].dictValue : ''}
            />
            <LineView title="购车方案：" content={buyTypeName} />
            <LineView title="小订金额：" content={responseDic.smallAmount ? `${responseDic.smallAmount} 元` : ''} />
            <LineView title="大订金额：" content={responseDic.bigAmount ? `${responseDic.bigAmount} 元` : ''} />
            <LineView title="发票编号：" content={responseDic.invoiceCode ? `${responseDic.invoiceCode}` : ''} />
            <LineView title="开票金额：" content={responseDic.invoiceMoney ? `${responseDic.invoiceMoney} 元` : ''} />
            <LineView title="购车金额：" content={responseDic.buyAmount ? `${responseDic.buyAmount} 元` : ''} />
            <LineView title="是否加速包：" content={responseDic.acceleratePackageFlag === 1 ? '是' : ''} />
            <LineView title="加速包金额：" content={responseDic.accAmount ? `${responseDic.accAmount} 元` : ''} />
            <LineView
              title="膨胀金："
              content={responseDic.expandingAmount ? `${responseDic.expandingAmount} 元` : ''}
            />
            <LineView title="超前小订定金：" content={responseDic.plAmount ? `${responseDic.plAmount} 元` : ''} />
            <LineView title="超前大订定金：" content={responseDic.pfAmount ? `${responseDic.pfAmount} 元` : ''} />
            <RowLineView style={styles.rowLineStyle} />
            <LineView title="客户姓名：" content={responseDic.customerName} style={{ marginTop: 20 }} />
            <LineView title="车系车型：" content={this.filterOrderCustomerDetailVOIsNull(0)} />
            <LineView title="VIN码：" content={responseDic.vin} />
            <LineView title="外观颜色：" content={this.filterOrderCustomerDetailVOIsNull(1)} />
            <LineView title="内饰颜色：" content={this.filterOrderCustomerDetailVOIsNull(2)} />
            <LineView
              title="是否安装充电桩："
              content={this.getIsExistChargingPoint(this.state.responseDic.isChargingPoint)}
            />
            <LineView title="选装包：" content={this.filterOrderCustomerDetailVOIsNull(3)} />
          </View>
          <AccessoryProtocolView
            title="附件协议："
            orderNo={this.state.orderNo}
            order={responseDic}
            navigation={this.props.navigation}
          />
          {responseDic.orderStatus == 3 ? <HandleInfo order={responseDic} /> : null}
          {this.state.isShowCancelOrderInfo ? (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <RowLineView style={styles.rowLineStyle} />
              <LineView title="申请时间：" content={this.dealTimeFormat(this.state.responseDic.cancelDate)} />
              <LineView
                title="退订申请状态："
                content={this.dicStringForKey(this.state.responseDic.cancelAudit, 'cancelOrderType')}
              />
              <LineView title="退订原因：" content={this.state.responseDic.cancelReason} />
              <LineView title="驳回原因：" content={this.state.responseDic.rejectReason} />
            </View>
          ) : null}
          <BottomSpaceView />
        </ScrollView>
        <OperationView
          style={{ height: 48 }}
          orderStatus={this.state.responseDic.orderStatus}
          printContractEvent={this.showOrderContract}
          rejectEvent={this.rejectCancelOrderApply}
          agreeEvent={this.agreeCancelOrderApply}
          cancelFlowStatus={this.state.responseDic.cancelFlowStatus}
        />
      </ColumnContentView>
    )
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    backgroundColor: '#f0f3f5'
  },
  scrollStyle: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    width: '100%'
  },
  rowLineStyle: {
    marginTop: 20,
    width: '93%',
    alignSelf: 'center'
  },
  lineTitleStyle: {
    fontSize: size.fontSizeBase,
    color: '#323233',
    width: 115,
    marginLeft: 16,
    marginTop: 10
  }
})
