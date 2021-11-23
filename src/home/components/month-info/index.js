import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {BenchWrapper, WorkWrapper, WorkTitle} from "./style";
import navigation from '../../../common/services/navigation'
import {withNavigationFocus} from 'react-navigation';
import {split} from 'lodash'
import {inject} from "mobx-react";

// 月工作信息
@inject(['userStore']) // 注入对应的store
class MonthInfo extends Component {
	constructor(props) {
		super(props)
		this.store = this.props.userStore
		this.state = {
			"salesConsultantNo": "",
			"partnerCode": "",
			"handleVehicleTarget": "0/0",
			"testDriveTarget": "0/0",
			"customerOrderTatget": "0/0",
			"newCustomerTarget": "0/0",
			"lostCustomerCount": "0",
			"queryDate": ""
		}
		// 标记状态
		this.reload = false
	}

	// 获取焦点时刻
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.isFocused) {
			// 如果reload了不再请求
			if (this.reload) return null
			const queryDate = moment().format('YYYY-MM-DD')
			axios.get('/admin/handleVehicle/taskTarget', {params: {queryDate}})
				.then(({data}) => this.setState({...data}))
			// 标记reload
			this.reload = true
		} else {
			this.reload = false
		}
		return null
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	getPercentage(target) {
		return target[1] == 0 ? 0 : Math.round(target[0] * 100 / target[1])
	}

	render() {
		const handleVehicleTarget = split(this.state.handleVehicleTarget, '/')
		const testDriveTarget = split(this.state.testDriveTarget, '/')
		const customerOrderTatget = split(this.state.customerOrderTatget, '/')
		const newCustomerTarget = split(this.state.newCustomerTarget, '/')

		// 计算百分比
		const vehicleTarget = this.getPercentage(handleVehicleTarget)
		const driveTarget = this.getPercentage(testDriveTarget)
		const orderTarget = this.getPercentage(customerOrderTatget)
		const customerTarget = this.getPercentage(newCustomerTarget)

		// 点击权限
		const {roleCode} = this.store.role
		const deliveryAble = roleCode === 'rolePartnerHandleVehicle'
		const driverAble = roleCode === 'rolePartnerTestDrive' || roleCode === 'rolePartnerSale'
		const monthAble = roleCode === 'rolePartnerManager' || roleCode === 'rolePartnerSale'
		const customerAble = roleCode === 'rolePartnerManager' || roleCode === 'rolePartnerSale'
		return (
			<BenchWrapper>
				<TouchableOpacity onPress={() => {
					navigation.navigate('MonthDeal')
				}}>
					{/*月度成交*/}
					<WorkWrapper>
						<AnimatedCircularProgress
							style={{marginLeft: 5}}
							size={60}
							width={6}
							fill={vehicleTarget}
							tintColor="#FFFFFF"
							backgroundColor="#1ad3bb">
							{
								(fill) => (
									<Text>
										<Text style={{fontSize: 18, color: '#fff'}}>{handleVehicleTarget[0]}</Text>
										<Text style={{fontSize: 14, color: '#fff'}}>/{handleVehicleTarget[1]}</Text>
									</Text>
								)
							}
						</AnimatedCircularProgress>
						<WorkTitle>月交车目标</WorkTitle>
					</WorkWrapper>
				</TouchableOpacity>

				{/*月度试驾*/}
				<TouchableOpacity onPress={() => {
					navigation.navigate('MonthDrive')
				}}>
					<WorkWrapper>
						<AnimatedCircularProgress
							style={{marginLeft: 5}}
							size={60}
							width={6}
							fill={driveTarget}
							prefill={0}
							tintColor="#FFFFFF"
							backgroundColor="#1ad3bb">
							{(fill) => (
								<Text>
									<Text>
										<Text style={{fontSize: 18, color: '#fff'}}>{testDriveTarget[0]}</Text>
										<Text style={{fontSize: 14, color: '#fff'}}>/{testDriveTarget[1]}</Text>
									</Text>
								</Text>
							)
							}
						</AnimatedCircularProgress>
						<WorkTitle>月试驾目标</WorkTitle>
					</WorkWrapper>
				</TouchableOpacity>

				{/*月订单目标*/}
				<TouchableOpacity onPress={() => {
					navigation.navigate('monthOrder')
				}}>
					<WorkWrapper>
						<AnimatedCircularProgress
							style={{marginLeft: 5}}
							size={60}
							width={6}
							fill={orderTarget}
							prefill={0}
							tintColor="#FFFFFF"
							backgroundColor="#1ad3bb">
							{
								(fill) => (
									<Text>
										<Text>
											<Text style={{fontSize: 18, color: '#fff'}}>{customerOrderTatget[0]}</Text>
											<Text style={{fontSize: 14, color: '#fff'}}>/{customerOrderTatget[1]}</Text>
										</Text>
									</Text>
								)
							}
						</AnimatedCircularProgress>
						<WorkTitle>月订单目标</WorkTitle>
					</WorkWrapper>
				</TouchableOpacity>


				<TouchableOpacity onPress={() => {
					navigation.navigate('MonthClient')
				}}>
					<WorkWrapper>
						<AnimatedCircularProgress
							style={{marginLeft: 5}}
							size={60}
							width={6}
							fill={customerTarget}
							prefill={0}
							tintColor="#FFFFFF"
							backgroundColor="#1ad3bb">
							{
								(fill) => (
									<Text>
										<Text>
											<Text style={{fontSize: 18, color: '#fff'}}>{newCustomerTarget[0]}</Text>
											<Text style={{fontSize: 14, color: '#fff'}}>/{newCustomerTarget[1]}</Text>
										</Text>
									</Text>
								)
							}
						</AnimatedCircularProgress>
						<WorkTitle>月新增客户</WorkTitle>
					</WorkWrapper>
				</TouchableOpacity>
			</BenchWrapper>
		)
	}

}

export default withNavigationFocus(MonthInfo)
