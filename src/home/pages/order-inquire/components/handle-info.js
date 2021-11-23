/**
 * @description 用来实现订单交车部分的修改
 * @param {order} 通过props接收订单数据
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, SafeAreaView} from 'react-native';
import {map} from "lodash";
import {RowContentView, RowLineView} from "../style";
import {SelectLabel, DatePicker} from "../../../../common/components/form";
import {Actionsheet, Button, Tip,Scrollpicker, BottomModal} from "beeshell";
import {size} from "../../../../style/variables";
import {inject, observer} from 'mobx-react'
// 预置数据
@inject(['userStore']) // 注入对应的store
export default class HandleInfo extends Component {
	constructor(props) {
		super(props)
		this.store = this.props.userStore
		this.state = {
			handleUser: {},// 交付小驰,
			deliveryCarDate: '',
			value:[[0]]
		}
	}

	// 生命周期挂载阶段
	componentDidMount() {
		// 获取交付小驰
		axios.get('/admin/staff/listStaffByRoleCode', {params: {roleCode: 'rolePartnerHandleVehicle'}})
			.then(({data}) => this.setState({
				handles: map(data, i => {
					return {label: i.staffName, value: i.accountNo}
				})
			}))
	}

	// 提交修改数据
	saveData() {
		const {deliveryCarDate, handleUser} = this.state
		let param = {orderCustomerNo: this.props.order.orderCustomerNo, orderCustomerId: this.props.order.orderCustomerId}
		if (handleUser.value) {
			param.handleUser = handleUser.value
		}
		if (deliveryCarDate) {
			param.deliveryCarDate = moment(deliveryCarDate).format('YYYY-MM-DD HH:mm:ss')
		}
		if (!param.handleUser && !deliveryCarDate) {
			Alert.alert('提示', '交付信息未做出任何更改.')
			return
		}
		axios.post('/admin/satOrderCustomer/updateDeliveryDate', param)
			.then(() => Tip.show('修改成功！', 1000, 'center'))
	}

	render() {
		const {order} = this.props
		const {roleCode} = this.store.role
		const available = roleCode==='rolePartnerSaleManager' || roleCode==='rolePartnerSale'
		return (
			<View style={{flex:1, backgroundColor: '#fff'}}>
				<RowLineView style={styles.rowLineStyle}/>
				<RowContentView style={{paddingTop: 10}}>
					<Text style={[styles.lineTitleStyle, {alignSelf: 'flex-start'}]}>交付小驰：</Text>
					<SelectLabel
						editable={available}
						data={this.state.handleUser.label ? this.state.handleUser.label : order.handleStaffName}
						onPress={() => this.Handles.open()}/>
				</RowContentView>
				<RowContentView style={{paddingTop: 5}}>
					<Text style={[styles.lineTitleStyle, {alignSelf: 'flex-start'}]}>预计交车时间：</Text>
					<SelectLabel data={this.state.deliveryCarDate ? this.state.deliveryCarDate : order.deliveryCarDate}
								 editable={available}
								 onPress={() => this.DatePicker.open()}/>
				</RowContentView>
				<View style={{paddingLeft: 16, paddingRight: 16, marginTop: 20, marginBottom: 16}}>
					<Button
						testID='submit'
						type='primary'
						size='sm'
						disabled={!available}
						onPress={() => this.saveData()}>
						保存交付信息
					</Button>
				</View>
				<BottomModal ref={c => this.Handles = c}
							 title='请选择交付小驰'
							 rightCallback={() => {
								 const data = this.state.handles[this.state.value[0]]
								 this.setState({handleUser: data})
							 }}
							 cancelable={true}>
					<View style={{paddingVertical: 15}}>
						<Scrollpicker
							style={{paddingHorizontal: 80}}
							offsetCount={2}
							list={[this.state.handles]}
							onChange={(columnIndex, rowIndex) => {
								this.setState({
									value: [rowIndex]
								})
							}}
							value={this.state.value}
							renderItem={(item) => {
								return (
									<View
										style={{
											flexDirection: 'row',
											paddingVertical: 10
										}}>
										<Text>{item.label}</Text>
									</View>
								)
							}}
						/>
					</View>
					<View style={{maxHeight: 30}}>
						<SafeAreaView style={{flex: 1}}>
							<View style={{height: 30}}/>
						</SafeAreaView>
					</View>
				</BottomModal>
				<DatePicker ref={c => this.DatePicker = c}
							rightCallback={value => this.setState({deliveryCarDate: value})}/>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	rowLineStyle: {
		marginTop: 20,
		width: '93%',
		alignSelf: 'center'
	},
	lineTitleStyle: {
		fontSize: size.fontSizeBase,
		color: '#323233',
		width: 115,
		marginLeft: 16,
		marginTop: 8
	}
})
