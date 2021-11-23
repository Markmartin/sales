import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Longlist, Button, Tab, Tip } from 'beeshell'
import { CheckBox } from 'react-native-elements'
import {
  ListWrapper,
  ListItem,
  ListInfo,
  UserInfo,
  OrderInfo,
  ActionInfo,
  ClueType,
  ClueDetail,
  ClueDetailCell
} from './style'
import { colors, size } from '../../../style/variables'

// 引入领取对话框
import Receive from './receive'
// 引入分配线索底部选择器
import Distribution from './distribution'
import { inject } from 'mobx-react'
import { clueType, clueTabData, cluesTypes } from '../../data-config'
import Sex from '../../../common/components/sex'
import variables from '../../../style/beeshell'
import { isNil, truncate, filter, forEach } from 'lodash'
import ShareButton from './share-button'
import {
  setShareBtn,
  setCancelBtn,
  setChangeCheckBox,
  setSharePartner,
  setShareClues,
  showByTab
} from './share-service'
import ShareCancelButton from './share-cancel-button'
import SharePartner from './share-partner'
import { Loading } from '../../../common/components/loading'

@inject((stores) => ({
  userStore: stores.userStore,
  dictStore: stores.dictStore
}))
class Clues extends Component {
  static navigationOptions = {
    headerRight: <ShareButton ref={(c) => setShareBtn(c)} />,
    headerLeft: <ShareCancelButton ref={(c) => setCancelBtn(c)} />
  }

  constructor(props) {
    super(props)
    this.store = this.props.userStore
    this.dictStore = this.props.dictStore
    this.shareList = []
    this.state = {
      showShareIcon: false,
      pageNum: 1,
      list: [],
      total: 0,
      activeItem: {},
      distributionItem: {},
      isGet: 0,
      tabOptions: [{ label: '全部', value: null }, { label: '订单线索', value: 3 }, { label: '潜客线索', value: 1 }],
      clueType: null,
      toggleClueIndex: null,
      followClue: null,
      clueDetailConfig: [
        { label: '意向车型名称', key: 'vehicleTypeName' },
        { label: '对比车型名称', key: 'contrastTypeName' },
        { label: '意向购车时间', key: 'purchaseIntention', dict: this.dictStore.hashData['purchase_intention'] },
        { label: '上牌省', key: 'carLicenseProvinceName' },
        { label: '上牌市', key: 'carLicenseCityName' },
        { label: '是否看车', key: 'isSeeCar', dict: this.dictStore.hashData['is_see_car'] },
        { label: '购买方式', key: 'purchaseType', dict: this.dictStore.hashData['purchase_type'] },
        { label: '是否置换', key: 'isSubstitution', dict: this.dictStore.hashData['is_substitution'] },
        { label: '旧车车型', key: 'oldCarType', showOnlyNotNull: true },
        { label: '旧车车龄', key: 'oldAutoAge', showOnlyNotNull: true },

        {
          label: '旧车动力类型',
          key: 'oldPowerType',
          showOnlyNotNull: true,
          dict: this.dictStore.hashData['old_power_type']
        },
        {
          label: '考虑因素',
          key: 'factorsToConsiders',
          showOnlyNotNull: true,
          dict: this.dictStore.hashData['factors_to_considers']
        }
      ],
      followClueConfig: [
        { label: '到店意向', key: 'intentToShop', dict: this.dictStore.hashData['intent_to_shop'] },
        { label: '经销商', key: 'partnerName' },
        { label: '跟进总结', key: 'followSummary' }
      ]
    }
  }

  componentDidMount() {
    // 获取线索数据
    let { pageNum, isGet, clueType } = this.state
    // 请求数据
    // 清空上拉方法禁止拉动
    Loading.show()
    this.refresh(1)
    setChangeCheckBox((i) => this.changeShareCheckbox(i))
  }

  // change the share checkbox
  changeShareCheckbox(showShareIcon) {
    this.setState({ showShareIcon })
    // 如果showShareIcon是false 重置线索数量
    if (!showShareIcon) {
      const { list } = this.state
      forEach(list, (item) => {
        item.checked = false
        return true
      })
      this.setState({ list })
    }
  }

  // 当用户角色为销售顾问时，未领取线索为未超时的可领取线索，
  // 当用户角色为销售经理时，未领取线索包含超时的线索
  refresh(num) {
    // 如果明确传入参数，则是刷新或者首次加载
    let { pageNum, isGet, clueType } = this.state
    pageNum = num || pageNum + 1

    // Loading.show()
    return axios
      .get('/admin/satCustomerClue/page', { params: { pageNum, pageSize: 10, isOrderClue: 0, isGet, clueType } })
      .then(({ data }) => {
        this.setState((prevState) => {
          let oldList = pageNum === 1 ? [] : prevState.list
          return {
            pageNum,
            toggleClueIndex: null,
            list: [...oldList, ...data.list],
            total: data.total
          }
        })
      })
  }

  // 领取线索
  receive(event, activeItem) {
    this.Receive.receive(activeItem)
  }

  // 分配线索
  distribute(event, distributionItem) {
    this.distribution.show(distributionItem)
  }

  // 查看资料
  goToCustomer(item) {
    const { navigation } = this.props
    // 根据线索类型去往不同的页面 clueType
    switch (item.clueType) {
      case '1':
        // 请求查看是否客户建档
        navigation.navigate('Customers', { customerNo: item.customerNo, clues: item })
        break
      case '2':
        // 试驾类型
        navigation.navigate('DriveDetails', { driveId: item.businessKey })
        break
      case '3':
        // 订单类型
        navigation.navigate('OrderInquireDetails', { orderNo: item.businessKey })
        break
    }
  }

  tapClueCell(item, index) {
    if (item.isGet == 1) {
      this.goToCustomer(item)
      return
    }
    const { toggleClueIndex, followClue } = this.state
    if (item.isGet == 0) {
      if (index === toggleClueIndex) {
        this.setState({ toggleClueIndex: null })
        return
      }

      if (index !== toggleClueIndex) {
        this.setState({ toggleClueIndex: index })
        if (!followClue || item.clueNo !== followClue.clueNo) {
          Loading.show()
          axios
            .get('/admin/satcustomercluefollow/getByClueNo', { params: { clueNo: item.clueNo } })
            .then(({ data }) => {
              this.setState({ followClue: !!data ? data : null })
            })
            .finally(() => Loading.hidden())
        }
        return
      }
    }
  }

  // 点击切换tab
  touchTab(value) {
    this.setState(
      (preState) => ({ isGet: value, clueType: value === 1 ? null : preState.clueType, toggleClueIndex: null }),
      () => {
        this.refresh(1)
        showByTab(value)
      }
    )
  }

  changeClueType(value) {
    this.setState({ clueType: value, toggleClueIndex: null }, () => {
      this.refresh(1)
    })
  }

  // 渲染时间
  renderTime(item) {
    if (item.isOverClueTime) {
      let getDate = moment(item.createTime)
      let currentDate = moment()
      const diff = currentDate.diff(getDate)
      let diffDuration = moment.duration(diff).minutes()
      diffDuration = diffDuration == 0 ? 1 : diffDuration
      const diffDurationDay = moment.duration(diff).hours()
      const dayText = diffDurationDay ? `${diffDurationDay}小时` : ''
      return (
        <Text style={{ color: colors.error }}>
          {dayText}
          {diffDuration}分钟未领取
        </Text>
      )
    } else {
      let time = item.getDate ? item.getDate : item.createTime
      return <Text style={{ color: colors.grey3 }}>{moment(time).format('YYYY-MM-DD HH:mm')}</Text>
    }
  }

  renderDistribution(item) {
    const { role } = this.store
    // 如果是已领取 则是查看
    if (item.isGet == 1) {
      return (
        <ActionInfo>
          <View style={{ flex: 1 }}>
            <Button textStyle={{ color: colors.primary }} type="text" size="sm" onPress={() => this.goToCustomer(item)}>
              查看
            </Button>
          </View>
        </ActionInfo>
      )
    } else {
      return role.roleCode !== 'rolePartnerSale' ? (
        <ActionInfo>
          {/* <View style={{ borderRightWidth: 1, borderRightColor: colors.grey4, flex: 1 }}>
            <Button
              textStyle={{ color: colors.primary }}
              type="text"
              size="md"
              onPress={(event) => this.receive(event, item)}>
              领取
            </Button>
          </View> */}
          <View style={{ flex: 1 }}>
            <Button
              textStyle={{ color: colors.primary }}
              type="text"
              size="sm"
              onPress={(event) => this.distribute(event, item)}>
              分配
            </Button>
          </View>
        </ActionInfo>
      ) : (
        <ActionInfo>
          <View style={{ flex: 1 }}>
            <Button
              textStyle={{ color: colors.primary }}
              type="text"
              size="sm"
              onPress={(event) => this.receive(event, item)}>
              领取
            </Button>
          </View>
        </ActionInfo>
      )
    }
  }

  // 渲染客户来源
  renderSourceType(item) {
    const { hashData } = this.dictStore
    const { user_source1, user_source2 } = hashData

    if (!user_source1) return
    if (!user_source2) return
    const source1 = item.userSource1 ? user_source1[item.userSource1] : ''
    const source1Value = source1 ? source1.dictValue : ''
    const source2 = item.userSource2 ? user_source2[item.userSource2] : ''
    const source2Value = source2 ? source2.dictValue : ''
    const data = `${source1Value}-${source2Value}-${item.userSource3}`
    return data ? truncate(data, { length: 20 }) : ''
  }

  // 点击后选择分享的线索
  checkItem(item) {
    const { list } = this.state
    // 如果已打勾则是取消
    if (item.checked) {
      item.checked = !item.checked
      this.shareList = filter(list, (i) => i.checked)
    } else {
      this.shareList = filter(list, (i) => i.checked)
      if (this.shareList.length >= 10) {
        return Tip.show('当前选择线索已超过10个！', 1000, 'center')
      }
      // 添加数据
      this.shareList.push(item)
      item.checked = !item.checked
    }
    setShareClues(this.shareList)
    this.setState({ list })
  }

  render() {
    const { hashData } = this.dictStore
    const { user_source1, user_source2 } = hashData
    const { showShareIcon, isGet, toggleClueIndex, clueDetailConfig, followClue, followClueConfig } = this.state
    const { user } = this.store

    return (
      <View style={{ backgroundColor: colors.grey5, flex: 1 }}>
        <Tab
          value={this.state.isGet}
          style={{ height: 42 }}
          dataItemContainerStyle={{ height: 40 }}
          data={clueTabData}
          onChange={(item) => this.touchTab(item.value)}
          activeColor={variables.mtdBrandPrimaryDark}
        />
        {isGet === 1 ? null : (
          <Tab
            value={this.state.clueType}
            style={{ height: 42, borderTopWidth: 1, borderTopColor: '#D3D3D3' }}
            dataItemContainerStyle={{ height: 40 }}
            data={this.state.tabOptions}
            onChange={(item) => this.changeClueType(item.value)}
            activeColor={variables.mtdBrandPrimaryDark}
          />
        )}

        <View style={{ paddingTop: 12, paddingBottom: 12, flex: 1 }}>
          <Longlist
            ref={(c) => (this._longlist = c)}
            data={this.state.list}
            total={this.state.total}
            renderItem={({ item, index }) => {
              return (
                <ListWrapper>
                  <ListItem>
                    <ListInfo>
                      <TouchableOpacity onPress={() => this.tapClueCell(item, index)}>
                        <UserInfo>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginRight: 10,
                              height: 35,
                              alignItems: 'center'
                            }}>
                            <View>
                              <Text style={{ fontSize: size.fontsizeMd }}>{item.customerName}</Text>
                            </View>
                            <Sex data={item.sex} />
                            <View>
                              <Text style={{ fontSize: size.fontsizeMd }}>
                                {item.tel
                                  .substr(0, 3)
                                  .concat('****', item.tel.substr(item.tel.length - 4, item.tel.length))}
                              </Text>
                            </View>
                            <View>
                              <Text style={{ fontSize: size.fontsizeMd, marginLeft: 20 }}>{item.userName}</Text>
                            </View>
                          </View>
                          {showShareIcon && item.isGet && !item.isShare && item.clueType != 3 ? (
                            <View style={{ width: 40 }}>
                              <CheckBox
                                center
                                containerStyle={{ width: 40, height: 40 }}
                                checkedColor="#00CFB4"
                                onPress={() => this.checkItem(item)}
                                checked={item.checked}
                              />
                            </View>
                          ) : null}
                          {user.partner.accountGroupCode === 'Y009' && showShareIcon && item.isShare ? (
                            <ClueType>
                              <Text
                                style={{
                                  color: colors.grey3,
                                  fontSize: size.fontSizeSm,
                                  textAlign: 'center'
                                }}>
                                已分享
                              </Text>
                            </ClueType>
                          ) : null}
                          {user.partner.accountGroupCode !== 'Y009' && item.isShare ? (
                            <ClueType>
                              <Text
                                style={{
                                  color: colors.grey3,
                                  fontSize: size.fontSizeSm,
                                  textAlign: 'center'
                                }}>
                                分享
                              </Text>
                            </ClueType>
                          ) : null}
                        </UserInfo>
                        <OrderInfo>
                          <ClueType>
                            <Text
                              style={{
                                color: colors.grey3,
                                fontSize: size.fontSizeSm,
                                textAlign: 'center'
                              }}>
                              {clueType[item.clueType]}
                            </Text>
                          </ClueType>
                          {item.userSource1 ? (
                            <ClueType>
                              <Text
                                style={{
                                  color: colors.grey3,
                                  fontSize: size.fontSizeSm,
                                  textAlign: 'center'
                                }}>
                                来源:{this.renderSourceType(item)}
                              </Text>
                            </ClueType>
                          ) : null}

                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.grey3 }}>{item.intentModel}</Text>
                          </View>
                          <View style={{ width: 125 }}>{this.renderTime(item)}</View>
                        </OrderInfo>
                        {toggleClueIndex == index ? (
                          <ClueDetail>
                            {clueDetailConfig
                              .filter(
                                (configItem) =>
                                  !configItem.showOnlyNotNull ||
                                  (configItem.showOnlyNotNull &&
                                    (configItem.dict
                                      ? configItem.dict[item[configItem.key]]?.dictValue
                                      : item[configItem.key]))
                              )
                              .map((filterItem, filterIndex) => (
                                <ClueDetailCell key={filterIndex}>
                                  <Text style={{ flex: 1, lineHeight: 25, fontSize: 15 }}>{filterItem.label}</Text>
                                  <Text style={{ flex: 1, lineHeight: 25, fontSize: 15, textAlign: 'right' }}>
                                    {filterItem.dict
                                      ? filterItem.dict[item[filterItem.key]]?.dictValue
                                      : item[filterItem.key]}
                                  </Text>
                                </ClueDetailCell>
                              ))}
                            {followClue &&
                              followClueConfig.map((configItem, index) => (
                                <ClueDetailCell key={index}>
                                  <Text style={{ flex: 1, lineHeight: 25, fontSize: 15 }}>{configItem.label}</Text>
                                  <Text style={{ flex: 1, lineHeight: 25, fontSize: 15, textAlign: 'right' }}>
                                    {configItem.dict
                                      ? configItem.dict[followClue[configItem.key]]?.dictValue
                                      : followClue[configItem.key]}
                                  </Text>
                                </ClueDetailCell>
                              ))}
                          </ClueDetail>
                        ) : null}
                      </TouchableOpacity>
                      {this.renderDistribution(item)}
                    </ListInfo>
                  </ListItem>
                </ListWrapper>
              )
            }}
            // onEndReachedThreshold={0.05}
            onEndReached={() => this.refresh()}
            onRefresh={() => this.refresh(1)}
            // 必须 否则容易出问题
            // getItemLayout={(data, index) => {
            //   return { length: 125, offset: 125 * index, index }
            // }}
          />
          <Receive ref={(c) => (this.Receive = c)} refresh={() => this.refresh(1)} />
          <Distribution ref={(c) => (this.distribution = c)} refresh={() => this.refresh(1)} />
        </View>
        <SharePartner ref={(c) => setSharePartner(c)} refresh={() => this.refresh(1)} />
      </View>
    )
  }
}

export default Clues
