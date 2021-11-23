import React, {Component} from 'react';
import {Text, View, ScrollView, Image} from 'react-native';
import {Form, Input, Button, Tab, Switch} from 'beeshell';
import {join, map} from "lodash";

import validate from './validator'
import {CustomerBg, ButtonWrapper, PageTitle} from "./style";
import {tabData} from "./data-config";
import variables from "../../../style/beeshell";

import {
	VehicleSpectrum, RequiredLabel, ErrorMsg, VehiclePackage, SelectLabel, ColorIn,
	ColorOut, DatePicker, TimePicker} from '../../../common/components/form'
import ImagePickerCamera from '../../../common/components/image-picker-camera'

export default class CreatNewOrder extends Component {
	constructor(p) {
		super(p)
		this.state = {
			user: {
				phone:'',
				customerName: '',
				vehicleCode: '', //15位码
				bigAmount: '', // 金额
				colorIdIn: '',
				colorIdOut: '',
				customPackCode: '',
				deliveryCarDate: '',
				deliveryCarTime: '',
				isChargingPoint: false,
				contractImgPath: ''
			},
			validateResults: {}
		}
	}

	// 表单值变化回调
	handleChange(key, value) {
		let ret
		validate(key, value, (tmp) => {
			ret = tmp
		})
		this.setState(prevState => {
			return {
				user: {
					...prevState.user,
					[key]: value
				},
				validateResults: {...prevState.validateResults, [key]: ret}
			}
		})
	}

	// 点击切换tab
	touchTab(v, value) {
		console.warn('value', value)
	}

	// 保存信息
	save() {
		const {user} = this.state
		// 组合保存表单
		let formData = {
			customerName: user.customerName,
			bigAmount: user.bigAmount,
			isChargingPoint: user.isChargingPoint ? 1 : 0,
			deliveryCarDate: moment(user.deliveryCarDate).format('YYYY-MM-DD HH:mm:ss'),
			contractImgPath: user.contractImgPath,
			customerNo: '20190723105649cc2b34a0450d4228'
		}
		// 分拆型谱
		formData.orderCustomerDetailVO = {
			colorIdIn: user.colorIdIn.value,
			colorIdOut: user.colorIdOut.value,
			customPackCode: join(map(this.state.user.customPackCode, item => item.value),','),
			vehicleCode:`AIWAYSMAS${join(map(this.state.user.vehicleCode, item => item.value), '')}`
		}
		axios.post('/admin/satOrderCustomer/save', formData)
			.then(({data}) => {
				console.log('data', data)
			})
	}

	// 组合显示车型
	get renderCar() {
		return join(map(this.state.user.vehicleCode, item => item.label), '-')
	}

	// 组合显示车型
	get renderPackage() {
		return join(map(this.state.user.customPackCode, item => item.label))
	}

	render() {
		return (
			<CustomerBg style={{flex: 1, paddingTop: 10}}>
				<ScrollView>
					<Tab
						value={3}
						data={tabData}
						onChange={item => this.touchTab('value', item.value)}
						activeColor={variables.mtdBrandPrimaryDark}/>

					<PageTitle>订单信息</PageTitle>

					<Form>
						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="客户手机"/>}
								   hasLine>
							<Input testID='customerName' value={this.state.user.phone} textAlign='right'
								   onChange={value => {
									   this.handleChange('iphone', value)
								   }}/>
							<ErrorMsg validateResults={this.state.validateResults} name='iphone'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="客户姓名"/>}
								   hasLine>
							<Input testID='customerName' value={this.state.user.customerName} textAlign='right'
								   onChange={value => {
									   this.handleChange('customerName', value)
								   }}/>
							<ErrorMsg validateResults={this.state.validateResults} name='customerName'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="车型"/>}
								   hasLine>
							<SelectLabel data={this.renderCar}
										 onPress={() => this.VehicleSpectrum.open()}/>
							<ErrorMsg validateResults={this.state.validateResults} name='vehicleCode'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="外观颜色"/>}
								   hasLine>
							<SelectLabel data={this.state.user.colorIdOut.label} onPress={() => this.ColorOut.open()}/>
							<ErrorMsg validateResults={this.state.validateResults} name='colorIdOut'/>
						</Form.Item>

						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="内饰颜色"/>}
								   hasLine>
							<SelectLabel data={this.state.user.colorIdIn.label} onPress={() => this.ColorIn.open()}/>
							<ErrorMsg validateResults={this.state.validateResults} name='colorIdIn'/>
						</Form.Item>

						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="选装包"/>}
								   hasLine>
							<SelectLabel data={this.renderPackage}
										 onPress={() => this.VehiclePackage.open()}/>
							<ErrorMsg validateResults={this.state.validateResults} name='customPackCode'/>
						</Form.Item>

						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="是否安装充电桩"/>}
								   hasLine>
							<View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
								<Switch value={this.state.user.isChargingPoint}
										onChange={value => {
											this.handleChange('isChargingPoint', value)
										}}/>
							</View>
							<ErrorMsg validateResults={this.state.validateResults} name='isChargingPoint'/>
						</Form.Item>

						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="预计交车日期"/>}
								   hasLine>
							<SelectLabel data={this.state.user.deliveryCarDate} onPress={() => this.DatePicker.open()}/>

							<ErrorMsg validateResults={this.state.validateResults} name='deliveryCarDate'/>
						</Form.Item>

						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="预计交车时间"/>}
								   hasLine>
							<SelectLabel data={this.state.user.deliveryCarTime} onPress={() => this.TimePicker.open()}/>

							<ErrorMsg validateResults={this.state.validateResults} name='deliveryCarTime'/>
						</Form.Item>

						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="金额"/>}
								   hasLine>
							<Input testID='customerName' value={this.state.user.bigAmount} textAlign='right'
								   onChange={value => {
									   this.handleChange('bigAmount', value)
								   }}/>
							<ErrorMsg validateResults={this.state.validateResults} name='bigAmount'/>
						</Form.Item>

						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="纸质合同照片"/>}
								   hasLine>
							<ImagePickerCamera callBack={value => this.handleChange('contractImgPath', value)}/>
							<ErrorMsg validateResults={this.state.validateResults} name='contractImgPath'/>
						</Form.Item>
					</Form>


					<ButtonWrapper>
						<Button
							testID='submit'
							type='primary'
							onPress={this.save.bind(this)}>
							保存
						</Button>
					</ButtonWrapper>
				</ScrollView>
				<VehicleSpectrum ref={c => this.VehicleSpectrum = c}
								 rightCallback={value => this.handleChange('vehicleCode', value)}/>
				<ColorIn ref={c => this.ColorIn = c}
						 catalogId={this.state.user.vehicleCode}
						 rightCallback={value => this.handleChange('colorIdIn', value)}/>
				<ColorOut ref={c => this.ColorOut = c}
						  catalogId={this.state.user.vehicleCode}
						  rightCallback={value => this.handleChange('colorIdOut', value)}/>
				<VehiclePackage ref={c => this.VehiclePackage = c}
								catalogId={this.state.user.vehicleCode}
								rightCallback={value => this.handleChange('customPackCode', value)}/>

				<DatePicker ref={c => this.DatePicker = c}
							rightCallback={value => this.handleChange('deliveryCarDate', value)}/>

				<TimePicker ref={c => this.TimePicker = c}
							rightCallback={value => this.handleChange('deliveryCarTime', value)}/>
			</CustomerBg>
		);
	}
}
