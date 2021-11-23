import React, { Component } from 'react'
import { Text, ImageBackground, View, TouchableOpacity } from 'react-native'
import { ListWrapper, TodoWrapper, TodoTitle, TodoInfo, BenchTitle, TodoView } from './style'
import navigation from '../../../common/services/navigation'
import { withNavigationFocus } from 'react-navigation'
// 月工作信息
const labelImg = require('../../../assets/images/label.png')
import { inject } from 'mobx-react'

@inject(['userStore']) // 注入对应的store
class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      waitFollowCount: 0,
      lateFollowCount: 0,
      oldCustomerFollowCount: 0,
      newCustomerCount: 0,
      gotWaitFollowCount: 0
    }
    // 标记状态
    this.reload = false
    this.store = this.props.userStore
  }

  // 获取焦点时刻
  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.isFocused) {
      // 如果reload了不再请求
      if (this.reload) return null
      axios.get('/admin/satCustomerFollow/followRemind').then(({ data }) => {
        this.setState({ ...data })
        this.store.setData({ key: 'lateFollowCount', value: data.lateFollowCount })
      })
      // 标记reload
      this.reload = true
    } else {
      this.reload = false
    }
    return null
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    const roles = ['rolePartnerManager', 'rolePartnerSaleManager', 'rolePartnerSale']
    const waitTestDrive = this.store.role.roleCode === 'rolePartnerSale' ? true : false
    const receivedBeFollowUp = false
    // const receivedBeFollowUp = roles.includes(this.store.role.roleCode)
    return (
      <TodoView>
        <BenchTitle>待办提醒</BenchTitle>
        <ListWrapper>
          <TodoWrapper>
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#effafb',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('TodayFollowUp')}>
                <TodoTitle>
                  {this.state.waitFollowCount}
                  <TodoInfo>位</TodoInfo>
                </TodoTitle>
                <View />
                <TodoInfo>今日待跟进</TodoInfo>
              </TouchableOpacity>
            </View>

            {receivedBeFollowUp && (
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: '#effafb',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 3
                }}>
                <TouchableOpacity onPress={() => navigation.navigate('ReceivedFollowUp')}>
                  <TodoTitle>
                    {this.state.gotWaitFollowCount}
                    <TodoInfo>位</TodoInfo>
                  </TodoTitle>
                  <View />
                  <TodoInfo>已领取待跟进</TodoInfo>
                </TouchableOpacity>
              </View>
            )}

            <ImageBackground
              source={labelImg}
              style={{ width: 42.5, height: 20, resizeMode: 'center', position: 'absolute', left: 0, top: 0 }}>
              <Text style={{ color: '#fff', paddingLeft: 5, fontSize: 12, paddingTop: 2 }}>重要</Text>
            </ImageBackground>
          </TodoWrapper>
          <TodoWrapper>
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#effafb',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('OldCustomers')}>
                <TodoTitle>
                  {this.state.oldCustomerFollowCount}
                  <TodoInfo>位</TodoInfo>
                </TodoTitle>
                <TodoInfo>老客户跟进</TodoInfo>
              </TouchableOpacity>
            </View>
            {waitTestDrive && (
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: '#effafb',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 3
                }}>
                <TouchableOpacity onPress={() => navigation.navigate('Driver')}>
                  <TodoTitle>
                    {this.state.todayTestDriveCount || 0}
                    <TodoInfo>位</TodoInfo>
                  </TodoTitle>
                  <TodoInfo>今日待试驾</TodoInfo>
                </TouchableOpacity>
              </View>
            )}
          </TodoWrapper>
          <TodoWrapper>
            <View style={{ width: '100%', flex: 1, marginBottom: 2, backgroundColor: '#effafb' }}>
              <TouchableOpacity onPress={() => navigation.navigate('TodayCustomers')}>
                <View style={{ height: 40 }}>
                  <TodoTitle style={{ marginTop: 3 }}>
                    {this.state.newCustomerCount}
                    <TodoInfo>位</TodoInfo>
                  </TodoTitle>
                </View>
                <TodoInfo>今日新增</TodoInfo>
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', flex: 1, backgroundColor: '#effafb' }}>
              <TouchableOpacity onPress={() => navigation.navigate('TimeoutCustomers')}>
                <View style={{ height: 40 }}>
                  <TodoTitle style={{ marginTop: 3 }}>
                    {this.state.lateFollowCount}
                    <TodoInfo>位</TodoInfo>
                  </TodoTitle>
                </View>
                <TodoInfo>逾期客户</TodoInfo>
              </TouchableOpacity>
            </View>
          </TodoWrapper>
        </ListWrapper>
      </TodoView>
    )
  }
}

export default withNavigationFocus(TodoList)
