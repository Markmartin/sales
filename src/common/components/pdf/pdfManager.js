import React, { Component } from 'react'
import { Platform, NativeModules, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
// import RNPrint from 'react-native-print'
import Pdf from 'react-native-pdf'
import DeleteImg from 'react-native-vector-icons/MaterialIcons'
import Printer from 'react-native-vector-icons/Feather'
import SlideIndicator from './slideIndicator'
import { _createWaterImages } from '../graphics/graphics'
import { Tip } from 'beeshell'
import * as Permission from '../permission/permission'

const x_with = 375
const x_height = 812
const { width, height } = Dimensions.get('window')
const { StatusBarManager } = NativeModules

/**
 *  显示PDF
 */
class DisplayPDFView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0, //当前第几页
      numberOfPages: 0 //pdf 共有几页
    }
    this.printerAction = this.printerAction.bind(this)
  }

  printerAction() {
    // RNPrint.print({ filePath: this.props.pdfPath }).then(res => {
    //     if (Platform.OS === 'android') return;
    //     if (res) {
    //         Tip.show('打印成功！', 1000, 'center');
    //     }else  {
    //         Tip.show('打印取消！', 1000, 'center');
    //     }
    // }).catch(error => {
    //     Tip.show(error, 1000, 'center');
    // });
  }

  render() {
    //const source = {
    //     uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', //pdf 路径
    //     cache: true, // 是否需要缓存，默认 false
    //     expiration: 0, // 缓存文件过期秒数，默认 0 为未过期
    //     method: 'GET', //默认 'GET'，请求 url 的方式
    //     headers: {} // 当 uri 是网址时的请求标头
    // };
    //const source = require('./test.pdf');  // ios only
    //const source = {uri:'file:///sdcard/test.pdf'};
    //const source = {uri:"data:application/pdf;base64,..."};
    const source = { uri: this.props.pdfPath }
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{this.props.title}</Text>
          <TouchableOpacity style={styles.deleteStyle} onPress={() => this.props.closeCallBack()}>
            <DeleteImg name="cancel" size={28} color="#FFF" light />
          </TouchableOpacity>
          <TouchableOpacity style={styles.printerStyle} onPress={this.printerAction}>
            <Printer name="printer" size={18} color="#FFF" light />
          </TouchableOpacity>
        </View>
        <Pdf
          source={source}
          fitWidth={false} //默认 false，若为 true 则不能将 fitWidth = true 与 scale 一起使用
          fitPolicy={0} //0:宽度对齐，1：高度对齐，2：适合两者（默认）
          page={1} //初始化第几页，1 开始
          scale={1} //页面加载出来 pdf 时的比例
          minScale={1} //最小模块
          maxScale={3} //最大模块
          onLoadComplete={(numberOfPages, filePath, width, height, tableContents) => {
            console.log(`number of pages: ${numberOfPages}`) //总页数
            console.log(`number of filePath: ${filePath}`) //本地返回的路径
            console.log(`number of width: `, JSON.stringify(width))
            console.log(`number of height: ${JSON.stringify(height)}`)
            console.log(`number of tableContents: ${tableContents}`)
          }}
          onPageChanged={(page, numberOfPages) => {
            this.setState({
              page: page,
              numberOfPages: numberOfPages
            })
            console.log(`current page: ${page}`) //返回当前页
            console.log(`current numberOfPages: ${numberOfPages}`) //返回总页面，其实在 onLoadComplete() 可以获取到
            //所以不建议在这里获取总页数，因为页面滑动就会触发
            // 更新滑动指示器
            if (this.indicator != null) {
              this.indicator.setCurrPage(page - 1)
            }
          }}
          onError={(error) => {
            console.log(error)
            this.props.closeCallBack()
          }}
          password="111" //pdf 密码，如果密码错误，会触发 onError() 并显示密码不正确或需要密码
          spacing={10} // 页面之间的间隔大小，默认为 10
          horizontal={true} //竖向
          activityIndicator={null}
          // activityIndi​​catorProps={{backgroundColor:'red'}} 文档里有这个属性，但是我看源码里面没有
          enablePaging={true} //在屏幕上只能显示一页
          enableAntialiasing={true} //在低分辨率屏幕上改进渲染，针对 Android 4.4 上可能会出现的一些问题
          enableRTL={false} //倒序滑动
          enableAnnotationRendering={true} //启用渲染注视，iOS 仅支持初始设置，不支持实时更改
          onLoadProgress={(number) => console.log(number)} //加载时回调，返回加载进度（0-1）
          onPageSingleTap={() => {
            console.log('页面被点击的时候回调')
          }}
          onScaleChanged={() => {
            console.log('页面缩放的时候回调')
          }}
          style={styles.pdf}
        />
        <View style={styles.indicatorStyle}>
          <SlideIndicator
            ref={(ref) => (this.indicator = ref)}
            count={this.state.numberOfPages}
            position={0}
            selectedColor="rgba(255, 255, 255, 1)"
            unselectColor="rgba(255, 255, 255, 0.5)"
          />
        </View>
      </View>
    )
  }
}

const isIphoneX = function() {
  return (height === x_height && width === x_with) || (height === x_with && width === x_height)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#3B3A3A'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: width,
    marginTop: Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : 0
  },
  titleStyle: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center'
  },
  pdf: {
    flex: 1,
    width: width,
    backgroundColor: '#3B3A3A'
  },
  deleteStyle: {
    width: 40,
    height: 40,
    left: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  printerStyle: {
    width: 40,
    height: 40,
    right: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicatorStyle: {
    height: 30,
    marginBottom: 25
  }
})

/**
 *  创建PDF
 */
const createPDF = async function(imagPathArr, fileName = 'protocol') {
  // 返回pdf文件路径
  return new Promise(async function(resolve, reject) {
    if (imagPathArr.length == 0) {
      reject('订单合同生成失败！')
      return
    }
    let html = ''
    imagPathArr.forEach((path) => {
      html += '<img src="' + path + '" alt="order_contract" width="1587" height="2245" >'
    })
    console.log(html)
    let options = {
      html: Platform.OS === 'android' ? imagPathArr.toString() : html,
      fileName: fileName,
      directory: 'Documents',
      width: 1587 * 0.8,
      height: 2245 * 0.8,
      backgroundColor: '#3B3A3A'
    }
    let file = await RNHTMLtoPDF.convert(options)
    if (file && file.filePath.length > 0) {
      resolve(file.filePath)
    } else {
      reject('生成PDF失败')
    }
  })
}

/***
 * 水印订单信息，生成订单的PDF
 * @param responseDic
 * @returns {Promise<Promise<*> | Promise<*>>}
 */
const createOrderContractPDF = async function(responseDic) {
  return new Promise(async function(resolve, reject) {
    // 判断是否有权限
    permissionJudgement()
      .then(() => {
        // 获取水印的图片路径
        _createWaterImages(responseDic).then((orderPathArr) => {
          // 创建PDF
          createPDF(orderPathArr, 'orderContractProtocol')
            .then((pdfPath) => {
              resolve(pdfPath)
            })
            .catch((err) => {
              reject(err)
            })
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 *  Android 读写权限判断
 *  iOS 不需要判断读写权限
 */
const permissionJudgement = function() {
  return new Promise(async function(resolve, reject) {
    // 判断平台 ios 不需要判断读写权限
    if (Platform.OS === 'ios') {
      resolve()
    } else {
      // 判断是否有权限
      let status = await Permission.CheckPermission()
      if (status) {
        resolve()
      } else {
        // 申请权限 - 返回string, 而非 bool
        let requestStatus = await Permission.RequestReadPermission()
        if (requestStatus === 'granted') {
          resolve()
        } else if (requestStatus === 'denied') {
          reject('申请权限被拒！')
        } else if (requestStatus === 'never_ask_again') {
          reject('申请权限永久被拒，请到设置中手动操作！')
        }
      }
    }
  })
}

export { DisplayPDFView, createPDF, isIphoneX, createOrderContractPDF }
