/**
 * 服务用来注册ajax请求服务
 * 服务启动后注册在全局属性里
 * 服务会自动添加请求连接，其他属性依照axios不变 https://github.com/axios/axios
 * 因为storage是异步取值，因此通过静态方法设置token
 * @format
 */
import axios from 'axios'
import { Alert } from 'react-native'
import { Tip } from 'beeshell'
import navigation from './navigation'
import { isString, replace } from 'lodash'
import { Loading } from '../components/loading'

let token = null
let roleCode = null

//生产环境
let baseURL = 'https://pmssat.ai-ways.com'
//预生产环境
// let baseURL = 'http://pmsstage.ai-ways.com/dms-admin-api'
// let baseURL = 'http://10.64.5.15:9080'

// 不需要提示的API
const noErrorShow = {
  '/admin/customer/getCustomerByPhone': true
}

const http = axios.create({ baseURL: baseURL })
// 设置token
const setHeaders = (t) => {
  if (t.token) token = t.token
  if (t.roleCode) roleCode = t.roleCode
}
// 添加请求拦截器 请求时自动传如token值到后台
http.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers['x-access-token'] = token
    }
    if (roleCode) {
      config.headers['roleCode'] = roleCode
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器 判断响应返回值 如果不成功直接弹出错误
http.interceptors.response.use(
  (res) => {
    // 确保加载效果关闭
    Loading.hidden()
    let { data, config } = res
    if (data.code !== 200) {
      console.warn('请求返回非200', data)
      // 后端服务在个别情况下回报201，待确认
      switch (data.code) {
        case 401:
          storage.remove({ key: 'token' })
          setTimeout(() => {
            navigation.navigate('Auth')
          }, 1000)
          break
        case 1000:
          storage.remove({ key: 'token' })
          setTimeout(() => {
            navigation.navigate('Auth')
          }, 1000)
          break

        default:
          if (isString(data.msg)) {
            const url = replace(config.url, config.baseURL, '')
            // 在不显示的范围中
            if (!noErrorShow[url]) {
              Tip.show(data.msg.substr(0, 80), 1500, true, 'center')
            }
          }
          // 非200的通过catch去取，这里返回
          return Promise.reject(data)
      }
    }
    return data
  },
  (error) => {
    console.warn(error)
    // 确保加载效果关闭
    Loading.hidden()
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

const formatResponse = (status, data = {}, message = '', others = {}) => {
  let response = {
    status,
    data
  }
  if (message !== '' && message !== undefined) {
    response.message = message
  }
  if (others != {}) {
    response.others = others
  }
  return response
}

const httpService = axios.create({
  baseURL: baseURL,
  // 指定请求超时的毫秒数
  timeout: 25000
})

const beforeSendRequest = (config) => {
  if (token) {
    config.headers['x-access-token'] = token
  }
  if (roleCode) {
    config.headers['roleCode'] = roleCode
  }
  return config
}

const sendRequestError = (error) => {
  return Promise.reject(formatResponse(false, error, error.message))
}

const receiveResponseSuccess = (response) => {
  const httpCodes = [200, 201]
  const codes = [200, 201]
  if (httpCodes.indexOf(response.status) !== -1) {
    if (codes.indexOf(response.data.code) !== -1) {
      return formatResponse(true, response.data.data, '', { headers: response.headers, request: response.request })
    }

    switch (response.data.code) {
      case 401:
        storage.remove({ key: 'token' })
        setTimeout(() => {
          navigation.navigate('Auth')
        }, 1000)
        break
      case 1000:
        storage.remove({ key: 'token' })
        setTimeout(() => {
          navigation.navigate('Auth')
        }, 1000)
        break
      default:
        break
    }
  }
  return formatResponse(false, response, response.data.msg || response.statusText)
}

// Do something with response error
const receiveResponseError = (error) => {
  const { response } = error
  if (response.data.code === 401 || response.data.code === 1000) {
    storage.remove({ key: 'token' })
    setTimeout(() => {
      navigation.navigate('Auth')
    }, 1000)
  }
  return Promise.reject(formatResponse(false, response, response.data.message || response.statusText))
}

httpService.interceptors.request.use(beforeSendRequest, sendRequestError)
httpService.interceptors.response.use(receiveResponseSuccess, receiveResponseError)

const baseRequest = async (params) => {
  let response
  try {
    response = await httpService(params)
  } catch (error) {
    response = error
  }
  if (response.status === false) {
    Tip.show((response.message || response.statusText).substr(0, 80), 1500, true, 'center')
  }
  return response
}

export { setHeaders, http, baseRequest }
