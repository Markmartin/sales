import React, { Component } from 'react'
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  Platform,
  Alert,
  Linking,
  BackHandler,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { inject } from 'mobx-react'
import { Form, Input, Button, Modal, Dialog } from 'beeshell'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import variables from '../style/beeshell'
import { LoginForm, ButtonWrapper } from './style'
import validate from './validator'
import { Loading } from '../common/components/loading'
import PrivacyContent from './privacy-content'
import ServicesContent from './services-content'
import RNExitApp from 'react-native-exit-app'
import { colors } from '../style/variables'

const loginImg = require('../assets/images/login.png')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

@inject(['userStore']) // 注入对应的store
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.userStore
    this.state = {
      user: {
        userName: '',
        password: ''
      },
      validateResults: {}
    }
  }

  // 生命周期挂载阶段
  componentDidMount() {
    storage.load({ key: 'userName' }).then((userName) => {
      this.setState({
        user: {
          ...this.state.user,
          userName
        }
      })
      this.handleChange('userName', userName)
    })

    // 是否显示弹窗
    storage.load({ key: 'agree' }).catch(() => {
      this._dialog.open()
    })
  }

  // 登陆处理
  async login() {
    // // 验证数据
    // let flag = false
    // for (let e in this.state.user) {
    //   const result = this.state.validateResults[e]
    //   // validateResults 不存在，则是未改变
    //   if (!result) {
    //     // 进行验证
    //     flag = true
    //     this.handleChange(e, this.state.user[e])
    //   }
    //   // 存在且valid 为false 返回
    //   if (result && !result.valid) {
    //     flag = true
    //   }
    // }
    // if (flag) return
    // 开始请求状态
    this.setState({ loading: true })
    // 本地保存登陆用户名
    storage.save({ key: 'userName', data: this.state.user.userName })
    // storage.save({ key: 'userName', data: this.state.user.userName }).finally(() => this.setState({ loading: false }))
    // 开始请求
    try {
      await this.store.login(this.state.user)
    } catch (e) {
      this.setState({ loading: false })
    }

    // this.setState({ loading: false })
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
        passwordType: true,
        validateResults: { ...prevState.validateResults, [key]: ret }
      }
    })
  }

  //登录前先检查更新
  checkUpdate() {
    Loading.show()
    axios
      .get('/admin/app/version/getNewVersion', {
        params: {
          type: 1,
          platform: Platform.OS
        }
      })
      .then(({ data }) => {
        Loading.hidden()
        if (data !== null) {
          if (data.versionCode > versionCode) {
            //有新版本
            let url = data.downUrl
            Alert.alert('检查更新', '发现新版本' + data.versionName, [
              {
                text: '稍后再说',
                onPress: () => {
                  BackHandler.exitApp()
                }
              },
              {
                text: '立即更新',
                onPress: () => {
                  Linking.canOpenURL(url)
                    .then((supported) => {
                      if (!supported) {
                        console.log("Can't handle url: " + url)
                      } else {
                        return Linking.openURL(url)
                      }
                    })
                    .catch((err) => console.error('An error occurred', err))
                }
              }
            ])
          } else {
            this.login()
          }
        }
      })
      .catch((data) => {
        Loading.hidden()
        this.login()
      })
  }

  render() {
    return (
      <ImageBackground source={loginImg} style={{ width: '100%', height: '100%', resizeMode: 'cover' }}>
        <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" translucent={false} />
        <KeyboardAwareScrollView
          style={{ backgroundColor: 'transparent', flex: 1 }}
          keyboardShouldPersistTaps="handled"
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid={true}
          scrollEnabled={true}>
          <LoginForm>
            <Form style={{ backgroundColor: 'transparent' }}>
              <Form.Item style={{ paddingVertical: 13 }} label="登录名/Login Name" labelWidth={300}>
                <View />
                <Input
                  testID="userName"
                  placeholder={''}
                  value={this.state.user.userName}
                  style={{
                    backgroundColor: 'transparent',
                    borderBottomWidth: 1,
                    borderBottomColor: '#47474e'
                  }}
                  onChange={(value) => {
                    this.handleChange('userName', value)
                  }}
                />
                {this.state.validateResults.userName && !this.state.validateResults.userName.valid ? (
                  <Text testID="userNameInfo" style={{ color: variables.mtdBrandDanger }}>
                    {this.state.validateResults.userName.msg}{' '}
                  </Text>
                ) : null}
              </Form.Item>
              <Form.Item style={{ paddingVertical: 13 }} labelWidth={300} label="密码/Password">
                <View />
                <Input
                  testID="password"
                  value={this.state.user.password}
                  style={{
                    backgroundColor: 'transparent',
                    borderBottomWidth: 1,
                    borderBottomColor: '#47474e'
                  }}
                  placeholder={''}
                  autoCapitalize="none"
                  secureTextEntry={this.state.passwordType}
                  clearButtonMode="never"
                  onChange={(value) => {
                    this.handleChange('password', value)
                  }}
                />
                {this.state.validateResults.password && !this.state.validateResults.password.valid ? (
                  <Text testID="passwordInfo" style={{ color: variables.mtdBrandDanger }}>
                    {this.state.validateResults.password.msg}{' '}
                  </Text>
                ) : null}
              </Form.Item>
            </Form>
            <ButtonWrapper>
              <Button
                style={{ backgroundColor: '#000' }}
                testID="submit"
                type="primary"
                disabled={this.state.loading}
                onPress={this.checkUpdate.bind(this)}>
                登录
              </Button>
            </ButtonWrapper>
            <ButtonWrapper style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.servicesModal.open()}>
                <Text style={{ textDecorationLine: 'underline', color: colors.info }}>服务协议</Text>
              </TouchableOpacity>
              <View style={{ marginLeft: 5, marginRight: 5 }}>
                <Text>|</Text>
              </View>
              <TouchableOpacity onPress={() => this._modal.open()}>
                <Text style={{ textDecorationLine: 'underline', color: colors.info }}>隐私政策</Text>
              </TouchableOpacity>
            </ButtonWrapper>
          </LoginForm>
        </KeyboardAwareScrollView>
        <Modal ref={(c) => (this._modal = c)} style={{ margin: 20 }} cancelable={true} scrollable>
          <View
            style={{
              padding: 10,
              backgroundColor: '#fff',
              borderRadius: 4
            }}>
            <PrivacyContent />
            <View style={{ marginTop: 10 }}>
              <Button type="default" onPress={() => this._modal.close()}>
                关闭
              </Button>
            </View>
          </View>
        </Modal>
        <Modal ref={(c) => (this.servicesModal = c)} style={{ margin: 20 }} cancelable={true} scrollable>
          <View
            style={{
              padding: 10,
              backgroundColor: '#fff',
              borderRadius: 4
            }}>
            <ServicesContent />
            <View style={{ marginTop: 10 }}>
              <Button type="default" onPress={() => this.servicesModal.close()}>
                关闭
              </Button>
            </View>
          </View>
        </Modal>
        <Dialog
          ref={(c) => {
            this._dialog = c
          }}
          cancelable={false}
          title="服务协议和隐私政策"
          body={
            <View style={{ backgroundColor: '#fff', padding: 20 }}>
              <View>
                <Text style={{ lineHeight: 21 }}>
                  请您务必审慎阅读、充分理解各条款内容，特别是"服务协议"和"隐私条款"，包括但不限于为了向您提供内容分享等服务，我们需要收集您的设备信息，操作日志等个人信息。
                </Text>
              </View>
              <View style={{ flexDirection: 'row', lineHeight: 20, marginTop: 10, flexWrap: 'wrap' }}>
                <Text>请阅读</Text>
                <TouchableOpacity onPress={() => this.servicesModal.open()}>
                  <Text style={{ color: colors.success }}>《服务协议》</Text>
                </TouchableOpacity>
                <Text>和</Text>
                <TouchableOpacity onPress={() => this._modal.open()}>
                  <Text style={{ color: colors.success }}>《隐私政策》</Text>
                </TouchableOpacity>
                <Text style={{ lineHeight: 21 }}>了解详细信息，如您同意，点击开始接受我们的服务。</Text>
              </View>
            </View>
          }
          confirmLabelTextStyle={{ paddingBottom: 10 }}
          cancelLabelTextStyle={{ paddingBottom: 10 }}
          cancelLabelText="暂不使用"
          cancelCallback={() => RNExitApp.exitApp()}
          confirmLabelText="同意"
          confirmCallback={() => {
            storage.save({ key: 'agree', data: 'yes' })
          }}
        />
      </ImageBackground>
    )
  }
}
