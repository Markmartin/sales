/**
 * @description 用来实现中国地区的底部选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Cascader, BottomModal} from 'beeshell';
import data from './area'
import {map, find, last, join} from 'lodash'

export default class ChinaRegions extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list:data,
			value: [],
			info: {}
		}
	}

	// 设置默认回显方法
	setDefault(addr) {
		// 添加子节点数据
		let value
		if (addr[0] && addr[0].id) {
			this.handleChange(addr[0].id, [[addr[0]]])
			value = [addr[0].id]
		}
		if (addr[1] && addr[1].id) {
			this.handleChange(addr[1].id, [[addr[0],addr[1]]])
			value = [addr[1].id]
		}
		if (addr[2] && addr[2].id) {
			this.handleChange(addr[2].id, [[addr[0],addr[1],addr[2]]])
			value = [addr[2].id]
		}
		this.setState({value})
	}

	//打开modal
	open() {
		return this.bottomModal.open()
	}

	// 异步加载数据
	handleChange(value, info) {
		console.log('value',value)
		this.setState({value, info})
	}

	render() {
		return (
			<BottomModal ref={c => this.bottomModal = c}
						 title='请选择地区'
						 rightCallback={() => {
							 // 组合地区
							 this.props.rightCallback(this.state.info[0])
						 }}
						 cancelable={true}>
				<Cascader
					style={{height: 260, marginBottom: 50}}
					proportion={[1]}
					fieldKeys={{idKey: 'id'}}
					data={this.state.list}
					value={this.state.value}
					onChange={(value, info) => this.handleChange(value, info)}
				/>
			</BottomModal>
		);
	}
}
