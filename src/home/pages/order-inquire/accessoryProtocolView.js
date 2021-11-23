/**
 * @description 用来实现订单协议拍照部分的图片上传与回显
 * @param {order} 通过props接收订单数据
 */

import React, {Component} from 'react'
import {TouchableOpacity, Image, StyleSheet, Text, View, Dimensions} from "react-native";
import {RowContentView, ColumnContentView} from "./style";
import Icon from 'react-native-vector-icons/dist/Feather';
import DeleteImg from 'react-native-vector-icons/MaterialIcons'
import {size} from "../../../style/variables";
import {takePhoto, uploadImgToAliCloud} from '../../../common/components/image-picker-camera/imageTool'
import {Loading} from "../../../common/components/loading";
import {Tip} from 'beeshell';
import {isArray, remove, map, filter} from 'lodash'
import OssImage from "../../../common/components/oss-image";

export default class AccessoryProtocolView extends Component {
	constructor(props) {
		super(props);
		// 初始化当前状态
		this.state = {
			imgArr: []
		}
		// 绑定
		this.deleteImage = this.deleteImage.bind(this);
		this.fullScreenBrows = this.fullScreenBrows.bind(this);
		this.takePhotoAction = this.takePhotoAction.bind(this);
		this.judgementIsShowSubmitBtn    = this.judgementIsShowSubmitBtn.bind(this);
		this.submitAccessoryProtocolInfo = this.submitAccessoryProtocolInfo.bind(this);
	}

	// 获取API附件数据 存储到数组数据中
	getSnapshotBeforeUpdate(prevProps, prevState) {
		const {order} = this.props
		if (!order || !isArray(order.attachVOList) || !order.attachVOList.length || this.reload) return null
		let imgArr = map(order.attachVOList, img => {
			img.path = img.picPath
			return img
		})
		// 过滤没有图片链接的脏数据
		imgArr = filter(imgArr, img => img.busId === 'pms_order_customer' && img.picPath)
		this.setState({
			imgArr: imgArr
		})
		this.reload = true
		return null
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	takePhotoAction() {
		// 调相机，并返回图片 - 异步返回
		takePhoto().then(image => {
			// 上传图片到阿里云
			Loading.show();
			let img = image
			uploadImgToAliCloud(image).then(imageUrl => {
				Loading.hidden();
				// 保存阿里云返回的图片url
				img.picPath = imageUrl
				this.setState((preState) => {
					return {
						imgArr: [...preState.imgArr, img]
					}
				})
			})
		});
	}

	// 提交附近协议的接口
	submitAccessoryProtocolInfo() {
		let {imgArr} = this.state
		// 过滤已上传的文件
		let paramArr = filter(imgArr, img => !img.busId)
		if (!paramArr.length) {
			Tip.show('附件未发生改变!', 1000, 'center')
			return
		}
		let data = []
		paramArr.forEach(img => {
			let param = {
				busId: 'pms_order_customer',
				busSubId: this.props.orderNo,
				picPath: img.picPath
			};
			data.push(param);
		})
		// 再将图片地址信息提交到后台
		Loading.show();
		axios.post('/admin/attach/saveBatch', data).then(response => {
			Loading.hidden();
			if (response.code === 200) {
				Tip.show('提交附件协议成功!', 1000, 'center')
                // 给上传成功的添加busId(固定)，隐藏删除btn
                imgArr.forEach(item => item.busId = 'pms_order_customer')
                this.setState({imgArr: [...imgArr]})
			}

		}).catch(error => {
			Loading.hidden();
			Tip.show('提交附件协议失败!', 1000, 'center')
		})
	}

	// 删除照片
	deleteImage(image) {
		// 判断是否API返回的图片
		let {imgArr} = this.state
		if (image.attachId) {
			let data = [{
				attachId: image.attachId,
				busId: 'pms_order_customer',
				busSubId: image.busSubId
			}]
			axios.post('/admin/attach/del', data)
				.then(() => {
					remove(imgArr, img => img.path === image.path)
					this.setState({imgArr: [...imgArr]})
				})
		} else {
			remove(imgArr, img => img.path === image.path)
			this.setState({imgArr: [...imgArr]})
		}
	}

	// 全屏浏览
	fullScreenBrows(image) {
		let mediaArr = [];
		let startIndex = 0;
		this.state.imgArr.map((subImage, index) => {
			if (subImage.path === image.path) {
				startIndex = index;
			}
			// 添加
			mediaArr.push({photo: subImage.path});
		})
		if (mediaArr.length == 0) return;
		// 获取导航栏
		const {navigate} = this.props.navigation;
		// 跳转
		navigate('Photo', {media: mediaArr, index: startIndex})
	}

	// 判断是否还需要显示上传按钮
    judgementIsShowSubmitBtn() {
        const {imgArr} = this.state;
        if (imgArr.length == 0) return false;
        let count = 0;
        imgArr.forEach(item => {
            if (item.busId === 'pms_order_customer') count++;
        })
        return count < 5;
    }

	// 加载界面
	render() {
		const {imgArr} = this.state
		let showUpdate = imgArr.length
		return (
			<RowContentView style={{backgroundColor: '#fff'}}>
				<Text style={[styles.lineTitleStyle, {alignSelf: 'flex-start'}]}>{this.props.title}</Text>
				<ColumnContentView style={{flex: 1}}>
					<RowContentView style={{flex: 1, flexWrap: 'wrap', marginTop: 16}}>
						{
							imgArr.map((imgObj, i) => {
								return (
									<ImageView
										key={i}
										imgObj={imgObj}
										deleteImgCallBack={this.deleteImage}
									/>
								)
							})
						}
						{/*增加照片按钮*/}
						{
                            showUpdate >= 5 ? null : <TakePhotoView takePhotoEvent={() => this.takePhotoAction()}/>
						}
					</RowContentView>
					{
						this.judgementIsShowSubmitBtn() ?
							<Text style={styles.submitStyle} onPress={this.submitAccessoryProtocolInfo}>确认上传</Text>
							:
							null
					}
				</ColumnContentView>
			</RowContentView>
		)
	}
}

class ImageView extends Component {
	render() {
		const {imgObj} = this.props
		let isSubmited = imgObj.busId === 'pms_order_customer';
		return (
			<View style={styles.imgContetntStyle}>
				<OssImage style={{width: 60, height: 90}} imageKey={imgObj.picPath}/>
				{
					!isSubmited ?
						<TouchableOpacity style={styles.deleteStyle}
										  onPress={() => this.props.deleteImgCallBack(imgObj)}>
							<View style={styles.deleteStyle}>
								<DeleteImg name='cancel' size={16} color='#FFF' light/>
							</View>
						</TouchableOpacity>
						:
						null
				}
			</View>
		)
	}
}

class TakePhotoView extends Component {
	render() {
		return (
			<TouchableOpacity style={styles.imgContetntStyle} onPress={() => this.props.takePhotoEvent()}>
				<View style={{width: 60, height: 90, justifyContent: 'center',alignItems: 'center'}}>
					<Icon
						name='camera'
						size={24}
						color='#bbb'
						light
					/>
					<Text style={styles.textStyle}>拍照</Text>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	lineTitleStyle: {
		fontSize: size.fontSizeBase,
		color: '#323233',
		width: 115,
		marginLeft: 16,
		marginTop: 16
	},
	imgContetntStyle: {
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
	textStyle: {
		fontSize: 12,
		color: '#323233',
		paddingTop: 5
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
	submitStyle: {
		flex: 1,
		height: 20,
		marginTop: 16,
		color: '#37c1b4',
		fontSize: 14,
		textDecorationLine: 'underline'
	}
});
