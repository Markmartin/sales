import {forEach, split, last} from "lodash";
import RNFetchBlob from 'rn-fetch-blob'
import userStore from '../../store/user'
import {Loading} from "../components/loading";

const getToken = data => {
	return axios.request({
		url: '/oss/getToken',
		data,
		method: 'post'
	})
}
let signature = ''
let callbackbody = ''
let key = ''
let expire = 0
let host = ''

// 获取后端返回的签名信息，生成oss参数
function oss(fileName = 'sss.jpg', subdir = userStore.user.partnerCode) {
	// 调用后端服务器接口获取签名信息，利用axios返回promise，可以链式调用
	return getToken({subdir}).then(({data}) => {
		signature = data['signature']
		expire = parseInt(data['expire'])
		callbackbody = data['callback']
		host = data['host']
		// 给Key添加文件名后缀
		key = data['key'] + last(split(fileName, '/'))
		// 返回表单上传需要的参数信息
		return {
			host,
			key,
			'policy': data['policy'],
			'OSSAccessKeyId': data['accessid'],
			signature,
			'success_action_status':200,
			filename:key
		}
	})
}

// 用来获取可用的文件地址，key为原先上传的返回的key，带有时间有效性
const getOssUrl = async function (key) {
	return axios.get('oss/getDownLoadUrl', {params: {key}}).then(({data}) => data)
}

// 上传OSS
const uploadOss = async function (file, partnerCode) {
	try {
		const ossData = await oss(file.path, partnerCode)

		// 上传图片
		let formData = new FormData()
		forEach(ossData, (value, key) => formData.append(key, value))
		let image = {uri: file.path, type: file.mime, name: ossData.key}
		formData.append('file', image)

		return  new Promise(function(resolve, reject){
			let request = new XMLHttpRequest();
			request.open("POST", ossData.host, true);
			request.onreadystatechange = function(status){
				if (request.readyState !== 4) {
					return;
				}
				if (request.status === 200) {
					resolve(`${ossData.host}/${ossData.key}`)
				} else {
					reject(status)
				}
			}
			request.send(formData)
		})
	} catch (e) {
		console.log(e)
	}
}

export {oss, uploadOss, getOssUrl}
