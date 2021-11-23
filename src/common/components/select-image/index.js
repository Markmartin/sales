/**
 * @description 单张照片拍照上传阿里云组件
 * @param {callBack} 上传成功的回调，更新父组件数据
 */

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image, StyleSheet, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/dist/Feather';
import {oss, uploadOss, getOssUrl} from "../../services/oss";

export default class SelectImage extends Component {
	constructor(p) {
		super(p)
		this.state = {
			image: '', // 返回的图片信息
			url: ''    // 阿里云OSS url
		}
	}

	// 选择本地相册上传
	async selectimage() {
		try {
			const image = await ImagePicker.openPicker({compressImageMaxWidth: 1980})
			this.setState({image})
			const fileUrl = await uploadOss(image)
			// 回传callback
			if (!this.props.callBack) return
			this.props.callBack(fileUrl)
		} catch (e) {
			console.warn(e)
		}
	}

	render() {
		const {image} = this.state
		if (image === '') {
			return (
				<TouchableOpacity style={{width: 100, height: 133}} onPress={this.selectimage.bind(this)}>
					<View style={{width: 100, height: 133, paddingTop: 40}}>
						<Icon
							name='camera'
							size={35}
							color='#bbb' light style={{alignSelf: 'center'}}/>
						<Text style={styles.textStyle}>{this.props.description}</Text>
					</View>
				</TouchableOpacity>
			)
		} else {
			return (
				<TouchableOpacity style={{width: 100, height: 133}} onPress={this.selectimage.bind(this)}>
					<Image source={{uri: this.state.image.path, width: 100, height: 133}}/>
				</TouchableOpacity>
			)
		}

	}
}
const styles = StyleSheet.create({
	textStyle: {fontSize: 12, alignSelf: 'center', color: '#bbb', paddingTop: 5}
})
