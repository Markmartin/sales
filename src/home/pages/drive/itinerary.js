import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, Image, SafeAreaView} from 'react-native';
import {Button, Form, BottomModal, Scrollpicker, Tip} from 'beeshell';
import navigation from "../../../common/services/navigation";
import {CluesBg, StepsBox, StepsBoxItem, StepsBoxItemText, StepsBoxItemTitle, Line} from './style'
import {colors} from "../../../style/variables";
import Icon from 'react-native-vector-icons/dist/Feather';
import {ErrorMsg, RequiredLabel, SelectLabel, VehicleSpectrum} from "../../../common/components/form";
import {itineraryForm, itineraryValidate} from "./validator";
import Swiper from 'react-native-swiper';
import Textarea from 'react-native-textarea';

import {forEach, join, map} from "lodash";
import {Content, InfoItem} from "../delivery/styles";

export default class Itinerary extends Component {
	constructor(props) {
		super(props)
		this.getUser = null
		this.params = {}
		this.state = {
			value: 1,
			text: '',
			info: {},
			show: false,
			memo: '',
			audi: '',
			audiCode: '',
			validateResults: {},
			currentIndex: 1,
			routes: [],
			catalogList: [],
			rowIndex: '',
			loading: false
		}
		this.nextStep = this.nextStep.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	componentDidMount() {
		const {navigation} = this.props;
		const user = navigation.getParam('user')
		const {phone, planDriveTime, customerName, applyType, driveType, driveStyle, certType, certPicFront, testDriveExpert, agreementPicPath} = user

		let params = {
			phone,
			planDriveTime,
			customerName,
			applyType,
			driveType,
			driveStyle,
			certType,
			certPicFront,
			agreementPicPath,
			testDriveExpert,
			audi: '',
			memo: '',
			testDriveRouteId: '',

		}
		this.params = params
		this.getRoutes()
		this.getModal()
	}

	componentDidUpdate() {
	}

	getRoutes() {
		axios.get('/admin/satTestDriveRoute/page', {params: {pageSize: 100, pageNum: 1}})
			.then(({data}) => this.setState({routes: data.list}))
	}

	getModal() {
		axios.get('/admin/vehicleStock/catalogList')
			.then(({data}) => {
				this.setState(
					{catalogList: data})
			})
	}

	handleChange(key, value) {
		let ret
		itineraryValidate(key, value, (tmp) => {
			ret = tmp
		})
		this.setState(prevState => {
			return {
				[key]: value,
				validateResults: {...prevState.validateResults, [key]: ret}
			}
		})
	}

	onChange(value) {
		this.setState({
			memo: value
		})
	}

	nextStep() {
		// 验证数据
		let flag = false
		let requiredData = [...itineraryForm]
		forEach(requiredData, e => {
			const result = this.state.validateResults[e]
			// validateResults 不存在，则是未改变
			if (!result) {
				// 进行验证
				flag = true
				this.handleChange(e, this.state[e])
			}
			// 存在且valid 为false 返回
			if (result && !result.valid) {
				flag = true
			}
		})
		if (flag) return
		this.params.audi = this.state.audiCode
		this.params.memo = this.state.memo
		if (!this.state.routes.length) {
			Tip.show('未选择路线', '2000')
			return
		}
		this.params.testDriveRouteId = this.state.routes[this.state.currentIndex - 1].testDriveRouteId
		this.setState({loading:true})
		axios.post('/admin/satTestDrive/save', this.params)
			.then(() => navigation.navigate('Success'))
			.finally(()=>this.setState({loading:false}))
	}

	// 组合显示车型
	get renderCar() {
		return join(map(this.state.audi, item => item ? item.label : ''), '-')
	}

	renderSafeArea() {
		return (
			<View style={{maxHeight: 30}}>
				<SafeAreaView style={{flex: 1}}>
					<View style={{height: 60}}></View>
				</SafeAreaView>
			</View>
		)
	}

	render() {
		const currentRouter = this.state.routes[this.state.currentIndex - 1]
		return (
			<CluesBg>
				<ScrollView>
					<StepsBox>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText style={{textAlignVertical: 'center'}}>
									<Icon name='check' size={16} color='white'
										  style={{alignSelf: 'center', paddingTop: 2}}></Icon>
								</StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>试驾须知</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
						<Line style={{backgroundColor: colors.primary}}></Line>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText><Text
									style={{color: 'white', alignSelf: 'center'}}>2</Text></StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>车型路线</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
					</StepsBox>
					<View style={{backgroundColor: '#fff', paddingBottom: 16, paddingTop: 12}}>
						<View style={{paddingRight: 16, paddingLeft: 16}}>
							<View style={styles.title}>
								<Text>{currentRouter ? currentRouter.routeName : ''}</Text>
								<View style={{flexDirection: 'row', alignItems: 'center'}}><Text style={{
									fontWeight: 'bold',
									fontSize: 18
								}}>{this.state.currentIndex}</Text><Text>/{this.state.routes.length}</Text></View>
							</View>
						</View>
						<View style={{height: 144}}>
							<Swiper showsPagination={false} loop={false}
									style={styles.wrapper} onIndexChanged={(index) => {
								this.setState({currentIndex: index + 1})
							}}>
								{this.state.routes.map((item, i) => {
									return (
										<View style={styles.slide1} key={i}>
											<Image source={{uri: item.picPath}}
												   style={{height: 144, width: '100%'}}/>
										</View>
									)
								})}
							</Swiper>
							{/*<Image source={require('../../../assets/images/route3.png')} style={{height: 144, width: '100%'}}></Image>*/}
						</View>
					</View>
					<Form>
						<View style={{height: 8, backgroundColor: colors.background}}></View>
						<Form.Item style={{paddingVertical: 13}} label={<RequiredLabel labelName="试驾车型"/>}
								   hasLine>
							<SelectLabel data={this.state.audi} onPress={() => {
								this.bottomModal.open()
							}}/>
							<ErrorMsg validateResults={this.state.validateResults} name='audi'/>
						</Form.Item>
					</Form>
					<Content style={styles.content}>
						<InfoItem style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
							<Text>备注信息</Text>
						</InfoItem>
						<Textarea
							onChangeText={this.onChange}
							defaultValue={this.state.memo}
							maxLength={50}
							placeholder={'请输入备注信息'}
							placeholderTextColor={'#c7c7c7'}
							underlineColorAndroid={'transparent'}
						/>
					</Content>
					<View style={{paddingLeft: 16, paddingRight: 16, marginTop: 36, marginBottom: 20}}>
						<Button
							testID='submit'
							type='primary'
							disabled={this.state.loading}
							onPress={this.nextStep}>
							保存并提交
						</Button>
					</View>
				</ScrollView>
				<BottomModal
					ref={(c) => {
						this.bottomModal = c
					}}
					title='请选择'
					rightCallback={() => {
						this.setState({
							audi: this.getUser.catalogName,
							audiCode: this.getUser.catalogCode
						})
						this.handleChange('audi', this.getUser.catalogName)
					}}
					cancelable={true}>
					<View style={{paddingVertical: 15}}>
						<Scrollpicker
							style={{paddingHorizontal: 0}}
							list={[
								this.state.catalogList
							]}
							proportion={[1]}
							renderItem={(item) => {
								return (
									<View
										style={{
											flexDirection: 'row',
											paddingVertical: 10
										}}>
										<Text>
											{item.catalogName}
										</Text>
									</View>
								)
							}}
							onChange={(columnIndex, rowIndex) => {
								this.getUser = this.state.catalogList[rowIndex]
							}}
						/>
					</View>
					{this.renderSafeArea()}
				</BottomModal>
				<VehicleSpectrum ref={c => this.VehicleSpectrum = c}
								 rightCallback={value => this.handleChange('audi', value)}/>
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
	files: {borderTopWidth: 1, borderTopColor: colors.grey5, marginTop: 15, flexDirection: 'row', paddingTop: 10},
	content: {
		backgroundColor: 'white',
		paddingTop: 17,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 17,
		marginTop: 8
	},
	textArea: {
		backgroundColor: 'white',
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 17
	},
	title: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 16,
		alignItems: 'center'
	},
	wrapper: {},
	slide1: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#9dd6eb',
		marginLeft: 16,
		marginRight: 16,
		borderRadius: 4,
		overflow: 'hidden'
	},
	slide2: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#97cae5',
		marginLeft: 16,
		marginRight: 16
	},
	slide3: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#92bbd9',
		marginLeft: 16,
		marginRight: 16
	},
	text: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold',
		marginLeft: 16,
		marginRight: 16
	}
});
