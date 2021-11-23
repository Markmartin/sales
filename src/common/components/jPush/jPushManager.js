import JPushModule from 'jpush-react-native'
import { Platform } from 'react-native'
import { navigate, navigateSubRoute } from '../../services/navigation'
import { remind, clear } from '../../services/home-bell'

/**
 *  初始化JPush
 *  确保该方法在 组件 componentDidMount 中被调用
 */

const JPush_Init = function() {
  JPushModule.initPush()
  if (Platform.OS === 'ios') {
    // 判断是否有权限
    JPushModule.hasPermission((has) => {
      // 如果没有权限，停止通知
      if (!has) JPushModule.stopPush()
    })
  } else if (Platform.OS === 'android') {
    // 新版本必需写回调函数
    // JPushModule.notifyJSDidLoad();
    JPushModule.notifyJSDidLoad((resultCode) => {
      if (resultCode === 0) {
      }
    })
  }
  // 接收自定义消息
  JPushModule.addReceiveCustomMsgListener((message) => {
    console.log(`custom msg:${JSON.stringify(message)}`)
    // resolve(message)
    // // 设置首页右上角的消息未读标识
    // remind()
    // // 记录接收到消息推送的状态
    // storage.save({ key: 'unReadMsg', data: true })
  })
  // // 接收推送通知
  JPushModule.addReceiveNotificationListener((message) => {
    console.log(`default msg:${JSON.stringify(message)}`)
    // resolve(message)
    // // 设置首页消息图片有未读消息的标识
    // remind()
    // // 记录接收到消息推送的状态
    // storage.save({ key: 'unReadMsg', data: true })
  })
  // 点击通知
  JPushModule.addReceiveOpenNotificationListener((message) => {
    console.log(`click msg:${JSON.stringify(message)}`)
    let extras = null
    if (Platform.OS === 'android') {
      extras = JSON.parse(message.extras)
    }

    if (Platform.OS === 'ios') {
      extras = message.extras
    }

    if (extras.routeName) {
      let { routeName, subRouteName, subParams } = extras
      subParams = JSON.parse(subParams)
      navigateSubRoute(routeName, {}, subRouteName, subParams)
    }
    // resolve(message)
    // // 可执行跳转操作，也可跳转原生页面
    // clear()
    // // 记录接收到消息推送的状态
    // storage.save({ key: 'unReadMsg', data: false })
    // // 跳转消息列表
    // // navigation.navigate("HomeSystemMsgList");
  })
}

// const JPush_Init = function() {
//   return new Promise(function(resolve, reject) {
//     // 初始化JPush
//     JPushModule.initPush()
//     if (Platform.OS === 'ios') {
//       // 判断是否有权限
//       JPushModule.hasPermission((has) => {
//         // 如果没有权限，停止通知
//         if (!has) JPushModule.stopPush()
//       })
//     } else if (Platform.OS === 'android') {
//       // 新版本必需写回调函数
//       // JPushModule.notifyJSDidLoad();
//       JPushModule.notifyJSDidLoad((resultCode) => {
//         if (resultCode === 0) {
//         }
//       })
//     }
//     // 接收自定义消息
//     // JPushModule.addReceiveCustomMsgListener((message) => {
//     //   resolve(message)
//     //   // 设置首页右上角的消息未读标识
//     //   remind()
//     //   // 记录接收到消息推送的状态
//     //   storage.save({ key: 'unReadMsg', data: true })
//     // })
//     // // 接收推送通知
//     // JPushModule.addReceiveNotificationListener((message) => {
//     //   resolve(message)
//     //   // 设置首页消息图片有未读消息的标识
//     //   remind()
//     //   // 记录接收到消息推送的状态
//     //   storage.save({ key: 'unReadMsg', data: true })
//     // })
//     // 点击通知
//     JPushModule.addReceiveOpenNotificationListener((message) => {
//       console.log('Opening notification!')
//       console.log('map: ' + message)
//       resolve(message)
//       // 可执行跳转操作，也可跳转原生页面
//       clear()
//       // 记录接收到消息推送的状态
//       storage.save({ key: 'unReadMsg', data: false })
//       // 跳转消息列表
//       // navigation.navigate("HomeSystemMsgList");
//     })
//   })
// }

/**
 *  设置AppBadge
 */
const JPush_setAppBadge = function(badge) {
  JPushModule.setBadge(badge, (success) => {})
}

/**
 *  获取AppBadge
 */
const JPush_getAppBadge = function() {
  return new Promise(function(resolve) {
    JPushModule.getBadge((badge) => {
      resolve(badge)
    })
  })
}

/**
 *  设置别名(会清除之前已注册的别名)
 */
const JPush_setAlias = function(alias) {
  return new Promise(function(resolve, reject) {
    // 设置别名
    JPushModule.setAlias(
      alias,
      (result) => {
        resolve(result.tags)
      },
      (result) => {
        reject(result.errorCode)
      }
    )
  })
}

/**
 *  重新设置tags
 */
const JPush_setTags = function(tags) {
  return new Promise(function(resolve, reject) {
    JPushModule.setTags(
      tags,
      (result) => {
        resolve(result.tags)
      },
      (result) => {
        reject(result.errorCode)
      }
    )
  })
}

/**
 *  重新设置单个tag
 */
const JPush_setSingleTag = function(tag) {
  return new Promise(function(resolve, reject) {
    JPushModule.setTags(
      [tag],
      (result) => {
        resolve(result.tags)
      },
      (result) => {
        reject(result.errorCode)
      }
    )
  })
}

/**
 *  同时注册 alias 和 tag
 */
const JPush_setAliasAndTags = function(alias, tags) {
  // 设置alias
  JPushModule.setAlias(alias, (result) => {
    console.warn(result)
  })
  // 设置tags
  JPushModule.setTags(tags, (result) => {
    console.warn(result)
  })
}

/**
 *  获取应用是否有推送权限
 */
const JPush_hasPermission_iosOnly = function() {
  JPushModule.hasPermission((has) => {
    // 如果没有权限，停止通知
    if (!has) JPushModule.stopPush()
  })
}

/**
 *  获取连接状态
 */
const JPush_getConnectionState = function() {
  return new Promise(async function(resolve, reject) {
    JPushModule.getConnectionState((has) => {
      has ? resolve(has) : reject(has)
    })
  })
}

/**
 *  删除所有的tags
 */
const JPush_deleteAllTags = function() {
  return new Promise(async function(resolve, reject) {
    JPushModule.cleanTags(
      (result) => {
        resolve(result.tags)
      },
      (result) => {
        reject(result.errorCode)
      }
    )
  })
}

/**
 *  删除原有的alias(别名)
 */
const JPush_deleteAllAlias = function() {
  return new Promise(async function(resolve, reject) {
    JPushModule.deleteAlias()
  })
}

/**
 *  移除所有的通知
 */
const JPush_clearAllNotifications = function() {
  JPushModule.clearAllNotifications()
}

export {
  JPush_Init,
  JPush_setAppBadge,
  JPush_getAppBadge,
  JPush_setAlias,
  JPush_setTags,
  JPush_setSingleTag,
  JPush_hasPermission_iosOnly,
  JPush_deleteAllTags,
  JPush_setAliasAndTags,
  JPush_getConnectionState
}
