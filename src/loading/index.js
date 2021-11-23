import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Platform, Text, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import { LoadingWrapper, LoadingImage } from './style'
import RNSplashScreen from 'react-native-splash-screen'
import RNFetchBlob from 'rn-fetch-blob'
import storage from '../common/services/storage'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
import { JPush_setSingleTag } from '../common/components/jPush/jPushManager'

@inject(['userStore']) // 注入对应的store
export default class Loading extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.userStore
    this.userToken = null
    this.state = {
      resTime: 5,
      refPath: ''
    }
  }

  init = async () => {
    try {
      this.userToken = await storage.load({ key: 'token' })
      if (this) this.store.load()

      // // 存在userToken时，重新注册tag
      // let userCode = await storage.load({key: 'userCode'})
      // JPush_setSingleTag(userCode);
    } catch (err) {
      console.log(err)
    }
    // 倒计时5S
    let count = this.state.resTime
    this.timer = setInterval(() => {
      count--
      this.setState({
        resTime: count
      })
      if (count == 0) {
        this.props.navigation.navigate(this.userToken ? 'App' : 'Auth')
      }
    }, 1000)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  componentDidMount() {
    this.init()
    // 加载宣传动图路径
    storage
      .load({ key: 'keyCacheLoadIMG' })
      .then((imgPath) => {
        // 0.5秒后启动屏，隐藏
        setTimeout(() => RNSplashScreen.hide(), 500)
        this.setState({
          refPath: imgPath
        })
      })
      .catch(() => {
        // 0.5秒后启动屏，隐藏
        setTimeout(() => RNSplashScreen.hide(), 500)
        this.setState({
          refPath: ''
        })
      })

    this.getNewAffiche()
  }

  getNewAffiche = async () => {
    return axios
      .get('/admin/affiche/getNewAffiche', {
        params: {
          afficheType: 'sys_affiche'
        }
      })
      .then(({ data }) => {
        if (!data.picPath) return
        this.downloadImage(data.picPath)
        // 数据请求结果
      })
      .catch(({ data }) => {
        Tip.show(data.msg, 1000)
      })
  }

  // 下载宣传动图
  downloadImage = async (picPath) => {
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'gif'
    })
      .fetch('GET', picPath, {})
      .then((res) => {
        let imgPath = Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path()
        storage.save({ key: 'keyCacheLoadIMG', data: imgPath })
      })
  }

  render() {
    if (this.state.refPath) {
      return (
        <LoadingWrapper>
          <StatusBar translucent={true} backgroundColor="#000" barStyle={'light-content'} />
          <LoadingImage
            style={{ width: width, height: height, backgroundColor: '#fff' }}
            source={{ uri: this.state.refPath }}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 20, bottom: 60 }}
            onPress={() => {
              this.props.navigation.navigate(this.userToken ? 'App' : 'Auth')
            }}>
            <View
              style={{
                color: '#fff',
                backgroundColor: '#999',
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 6
              }}>
              <Text>跳过({this.state.resTime}S)</Text>
            </View>
          </TouchableOpacity>
        </LoadingWrapper>
      )
    } else {
      return (
        <LoadingWrapper>
          <StatusBar hidden={true} translucent={true} />
          <LoadingImage
            style={{ width: width, height: height, backgroundColor: '#fff' }}
            source={require('../assets/images/loading.jpg')}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 20, bottom: 60 }}
            onPress={() => {
              this.props.navigation.navigate(this.userToken ? 'App' : 'Auth')
            }}>
            <View
              style={{
                color: '#fff',
                backgroundColor: '#999',
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 6
              }}>
              <Text>跳过({this.state.resTime}S)</Text>
            </View>
          </TouchableOpacity>
        </LoadingWrapper>
      )
    }
  }
}
