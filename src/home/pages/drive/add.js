import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Button, Form, Input, Actionsheet, Dialog} from 'beeshell';
import navigation from "../../../common/services/navigation";
import {CluesBg, StepsBox, StepsBoxItem, StepsBoxItemText, StepsBoxItemTitle, Line} from './style'
import {colors} from "../../../style/variables";
import Icon from 'react-native-vector-icons/dist/Feather';
import DateTimePicker from "../../../common/components/date-time";
import {ErrorMsg, RequiredLabel, SelectLabel} from "../../../common/components/form";
import ImagePickerCamera from "../../../common/components/image-picker-camera";
import SelectImage from "../../../common/components/select-image";
import {validate, requiredForm} from "./validator";
import {certType, applySelect, driveSelect, driveStyleSelect} from '../../../common/tool/dictionaries'
import {forEach, map} from "lodash";
import {inject} from 'mobx-react';

@inject(['userStore']) // 注入对应的store

export default class Add extends Component {
	constructor(props) {
		super(props)
		this.role = this.props.userStore.role
		this.state = {
			disableHours: {},
			value: 1,
			handleTime: '',
			handleTimeAll: '',
			info: {},
			show: false,
			user: {
				phone: '',
				planDriveTime: '',
				customerName: '',
				applyType: '',
				applyTypeCode: '',
				driveType: '',
				driveTypeCode: '',
				driveStyle: '',
				driveStyleCode: '',
				certType: '',
				certTypeCode: '',
				imgPath1: '',
				imgPath2: ''
			},
			validateResults: {},
			checked: false,
			formName: '',
			typeName: '',
		}
		this.nextStep = this.nextStep.bind(this)
		this.queryCustomer = this.queryCustomer.bind(this)
	}

	componentDidMount() {
		axios.get('/admin/staff/listStaffByRoleCode', {params: {roleCode: 'rolePartnerTestDrive'}})
			.then(({data}) => this.setState({
				drivers: map(data, i => {
					return {label: i.staffName, value: i.accountNo}
				})
			}))
	}

	// 获取试驾专家时间
	setDriverTime(testDriveExpert) {
		let disableHours = {}
		axios.get('/admin/satTestDrive/testDriveDate', {params: {testDriveExpert}})
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
		return ret
	}

	// 查询客户
	queryCustomer(value) {
		if (value.length > 10) {
			let params = {
				phone: value
			}
			return axios.get('/admin/customer/getCustomerByPhone', {params: params})
				.then((data) => {
					this.setState((prevState) => {
						return {
							user: {
								...this.state.user,
								customerName: data.data.name
							}
						}
					})
				})
				.catch(() => this._dialog.open())
		} else {
			this.setState(
				(prevState) => {
					return {
						user: {
							...this.state.user,
							customerName: '',
							phone: value
						}
					}
				})
		}
	}

	selectChange(date, time) {
		let dateTime = moment(`${date} ${time}`).format('YYYY-MM-DD HH:mm')
		this.setState({
			show: false,
			user: {
				...this.state.user,
				planDriveTime: dateTime,
			}
		})
		this.handleChange('planDriveTime', dateTime)
	}

	selectType(type) {
		this.setState({typeName: type})
		this.actionsheet.open()
	}

	nextStep() {
		// 验证数据
		let flag = false
		let requiredData = [...requiredForm, 'phone']
		forEach(requiredData, e => {
			let result = this.state.validateResults[e]
			// validateResults 不存在，则是未改变
			if (!result) {
				result = this.handleChange(e, this.state.user[e])
			}
			// 存在且valid 为false 返回
			if (result && !result.valid) {
				flag = true
			}
		})
		if (flag) return
		if (!this.state.checked) return
		// 处理数据
		const {user} = this.state
		let params = {
			phone: user.phone,
			planDriveTime: moment(user.planDriveTime).format('YYYY-MM-DD HH:mm:ss'),
			customerName: user.customerName,
			applyType: user.applyTypeCode,
			driveType: user.driveTypeCode,
			driveStyle: user.driveStyleCode,
			certType: user.certTypeCode,
			certPicFront: user.imgPath1,
			agreementPicPath: user.imgPath2,
			testDriveExpert: user.testDriveExpert
		}
		navigation.navigate('Itinerary', {user: params})
	}

	render() {
		return (
			<CluesBg>
				<ScrollView>
					<StepsBox>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText><Text style={{
									color: colors.white,
									alignSelf: 'center',
									paddingTop: 1
								}}>1</Text></StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>试驾须知</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
						<Line/>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText style={{backgroundColor: '#e3e6e6'}}><Text
									style={{alignSelf: 'center', paddingTop: 1}}>2</Text></StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>车型路线</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
					</StepsBox>
					<Form>
						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="客户电话"/>}
								   hasLine>
							<Input testID='phone' value={this.state.user.phone} textAlign='right'
								   onChange={value => {
									   this.handleChange('phone', value)
									   this.queryCustomer(value)
								   }}/>
							<ErrorMsg validateResults={this.state.validateResults} name='phone'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="客户姓名"/>}
								   hasLine>
							<Input testID='customerName' value={this.state.user.customerName} textAlign='right'
								   editable={false}
								   onChange={value => this.handleChange('customerName', value)}/>
							<ErrorMsg validateResults={this.state.validateResults} name='phone'/>
						</Form.Item>
						<View style={{height: 8, backgroundColor: colors.background}}/>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="试驾专员"/>}
								   hasLine>
							<SelectLabel data={this.state.user.testDriveExpertLabel}
										 onPress={() => this.TestDriveExpert.open()}/>
							<ErrorMsg validateResults={this.state.validateResults} name='testDriveExpert'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="试驾时间"/>}
								   hasLine>
							<SelectLabel data={this.state.user.planDriveTime} onPress={() => {
								this.setState({formName: 'planDriveTime', show: true})
							}}/>
							<ErrorMsg validateResults={this.state.validateResults} name='planDriveTime'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="申请类型"/>}
								   hasLine>
							<SelectLabel data={this.state.user.applyType} onPress={() => {
								this.setState({typeName: 'applyType'})
								this.actionsheet.open()
							}}/>
							<ErrorMsg validateResults={this.state.validateResults} name='applyType'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="试驾类型"/>}
								   hasLine>
							<SelectLabel data={this.state.user.driveType} onPress={() => {
								this.setState({typeName: 'driveType'})
								this.actionsheet2.open()
							}}/>
							<ErrorMsg validateResults={this.state.validateResults} name='driveType'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="试驾方式"/>}
								   hasLine>
							<SelectLabel data={this.state.user.driveStyle} onPress={() => {
								this.setState({typeName: 'driveStyle'})
								this.actionsheet3.open()
							}}/>
							<ErrorMsg validateResults={this.state.validateResults} name='driveStyle'/>
						</Form.Item>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="证件类型"/>}
								   hasLine>
							<SelectLabel data={this.state.user.certType} onPress={() => {
								this.setState({typeName: 'certType'})
								this.actionsheet4.open()
							}}/>
							<ErrorMsg validateResults={this.state.validateResults} name='certType'/>
						</Form.Item>
						<View style={{height: 8, backgroundColor: colors.background}}></View>

						<Form.Item style={{paddingVertical: 13}}
								   label={<RequiredLabel labelName="上传附件"/>}
								   hasLine>
							<View></View>
							<View style={styles.files}>
								<View style={styles.imgBox}>
									<ImagePickerCamera callBack={value => this.handleChange('imgPath1', value)}
													   description='证件拍照'/>
								</View>
								{/* 选择照片方法添加 */}
								<view style={styles.imgBox}>
									<SelectImage callBack={value=>this.handleChange('imgPath1',value)} description='选择照片'></SelectImage>
								</view>
								<View style={styles.imgBox}>
									<ImagePickerCamera callBack={value => this.handleChange('imgPath2', value)}
													   description='试驾协议'/>
								</View>
							</View>
							{
								this.state.user.imgPath1 === '' || this.state.user.imgPath2 === '' ? (
									<ErrorMsg validateResults={this.state.validateResults} name='imgPath1'/>) : (
									<Text></Text>)
							}
						</Form.Item>
					</Form>
					<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16}}>
						{
							this.state.checked ? (
									<Icon name='check-square' size={18} style={{marginRight: 5}} color={colors.primary}
										  onPress={() => {
											  this.setState({checked: false})
										  }}/>) :
								(<Icon name='square' size={18} style={{marginRight: 5}} color={colors.grey3}
									   onPress={() => {
										   this.setState({checked: true})
									   }}/>)
						}
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Text>确认试驾人已认真阅读</Text>
							<TouchableOpacity>
								<Text style={{color: colors.primary}}>《试驾车使用规范协议》</Text>
							</TouchableOpacity>
							<Text>并签署</Text>
						</View>
					</View>
					<View style={{paddingLeft: 16, paddingRight: 16, marginTop: 12, marginBottom: 16}}>
						<Button
							testID='submit'
							type='primary'
							onPress={this.nextStep}>
							保存并下一步
						</Button>
					</View>
				</ScrollView>
				<DateTimePicker show={this.state.show}
								showTime='HH'
								startTime='09'
								endTime='19'
								disableHours={this.state.disableHours}
								callBack={(date, time) => this.selectChange(date, time)}/>
				<Actionsheet
					ref={(c) => {
						this.actionsheet = c;
					}}
					header='选择类型'
					data={applySelect}
					cancelable={false}
					onPressConfirm={(item) => {
						this.handleChange('applyTypeCode', item.value)
						this.handleChange('applyType', item.label)
					}}
					onPressCancel={() => {
					}}>
				</Actionsheet>
				<Actionsheet
					ref={(c) => {
						this.actionsheet2 = c;
					}}
					header='选择类型'
					data={driveSelect}
					cancelable={false}
					onPressConfirm={(item) => {
						this.setState({
							user: {
								...this.state.user,
								driveType: item.label,
								driveTypeCode: item.value
							}
						})
						this.handleChange('driveType', item.label)
					}}
					onPressCancel={() => {
					}}>
				</Actionsheet>
				<Actionsheet
					ref={(c) => {
						this.actionsheet3 = c;
					}}
					header='选择类型'
					data={driveStyleSelect}
					cancelable={false}
					onPressConfirm={item => {
						this.handleChange('driveStyle', item.label)
						this.handleChange('driveStyleCode', item.value)
					}}
					onPressCancel={() => {
					}}>
				</Actionsheet>
				<Actionsheet
					ref={(c) => this.TestDriveExpert = c}
					header='请选择试驾专员'
					data={this.state.drivers}
					cancelable={false}
					onPressConfirm={item => {
						this.handleChange('testDriveExpert', item.value)
						this.handleChange('testDriveExpertLabel', item.label)
						this.setDriverTime(item.value)
					}} />
				<Actionsheet
					ref={(c) => {
						this.actionsheet4 = c;
					}}
					header='选择类型'
					data={certType}
					cancelable={false}
					onPressConfirm={(item) => {
						this.setState({
							user: {
								...this.state.user,
								certType: item.label,
								certTypeCode: item.value
							}
						})
						this.handleChange('certType', item.label)
					}}
					onPressCancel={() => {
					}}>
				</Actionsheet>
				{/*    销售人员判断是否去维护客户*/}
				<Dialog
					ref={(c) => {
						this._dialog = c
					}}
					cancelable={false}
					title='搜索无号码信息'
					bodyText='您当前输入的手机号码，没有客户信息，请去维护！'
					cancelLabelText='取消'
					confirmLabelText='维护'
					cancelLabelTextStyle={{color: colors.primary}}
					cancelCallback={() => {
						navigation.navigate('Driver')
						this._dialog.close()
					}}
					confirmCallback={() => {
						navigation.navigate('Customers')
						this._dialog.close()
					}}
				/>
			</CluesBg>
		);
	}
}

const styles = StyleSheet.create({
	StepsBoxItem: {paddingLeft: 22, paddingBottom: 10},
	imgBox: {
		width: 100,
		height: 133,
		borderTopColor: colors.grey5,
		borderLeftColor: colors.grey5,
		borderRightColor: colors.grey5,
		borderBottomColor: colors.grey5,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderBottomWidth: 1,
		marginLeft: 15
	},
	files: {borderTopWidth: 1, borderTopColor: colors.grey5, marginTop: 15, flexDirection: 'row', paddingTop: 10}
});
