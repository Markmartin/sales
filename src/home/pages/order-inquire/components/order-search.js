// 订单搜索内容
import React, {Component} from "react";
import { View} from "react-native";
import {Form, Button} from 'beeshell';
import {SelectLabel, VehicleSpectrum} from "../../../../common/components/form";
import OrderDatePicker from "./date-picker";
import BuyType from "./buy-type";
import OrderStatus from "./order-status";
import Sales from "./sales";
import {join, map,isEmpty} from "lodash";
import {close} from './calendar-services'

class OrderSearch extends Component {
	constructor(props) {
		super(props)
		this.userStore = this.props.userStore
		this.dictStore = this.props.dictStore
		this.state = {
			vehicleCode:'',
			createTime:'',
			buyType:'',
			seller:'',
			orderStatus:''
		}
	}
	// 生命周期挂载阶段
	componentDidMount() {
		const {searchData} = this.props
		if (isEmpty(searchData)) return

		// 根据信息进行回显
		this.setState({...searchData})
	}

	// 重置
	reset(){
		this.setState({
			vehicleCode:'',
			createTime:'',
			buyType:'',
			seller:'',
			orderStatus:''
		})
		this.props.onRefresh({})
		close()
	}

	// 搜索
	search(){
		// 不组合数据 方便回显
		this.props.onRefresh(this.state)
		close()
	}
	// 组合显示车型
	get renderCar() {
		return join(map(this.state.vehicleCode, item => item ? item.label : ''), '-')
	}
	render() {
		const {createTime,orderStatus,buyType,seller} = this.state
		const {role} = this.userStore
		return (
			<View >
				<Form style={{marginTop: 10, backgroundColor: 'transparent'}}>
					<Form.Item style={{paddingVertical: 13}} label="车型"
							   hasLine>
						<SelectLabel data={this.renderCar}
									 onPress={() => this.VehicleSpectrum.open()}/>
					</Form.Item>

					<Form.Item style={{paddingVertical: 13}} label="订单日期"
							   hasLine>
						<SelectLabel data={createTime}
									 onPress={() => this.orderDatePicker.open()}/>
					</Form.Item>
					<Form.Item style={{paddingVertical: 13}} label="订单状态"
							   hasLine>
						<SelectLabel data={orderStatus.dictValue}
									 onPress={() => this.OrderStatusPicker.open()}/>
					</Form.Item>
					<Form.Item style={{paddingVertical: 13}} label="购车方案"
							   hasLine>
						<SelectLabel data={buyType.dictValue}
									 onPress={() => this.buyTypePicker.open()}/>
					</Form.Item>
					{role.roleCode === 'rolePartnerSaleManager'?<Form.Item style={{paddingVertical: 13}} label="所属顾问"
																		   hasLine>
						<SelectLabel data={seller.staffName}
									 onPress={() => this.SalesPicker.open()}/>
					</Form.Item>:null}
					<View style={{flexDirection:'row',paddingLeft:15,paddingRight:15,marginTop:20}}>
						<Button
							style={{marginRight:20,flex:1}}
							type='default'
							size='sm'
							onPress={()=>this.reset()}>
							重置
						</Button>
						<Button
							style={{flex:1}}
							type='primary'
							size='sm'
							onPress={()=>this.search()}>
							确定
						</Button>
					</View>

				</Form>

				<VehicleSpectrum ref={c => this.VehicleSpectrum = c}
								 rightCallback={value =>this.setState({vehicleCode: value})}/>
				<OrderDatePicker ref={(c) => this.orderDatePicker = c}
								 rightCallback = {date=>this.setState({createTime: date})}/>
				<BuyType ref={(c) => this.buyTypePicker = c}
						 dictStore={this.dictStore}
						 rightCallback = {date=>this.setState({buyType: date})}/>
				<OrderStatus ref={(c) => this.OrderStatusPicker = c}
							 dictStore={this.dictStore}
							 rightCallback = {date=>this.setState({orderStatus: date})}/>
				<Sales ref={(c) => this.SalesPicker = c}
					   rightCallback = {date=>this.setState({seller: date})}/>

			</View>
		);
	}
}
export default OrderSearch
