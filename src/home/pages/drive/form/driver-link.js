/**
 * @description 用来实现家人试驾的底部选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Checkbox} from 'beeshell';
import {find, map, forEach} from 'lodash'

export default class DriverLink extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: this.props.value,
			links: []
		}
	}

	componentDidMount() {
		// 获取试驾专员
		axios.get('/admin/customer/loadDetail', {params: {customerNo: this.props.customerNo}})
			.then(({data}) => {
				if (data.customerLinkVOList && data.customerLinkVOList.length) {
					const links = data.customerLinkVOList
					this.setState({links})
				}
			})
	}

	render() {
		const {links} = this.state
		const {editable} = this.props
		return (
			<View style={{marginTop: 15, marginBottom: 15}}>
				<Checkbox
					style={{flexDirection: 'row'}}
					value={this.state.value}
					onChange={(value) => {
						this.setState({value})
						if (value.length) {
							let tmp = []
							forEach(value, item => {
								tmp.push(find(links, i => i.phone === item))
							})
							console.log('tmp', tmp)
							if (this.props.callback) this.props.callback(tmp)
						}
					}}>
					{map(links, (link) => {
						return (
							<Checkbox.Item style={{marginRight: 15}}
										   disabled={editable === false}
										   label={link.name}
										   value={link.phone}/>
						)
					})}
					{links.length ? null : <Text>暂无联系人，请添加联系人</Text>}
				</Checkbox>
			</View>
		);
	}
}
