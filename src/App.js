import React from 'react'
import { Provider } from 'mobx-react'
import { AppState, Platform } from 'react-native'
// 导航服务
import { setTopLevelNavigator } from './common/services/navigation'

import AppContainer from './router'

// 引入store
import store from './store'
import { JPush_Init, JPush_setAppBadge, JPush_getAppBadge } from './common/components/jPush/jPushManager'
import { remind } from './common/services/home-bell'

// 初始化错误收集
import { init } from './common/services/sentry'
init()

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      badge: 0
    }
    this.handleAppStateChange = this._handleAppStateChange.bind(this)
  }

  componentDidMount() {
    // 监听app的状态
    // AppState.addEventListener('change', this.handleAppStateChange)
    // 初始化JPush
    JPush_Init()
    // JPush_Init().then((type) => {
    //   if (type === 'notification') {
    //     // 接收通知
    //   } else if (type === 'custom_notification') {
    //     // 接收自定义通知
    //   }
    //   let badge = this.state.badge + 1
    //   this.setState({
    //     badge: badge
    //   })
    //   JPush_setAppBadge(badge)
    // })
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this.handleAppStateChange)
  }

  // 处理app的状态变化
  _handleAppStateChange(nextAppState) {
    // 当消息badge不为0时，设置未读消息提醒
    JPush_getAppBadge().then((badge) => {
      if (badge > 0) {
        remind()
        // 清除app icon 的推送个数
        JPush_setAppBadge(0)
        this.setState({ badge: 0 })
      }
    })
  }

  render() {
    return (
      <Provider {...store}>
        <AppContainer
          ref={(navigatorRef) => {
            setTopLevelNavigator(navigatorRef)
          }}
        />
      </Provider>
    )
  }
}
