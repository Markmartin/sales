import {Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ListItem, ListLeft, ListRight} from "./styles";
import {Longlist} from 'beeshell';
import React, {Component} from 'react';
import {colors, size} from "../../../style/variables";
import {level} from '../../../common/tool/dictionaries'
import Sex from "../../../common/components/sex";
import {find} from 'lodash'

/**
 * 入参
 * 1. data 父组获取接口后的数据
 * 2. onRefresh 下拉刷新事件
 * 1. refreshing 下拉刷新后获取loading 状态
 */

export default class ClientList extends Component {
	constructor(props) {
		super(props)
		this.levelHandel = this.levelHandel.bind(this)
		this.timeHandel = this.timeHandel.bind(this)
	}

	levelHandel(value) {
		if (!value) return ''
		let obj = find(level, item => item.dictKey == value)
        obj = obj?obj:{dictValue:''}
		return obj.dictValue
	}

	timeHandel(time) {
		if (!time) return ''
		return moment(time).format('YYYY-MM-DD HH:mm')
	}

	render() {
		return (
			<Longlist
				ref={(c) => {
					this._longlist = c
				}}
				refreshControl={
					<RefreshControl
						refreshing={this.props.refreshing}
						onRefresh={this.props.onRefresh}
					/>}
				data={this.props.data}
				renderItem={({item}) =>
					<TouchableOpacity activeOpacity={0.5} underlayColor={'#00cfb4'} onPress={() => {
						this.props.onPage(item)
					}}>
						<View style={styles.listBox}>
							<ListItem>
								<ListLeft>
									<View style={styles.item}>
										<Text style={styles.boldTextStyle}>{item.name}</Text>
										<Sex data={item.sex}/>
										<Text style={styles.boldTextStyle}>{item.phone}</Text>
									</View>
									<View style={this.props.money ? styles.item : {
										flexDirection: 'row',
										alignItems: "center"
									}}>
										<Text style={styles.vehicle}>{this.levelHandel(item.level)}</Text>
										<Text style={styles.vehicle}>{item.productName}</Text>
										<Text
											style={styles.vehicle}>{this.timeHandel(item[this.props.timeKey] || item.createTime)}</Text>
									</View>
									{this.props.money &&
									<Text>
										<Text>
											<Text style={styles.symbol}>￥</Text>
											<Text style={styles.money}>{item.invoiceMoney}</Text>
										</Text>
									</Text>
									}
								</ListLeft>
								<ListRight>
									<Text style={styles.listRightCont}>详情</Text>
									<Image style={styles.listRightIcon}
										   source={require('../../../assets/images/ic_next.png')}></Image>
								</ListRight>
							</ListItem>
						</View>
					</TouchableOpacity>
				}
			/>
		)
	}
}
const styles = StyleSheet.create({
	boldTextStyle: {
		fontSize: size.fontsizeMd,
		color: colors.black,
		fontWeight: "bold"
	},
	listBox: {
		paddingHorizontal: 16,
		backgroundColor: '#fff'
	},
	item: {
		flexDirection: 'row',
		marginBottom: 12,
		alignItems: "center"
	},
	user: {
		color: `${colors.grey0}`,
		fontSize: 16,
		marginRight: 14
	},
	listRightCont: {
		alignSelf: 'center',
		color: `${colors.grey3}`,
		fontSize: 14
	},
	listRightIcon: {
		width: 15,
		height: 15,
		marginLeft: 6,
		alignSelf: 'center'
	},
	vehicle: {
		fontSize: 14,
		color: `${colors.grey3}`,
		marginRight: 12
	},
	money: {
		color: '#10a627',
		fontSize: 16,
	},
	symbol: {
		color: '#10a627',
		fontSize: 12,
	}
})
