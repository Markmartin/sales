import React, { Component } from 'react'
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { Divider, Image, CheckBox } from 'react-native-elements'
import { Button, Datepicker, Longlist, Radio, SlideModal, Tag, TopviewGetInstance, Tip } from 'beeshell'
import { colors, size } from '../style/variables'
import { customerStatus, level } from '../common/tool/dictionaries'
import moment from 'moment'
import Sex from '../common/components/sex'
import { Loading } from '../common/components/loading'
import { withNavigationFocus } from 'react-navigation'
import AddCustomerButton from '../common/components/add-customer-button'
import { join, map, reject } from 'lodash'
import Icon from 'react-native-vector-icons/dist/Feather'
import { VehicleSpectrum } from '../common/components/form'
import ListPicker from '../home/pages/lost/listPicker'
import { inject, observer } from 'mobx-react'

const window = Dimensions.get('window')
const screenHeight = Platform.OS === 'ios' ? window.height : window.height - StatusBar.currentHeight
const screenWidth = window.width
// ID1003710 暂时屏蔽战败
const customerLevel = reject(level, ['dictValue', '战败'])
const followStatusDict = [
  {
    dictKey: 0,
    dictValue: '待跟进'
  },
  {
    dictKey: 1,
    dictValue: '已跟进'
  }
]

const isApplyDriveDict = [
  {
    dictKey: 1,
    dictValue: '是'
  },
  {
    dictKey: 0,
    dictValue: '否'
  }
]

@inject(['userStore']) // 注入对应的store
@observer
class Customer extends Component {
  static navigationOptions = ({ navigation }) => {
    const {
      params = { inSelection: false, allChecked: false, tapShare: () => {}, chooseAll: () => {} }
    } = navigation.state
    return {
      headerRight: (
        <AddCustomerButton
          inSelection={params.inSelection}
          allChecked={params.allChecked}
          tapShare={params.tapShare}
          chooseAll={params.chooseAll}
        />
      ),
      headerLeft: <View />
    }
  }

  constructor(props) {
    super(props)
    this.date = moment().format('YYYY-MM-DD')
    this.salerList = []
    this.store = this.props.userStore //通过props来导入访问已注入的store
    this.state = {
      up: false,
      pageNum: 1,
      list: [],
      total: 0,
      carModels: [],
      modelValue: -1,
      levelValue: -1,
      statusValue: -1,
      createStartDate: null,
      createEndDate: null,
      followStartDate: null,
      followEndDate: null,
      vechileList: [],
      catalogId: [],
      saler: null,
      distributeSaler: null,
      followStatusValue: -1,
      isApplyDrive: -1,
      salerListId: null,
      didBlurSubscription: null
    }
    // 标记状态
    this.reload = false
  }

  chooseAll() {
    const { navigation } = this.props
    const allChecked = navigation.getParam('allChecked')
    let list = this.state.list.map((item) => ({ ...item, checked: !allChecked }))
    this.setState({ list })
    this.props.navigation.setParams({ allChecked: !allChecked })
  }

  tapShare() {
    const { navigation } = this.props
    const { list } = this.state
    const inSelection = navigation.getParam('inSelection')

    if (inSelection) {
      let selection = list.filter((item) => item.checked)
      if (selection.length > 0) {
        this.showSalerList('distribution')
      }
    }

    this.props.navigation.setParams({ inSelection: !inSelection })
  }

  updateShareSelection(index) {
    let list = this.state.list
    list[index] = { ...list[index], checked: !list[index].checked }
    this.setState({ list })
  }

  distributeCustomer() {
    const { list, distributeSaler } = this.state
    let selectionIds = list
      .filter((item) => item.checked)
      .map((item) => item.customerId)
      .join(',')

    Loading.show()
    let _this = this
    axios
      .get('/admin/customer/transferCustomers', { params: { userCode: distributeSaler.accountNo, ids: selectionIds } })
      .then(({ data }) => {
        Tip.show('分配成功', 1000, 'center')
        setTimeout(() => {
          _this.refresh(1)
        }, 1000)
      })
      .catch((data) => {
        Loading.hidden()
        // Tip.show(data.msg, 1000, 'center')
      })
  }

  sort() {
    this.setState({ up: !this.state.up })
  }

  refresh(num) {
    // 如果明确传入参数，则是刷新或者首次加载
    let pageNum
    if (num) {
      pageNum = 1
      if (this.state.list.length !== 0) {
        this.longList.flatList.scrollToIndex({
          index: 0
        })
      }
    } else {
      // 没有明确参数是下拉刷新
      pageNum = this.state.pageNum + 1
    }
    // console.warn(pageNum)
    // 请求数据
    // 清空上拉方法禁止拉动

    //客户状态
    let custStatus = null
    //销售顾问
    let salerNo = null
    //跟进状态
    let followStatus = null
    //是否申请试驾
    let isTestDrive = null

    if (this.state.statusValue !== -1) {
      custStatus = customerStatus[this.state.statusValue].dictKey
    }
    if (this.state.saler !== null) {
      salerNo = this.state.saler.accountNo
    }
    let carModel = this.state.catalogId[2]
    let catalogId = null
    if (carModel !== undefined) {
      catalogId = carModel.value
    }

    if (this.state.followStatusValue !== -1) {
      followStatus = followStatusDict[this.state.followStatusValue].dictKey
    }

    if (this.state.isApplyDrive === 1) {
      isTestDrive = 1
    }

    Loading.show()
    return axios
      .get('/admin/customer/page', {
        params: {
          pageNum,
          pageSize: 10,
          custCreateTimeRule: this.state.up ? 'ASC' : 'DESC',
          level: this.state.levelValue === -1 ? null : level[this.state.levelValue].dictKey,
          vehicleCode: catalogId,
          custStatus: custStatus,
          startTime: this.state.createStartDate,
          endTime: this.state.createEndDate,
          followStartTime: this.state.followStartDate,
          followEndTime: this.state.followEndDate,
          salesConsultantNo2: salerNo,
          followStatus: followStatus,
          isTestDrive: isTestDrive
        }
      })
      .then(({ data }) => {
        Loading.hidden()
        // 判断如果是刷新则清空数据
        this.setState((prevState) => {
          let oldList = pageNum === 1 ? [] : prevState.list
          return {
            pageNum,
            list: [...oldList, ...data.list],
            total: data.total
          }
        })
      })
      .catch((data) => {
        Loading.hidden()
      })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      inSelection: false,
      allChecked: false,
      tapShare: () => this.tapShare(),
      chooseAll: () => this.chooseAll()
    })

    this.setState({
      didBlurSubscription: this.props.navigation.addListener('didFocus', () => {
        this.props.navigation.setParams({ inSelection: false })
      })
    })

    this.refresh(1)
    this.reload = true

    //销售顾问列表
    axios
      .get('/admin/staff/listSaler', { params: { partnerCode: this.store.user.partner.partnerCode } })
      .then(({ data }) => {
        this.salerList = data
      })
      .catch((data) => {
        Tip.show(data.msg, 1000, 'center')
      })
  }

  componentWillUnmount() {
    if (this.state.didBlurSubscription) {
      this.state.didBlurSubscription.remove()
    }
  }

  showSalerList(from = 'filter') {
    TopviewGetInstance()
      .add(
        <ListPicker
          title="选择顾问"
          onPress={(isCancel, item) => {
            TopviewGetInstance().remove(this.state.salerListId)
            if (!isCancel) {
              if (from === 'filter') {
                this.setState({ saler: item })
                return
              }

              if (from === 'distribution') {
                this.setState({ distributeSaler: item }, () => {
                  if (!this.state.distributeSaler.mobilePhone) {
                    Tip.show('请维护产品专家的手机号!', 1000, 'center')
                    return false
                  }
                  this.distributeCustomer()
                })
              }
            }
          }}
          data={this.salerList}
        />
      )
      .then((id) => {
        this.setState({
          salerListId: id
        })
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.up !== this.state.up) {
      // this.longList.flatList.scrollToIndex({
      //     index: 0
      // })
      this.refresh(1)
    }
  }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   if (this.props.isFocused) {
  //     // 如果reload了不再请求
  //     if (this.reload) return null
  //     this.refresh(1)
  //     this.reload = true
  //   } else {
  //     this.reload = false
  //   }
  //   return null
  // }

  getLevelStr(value) {
    if (!value) return ''
    let obj = null
    level.filter((item) => {
      if (item.dictKey === value) obj = item
    })
    return obj ? obj.dictValue : ''
  }

  getStatusStr(value) {
    if (value === '') return 'None'
    let obj = null
    customerStatus.filter((item) => {
      if (item.dictKey === value) obj = item
    })
    return obj ? obj.dictValue : ''
  }

  renderFilterItem(checked, index, label) {
    return (
      <View
        style={{
          backgroundColor: checked ? colors.white : '#F0F0F0',
          borderWidth: checked ? 0.5 : 0,
          borderRadius: 2,
          height: 30,
          width: 80,
          margin: 5,
          justifyContent: 'center',
          borderColor: colors.primary,
          alignContent: 'center',
          alignItems: 'center'
        }}>
        <Text style={{ color: checked ? colors.primary : colors.black }}>{label}</Text>
      </View>
    )
  }

  resetFilter() {
    this.setState({
      modelValue: -1,
      levelValue: -1,
      statusValue: -1,
      createStartDate: '',
      createEndDate: '',
      followStartDate: '',
      followEndDate: '',
      catalogId: [],
      saler: null,
      followStatusValue: -1,
      isApplyDrive: -1
    })
  }

  // 拨号
  call(phone) {
    let tel = `tel:${phone}`
    Alert.alert('提示', '是否拨打该号码？', [
      {
        text: '取消',
        onPress: () => {
          console.log('取消')
        }
      },
      {
        text: '确定',
        onPress: () => {
          Linking.canOpenURL(tel)
            .then((supported) => {
              if (!supported) {
                console.log('Can not handle tel:' + tel)
              } else {
                return Linking.openURL(tel)
              }
            })
            .catch((error) => console.log('tel error', error))
        }
      }
    ])
  }

  // 组合显示车型
  get renderCar() {
    return join(map(this.state.catalogId, (item) => (item ? item.label : '')), '-')
  }

  render() {
    const inSelection = this.props.navigation.getParam('inSelection') || false
    const showStaff = this.store.role.roleCode === 'rolePartnerSaleManager' ? true : false
    return (
      <View style={{ flex: 1 }}>
        {/*头部*/}
        <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
          <TouchableOpacity onPress={this.sort.bind(this)} style={styles.touchableTitle} activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleTextStyle}>建档时间</Text>
              <View>
                <AntIcon name="caretup" size={6} color={this.state.up ? colors.primary : '#D7D7D9'} />
                <AntIcon name="caretdown" size={6} color={!this.state.up ? colors.primary : '#D7D7D9'} />
              </View>
            </View>
          </TouchableOpacity>
          <Divider style={{ backgroundColor: '#EDEEF0', height: 18, width: 1 }} />
          <TouchableOpacity
            onPress={() => {
              this._slideModal.open()
            }}
            style={styles.touchableTitle}
            activeOpacity={0.8}
            ref={(element) => {
              this.filterBtn = element
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleTextStyle}>筛选条件</Text>
              <AntIcon name={'filter'} size={size.fontSizeSm} color="black" />
            </View>
          </TouchableOpacity>
        </View>
        <Divider style={{ backgroundColor: '#EDEEF0', height: 1 }} />

        {/*这里是列表*/}
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <Longlist
            ref={(c) => {
              this.longList = c
            }}
            total={this.state.total}
            data={this.state.list}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.Itemcontainer}
                  activeOpacity={0.7}
                  onPress={() => {
                    this.props.navigation.navigate('Customers', {
                      customerNo: item.customerNo,
                      eventId: item.eventId,
                      eventRemark: item.eventRemark
                    })
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10
                    }}>
                    <View style={{ alignItems: 'flex-start', flex: 0.5 }}>
                      <Text style={styles.timeTextStyle}>
                        建档:{moment(item.custCreateTime).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    </View>
                    {item.followTime ? (
                      <View style={{ alignItems: 'flex-end', flex: 0.5 }}>
                        <Text style={styles.timeTextStyle}>
                          跟进:{moment(item.followTime).format('YYYY-MM-DD HH:mm')}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Divider style={{ backgroundColor: '#EDEEF0', height: 1 }} />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 5 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                          marginBottom: 5,
                          flex: 1
                        }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <Text style={styles.boldTextStyle}>{item.name}</Text>
                          <Sex data={item.sex} />
                          <Text style={styles.boldTextStyle}>{item.phone}</Text>
                        </View>
                      </View>
                      {showStaff ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 5 }}>
                          <Text style={styles.staffStyle}>{`产品专家：${item.staffName}`}</Text>
                        </View>
                      ) : null}

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                          <Tag style={styles.customerTypeText} type="default" textStyle={{ color: '#747475' }}>
                            {this.getStatusStr(item.custStatus)}
                          </Tag>
                          {/*1O,2H,3A,4B,5C,6其他,7战败)*/}
                          <Text style={styles.carSeriesStyle}>{this.getLevelStr(item.level)}</Text>
                          <Text style={styles.carSeriesStyle}>{item.satCustomerIntentionVO.vehicleName}</Text>
                        </View>
                        {!!item.eventId && (
                          <View style={{ width: 30, flexDirection: 'row-reverse' }}>
                            <Text style={{ color: 'red' }}>试驾</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      {inSelection ? (
                        <TouchableOpacity
                          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                          onPress={() => this.call(item.phone)}>
                          <CheckBox
                            center
                            containerStyle={{ width: 40, height: 40 }}
                            checkedColor="#00CFB4"
                            onPress={() => this.updateShareSelection(index)}
                            checked={item.checked}
                          />
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.call(item.phone)}>
                        <Icon name="phone" size={24} color="#999999" light />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
            onEndReachedThreshold={0.05}
            onEndReached={() => this.refresh()}
            onRefresh={() => this.refresh(1)}
            renderFooter={() => {
              return (
                <View
                  style={{
                    backgroundColor: colors.white
                  }}
                />
              )
            }}
            // 必须 否则容易出问题
            getItemLayout={(data, index) => {
              return { length: 94, offset: 94 * index, index }
            }}
          />
        </View>

        {/*以下是筛选弹窗*/}

        <SlideModal
          ref={(c) => {
            this._slideModal = c
          }}
          screenHeight={screenHeight}
          offsetX={screenWidth}
          offsetY={0}
          direction="left"
          align="left"
          styles={{
            content: {
              width: '80%',
              backgroundColor: 'white',
              height: '100%',
              paddingTop: 25
            },
            flex: 1
            // backdrop: [{backgroundColor: "#000", opacity: 0.8}],
          }}
          onClosed={(...args) => {
            if (args[0] === 'backdrop') {
              //点击遮罩层关闭，而不是确定按钮，应该清除筛选条件，并且不该请求数据
              this.resetFilter()
            } else {
              // this.longList.flatList.scrollToIndex({
              //     index: 0
              // })
              this.refresh(1)
            }
          }}
          cancelable={true}>
          <ScrollView style={{ flex: 1, height: screenHeight }}>
            <Text style={styles.filterSection}>车型</Text>

            {/*车型*/}
            {/*<Radio
                            value={this.state.modelValue}
                            checkedIcon={null}
                            uncheckedIcon={null}
                            style={styles.RadioBoxStyle}
                            onChange={(value) => {
                                console.log(value);
                                this.setState({
                                    modelValue: value
                                })
                            }}>

                            {
                                this.state.carModels.map((carModel, i) => {
                                    return (
                                        <Radio.Item value={i}
                                                    renderItem={(checked) => {
                                                        return this.renderFilterItem(checked, i, carModel.label)
                                                    }}
                                        />
                                    )

                                })
                            }
                        </Radio>*/}

            <View style={{ flexDirection: 'row', marginLeft: 16, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => this.VehicleSpectrum.open()}
                style={{ alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.8}>
                <View style={styles.carModelTextStyle}>
                  <Text
                    style={{
                      fontSize: size.fontSizeBase,
                      color: colors.primary
                    }}>
                    {this.renderCar}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSection}>客户级别</Text>

            {/*客户级别*/}
            <Radio
              value={this.state.levelValue}
              checkedIcon={null}
              uncheckedIcon={null}
              style={styles.RadioBoxStyle}
              onChange={(value) => {
                this.setState({
                  levelValue: value
                })
              }}>
              {customerLevel.map((level, i) => {
                return (
                  <Radio.Item
                    value={i}
                    key={i}
                    renderItem={(checked) => {
                      return this.renderFilterItem(checked, i, level.dictValue)
                    }}
                  />
                )
              })}
            </Radio>

            <Text style={styles.filterSection}>品鉴顾问</Text>

            <View style={{ flexDirection: 'row', marginLeft: 16, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => this.showSalerList()}
                style={{ alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.8}>
                <View style={styles.carModelTextStyle}>
                  <Text
                    style={{
                      fontSize: size.fontSizeBase,
                      color: colors.primary
                    }}>
                    {this.state.saler === null ? '' : this.state.saler.staffName}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSection}>建档时间</Text>

            <View style={{ flexDirection: 'row', marginLeft: 16, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  this._dateType = 0
                  this._datePicker.open()
                }}
                style={{ alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.8}>
                <View style={styles.dateTextStyle}>
                  <Text
                    style={{
                      fontSize: size.fontSizeBase,
                      color: colors.black
                    }}>
                    {this.state.createStartDate}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  height: 1,
                  width: 12,
                  marginLeft: 8,
                  marginRight: 8,
                  backgroundColor: colors.black
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this._dateType = 1
                  this._datePicker.open()
                }}
                style={{ alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.8}>
                <View style={styles.dateTextStyle}>
                  <Text
                    style={{
                      fontSize: size.fontSizeBase,
                      color: colors.black
                    }}>
                    {this.state.createEndDate}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSection}>跟进时间</Text>

            <View style={{ flexDirection: 'row', marginLeft: 16, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  this._dateType = 2
                  this._datePicker.open()
                }}
                style={{ alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.8}>
                <View style={styles.dateTextStyle}>
                  <Text
                    style={{
                      fontSize: size.fontSizeBase,
                      color: colors.black
                    }}>
                    {this.state.followStartDate}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  height: 1,
                  width: 12,
                  marginLeft: 8,
                  marginRight: 8,
                  backgroundColor: colors.black
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this._dateType = 3
                  this._datePicker.open()
                }}
                style={{ alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.8}>
                <View style={styles.dateTextStyle}>
                  <Text
                    style={{
                      fontSize: size.fontSizeBase,
                      color: colors.black
                    }}>
                    {this.state.followEndDate}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSection}>客户状态</Text>

            {/*客户状态*/}
            <Radio
              value={this.state.statusValue}
              checkedIcon={null}
              uncheckedIcon={null}
              style={styles.RadioBoxStyle}
              onChange={(value) => {
                this.setState({
                  statusValue: value
                })
              }}>
              {customerStatus.map((status, i) => {
                return (
                  <Radio.Item
                    value={i}
                    key={i}
                    renderItem={(checked) => {
                      return this.renderFilterItem(checked, i, status.dictValue)
                    }}
                  />
                )
              })}
            </Radio>

            <Text style={styles.filterSection}>跟进状态</Text>

            {/*跟进状态*/}
            <Radio
              value={this.state.followStatusValue}
              checkedIcon={null}
              uncheckedIcon={null}
              style={styles.RadioBoxStyle}
              onChange={(value) => {
                this.setState({
                  followStatusValue: value
                })
              }}>
              {followStatusDict.map((status, i) => {
                return (
                  <Radio.Item
                    value={i}
                    key={i}
                    renderItem={(checked) => {
                      return this.renderFilterItem(checked, i, status.dictValue)
                    }}
                  />
                )
              })}
            </Radio>

            <Text style={styles.filterSection}>是否申请试驾</Text>

            {/*是否申请试驾*/}
            <Radio
              value={this.state.isApplyDrive}
              checkedIcon={null}
              uncheckedIcon={null}
              style={styles.RadioBoxStyle}
              onChange={(value) => {
                this.setState({
                  isApplyDrive: value
                })
              }}>
              {isApplyDriveDict.map((status, i) => {
                return (
                  <Radio.Item
                    value={status.dictKey}
                    key={i}
                    renderItem={(checked) => {
                      return this.renderFilterItem(checked, i, status.dictValue)
                    }}
                  />
                )
              })}
            </Radio>
          </ScrollView>

          <View style={{ flexDirection: 'row', flex: 0, marginTop: 20, alignItems: 'flex-end' }}>
            <Button type="default" size="md" style={{ flex: 1 }} onPress={this.resetFilter.bind(this)}>
              重置
            </Button>

            <Button
              type="primary"
              size="md"
              textColorInverse={false}
              style={{ flex: 1 }}
              onPress={() => {
                this._slideModal.close()
              }}>
              确定
            </Button>
          </View>
        </SlideModal>

        {/*日期选择器*/}
        <SlideModal
          ref={(c) => {
            this._datePicker = c
          }}
          screenHeight={screenHeight}
          direction="up"
          align="up"
          styles={{
            content: {
              width: '100%',
              backgroundColor: 'white',
              height: '30%'
            }
            // backdrop: [{backgroundColor: "#000", opacity: 0.8}],
          }}
          cancelable={true}
          onClosed={(...args) => {
            if (args[0] === true) {
              switch (this._dateType) {
                case 0:
                  this.setState({
                    createStartDate: this.date
                  })
                  break
                case 1:
                  this.setState({
                    createEndDate: this.date
                  })
                  break
                case 2:
                  this.setState({
                    followStartDate: this.date
                  })
                  break
                case 3:
                  this.setState({
                    followEndDate: this.date
                  })
                  break
              }
            }
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this._datePicker.close()
              }}
              style={{ alignItems: 'center', justifyContent: 'center' }}
              activeOpacity={0.8}>
              <Text style={{ padding: 10 }}>取消</Text>
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: size.fontSizeBase,
                fontWeight: 'bold'
              }}>
              请选择日期
            </Text>
            <TouchableOpacity
              onPress={() => {
                this._datePicker.close(true)
              }}
              style={{ alignItems: 'center', justifyContent: 'center' }}
              activeOpacity={0.8}>
              <Text style={{ padding: 10, color: colors.primary }}>确定</Text>
            </TouchableOpacity>
          </View>

          <Datepicker
            proportion={[1, 1, 1]}
            numberOfYears={6}
            startYear={Number(new Date().getFullYear()) - 5}
            date={this.date}
            onChange={(date) => {
              this.date = date
            }}
          />
        </SlideModal>

        {/*车型显示*/}
        <VehicleSpectrum
          ref={(c) => (this.VehicleSpectrum = c)}
          rightCallback={(value) => {
            // this.handleChange('catalogId', value)
            // this.resetColors()
            this.setState({
              catalogId: value
            })
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: size.fontSizeBase,
    color: '#292D35',
    marginRight: 5
  },

  timeTextStyle: {
    fontSize: size.fontSizeBase,
    color: '#99999A'
  },

  boldTextStyle: {
    fontSize: size.fontsizeMd,
    color: colors.black,
    fontWeight: 'bold'
  },

  staffStyle: {
    fontSize: size.fontSizeBase,
    color: colors.black,
    textAlign: 'left'
  },

  carSeriesStyle: {
    fontSize: size.fontSizeBase,
    color: '#99999A',
    marginLeft: 12
  },

  customerTypeText: {
    borderRadius: 2,
    backgroundColor: '#E3E3E6',
    fontSize: 12,
    borderColor: '#E3E3E6'
  },

  touchableTitle: {
    flex: 0.5,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },

  Itemcontainer: {
    padding: 10,
    backgroundColor: colors.white,
    marginBottom: 10
  },

  RadioBoxStyle: {
    flexDirection: 'row',
    marginLeft: 16,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },

  filterSection: {
    color: colors.black,
    marginTop: 24,
    fontSize: size.fontsizeMd,
    marginLeft: 16,
    marginBottom: 16
  },

  dateTextStyle: {
    backgroundColor: '#F0F0F0',
    height: 30,
    width: 116,
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center'
  },

  carModelTextStyle: {
    backgroundColor: '#F0F0F0',
    height: 30,
    width: 'auto',
    minWidth: 116,
    paddingLeft: 10,
    paddingRight: 10,
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center'
  }
})

export default withNavigationFocus(Customer)
