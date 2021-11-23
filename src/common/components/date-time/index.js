import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import {SlideModal, Tab, Timepicker, Calendar} from "beeshell";
import {colors} from "../../../style/variables";
import Icon from 'react-native-vector-icons/dist/Feather';

export default class Handle extends Component {
	static defaultProps = {
		showTime: 'HH:mm:ss',
		startTime: '00:00:00',
		endTime: '23:59:59'
	}

	constructor(props) {
		super(props)
		this.state = {
			date: moment(new Date()).format('YYYY-MM-DD'),
			time: '09:00:00',
			value: 1
		}
	}

	componentDidUpdate() {
		let show = this.props.show
		if (show) {
			this._slideModal.open()
		}
	}

	render() {
		let disableHours = []
		if(this.props.disableHours && this.props.disableHours[this.state.date]){
			disableHours = this.props.disableHours[this.state.date]
		}
		return (
			<SlideModal
				ref={(c) => {
					this._slideModal = c
				}}
				styles={{
					content: {
						height: '58%',
						width: '100%',
						backgroundColor: 'white'
					}
				}}>
				<View style={{position: 'relative'}}>
					<View style={{position: 'absolute', top: 12, left: 10, zIndex: 10}}>
						<Icon
							onPress={() => {
								this._slideModal.close();
							}}
							name='x-circle'
							size={26}
							color='#00CFB4'>
						</Icon>
					</View>

					<View style={{position: 'absolute', top: 12, right: 10, zIndex: 10}}>
						<Icon
							onPress={() => {
								this.props.callBack(this.state.date, this.state.time)
								this._slideModal.close()
								this.setState({
									date: moment(new Date()).format('YYYY-MM-DD'),
									time: '00:00:00',
									value: 1
								})
							}}
							name='check-circle'
							size={26}
							color='#00CFB4'>
						</Icon>
					</View>
					<Tab
						value={this.state.value}
						data={[{value: 1, label: '选择日期'},
							{value: 2, label: '选择时间'}]}
						dataContainerStyle={styles.tab}
						onChange={(item) => {
							this.setState({
								value: item.value
							})
						}}
					/>
					{
						this.state.value === 1 ? (
								<View>
									<Calendar
										date={this.state.date}
										onChange={(date) => {
											this.setState({
												date: date,
												value: 2
											})
										}}>
									</Calendar>
								</View>
							) :
							(<View style={{paddingTop: 60}}>
								<Timepicker
									value={this.state.time}
									showTime={this.props.showTime}
									startTime={this.props.startTime}
									endTime={this.props.endTime}
									disableHours={disableHours}
									onChange={(value) => {
										this.setState({
											time: value,
											date: this.state.date
										})
									}}/>
							</View>)
					}
				</View>
			</SlideModal>
		)
	}
}
const styles = StyleSheet.create({
	tab: {height: 46, borderBottomWidth: 1, borderBottomColor: colors.grey5}
});
