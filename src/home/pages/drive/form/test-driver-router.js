/**
 * @description 用来显示试驾路线的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, StyleSheet} from 'react-native';
import {Tip} from 'beeshell';
import Swiper from "react-native-swiper";
import {colors} from "../../../../style/variables";
import {Card, CardTitle,} from '../driver-detail-style'
import OssImage from '../../../../common/components/oss-image'
import {findIndex} from 'lodash'

export default class TestDriverRouters extends Component {
	constructor(props) {
		super(props)
		this.state = {
			routes: []
		}
	}

	componentDidMount() {
		// 获取试驾线路
		axios.get('/admin/satTestDriveRoute/page')
			.then(({data}) => {
				this.setState({routes: data.list})
				if (this.props.callback) this.props.callback(this.state.routes[0])
			})
	}

	// 回显当前路线
	setDefault(id) {
		// 查找id的index
		const {routes} = this.state
		if (!routes.length) return
		const index = findIndex(routes, item => item.testDriveRouteId === id)
		this.Swiper.scrollBy(index)
	}

	render() {
		return (
			<Card>
				<CardTitle style={{borderBottomWidth: 0}}>
					<Text>试驾线路:</Text>
				</CardTitle>
				<Swiper ref={c => this.Swiper = c}
						scrollEnabled={this.props.editable !== false}
						showsPagination={false}
                        loop={false}
                        showsButtons={true}
						style={styles.wrapper}
						onIndexChanged={index => {
                            Tip.show(`已选择${this.state.routes[index].routeName}`, 10, 'center')
							if (this.props.callback) this.props.callback(this.state.routes[index])
						}}>
					{this.state.routes.map((item, i) => {
						return (
							<View style={styles.slide} key={i}>
								<Text style={styles.text}>{item.routeName}</Text>
								<OssImage
									imageKey={item.picPath}
									style={{height: 144, width: '100%'}}/>
							</View>
						)
					})}
				</Swiper>
			</Card>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		height: 174
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 16,
		marginRight: 16,
		borderRadius: 4,
		overflow: 'hidden',
	},
	text: {
		color: colors.dark,
		fontSize: 26,
		marginTop: 10
	}
});
