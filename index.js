/**
 * @format
 */

import { AppRegistry } from 'react-native'
// 引入美团组件变量文件
import variables from './src/style/beeshell'

import App from './src/App'
import { name as appName } from './app.json'

// 引入storage
import storage from './src/common/services/storage'
// 对于react native
global.storage = storage

// 引入axios
import { http, baseRequest } from './src/common/services/axios'
global.axios = http
global.baseRequest = baseRequest

// 引入moment
const moment = require('moment')
global.moment = moment

global.versionCode = 19
global.versionName = '1.2.9'

AppRegistry.registerComponent(appName, () => App)
