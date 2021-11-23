import React, { Component } from 'react'
import { Text, View, ScrollView, Alert, TouchableOpacity, FlatList } from 'react-native'
import { Form, Input, Button, Radio, Tab, Dialog, Longlist } from 'beeshell'
import { inject } from 'mobx-react'
import { withNavigation } from 'react-navigation'
import variables from '../../../style/beeshell'
import { validate, requiredForm } from './validator'
import {
  VehicleSpectrum,
  RequiredLabel,
  ErrorMsg,
  CRadio,
  SelectLabel,
  ChinaRegions,
  ColorIn,
  ColorOut,
  DatePicker
} from '../../../common/components/form'
import Textarea from 'react-native-textarea'
import { ButtonWrapper, FormItemWrapper, CardTitle, Card, CardTitleIcon, CardRightButton } from './style'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Loading } from '../../../common/components/loading'

// 预置数据
import { tabData, userLevelHash, buyNatureHash, defaultList } from '../../data-config'
import Vehicle from '../../../common/services/vehicle'
import { setCustomerInfo, getFormData } from './util'

// 各种底部选择
import UserLevel from './form/user-level'
import BuyNature from './form/buy-nature'
import CompetitorInfo from './form/competitor-info'
import ChildredState from './form/childred-state'
import FirstSources from './form/first-sources'
import { join, map, forEach, isObject, isNil, split } from 'lodash'
import Icon from 'react-native-vector-icons/dist/Feather'
import { colors } from '../../../style/variables'
import { getPlanDate } from './util'
import Entypo from 'react-native-vector-icons/Entypo'

// 联系人资料
import CustomerLink from './components/customer-link'
import { Divider } from 'react-native-elements'

@inject((stores) => ({
  userStore: stores.userStore,
  dictStore: stores.dictStore
}))
class Customers extends Component {
  constructor(props) {
    super(props)
    this.vehicle = Vehicle.getInstance()
    this.store = this.props.userStore
    this.dict = this.props.dictStore
    this.customerNo = null
    this.reload = false

    this.state = {
      total: 0,
      list: [],
      userSource1List: [defaultList],
      userSource2List: [defaultList],
      userSource3List: [defaultList],
      user: {
        addr1: [],
        addr2: '',
        catalogId: [],
        colorIdOut: '',
        colorIdIn: '',
        source: 2,
        level: '5'
      },
      validateResults: {},
      phoneEditable: true,
      formContext: {},
      loading: false,
      addrtest: [],
      showTripList: true
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    let customerNo = navigation.getParam('customerNo')
    this.getUserSource1(customerNo)
    let addr = []
    let addrstr = { id: '', label: '' }
    let addrcity = { id: '', label: '' }
    let addrregion = { id: '', label: '' }
    axios.get('/admin/partner/area/info').then(({ data }) => {
      addrstr.id = data.provinceCode
      addrstr.label = data.provinceName
      addrcity.id = data.cityCode
      addrcity.label = data.cityName
      addrregion.id = data.regionCode
      addrregion.label = data.regionName
      addr.push(addrstr, addrcity, addrregion)
      this.setState({
        addrtest: addr
      })
    })
    this.focusListener = navigation.addListener('didFocus', () => {
      customerNo = customerNo ? customerNo : this.customerNo
      // 处理带有客户资料的
      if (customerNo) {
        // 添加属性
        this.customerNo = customerNo
        // 读取客户资料信息
        Loading.show()
        axios
          .get('/admin/customer/loadDetail', { params: { customerNo } })
          .then(({ data }) => {
            let userData = data
            if (!isObject(data)) {
              // 根据过来的线索数据，填充表单
              const clues = navigation.getParam('clues')
              if (!clues) return
              userData = clues
              userData.name = clues.customerName
              userData.phone = clues.tel
              // 客户来源
              userData.source = 1

              // 设置购买时间
              if (clues.planPayDate) {
                userData.planPayDate = split(clues.planPayDate, ' ')[0]
              } else {
                if (clues.level) {
                  userData.planPayDate = getPlanDate(clues.level)
                }
              }

              // 设置预计购买时间限制
              if (clues.level) {
                this.setPlanTime(clues.level)
              }

              // 组合意向车型
              if (clues.vehicleCode) {
                userData.satCustomerIntentionVO = {
                  catalogCode: clues.vehicleCode,
                  colorInCode: clues.colorInCode,
                  colorInName: clues.colorInName,
                  colorOutCode: clues.colorOutCode,
                  colorOutName: clues.colorOutName
                }
              }
              // 如果线索没有省份只有城市
              if (clues.province) {
                userData.province = clues.province
              }
              if (clues.city && clues.city.length >= 4) {
                userData.province = clues.city.substr(0, 2)
              }
              if (clues.region && clues.region.length >= 6) {
                userData.province = clues.region.substr(0, 2)
                userData.city = clues.region.substr(0, 4)
              }
            }
            setCustomerInfo.call(this, userData)
            // 根据salesConsultantNo 锁定表单
            if (data.salesConsultantNo && data.salesConsultantNo !== this.store.user.staff.accountNo) {
              this.setState({
                formContext: { editable: false }
              })
            }
            // 根据角色锁定表单
            const { role } = this.store
            if (!role) return null
            const { roleCode } = role
            if (roleCode !== 'rolePartnerSale') {
              this.setState({
                formContext: { editable: false }
              })
            }

            // 根据是否分享锁定,分享后只有电商渠道的isShare是1
            if (data.isShare == 1) {
              this.setState({
                formContext: { editable: false }
              })
            }

            this.setState({
              list: userData.eventList,
              total: userData.eventList.length
            })
          })
          .finally(() => Loading.hidden())
      }
    })
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove()
  }

  getUserSource1(customerNo) {
    axios.get('/admin/customer/getUserSource1').then(({ data }) => {
      this.setState({
        userSource1List: map([...data], (item) => {
          return {
            label: item.dictValue,
            value: item.dictKey,
            dictId: item.dictId
          }
        })
      })
      // customerNo不存在则设置默认的一级地区
      if (customerNo) return
      // 设置回显
      this.firstSources.wrappedInstance.setDefault('100')
      // 设置表单数据
      const { user } = this.state
      // 获取二级来源
      this.getSubUserSource({ dictId: '41ff2d2a4ca55ff9875ac34aca2ba03d', value: '100' }, 2).then(() => {
        this.setState({ user: { ...user, userSource1: '100', userSource2: '1001' } })
        this.secondSources.wrappedInstance.setDefault('1001')
        // 设定三级来源
        const { partner } = this.store.user
        const defaultData = { userSource1: '100', userSource2: '1001' }
        if (partner && partner.partnerName) {
          defaultData.userSource3 = partner.partnerName
        }
        //const addr=[{id:'31',label:'上海市'},{id:'3101',label:'上海市'},{id:'310117',label:'松江区'}]
        // TODO 设置地址为店的地址 需要登录接口返回数据
        // if (partner && partner.fullAreaCode) {
        //     const addr = map(JSON.parse(partner.fullAreaCode), item => {
        //         return {id: item}
        //     })
        defaultData.addr1 = this.state.addrtest
        this.ChinaRegions.setDefault(this.state.addrtest)
        //   }

        // TODO 设置意向车型 需要生产的数据
        const car = [
          { id: 'U', label: 'U系列' },
          { id: '861', label: '861' },
          { id: 'AM861BFLCHL21C0', label: '21款63度 PRO V0' }
          // { id: '861', label: 'U6' }
        ]
        this.VehicleSpectrum.setDefault(car)
        defaultData.catalogId = car
        this.setState({ user: { ...user, ...defaultData } })
      })
    })
  }

  getSubUserSource(item, type) {
    const { user } = this.state
    const { dictId, value } = item

    // 置空处理
    if (type == 2) {
      // 如果一级来源改变清理二级三级来源
      if (user.userSource1 && user.userSource1 !== value) {
        this.secondSources.wrappedInstance.setDefault(0)
        this.thirdSources.wrappedInstance.setDefault(0)
        if (user.userSource2) {
          this.handleChange('userSource2', '')
        }
        if (user.userSource3) {
          this.handleChange('userSource3', '')
        }
        this.setState({
          userSource2List: [defaultList],
          userSource3List: [defaultList]
        })
      }
    }
    if (type == 3) {
      // 如果一级来源改变清理二级三级来源
      // 如果一级来源改变清理二级三级来源
      if (user.userSource2 && user.userSource2 !== value) {
        this.thirdSources.wrappedInstance.setDefault(0)
        if (user.userSource3) {
          this.handleChange('userSource3', '')
        }
        this.setState({
          userSource3List: [defaultList]
        })
      }
    }

    return axios.get('/admin/customer/getUserSourceSub', { params: { dictId } }).then(({ data }) => {
      let userSourceList = map([...data], (item) => {
        return {
          label: item.dictValue,
          value: item.dictKey,
          dictId: item.dictId
        }
      })

      if (type == 2) {
        this.setState({
          userSource2List: userSourceList
        })
      } else if (type == 3) {
        this.setState({
          userSource3List: userSourceList
        })
      }
      return userSourceList
    })
  }

  userSourceTextWithValue(value, userSourcesList) {
    let list = userSourcesList
    for (let index in list) {
      let item = list[index]
      if (item.value === value) {
        return item.label
      }
    }
    return ''
  }

  // 表单值变化回调
  handleChange(key, value) {
    let ret
    validate(key, value, (tmp) => {
      ret = tmp
    })
    this.setState((prevState) => {
      return {
        user: {
          ...prevState.user,
          [key]: value
        },
        validateResults: { ...prevState.validateResults, [key]: ret }
      }
    })
    return ret
  }

  // 设置计划跟进时间
  setPlanTime(level) {
    this.setState({ endDate: getPlanDate(level) })
  }

  // 检查电话号码
  checkPhone(evt) {
    // 并且通过后验证数据 放入编辑结束时间
    const { user, validateResults } = this.state
    if (!user.phone || !validateResults.phone || !validateResults.phone.valid || this.customerNo) return
    axios
      .get('/admin/customer/getCustomerByPhone', { params: { phone: user.phone } })
      .then(({ data, code, msg }) => {
        if (!isObject(data)) {
          Alert.alert('提示', '数据格式不正确，不是对象')
          return
        }
        this.checkCustomer = { data, code }
        this.setState({ showCustomerText: '客户已存在，是否查看客户资料' })
        this.showCustomer.open()
      })
      .catch(({ data, code, msg }) => {
        // 如果code是-2，则是别人的客户，只显示客户资料，不能查看跟进
        if (code === -2) {
          this.checkCustomer = { data, code }
          this.setState({ showCustomerText: msg })
          this.showCustomer.open()
        }
      })
  }

  // 保存信息
  save() {
    // 验证数据
    let flag = false
    let requiredData = [...requiredForm, 'phone', 'addr1']
    forEach(requiredData, (e) => {
      let result = this.state.validateResults[e]
      // validateResults 不存在，则是未改变
      if (!result) {
        result = this.handleChange(e, this.state.user[e])
      }
      // 存在且valid 为false 返回
      if (result && !result.valid) {
        flag = true
      }
    })
    if (flag) return

    this.setState({ loading: true })

    axios
      .post('/admin/customer/save', getFormData.apply(this))
      .then(({ data }) => {
        Alert.alert('提示', '本次信息保存成功.')
        this.customerNo = data // 设置防止缓存
        this.props.navigation.navigate('FollowUp', { customerNo: data })
      })
      .finally(() => this.setState({ loading: false }))
  }

  // 点击切换tab
  touchTab(v, value) {
    // 没有保存 或者 没有意向 或者 为线索客户
    if (
      !this.customerNo ||
      !this.state.user.level ||
      isNil(this.state.user.custStatus) ||
      this.state.user.custStatus === '' ||
      (this.state.user.custStatus == 4 &&
        (!this.state.user.level || !this.state.user.satCustomerIntentionVO.vehicleName))
    ) {
      Alert.alert('提示', '客户尚未成为意向客户，请填写资料并保存')
      return
    }
    // 角色不是销售顾问 锁定tab
    const { role } = this.store
    if (!role) return null
    const { roleCode } = role
    if (roleCode !== 'rolePartnerSale') {
      return Alert.alert('提示', '您当前角色不是销售顾问，无法查看')
    }
    const { navigation } = this.props
    switch (value) {
      case 2:
        navigation.navigate('FollowUp', { customerNo: this.customerNo })
        break
      case 3:
        navigation.navigate('CreatOrder', { customerNo: this.customerNo })
        break
      default:
        return
    }
  }

  // 点击切换显示更多资料
  handleShowMore() {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  // 点击切换显示用户旅程
  handleShowTripList() {
    this.setState({
      showTripList: !this.state.showTripList
    })
  }

  // 车型谱更改需要重置颜色
  resetColors() {
    const { user } = this.state
    user.colorIdOut = ''
    user.colorIdIn = ''
    this.setState({
      user: { ...user }
    })
  }

  // 更多资料渲染
  renderMore() {
    const disabled = this.state.formContext.editable === false
    if (this.state.showMore) {
      return (
        <View>
          <Form.Item style={{ paddingVertical: 0 }} label="是否有车" labelWidth={100} hasLine>
            <CRadio
              value={this.state.user.ownCar}
              disabled={disabled}
              onChange={(value) => {
                this.handleChange('ownCar', value)
              }}>
              <Radio.Item label="有" style={{ marginRight: 30 }} value={1} disabled={disabled} />
              <Radio.Item label="无" value={0} disabled={disabled} />
            </CRadio>
          </Form.Item>
          <Form.Item style={{ paddingVertical: 0 }} label="购车指标" labelWidth={100} hasLine>
            <CRadio
              value={this.state.user.isCanBuy}
              disabled={disabled}
              onChange={(value) => {
                this.handleChange('isCanBuy', value)
              }}>
              <Radio.Item label="有" style={{ marginRight: 30 }} value={1} disabled={disabled} />
              <Radio.Item label="无" value={0} disabled={disabled} />
            </CRadio>
          </Form.Item>
          <Form.Item style={{ paddingVertical: 0 }} label="停车位置" labelWidth={100} hasLine>
            <CRadio
              disabled={disabled}
              value={this.state.user.isPlace}
              onChange={(value) => {
                this.handleChange('isPlace', value)
              }}>
              <Radio.Item label="有" style={{ marginRight: 30 }} value={1} disabled={disabled} />
              <Radio.Item label="无" value={0} disabled={disabled} />
            </CRadio>
          </Form.Item>
          <Form.Item style={{ paddingVertical: 0 }} label="安装充电桩" labelWidth={100} hasLine>
            <CRadio
              value={this.state.user.isCharge}
              disabled={disabled}
              onChange={(value) => {
                this.handleChange('isCharge', value)
              }}>
              <Radio.Item label="有" style={{ marginRight: 30 }} value={1} disabled={disabled} />
              <Radio.Item label="无" value={0} disabled={disabled} />
            </CRadio>
          </Form.Item>
          <Form.Item style={{ paddingVertical: 13 }} label="购买性质" labelWidth={100} hasLine>
            <SelectLabel
              data={buyNatureHash[this.state.user.buyNature]}
              editable={this.state.formContext.editable}
              onPress={() => this.BuyNature.open()}
            />
          </Form.Item>
          <Form.Item style={{ paddingVertical: 13 }} label="竞品信息" labelWidth={100} hasLine>
            <SelectLabel
              data={
                this.dict.hashData.competitorInfo &&
                this.state.user.competitorInfo !== '' &&
                !isNil(this.state.user.competitorInfo)
                  ? this.dict.hashData.competitorInfo[this.state.user.competitorInfo].dictValue
                  : ''
              }
              editable={this.state.formContext.editable}
              onPress={() => this.competitorInfo.wrappedInstance.open()}
            />
          </Form.Item>
          <Form.Item style={{ paddingVertical: 13 }} label="育儿阶段" labelWidth={100} hasLine>
            <SelectLabel
              data={
                this.dict.hashData.childredState &&
                this.state.user.childredState !== '' &&
                !isNil(this.state.user.childredState)
                  ? this.dict.hashData.childredState[this.state.user.childredState].dictValue
                  : ''
              }
              editable={this.state.formContext.editable}
              onPress={() => this.childredState.wrappedInstance.open()}
            />
          </Form.Item>
        </View>
      )
    } else {
      return null
    }
  }

  renderTripList() {
    const disabled = this.state.formContext.editable === false
    if (this.state.showTripList) {
      return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <FlatList
            ref={(c) => {
              this.longList = c
            }}
            total={this.state.total}
            data={this.state.list}
            renderItem={({ item, index }) => {
              var textColor = colors.black
              if (item.isCreateOrder === 0) {
                textColor = '#FF0000'
              } else if (index === 0) {
                textColor = colors.primary
              }
              return (
                <View
                  style={{
                    flexDirection: 'column',
                    height: 88,
                    backgroundColor: colors.white
                  }}>
                  <View style={{ height: 88, flexDirection: 'row' }}>
                    <View style={{ marginTop: 12, marginLeft: 15, marginRight: 15, flexDirection: 'column' }}>
                      <Text style={{ fontSize: 14 }}>
                        {item.eventtime && item.eventtime.length == 19 ? item.eventtime.substr(0, 10) : ''}
                      </Text>
                      <Text style={{ marginTop: 6, fontSize: 12, color: colors.grey3 }}>
                        {item.eventtime && item.eventtime.length == 19 ? item.eventtime.substr(11, 8) : ''}
                      </Text>
                    </View>

                    <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                      <Divider
                        style={{
                          marginLeft: 6,
                          height: 13,
                          width: 1,
                          backgroundColor: index == 0 ? colors.white : '#edeef0'
                        }}
                      />
                      <Entypo
                        style={{ marginLeft: index == 0 ? 0 : 1 }}
                        name="vinyl"
                        size={index == 0 ? 15 : 12}
                        color={index == 0 ? colors.primary : '#edeef0'}
                      />
                      <Divider
                        style={{
                          marginLeft: 6,
                          height: 60,
                          width: 1,
                          backgroundColor: index === this.state.total - 1 ? colors.white : '#edeef0'
                        }}
                      />
                    </View>

                    <View
                      style={{ flex: 1.0, marginTop: 12, marginLeft: 15, marginRight: 15, flexDirection: 'column' }}>
                      <Text style={{ color: index == 0 ? colors.primary : colors.black }}>{item.userSource3}</Text>
                      {!!item.userSource3Split ? (
                        <Text style={{ marginTop: 6, fontSize: 13, color: colors.grey3 }}>
                          {item.userSource3Split ? `——${item.userSource3Split}` : ''}
                        </Text>
                      ) : null}
                      {!!item.remark ? (
                        <Text style={{ marginTop: 6, fontSize: 13, color: colors.grey3 }}>{item.remark}</Text>
                      ) : null}
                    </View>
                    <View />
                  </View>
                </View>
              )
            }}
            onEndReachedThreshold={0.05}
            // 必须 否则容易出问题
            getItemLayout={(data, index) => {
              return { length: 94, offset: 94 * index, index }
            }}
          />
        </View>
      )
    } else {
      return null
    }
  }

  // 组合显示车型
  get renderCar() {
    return join(map(this.state.user.catalogId, (item) => (item ? item.label : '')), '-')
  }

  // 组合显示
  get renderAddr1() {
    return join(map(this.state.user.addr1, (item) => (item ? item.label : '')), '-')
  }

  render() {
    const disabled = this.state.formContext.editable === false
    const { user } = this.state
    const { hashData } = this.dict
    const { user_source1, user_source2 } = hashData

    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: colors.grey5, flex: 1 }}
        enableOnAndroid={true}
        scrollEnabled={true}>
        <Tab
          value={1}
          data={tabData}
          onChange={(item) => this.touchTab('value', item.value)}
          activeColor={variables.mtdBrandPrimaryDark}
        />

        <Form style={{ marginTop: 10, backgroundColor: 'transparent' }} formContext={this.state.formContext}>
          <FormItemWrapper>
            <Card>
              <TouchableOpacity
                onPress={() => {
                  this.handleShowTripList()
                }}>
                <CardTitle>
                  <Text>用户旅程</Text>
                  <CardTitleIcon>
                    <Icon
                      name={this.state.showTripList ? 'chevron-down' : 'chevron-up'}
                      size={20}
                      color={variables.mtdGrayLight}
                    />
                  </CardTitleIcon>
                </CardTitle>
                <CardRightButton
                  onPress={() => {
                    const { navigation } = this.props
                    navigation.navigate('AddDriver', {
                      eventId: navigation.getParam('eventId'),
                      eventRemark: navigation.getParam('eventRemark'),
                      customerName: user.name,
                      contacterPhoneOne: user.phone
                    })
                  }}>
                  <Text style={{ color: colors.primary }}>快速试驾</Text>
                </CardRightButton>
              </TouchableOpacity>
              {this.renderTripList()}
            </Card>
          </FormItemWrapper>
          <FormItemWrapper>
            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="客户姓名" />} hasLine>
              <Input
                testID="name"
                value={user.name}
                textAlign="right"
                onChange={(value) => {
                  this.handleChange('name', value)
                }}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="name" />
            </Form.Item>
            <Form.Item style={{ paddingVertical: 0 }} label={<RequiredLabel labelName="客户性别" />} hasLine>
              <CRadio
                value={user.sex}
                disabled={disabled}
                onChange={(value) => {
                  this.handleChange('sex', value)
                }}>
                <Radio.Item label="男士" style={{ marginRight: 30 }} value={'1'} disabled={disabled} />
                <Radio.Item label="女士" value={'2'} disabled={disabled} />
              </CRadio>
              <ErrorMsg validateResults={this.state.validateResults} name="sex" />
            </Form.Item>
            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="客户级别" />} hasLine>
              <SelectLabel
                data={userLevelHash[user.level]}
                editable={this.state.formContext.editable}
                onPress={() => this.UserLevel.open()}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="level" />
            </Form.Item>
            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="手机号码" />} hasLine>
              <Input
                testID="phone"
                value={user.phone}
                textAlign="right"
                editable={this.state.phoneEditable}
                onEndEditing={(value) => this.checkPhone(value)}
                onChange={(value) => this.handleChange('phone', value)}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="phone" />
            </Form.Item>
          </FormItemWrapper>
          <FormItemWrapper>
            <CustomerLink
              callback={(value) => this.handleChange('customerLinkVOList', value)}
              list={user.customerLinkVOList}
              editable={this.state.formContext.editable}
            />
          </FormItemWrapper>

          <FormItemWrapper>
            <Form.Item style={{ paddingVertical: 0 }} label={<RequiredLabel labelName="客户来源" />} hasLine>
              <CRadio value={user.source} disabled={true}>
                <Radio.Item label="线索领取" disabled={true} style={{ marginRight: 30 }} value={1} />
                <Radio.Item label="展厅建档" disabled={true} value={2} />
              </CRadio>
              <ErrorMsg validateResults={this.state.validateResults} name="source" />
            </Form.Item>
            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="一级来源" />} hasLine>
              <SelectLabel
                data={
                  this.customerNo
                    ? user.userSource1Name
                    : this.userSourceTextWithValue(user.userSource1, this.state.userSource1List)
                }
                editable={!this.customerNo}
                onPress={() => this.firstSources.wrappedInstance.open()}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="userSource1" />
            </Form.Item>

            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="二级来源" />} hasLine>
              <SelectLabel
                data={
                  this.customerNo
                    ? user.userSource2Name
                    : this.userSourceTextWithValue(user.userSource2, this.state.userSource2List)
                }
                editable={!this.customerNo}
                onPress={() => {
                  if (!user.userSource1) {
                    Alert.alert('提示', '请先选择一级来源')
                  } else {
                    this.secondSources.wrappedInstance.open()
                  }
                }}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="userSource2" />
            </Form.Item>

            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="三级来源" />} hasLine>
              <SelectLabel
                data={this.customerNo ? user.userSource3Name : user.userSource3}
                editable={!this.customerNo}
                onPress={() => {
                  if (!user.userSource2) {
                    Alert.alert('提示', '请先选择二级来源')
                  } else {
                    this.thirdSources.wrappedInstance.open()
                  }
                }}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="userSource3" />
            </Form.Item>

            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="所在区域" />} hasLine>
              <SelectLabel
                data={this.renderAddr1}
                editable={this.state.formContext.editable}
                onPress={() => this.ChinaRegions.open()}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="addr1" />
            </Form.Item>
            <Form.Item style={{ paddingVertical: 13 }} label="详细地址" labelWidth={100} hasLine>
              <Input
                testID="addr2"
                value={user.addr2}
                textAlign="right"
                onChange={(value) => {
                  this.handleChange('addr2', value)
                }}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="addr2" />
            </Form.Item>
          </FormItemWrapper>

          <FormItemWrapper>
            <Form.Item style={{ paddingVertical: 13 }} label={<RequiredLabel labelName="意向车型" />} hasLine>
              <SelectLabel
                data={this.renderCar}
                editable={this.state.formContext.editable}
                onPress={() => this.VehicleSpectrum.open()}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="catalogId" />
            </Form.Item>
            <Form.Item style={{ paddingVertical: 13 }} label="外观颜色" labelWidth={100} hasLine>
              <SelectLabel
                data={user.colorIdOut ? user.colorIdOut.label : ''}
                editable={this.state.formContext.editable}
                onPress={() => this.ColorOut.open()}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="colorIdOut" />
            </Form.Item>

            <Form.Item style={{ paddingVertical: 13 }} label="内饰颜色" labelWidth={100} hasLine>
              <SelectLabel
                data={user.colorIdIn ? user.colorIdIn.label : ''}
                editable={this.state.formContext.editable}
                onPress={() => this.ColorIn.open()}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="colorIdIn" />
            </Form.Item>
          </FormItemWrapper>
          <FormItemWrapper>
            <Form.Item style={{ paddingVertical: 13 }} label="预计购买时间" hasLine>
              <SelectLabel
                data={user.planPayDate}
                editable={this.state.formContext.editable}
                onPress={() => this.DatePicker.open()}
              />

              {/* <ErrorMsg validateResults={this.state.validateResults} name='planPayDate'/> */}
            </Form.Item>
          </FormItemWrapper>
          <FormItemWrapper>
            <Form.Item style={{ paddingVertical: 13 }} label="客户描述" labelWidth={100} hasLine>
              <View />
              <Textarea
                onChangeText={(value) => {
                  this.handleChange('customerDesc', value)
                }}
                defaultValue={user.customerDesc}
                maxLength={500}
                placeholder={'请输入'}
                placeholderTextColor={'#c7c7c7'}
                underlineColorAndroid={'transparent'}
                editable={this.state.formContext.editable}
              />
              <ErrorMsg validateResults={this.state.validateResults} name="customerDesc" />
            </Form.Item>
          </FormItemWrapper>

          <FormItemWrapper>
            <Card>
              <TouchableOpacity
                onPress={() => {
                  this.handleShowMore()
                }}>
                <CardTitle>
                  <Text>更多资料</Text>
                  <CardTitleIcon>
                    <Icon
                      name={this.state.showMore ? 'chevron-down' : 'chevron-up'}
                      size={20}
                      color={variables.mtdGrayLight}
                    />
                  </CardTitleIcon>
                </CardTitle>
              </TouchableOpacity>
              {this.renderMore()}
            </Card>
          </FormItemWrapper>
        </Form>
        <ButtonWrapper>
          <Button
            testID="submit"
            type="primary"
            disabled={disabled || this.state.loading}
            onPress={this.save.bind(this)}>
            保存
          </Button>
        </ButtonWrapper>
        <UserLevel
          ref={(c) => (this.UserLevel = c)}
          userLevel={this.state.user.level}
          rightCallback={(value) => {
            this.handleChange('level', value)
            this.setPlanTime(value)
          }}
        />

        <FirstSources
          ref={(c) => (this.firstSources = c)}
          title={'请选择一级来源'}
          list={this.state.userSource1List}
          userSource={this.state.user.userSource1}
          rightCallback={(item) => {
            if (item) {
              this.getSubUserSource(item, 2)
              this.handleChange('userSource1', item.value)
            }
          }}
        />

        <FirstSources
          ref={(c) => (this.secondSources = c)}
          title={'请选择二级来源'}
          list={this.state.userSource2List}
          userSource={this.state.user.userSource2}
          rightCallback={(item) => {
            if (item) {
              this.getSubUserSource(item, 3)
              this.handleChange('userSource2', item.value)
            }
          }}
        />

        <FirstSources
          ref={(c) => (this.thirdSources = c)}
          title={'请选择三级来源'}
          list={this.state.userSource3List}
          userSource={this.state.user.userSource3}
          rightCallback={(item) => {
            if (item) {
              this.handleChange('userSource3', item.label)
            }
          }}
        />

        <BuyNature
          ref={(c) => (this.BuyNature = c)}
          buyNature={this.state.user.buyNature}
          rightCallback={(value) => this.handleChange('buyNature', value)}
        />
        <CompetitorInfo
          ref={(c) => (this.competitorInfo = c)}
          buyNature={this.state.user.competitorInfo}
          rightCallback={(value) => this.handleChange('competitorInfo', value)}
        />
        <ChildredState
          ref={(c) => (this.childredState = c)}
          childredState={this.state.user.childredState}
          rightCallback={(value) => this.handleChange('childredState', value)}
        />
        <ChinaRegions
          ref={(c) => (this.ChinaRegions = c)}
          rightCallback={(value) => {
            this.handleChange('addr1', value)
          }}
        />
        <VehicleSpectrum
          ref={(c) => (this.VehicleSpectrum = c)}
          rightCallback={(value) => {
            //console.log('value',value)
            this.handleChange('catalogId', value)
            this.resetColors()
          }}
        />
        <ColorIn
          ref={(c) => (this.ColorIn = c)}
          catalogId={this.state.user.catalogId}
          rightCallback={(value) => this.handleChange('colorIdIn', value)}
        />
        <ColorOut
          ref={(c) => (this.ColorOut = c)}
          catalogId={this.state.user.catalogId}
          rightCallback={(value) => this.handleChange('colorIdOut', value)}
        />
        <DatePicker
          ref={(c) => (this.DatePicker = c)}
          endDate={this.state.endDate}
          numberOfYears={2}
          rightCallback={(value) => this.handleChange('planPayDate', value)}
        />

        <Dialog
          ref={(c) => (this.showCustomer = c)}
          cancelable={true}
          title="销售助手App系统提示"
          bodyText={this.state.showCustomerText}
          cancelLabelText="重新输入电话"
          confirmLabelText="查看客户资料"
          confirmLabelTextStyle={{ color: colors.primary }}
          confirmCallback={() => {
            setCustomerInfo.call(this, this.checkCustomer.data)
            if (this.checkCustomer.code !== -2) return
            this.setState({
              formContext: { editable: false }
            })
          }}
        />
      </KeyboardAwareScrollView>
    )
  }
}

export default withNavigation(Customers)
