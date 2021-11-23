/**
 * @description 用来实现附件上传和回显组件，主要接收数据，对外传递数据
 * @param {callback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {isArray, forEach, remove, filter} from 'lodash'
import {colors, size} from "../../../../style/variables";
import Icon from 'react-native-vector-icons/dist/Feather';
import {uploadOss} from '../../../../common/services/oss';
import OssImage from '../../../../common/components/oss-image'
import ImagePicker from 'react-native-image-crop-picker';
import DeleteImg from "react-native-vector-icons/MaterialIcons";

const images = ['agreementPicPath', 'fifthPicPath', 'fourthPicPath', 'secendPicPath', 'thirdPicPath']
export default class DriverAttachment extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list: []
		}
	}

	// 获取API附件数据 存储到数组数据中
	getSnapshotBeforeUpdate(prevProps, prevState) {
		const {order} = this.props
		if (!order || this.reload) return null
		// 使用对象HASH存储展示图片
		let list = []
		forEach(images, name => {
			if (order[name]) {
				console.log('order[name]', order[name])
				list.push({path: null, url: order[name]})
			}
		})
		if (list.length) {
			this.reload = true
			this.setState({list})
		}
		return null
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	// 拍照
	async takePhoto() {
		try {
			const image = await ImagePicker.openCamera({compressImageMaxWidth: 1980})
			const fileUrl = await uploadOss(image)
			// 处理图片数组
			this.setState({
				list: [...this.state.list, {path: image.path, url: fileUrl}]
			})
			this.props.setPhotos(this.state.list)
		} catch (e) {
			console.warn(e)
		}
	}

	// 删除
	delete(img) {
		// 删除对应
		const {list} = this.state
		remove(list, item => item.url === img.url)
		this.setState({list: [...list]})
		this.props.setPhotos(list)
	}

	render() {
		const {list} = this.state
		const {editable} = this.props
		const showAdd = list.length < 5 && editable !== false
		return (
			<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
				{/*图片队列*/}
				{list.map((img, i) => {
					return (
						<View style={styles.imgContentStyle} key={i}>
							<OssImage imageKey={img.url} style={{height: 90, width: 60}}/>
							{editable !== false ? <TouchableOpacity style={styles.deleteStyle}
																	onPress={() => this.delete(img)}>
								<View style={styles.deleteStyle}>
									<DeleteImg name='cancel' size={16} color='#FFF' light/>
								</View>
							</TouchableOpacity> : null}
						</View>
					)
				})}
				{/*拍照图标*/}
				{showAdd ? <View style={styles.addBox}>
					<TouchableOpacity onPress={() => this.takePhoto()}>
						<Icon
							name='camera'
							size={24}
							color='#bbb'
							light
						/>
						<Text style={styles.textStyle}>拍照</Text>
					</TouchableOpacity>
				</View> : null}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	addBox: {
		marginRight: 8,
		marginBottom: 8,
		backgroundColor: '#dcdcdc',
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 90
	},
	textStyle: {
		fontSize: 12,
		color: '#323233',
		paddingTop: 5
	},
	lineTitleStyle: {
		fontSize: size.fontSizeBase,
		color: '#323233',
		width: 115,
		marginLeft: 16,
		marginTop: 16
	},
	imgContentStyle: {
		marginRight: 8,
		marginBottom: 8,
		backgroundColor: '#dcdcdc',
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 90
	},
	imgStyle: {
		width: 60,
		height: 90
	},
	deleteStyle: {
		width: 16,
		height: 16,
		position: 'absolute',
		right: 0,
		top: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)'
	},
})
