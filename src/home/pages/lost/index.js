import React, { Component } from 'react'
import { ActivityIndicator, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'

import { LostBG } from './styles'
import { Modal, Tip, Longlist, Tab, Button, Dropdown, TopviewGetInstance } from 'beeshell'
import { colors, size } from '../../../style/variables'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Divider } from 'react-native-elements'
import ListPicker from './listPicker'
import navigation from '../../../common/services/navigation'
import { inject } from 'mobx-react'
import userStore from '../../../store/user'
import { orderBy, cloneDeep } from 'lodash'
import { level, lostReason } from '../../../common/tool/dictionaries'
import PhoneCall from '../../../common/components/phone-call'

const window = Dimensions.get('window')

@inject(['userStore']) // 注入对应的store
export default class Lost extends Component {
  //---- 生命周期方法--------
  constructor(props) {
    super(props)
    this.store = this.props.userStore
    this.state = {
      lostState: 0, // 战状态 待审批1 已审批2
      applyCount: 0, // 申请次数  0 全部申请 1 首次申请 2 再次申请
      levelASC: false, // 级别正序
      timeASC: false, // 时间正序
      pageNum: 1,
      list: [],
      total: 0,
      clueListId: null
    }
    this.refresh = this.refresh.bind(this)
    this.getListSaler = this.getListSaler.bind(this)
  }

  componentDidMount(): void {
    this.refresh(1)
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevState.lostState != this.state.lostState || prevState.applyCount != this.state.applyCount) {
      this.refresh(1)
    }
  }
  // 加载数据
  refresh(num) {
    // 如果明确传入参数，则是刷新或者首次加载
    let pageNum
    let applyCount
    let isFirstApply
    let isApplyAgain
    if (num) {
      pageNum = 1
    } else {
      // 没有明确参数是下拉刷新
      pageNum = this.state.pageNum + 1
    }
    if (this.state.applyCount === 0) {
      applyCount = null
      isFirstApply = null
      isApplyAgain = null
    } else if (this.state.applyCount === 1) {
      isFirstApply = 1
      isApplyAgain = null
      applyCount = this.state.applyCount
    } else if (this.state.applyCount === 2) {
      isFirstApply = null
      isApplyAgain = 1
      applyCount = this.state.applyCount
    }
    // 请求数据
    // 清空上拉方法禁止拉动
    this.tip.open()
    return axios
      .get('/admin/satLostApply/page', {
        params: {
          pageNum,
          pageSize: 20,
          // applyOrderStatus:2,
          applyCount: applyCount,
          isFirstApply: isFirstApply,
          isApplyAgain: isApplyAgain,
          isProcess: this.state.lostState
        }
      })
      .then(({ data }) => {
        this.tip.close('refresh')
        console.log('refresh')
        // 判断如果是刷新则清空数据
        this.setState((prevState) => {
          console.log('totalLength:' + data.list.length)
          let oldList = pageNum === 1 ? [] : prevState.list
          return {
            pageNum,
            list: [...oldList, ...data.list],
            total: data.total
          }
        })
      })
      .catch(() => {
        this.tip.close()
      })
  }

  // 战败分配获取 销售顾问列表
  getListSaler(applyId) {
    this.tip.open()
    return axios
      .get('/admin/staff/listSaler', {
        params: {
          partnerCode: this.store.user.partner.partnerCode
        }
      })
      .then(({ data }) => {
        this.tip.close()
        // 数据请求结果
        this.showDispatchList(data, applyId)
      })
      .catch(({ data }) => {
        this.tip.close()
        Tip.show(data.msg, 1000, 'center')
      })
  }

  // 分配
  dispatchSaler(accountNo, applyId) {
    if (accountNo == null || accountNo.length == 0) {
      Tip.show('请选择分配人员', 1000, 'center')
      return
    }
    this.tip.open()
    return axios
      .post('/admin/satLostApply/dispatch', {
        getUser: accountNo,
        applyIdList: [applyId]
      })
      .then(() => {
        this.tip.close()
        Tip.show('分配成功', 1000, 'center')
        //分配成功后，刷新页面数据
        this.refresh(1)
      })
      .catch(({ data }) => {
        this.tip.close()
        Tip.show(data.msg, 1000, 'center')
      })
  }

  // 同意战败
  agreeLost(applyId) {
    this.tip.open()
    return axios
      .post('/admin/satLostApply/agree', {
        applyIdList: [applyId]
      })
      .then(({ data }) => {
        // 同意战败后，刷新页面数据
        this.tip.close()
        Tip.show('战败成功', 1000, 'center')
        this.refresh(1)
      })
      .catch(() => {
        this.tip.close()
        Tip.show(data.msg, 1000, 'center')
      })
  }

  // 总经理战败
  magreeLost(applyId) {
    this.tip.open()
    return axios
      .post('/admin/satLostApply/mAgree', {
        applyId: applyId
      })
      .then(({ data }) => {
        // 同意战败后，刷新页面数据
        this.tip.close()
        Tip.show('战败成功', 1000, 'center')
        this.refresh(1)
      })
      .catch(() => {
        this.tip.close()
        Tip.show(data.msg, 1000, 'center')
      })
  }

  // 总经理驳回
  mRejectLost(applyId) {
    this.tip.open()
    return axios
      .post('/admin/satLostApply/mReject', {
        applyId: applyId
      })
      .then(({ data }) => {
        // 同意战败后，刷新页面数据
        this.tip.close()
        Tip.show('驳回成功', 1000, 'center')
        this.refresh(1)
      })
      .catch(() => {
        this.tip.close()
        Tip.show(data.msg, 1000, 'center')
      })
  }

  // 根据基本排序
  sortLevel() {
    let data = cloneDeep(this.state.list)
    // 因为是先排序后改变 levelASC 所以要取反
    let type = this.state.levelASC ? 'desc' : 'asc'
    this.setState({
      list: orderBy(data, ['level'], [type]),
      levelASC: !this.state.levelASC
    })
  }

  // 根据申请时间排序
  sortTime() {
    let data = cloneDeep(this.state.list)
    // 因为是先排序后改变 levelASC 所以要取反
    let type = this.state.timeASC ? 'desc' : 'asc'
    this.setState({
      list: orderBy(data, ['applyTime'], [type]),
      timeASC: !this.state.timeASC
    })
  }

  // 根据申请次数，返回显示字符串
  stringForApplyCount(applyCount) {
    if (applyCount === 0) {
      return '全部申请'
    } else if (applyCount === 1) {
      return '首次申请'
    } else if (applyCount === 2) {
      return '再次申请'
    } else {
      return applyCount
    }
  }

  render() {
    return (
      <LostBG>
        {/*加载指示器*/}
        <Tip
          ref={(c) => {
            this.tip = c
          }}
          body={
            <View>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          }
          cancelable={true}
        />
        <Tab
          ref={(c) => {
            this.tab = c
          }}
          value={this.state.lostState}
          data={[{ value: 0, label: '待审批' }, { value: 1, label: '已处理' }]}
          dataContainerStyle={styles.tab}
          activeColor={'#37C1B4'}
          onChange={(item) => {
            this.setState({
              lostState: item.value
            })
          }}
        />
        <View style={styles.menuTab}>
          <Button
            style={{ flex: 1 }}
            type="text"
            size="sm"
            ref={(element) => {
              this.btnEl2 = element
            }}
            onPress={() => {
              this.btnEl2.measure((fx, fy, width, height, px, py) => {
                this.setState({
                  offsetX2: px,
                  offsetY2: py + height
                })
                this.dropdownModel.open()
              })
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuTitle}>{this.stringForApplyCount(this.state.applyCount)}</Text>
              <Feather name="chevron-down" size={14} color="#969799" />
            </View>
          </Button>
          <Dropdown
            style={{ width: window.width, height: 160 }}
            offsetX={0}
            offsetY={this.state.offsetY2}
            cancelable={true}
            value={this.state.applyCount}
            data={[{ label: '全部申请', value: 0 }, { label: '首次申请', value: 1 }, { label: '再次申请', value: 2 }]}
            ref={(c) => {
              this.dropdownModel = c
            }}
            onChange={(value) => {
              console.log('Dropdown')
              this.setState({
                applyCount: value
              })
            }}
          />
          <Divider style={styles.menuDivider} />
          <Button onPress={this.sortLevel.bind(this)} style={{ flex: 1 }} type="text" size="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuTitle}>级别</Text>
              <Feather name={this.state.levelASC ? 'arrow-up' : 'arrow-down'} size={14} color="#969799" />
            </View>
          </Button>
          <Divider style={styles.menuDivider} />
          <Button onPress={this.sortTime.bind(this)} style={{ flex: 1 }} type="text" size="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuTitle}>申请时间</Text>
              <Feather name={this.state.timeASC ? 'arrow-up' : 'arrow-down'} size={14} color="#969799" />
            </View>
          </Button>
        </View>
        <Longlist
          data={this.state.list}
          total={this.state.total}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            // 3是已战败
            if (this.state.lostState == 1) {
              return <LostListHandledCell data={item} />
            } else if (this.state.lostState == 0) {
              return (
                <LostListWaitHandleCell
                  data={item}
                  dispatchOnPress={() => {
                    // 分配
                    if (item.applyOrderStatus == 1) {
                      this.getListSaler(item.applyId)
                    } else if (item.applyOrderStatus == 2) {
                      this.mRejectLost(item.applyId)
                    }
                  }}
                  agreeLostOnPress={() => {
                    // 同意战败
                    if (item.applyOrderStatus == 1) {
                      this.agreeLost(item.applyId)
                    } else if (item.applyOrderStatus == 2) {
                      this.magreeLost(item.applyId)
                    }
                  }}
                />
              )
            } else {
              return <View />
            }
          }}
          onEndReachedThreshold={0.05}
          onRefresh={() => this.refresh(1)}
          onEndReached={() => this.refresh()}
        />
      </LostBG>
    )
  }
  // 显示分配列表
  showDispatchList(list, applyId) {
    TopviewGetInstance()
      .add(
        <ListPicker
          title="线索分配"
          onPress={(isCancel, item) => {
            this.dismissDispatchList()
            if (!isCancel) {
              this.dispatchSaler(item.accountNo, applyId)
            }
          }}
          data={list}
        />
      )
      .then((id) => {
        console.log('TopviewGetInstance')
        this.setState({
          clueListId: id
        })
      })
  }
  // 隐藏分配列表
  dismissDispatchList() {
    TopviewGetInstance().remove(this.state.clueListId)
  }
}

// 未处理列表项
class LostListWaitHandleCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  // 接受到新属性更新
  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.props.data) {
      this.setState({
        data: nextProps.data
      })
    }
  }

  stringForKey(dict, key) {
    if (!key) return ''
    let obj = { dictValue: '' }
    dict.filter((item) => {
      if (item.dictKey === key) obj = item
    })
    return obj.dictValue
  }

  // 根据申请次数，返回显示字符串
  stringForApplyCount(applyCount) {
    if (applyCount === 0) {
      return '全部申请'
    } else if (applyCount === 1) {
      return '首次申请'
    } else if (applyCount === 2) {
      return '再次申请'
    } else {
      return applyCount
    }
  }

  render() {
    const item = this.state.data
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LostDetail', { applyId: item.applyId })
          }}>
          <View style={{ flex: 1, paddingTop: 16, paddingRight: 16, paddingLeft: 16, paddingBottom: 4 }}>
            <View style={styles.cellTextRow}>
              <Text style={styles.defaultText}>品鉴顾问：{item.applyUserName}</Text>
              <Text style={styles.defaultText}>{item.applyTime}</Text>
            </View>
            <View style={styles.cellTextRow}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.defaultText}>申请次数:</Text>
                <Text style={{ color: item.applyCount > 1 ? '#f00' : '#99999A' }}>
                  {this.stringForApplyCount(item.applyCount)}
                </Text>
              </View>
              <Text style={styles.defaultText}>申请原因:{this.stringForKey(lostReason, item.lostReason)}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.defaultText}>详情</Text>
                <Feather name={'chevron-right'} size={14} color="#969799" />
              </View>
            </View>
          </View>
          <Divider style={styles.cellTextRowDivider} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ paddingTop: 16, paddingRight: 16, paddingLeft: 16, paddingBottom: 4 }}>
              <View style={styles.cellTextRow}>
                <Text style={{ fontWeight: '500', color: '#323233', fontSize: 16 }}>{item.name}</Text>
                <FontAwesome style={{ marginRight: 14, marginLeft: 14 }} name={'mars'} size={16} color={'#4296F4'} />
                <PhoneCall style={{ fontWeight: '500', color: '#323233', fontSize: 16 }} phone={item.phone} />
              </View>
              <View style={styles.cellTextRow}>
                <Text style={{ color: '#666', fontSize: 14 }}>{this.stringForKey(level, item.level)}</Text>
                <Text style={{ color: '#666', fontSize: 14, marginLeft: 12 }}>{item.productName}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {this.renderOperateView(item)}
        <Divider style={{ height: 10, backgroundColor: '#eff3f6' }} />
      </View>
    )
  }

  renderOperateView(item) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          style={{ flex: 1, borderRadius: 0 }}
          onPress={() => {
            this.lostAgreeAlert.open()
          }}>
          <Text style={{ color: '#37C1B4', fontSize: 15 }}>战败</Text>
        </Button>
        {this.renderLostAlert()}
        <Button
          style={{ flex: 1, borderRadius: 0 }}
          onPress={() => {
            this.props.dispatchOnPress()
          }}>
          <Text style={{ color: '#37C1B4', fontSize: 15 }}>{item.applyOrderStatus == 1 ? '分配' : '驳回'}</Text>
        </Button>
      </View>
    )
    // if (item.applyCount >= 2) {
    //   return (
    //     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    //       <Button
    //         style={{ flex: 1, borderRadius: 0 }}
    //         onPress={() => {
    //           this.lostAgreeAlert.open()
    //         }}>
    //         <Text style={{ color: '#37C1B4', fontSize: 15 }}>战败</Text>
    //       </Button>
    //       {this.renderLostAlert()}
    //       <Button
    //         style={{ flex: 1, borderRadius: 0 }}
    //         onPress={() => {
    //           this.props.dispatchOnPress()
    //         }}>
    //         <Text style={{ color: '#37C1B4', fontSize: 15 }}>{item.applyOrderStatus == 1 ? '分配' : '驳回'}</Text>
    //       </Button>
    //     </View>
    //   )
    // } else {
    //   return (
    //     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    //       <Button
    //         style={{ flex: 1, borderRadius: 0 }}
    //         onPress={() => {
    //           this.props.dispatchOnPress()
    //         }}>
    //         <Text style={{ color: '#37C1B4', fontSize: 15 }}>分配</Text>
    //       </Button>
    //     </View>
    //   )
    // }
  }

  // 战败确认弹出框
  renderLostAlert() {
    return (
      <Modal
        ref={(c) => {
          this.lostAgreeAlert = c
        }}
        cancelable={false}>
        <View
          style={{
            width: 270,
            height: 140,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12
          }}>
          <Text style={{ padding: 20, fontSize: 17, fontWeight: 'bold' }}>战败</Text>
          <Text style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>是否确定将客户置为战败？</Text>
          <View style={{ height: 48, flex: 1, flexDirection: 'row' }}>
            <Button
              style={{ flex: 1, borderRadius: 0, borderBottomLeftRadius: 12 }}
              onPress={() => {
                this.lostAgreeAlert.close()
              }}>
              <Text style={{ color: '#37C1B4', fontSize: 15 }}>取消</Text>
            </Button>
            <Button
              style={{ flex: 1, borderRadius: 0, borderBottomRightRadius: 12 }}
              onPress={() => {
                this.lostAgreeAlert.close()
                /* 方法回调，通过属性传递给父组件 */
                this.props.agreeLostOnPress()
              }}>
              <Text style={{ color: '#37C1B4', fontSize: 15 }}>确定</Text>
            </Button>
          </View>
        </View>
      </Modal>
    )
  }
}

// 已处理列表项
class LostListHandledCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  // 接受到新属性更新
  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.props.data) {
      this.setState({
        data: nextProps.data
      })
    }
  }

  stringForApplyOrderStatus(applyOrderStatus, assignUserName) {
    if (applyOrderStatus == 2) {
      return '已战败'
    } else if (applyOrderStatus == 3) {
      return '已分配给' + assignUserName
    }
    return null
  }

  colorForApplyOrderSatus(applyOrderStatus) {
    if (applyOrderStatus == 2) {
      return '#f00'
    } else if (applyOrderStatus == 3) {
      return '#37C1B4'
    } else {
      return '#fff'
    }
  }
  // 根据申请次数，返回显示字符串
  stringForApplyCount(applyCount) {
    if (applyCount === 0) {
      return '全部申请'
    } else if (applyCount === 1) {
      return '首次申请'
    } else if (applyCount === 2) {
      return '再次申请'
    } else {
      return applyCount
    }
  }

  stringForKey(dict, key) {
    if (!key) return ''
    let obj = null
    dict.filter((item) => {
      if (item.dictKey === key) obj = item
    })
    return obj.dictValue
  }

  render() {
    const item = this.state.data
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LostDetail', { applyId: item.applyId })
          }}>
          <View style={{ flex: 1, paddingTop: 16, paddingRight: 16, paddingLeft: 16, paddingBottom: 4 }}>
            <View style={styles.cellTextRow}>
              <Text style={styles.defaultText}>品鉴顾问：{item.applyUserName}</Text>
              <Text style={styles.defaultText}>{item.applyTime}</Text>
            </View>
            <View style={styles.cellTextRow}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.defaultText}>申请次数:</Text>
                <Text style={{ color: item.applyCount > 1 ? '#f00' : '#99999A' }}>
                  {this.stringForApplyCount(item.applyCount)}
                </Text>
              </View>
              <Text style={styles.defaultText}>申请原因:{this.stringForKey(lostReason, item.lostReason)}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.defaultText}>详情</Text>
                <Feather name={'chevron-right'} size={14} color="#969799" />
              </View>
            </View>
          </View>
          <Divider style={styles.cellTextRowDivider} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ paddingTop: 16, paddingRight: 16, paddingLeft: 16, paddingBottom: 4 }}>
              <View style={styles.cellTextRow}>
                <Text style={{ fontWeight: '500', color: '#323233', fontSize: 16 }}>{item.name}</Text>
                <FontAwesome style={{ marginRight: 14, marginLeft: 14 }} name={'mars'} size={16} color={'#4296F4'} />
                <PhoneCall style={{ fontWeight: '500', color: '#323233', fontSize: 16 }} phone={item.phone} />
              </View>
              <View style={styles.cellTextRow}>
                <Text style={{ color: '#666', fontSize: 14 }}>{this.stringForKey(level, item.level)}</Text>
                <Text style={{ color: '#666', fontSize: 14, marginLeft: 12 }}>{item.productName}</Text>
              </View>
            </View>
            <View style={{ justifyContent: 'center', paddingRight: 16 }}>
              <View
                style={{
                  padding: 4,
                  borderRadius: 4,
                  backgroundColor: this.colorForApplyOrderSatus(item.applyOrderStatus)
                }}>
                <Text style={{ color: '#fff' }}>
                  {this.stringForApplyOrderStatus(item.applyOrderStatus, item.assignUserName)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <Divider style={{ height: 10, backgroundColor: '#eff3f6' }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tab: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey5
  },
  menuTab: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 36,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey5
  },
  menuTitle: {
    color: '#323233',
    marginRight: 5
  },
  menuDivider: {
    backgroundColor: colors.grey5,
    marginTop: 9,
    height: 18,
    width: 1
  },
  cellTextRow: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 12,
    justifyContent: 'space-between'
  },
  cellTextRowDivider: {
    height: 0.5,
    backgroundColor: '#eff3f6'
  },
  defaultText: {
    color: '#999',
    fontSize: 14
  }
})
