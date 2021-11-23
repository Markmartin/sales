import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {ButtonText, CluesBg, Content, ContentInner, InfoItem, LabelText, ValueText} from './style'
import {colors} from "../../../style/variables";
import {Button, Dialog, Tip} from 'beeshell';
import navigation from "../../../common/services/navigation";
import DateTimePicker from "../../../common/components/date-time";
import {apply} from '../../../common/tool/dictionaries';
import Textarea from 'react-native-textarea';
import {Line, StepsBox, StepsBoxItem, StepsBoxItemText, StepsBoxItemTitle} from "../delivery/styles";
import {Loading} from "../../../common/components/loading";
import {inject} from 'mobx-react';
import {forEach} from "lodash";

@inject(['userStore']) // 注入对应的store

export default class Detail extends Component {
	constructor(props) {
		super(props)
		this.role = this.props.userStore.role
		this.user = this.props.userStore.user
		this.state = {
			disableHours: {},
			name: '',
			info: {},
			dateTime: '',
			dateTimeAll: '',
			show: false,
			value: '',
			reason: ''
		}
		this.getLoad = this.getLoad.bind(this)
		this.applyHandel = this.applyHandel.bind(this)
		this.beginHandle = this.beginHandle.bind(this)
		this.cancelHandle = this.cancelHandle.bind(this)
		this.onChange = this.onChange.bind(this)
		this.saveHandle = this.saveHandle.bind(this)
	}

	componentDidMount() {
		const {navigation} = this.props;
		let id = navigation.getParam('id')
		let state = navigation.getParam('state')
		let isFromMsg = navigation.getParam('isFromMsg')
		this.setState({value: state})
		// 获取数据
		this.getLoad(id, isFromMsg)
		// 根据权限获取试驾时间安排
		if (this.role.roleCode !== 'rolePartnerTestDrive') return
		this.setDriverTime(this.user.userCode)
	}

	selectChange(date, time) {
		let dateTime = `${date} ${time}`
		let handleTime = moment(dateTime).format('YYYY-MM-DD HH:mm')
		this.setState({
			dateTime: handleTime,
			dateTimeAll: dateTime
		})
	}

	applyHandel(value) {
		if (!value) return ''
		let obj = null
		apply.filter(item => {
			if (item.dictKey === value) {
				obj = item
			} else {
				obj = {dictValue: ''}
			}
		})
		return obj.dictValue
	}

	// 获取数据
	getLoad(id, status) {
		let urlPath = status ? '/admin/satTestDrive/testDriveInfo' : '/admin/satTestDrive/load'
		let param = status ? {customerNo: id} : {driveId: id}
		// 开启菊花
		Loading.show()
		return axios.get(urlPath, {
			params: param
		}).then(({data}) => {
			// 隐藏菊花
			Loading.hidden()
			// 保存数据
			this.setState({
				info: data,
				dateTime: this.state.value !== '1' ? data.driveTime : data.completeDriveTime
			})
		}).catch(({data}) => {
			// 隐藏菊花
			Loading.hidden()
			Tip.show(data.msg, 1000, 'center');
		})
	}

	onChange(value) {
		this.setState({
			reason: value
		})
	}

	beginHandle() {
		let params = {
			driveId: this.state.info.driveId,
			planDriveTime: this.state.dateTimeAll
		}
		axios.post('/admin/satTestDrive/begin', params)
			.then(({data}) => {
				navigation.navigate('DriveOver', {driveId: this.state.info.driveId})
			})
	}

	cancelHandle() {
		this.dialog.open()
	}

	getLabel(label) {
		const color = colors.primary
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					paddingVertical: 11,
					paddingHorizontal: 15,
					borderTopColor: colors.grey5,
					borderTopWidth: 1
				}}>
				<Text style={{fontSize: 16, color, marginLeft: 5}}>{label}</Text>
			</View>
		)
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
	saveHandle() {
		let params = {
			driveId: this.state.info.driveId,
			cancelReason: this.state.reason
		}
		axios.post('/admin/satTestDrive/cancelTestDrive', params)
			.then(() => {
				Tip.show('取消订单成功', 2000, 'center')
				navigation.navigate('Driver')
			})
	}

	// 试驾专家可修改权限
	modifyRole(){
		return this.state.value == '1' && this.role.roleCode === 'rolePartnerTestDrive' && this.state.info.testDriveStatus == 1
	}

	render() {
		const {testDriveStatus} = this.state.info
		return (
			<CluesBg>
				<ScrollView>
					{
						this.modifyRole() ? (<StepsBox>
							<StepsBoxItem>
								<View style={styles.StepsBoxItem}>
									<StepsBoxItemText><Text style={{
										color: 'white',
										alignSelf: 'center',
										paddingTop: 1
									}}>1</Text></StepsBoxItemText>
								</View>
								<View>
									<StepsBoxItemTitle>确认信息</StepsBoxItemTitle>
								</View>
							</StepsBoxItem>
							<Line></Line>
							<StepsBoxItem>
								<View style={styles.StepsBoxItem}>
									<StepsBoxItemText style={{backgroundColor: '#e3e6e6'}}><Text style={{
										alignSelf: 'center',
										color: colors.white,
										paddingTop: 1
									}}>2</Text></StepsBoxItemText>
								</View>
								<View>
									<StepsBoxItemTitle>试驾感知</StepsBoxItemTitle>
								</View>
							</StepsBoxItem>
						</StepsBox>) : (<Text></Text>)
					}

					<Content>
						<ContentInner style={{marginBottom: 10}}>
							<InfoItem>
								<LabelText><Text>申请类型:</Text></LabelText>
								<ValueText><Text>{this.state.info.applyType == '1' ? 'APP申请' : '展厅申请'}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>试驾时间:</Text></LabelText>
								<ValueText><Text>{this.state.dateTime ? moment(this.state.dateTime).format('YYYY-MM-DD HH:mm') : ''}</Text></ValueText>
								{
									this.modifyRole() ? (
										<TouchableOpacity style={{marginRight: 80}}
														  onPress={() => {
															  this.setState({
																  show: true
															  })
														  }}>
											<ValueText style={{color: colors.primary}}>修改</ValueText>
										</TouchableOpacity>) : (<Text></Text>)
								}
							</InfoItem>
							<InfoItem>
								<LabelText><Text>客户姓名:</Text></LabelText>
								<ValueText><Text>{this.state.info.name}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>客户电话:</Text></LabelText>
								<ValueText><Text>{this.state.info.phone}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>试驾车系:</Text></LabelText>
								<ValueText><Text>{this.state.info.seriesName}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>试驾路线:</Text></LabelText>
								<View style={{width: 160, height: 90, backgroundColor: colors.grey3}}>
									<Image source={{uri: this.state.info.routePicPath}}
										   style={{width: 160, height: 90}}/>
								</View>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>试驾专家:</Text></LabelText>
								<ValueText><Text>{this.state.info.expertName}</Text></ValueText>
							</InfoItem>
							{testDriveStatus == 3 ? <InfoItem>
								<LabelText><Text>试驾专家描述:</Text></LabelText>
								<ValueText><Text>{this.state.info.driveInfo}</Text></ValueText>
							</InfoItem> : null}
							<InfoItem>
								<LabelText><Text>试驾方式:</Text></LabelText>
								<ValueText><Text>{this.state.info.driveStyle == '1' ? '上门试驾' : '到店试驾'}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>试驾类型:</Text></LabelText>
								<ValueText><Text>{this.state.info.driveType == '1' ? '本人试驾' : '他人试驾'}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>证件类型:</Text></LabelText>
								<ValueText><Text>{this.state.info.driveType == '1' ? '身份证' : '驾驶证'}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>上传附件:</Text></LabelText>
								<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
									<Image source={{uri: this.state.info.certPicFront}} style={styles.img}/>
									<Image source={{uri: this.state.info.agreementPicPath}} style={styles.img}/>
								</View>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>驾车协议:</Text></LabelText>
								<TouchableOpacity onPress={() => {
									navigation.navigate('Treaty')
								}}>
									<ButtonText>
										<Text style={{color: colors.primary}}>《试驾车使用规范协议》</Text>
									</ButtonText>
								</TouchableOpacity>
							</InfoItem>
						</ContentInner>
						{
							this.modifyRole() ? (
								<View style={styles.buttonBox}>
									<Button onPress={this.cancelHandle} style={styles.cancel}><Text
										style={{color: colors.primary, fontSize: 16}}>取消试驾</Text></Button>
									<Button onPress={this.beginHandle} style={styles.start}><Text
										style={{color: colors.white, fontSize: 16}}>试驾确认</Text></Button>
								</View>) : (<Text></Text>)
						}

					</Content>
				</ScrollView>
				{/*    日期时间控件*/}
				<DateTimePicker show={this.state.show}
								showTime='HH'
								startTime='09'
								endTime='19'
								disableHours={this.state.disableHours}
								callBack={(date, time) => this.selectChange(date, time)} />
				{/*  取消试驾弹窗  */}
				<Dialog ref={c => this.dialog = c}
					header={
						<View style={{paddingTop: 20, alignItems: 'center'}}>
							<Text style={{fontSize: 17}}>取消试驾</Text>
						</View>
					}
					body={<View style={{backgroundColor: '#fff', padding: 16}}>
							<View style={styles.border}>
								<Textarea
									onChangeText={this.onChange}
									defaultValue={this.state.reason}
									placeholderTextColor={'#c7c7c7'}
									placeholder={'请输入取消试驾原因'}
									underlineColorAndroid={'transparent'}
								/>
							</View>
						</View>}
					cancelable={true}
					operations={[
						{
							label: this.getLabel('取消', 'confirm', 1),
							onPress: () => {
								this.setState({
									reason: ''
								})
								this.dialog.close()
							}
						},
						{
							label: this.getLabel('确定', 'confirm', 2),
							type: 'confirm',
							onPress: () => {
								this.saveHandle()
							}
						}
					]}>
				</Dialog>
			</CluesBg>
		);
	}
}

const styles = StyleSheet.create({
	img: {width: 60, height: 60, backgroundColor: '#ccc', marginLeft: 10},
	buttonBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	border: {
		borderTopColor: colors.grey4,
		borderTopWidth: 1,
		borderBottomColor: colors.grey4,
		borderBottomWidth: 1,
		borderLeftColor: colors.grey4,
		borderLeftWidth: 1,
		borderRightColor: colors.grey4,
		borderRightWidth: 1,
	},
	cancel: {
		borderColor: colors.primary,
		borderWidth: 1,
		color: colors.primary
	},
	start: {
		backgroundColor: colors.primary
	},
	StepsBoxItem: {paddingLeft: 22, paddingBottom: 10}
});
