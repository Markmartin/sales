import React, { Component } from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import { colors } from '../style/variables'

import CluesInfo from './components/clues-info'
import MonthInfo from './components/month-info'
import TodoList from './components/todo-list'
import WorkBench from './components/work-bench'

import { inject } from 'mobx-react'
import { remind, setBell } from '../common/services/home-bell'
import HomeBell from '../common/components/home-bell'

import { checkAndBindJPush } from '../common/services/push'

@inject((stores) => ({
  userStore: stores.userStore,
  dictStore: stores.dictStore
}))
// @inject(['dictStore']) // 注入对应的store
export default class Home extends Component {
  static navigationOptions = {
    headerRight: <HomeBell ref={(c) => setBell(c)} />
  }

  constructor(props) {
    super(props)
    this.dictStore = this.props.dictStore
    this.userStore = this.props.userStore
  }

  async componentDidMount() {
    // 获取字典
    this.dictStore.setData()
    const userCode = this.userStore.user.userCode
    const roleCode = this.userStore.role.roleCode
    const response = await checkAndBindJPush(userCode, roleCode)
    if (response.status) {
      console.log(response)
      console.log('绑定极光成功')
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.grey5 }}>
        {/* 设置statusBar的整体样式 - 白色 */}
        <StatusBar backgroundColor={colors.primary} barStyle={'light-content'} translucent={false} />
        <ScrollView>
          <MonthInfo />
          <CluesInfo />
          <TodoList />
          <WorkBench />
        </ScrollView>
      </View>
    )
  }
}
