/**
 * @description 用来实现交车时间部分的修改
 * @param {order} 通过props接收订单数据
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {forEach, map} from "lodash";
import {SelectLabel, DatePicker, DeliveryTime} from "../../../../common/components/form";
import {Button, Tip} from "beeshell";
import {size} from "../../../../style/variables";
import {InfoItem, LabelText} from "../styles";
import navigation from "../../../../common/services/navigation";

// 预置数据
export default class DeliveryDateInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			date: '',
			time: {},
			deliveryTime: [],
			disableHours: {},
			loading: false
		}
	}

	// 生命周期挂载阶段
	componentDidMount() {
		// 获取交付小驰的时间安排
		let disableHours = {}
		axios.get('/admin/handleVehicle/handleDateList')
			.then(({data}) => {
				if (!data || !data.length) return
				forEach(data, item => {
					const date = moment(item).format('YYYY-MM-DD')
					const time = moment(item).format('HH')
					if (disableHours[date]) {
						disableHours[date].push(time)
					} else {
						disableHours[date] = [time]
					}
				})
				this.setState({disableHours})
			})
	}

	// 显示时间段
	showTimeDuration(date) {
		// 获取当前时间
		if(!date) return ''
		const time = moment(date)
		const hour = time.format('HH')
		const after = time.add(2, 'h').format('HH')
		return `${hour}点-${after}点`
	}

	// 保存交付时间
	saveData() {
		const {order} = this.props
		const date = this.state.date ? this.state.date : moment(order.handleTime).format('YYYY-MM-DD')
		const time = this.state.time.label ? `${this.state.time.value}:00:00` : moment(order.handleTime).format('HH:mm:ss')
		const handleTime = `${date} ${time}`
		let params = {
			handleId: this.props.order.handleId,
			handleTime
		}
		this.setState({loading:true})
		axios.post('/admin/handleVehicle/begin', params)
			.then(() => navigation.navigate('Handing', {handleId: order.handleId}))
			.finally(()=>this.setState({loading:false}))
	}

	render() {
		const {order} = this.props
		const orderHandleTime = order.handleTime? moment(order.handleTime).format('YYYY-MM-DD'):''
		const date = this.state.date ? this.state.date : orderHandleTime
		const time = this.state.time.label ? this.state.time.label : this.showTimeDuration(orderHandleTime)
		return (
			<View>
				<InfoItem>
					<LabelText style={{marginTop: 8}}><Text>交车日期:</Text></LabelText>
					<SelectLabel data={date}
								 onPress={() => this.DatePicker.open()}/>
				</InfoItem>
				<InfoItem>
					<LabelText style={{marginTop: 8}}><Text>交车时间:</Text></LabelText>
					<SelectLabel data={time}
								 onPress={() => this.DeliveryTime.open()}/>
				</InfoItem>
				<View style={{paddingLeft: 16, paddingRight: 16, marginTop: 20, marginBottom: 16}}>
					<Button
						testID='submit'
						type='primary'
						size='sm'
						disabled={this.state.loading}
						onPress={() => this.saveData()}>
						确认交车信息
					</Button>
				</View>

				<DatePicker ref={c => this.DatePicker = c}
							numberOfYears={2}
							rightCallback={value => this.setState({date: value})}/>
				<DeliveryTime ref={c => this.DeliveryTime = c}
							  disableHours={this.state.disableHours[date]}
							  rightCallback={value => this.setState({time: value})}/>
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
