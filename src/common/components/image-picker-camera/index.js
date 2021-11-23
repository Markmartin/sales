/**
 * @description 单张照片拍照上传阿里云组件
 * @param {callBack} 上传成功的回调，更新父组件数据
 */

import React, {Component} from 'react';
import {Text, View, Platform, Image, StyleSheet, TouchableOpacity,StatusBar,Dimensions} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/dist/Feather';
import {oss, uploadOss, getOssUrl} from "../../services/oss";
import {Popover } from 'beeshell'
import {Card} from "../../../home/pages/customers/style";
const window = Dimensions.get('window')
const screenHeight = Platform.OS === 'ios' ? window.height : window.height - StatusBar.currentHeight
export default class ImagePickerCamera extends Component {
	constructor(p) {
		super(p)
		this.state = {
			image: '', // 返回的图片信息
			url: ''    // 阿里云OSS url
		}
	}
	// 显示选择
	click(){
		this.btnA.measure((fx, fy, width, height, px, py) => {
			this.setState({
				offsetX: px + 190,
				offsetY: py - 50
			})
			this._popover.open().catch((e) => {
				console.log(e)
			})
		})
	}
	// 相册
	async openPicker() {
		this._popover.close()
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
	// 拍照
	async takePhoto() {
		this._popover.close()
		try {
			const image = await ImagePicker.openCamera({compressImageMaxWidth: 1980})
			this.setState({image})
			const fileUrl = await uploadOss(image)
			// 回传callback
			if (!this.props.callBack) return
			this.props.callBack(fileUrl)
		} catch (e) {
			console.warn(e)
		}
	}
	// 渲染图标还是图片
	renderIconOrImg(){
		const {image} = this.state
		if (image === '') {
			return(
				<TouchableOpacity   ref={c => {this.btnA = c}} style={{width: 100, height: 133}}
									onPress={this.click.bind(this)}>
					<View style={{width: 100, height: 133, paddingTop: 40}}>
						<Icon
							name='camera'
							size={35}
							color='#bbb' light style={{alignSelf: 'center'}}/>
						<Text style={styles.textStyle}>{this.props.description}</Text>
					</View>
				</TouchableOpacity>
			)
		}else {
			return 	<Image source={{uri: this.state.image.path, width: 100, height: 133}}/>
		}
	}

	render() {
		return (
			<View>
				<TouchableOpacity   ref={c => {this.btnA = c}} style={{width: 100, height: 133}}
									onPress={this.click.bind(this)}>
					{this.renderIconOrImg()}
				</TouchableOpacity>
				<Popover
					direction='down'
					align='left'
					screenHeight={screenHeight}
					offsetX={this.state.offsetX}
					offsetY={this.state.offsetY}
					ref={(c) => this._popover = c}>
					<View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', paddingHorizontal: 16 }}>
						<TouchableOpacity style={{width:100,marginBottom:10,marginTop:10}}
										  onPress={this.takePhoto.bind(this)}>
							<Text style={styles.listTextStyle}>拍照</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.listStyle} onPress={this.openPicker.bind(this)}>
							<Text style={styles.listTextStyle}>相册</Text>
						</TouchableOpacity>
					</View>
				</Popover>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	textStyle: {fontSize: 12, alignSelf: 'center', color: '#bbb', paddingTop: 5},
	listStyle:{width:100,marginBottom:10},
	listTextStyle: {color: '#000', paddingTop: 5,paddingBottom:5,paddingLeft:10}
})
