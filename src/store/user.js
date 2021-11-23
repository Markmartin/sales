/**
 * 用户数据以及共享服务
 * 用户登录，权限、角色、退出封装
 * @format
 */
import { observable, action, configure, runInAction, computed } from 'mobx'
import { setHeaders } from '../common/services/axios'
import navigation from '../common/services/navigation'
import { Alert } from 'react-native'
import { Loading } from '../common/components/loading'
import { Platform } from 'react-native'

import { Sentry } from '../common/services/sentry'

import { checkAndBindJPush } from '../common/services/push'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' })

class User {
  @observable user // 注册变量，使其成为可检测的
  @observable role
  @observable cluesCount

  constructor() {
    this.user = null
    this.role = null
    this.cluesCount = 0
    this.lateFollowCount = 0
  }

  @computed get realName() {
    return this.user ? this.user.realName : ''
  }

  @action // 登陆
  login = async (user) => {
    console.log('执行登录')
    Loading.show()
    let params
    if (Platform.OS === 'ios' && user.userName === 'admin') {
      //admin登录，用作iOS上线审核
      params = user
    } else {
      params = { ...user, currSys: 'sat' }
    }

    let { code, data } = await axios.post('/com/login', params)
    Loading.hidden()
    if (code == 200) {
      runInAction(() => (this.user = data))

      // 如果用户多个角色，则去选择角色页面
      const { roleList } = this.user.subMap
      // 设置默认角色
      if (roleList.length === 0) {
        Alert.alert('提示', '当前用户未设置角色')
        this.loginOut()
        return
      }

      runInAction(() => {
        this.role = roleList[0]
      })
      setHeaders({
        token: data.token,
        roleCode: this.role.roleCode
      })
      // 存储数据
      storage.save({ key: 'token', data: data.token })
      storage.save({ key: 'user', data: data })
      storage.save({ key: 'userCode', data: data.userCode })
      storage.save({ key: 'role', data: this.role })
      Sentry.setUser(Object.assign(data, { username: data.accountNo }))
      Sentry.setExtra('roleCode', this.role.roleCode)

      navigation.navigate('SwitchRole', { title: '选择角色' })
    }
  }

  @action // 退出
  loginOut = () => {
    Loading.show()
    axios
      .post('/com/loginOut')
      .then(() => {
        Loading.hidden()
        setHeaders({
          token: null,
          roleCode: null
        })
        storage.remove({ key: 'token' })
        navigation.navigate('Auth')
      })
      .catch((error) => {
        Loading.hidden()
      })
  }

  @action // 从storage载入数据
  load = async () => {
    console.log('执行加载')
    const user = await storage.load({ key: 'user' })
    if (user) {
      runInAction(() => (this.user = user))
      Sentry.setUser(Object.assign(user, { username: user.accountNo }))

      const role = await storage.load({ key: 'role' })
      if (role) {
        runInAction(() => (this.role = role))
        setHeaders({
          token: this.user.token,
          roleCode: this.role.roleCode
        })
        Sentry.setExtra('roleCode', this.role.roleCode)
      }
    }
  }

  @action // 设置角色
  setRole = async (role) => {
    console.log('执行设置角色')
    runInAction(() => (this.role = role))
    storage.save({ key: 'role', data: this.role })
    setHeaders({
      roleCode: this.role.roleCode
    })
    Sentry.setExtra('roleCode', this.role.roleCode)

    const response = await checkAndBindJPush(this.user.userCode, this.role.roleCode)
    if (response.status) {
      console.log(response)
      console.log('绑定极光成功')
    }
  }

  @action // 设置线索数
  setData = (data) => (this[data.key] = data.value)
}

const userStore = new User()

export default userStore
