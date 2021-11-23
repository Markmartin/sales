// 古月
import axios from 'axios'
import jpush from 'jpush-react-native'

const httpService = axios.create({
  baseURL: 'https://device.jpush.cn/v3/'
})

const formatResponse = (status, data = {}, message = '', others = {}) => {
  return {
    status,
    data: data || {},
    message: message || '',
    others: others || {}
  }
}

// Do something before request is sent
const beforeSendRequest = (config) => {
  config.headers = {
    Authorization: 'Basic MDNlNmU5MWQzZWRhODY2MTU5OTYyMzQzOjAyNGE5ZTZiNjk3YjI4YjRmYTgyNGNhNg==',
    Accept: 'application/json'
  }
  return config
}

// Do something with request error
const sendRequestError = (error) => {
  return formatResponse(false, error, error.message)
}

// Do something with response data
const receiveResponseSuccess = (response) => {
  // http状态码
  const httpCodes = [200, 201]

  // http收到回复
  if (httpCodes.indexOf(response.status) !== -1) {
    // auth过期
    return formatResponse(true, response.data, '', { headers: response.headers, request: response.request })
  }
  return formatResponse(false, response, response.statusText)
}

// Do something with response error
const receiveResponseError = (error) => {
  const { response } = error
  return formatResponse(false, response, response.data.message || response.statusText)
}

httpService.interceptors.request.use(beforeSendRequest, sendRequestError)
httpService.interceptors.response.use(receiveResponseSuccess, receiveResponseError)

const pushRequest = async (params) => {
  let response
  try {
    response = await httpService(params)
  } catch (error) {
    response = error
  }

  return {
    ...response,
    status: response ? response.status : false
  }
}

export const checkAndBindJPush = async (alias, tag) => {
  const deveceId = await new Promise((resolve, reject) => {
    jpush.getRegistrationID((id) => resolve(id))
  })

  const aliasResp = await deleteAlias(alias)
  if (!aliasResp.status) {
    return formatResponse(false)
  }

  const bindResponse = await setDevice({ alias })
  return bindResponse

  // const queryResponse = await queryDevice()
  // if (queryResponse.status) {
  //   if (queryResponse.data.alias !== alias) {
  // const bindResponse = await setDevice({ alias })
  // return bindResponse
  //   }

  //   return queryResponse
  // }

  // return formatResponse(false)
}

// 查询别名的设备
export const queryAlias = async (alias) => {
  return await pushRequest({ method: 'get', url: `aliases/${alias}` })
}

// 删除别名
export const deleteAlias = async (alias) => {
  return await pushRequest({ method: 'delete', url: `aliases/${alias}` })
}

// 查询设备
export const queryDevice = async () => {
  const id = await new Promise((resolve, reject) => {
    jpush.getRegistrationID((id) => resolve(id))
  })
  return await pushRequest({ method: 'get', url: `devices/${id}` })
}

// 设置设备
export const setDevice = async (data) => {
  const id = await new Promise((resolve, reject) => {
    jpush.getRegistrationID((id) => resolve(id))
  })
  return await pushRequest({ method: 'post', url: `devices/${id}`, data })
}
