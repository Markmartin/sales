/**
 * @description 获取OSS图片，oss图片有权限需要通过API获取显示
 * @param {imageKey} image的KEY值
 */

import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {getOssUrl} from '../../services/oss'
import navigation from "../../services/navigation";

const defaultImg = require('../../../assets/images/todo-top.png')

export default class OssImage extends Component {
	static defaultProps = {
		style: {
			width: 60,
			height: 60
		}
	}

	constructor(props) {
		super(props)
		this.urlCatch = {}
		this.state = {}
	}

	componentDidMount() {
		if (this.props.imageKey) {
			this.urlCatch[this.props.imageKey] = true
			// 获取下载地址
			getOssUrl(this.props.imageKey)
				.then(image => this.setState({image}))
		}
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.imageKey && !this.urlCatch[this.props.imageKey]) {
			this.urlCatch[this.props.imageKey] = true
			// 获取下载地址
			getOssUrl(this.props.imageKey)
				.then(image => {
					this.setState({image})
					return null
				})
		}
		return null
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	// 全屏浏览
	fullScreenBrows(image) {
		let mediaArr = [{photo: image}];
		// 跳转
		navigation.navigate('Photo', {media: mediaArr, index: 0})
	}

	render() {
		const {style} = this.props
		const {image} = this.state
		if (image) {
			return (
				<TouchableOpacity style={style} onPress={() => this.fullScreenBrows(image)}>
					<Image source={{uri: image}} style={style}/>
				</TouchableOpacity>
			)
		} else {
			return (
				<Image source={defaultImg} style={style}/>
			)
		}
	}
}
