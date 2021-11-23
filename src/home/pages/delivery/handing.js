import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {Button, Form, Input, Radio, Tip} from 'beeshell';
import Icon from 'react-native-vector-icons/dist/Feather';
import Textarea from 'react-native-textarea';
import ImagePickerCamera from '../../../common/components/image-picker-camera'
import {CRadio, ErrorMsg, RequiredLabel} from '../../../common/components/form'
import {CluesBg, StepsBox, StepsBoxItem, StepsBoxItemText, StepsBoxItemTitle, Line, Content, InfoItem, LabelText, ValueText} from './styles'
import {colors} from "../../../style/variables";
import {inject} from 'mobx-react';

@inject(['userStore']) // 注入对应的store

export default class Handle extends Component {
	constructor(props) {
		super(props)
		this.store = this.props.userStore
		this.state = {
			handleTime: '',
			text: '',
			value: 1,
			customerNo: '',
			orderCustomerNo: '',
			picPath1: '',
			picPath2: '',
			picPath3: '',
			description1: '入库检查表',
			description2: 'PDI检查表',
			description3: '整车整备质检表'
		}
		this.onChange = this.onChange.bind(this)
		this.save = this.save.bind(this)
	}

	componentDidMount() {
		const {navigation} = this.props;
		let handleId = navigation.getParam('handleId')
		this.getLoad(handleId)
	}

	getLoad(id) {
		return axios.get('/admin/handleVehicle/load', {params: {handleId: id}})
			.then(({data}) => {
				// 判断如果是刷新则清空数据
				this.setState(
					() => {
						return {
							handleTime: data.handleTime,
							userName: data.userName,
							customerNo: data.customerNo,
							orderCustomerNo: data.orderCustomerNo
						}
					})
			})
	}

	save() {
		// 判断是否拍照
		if (!this.state.picPath1 || !this.state.picPath2 || !this.state.picPath3) {
			Alert.alert('提示', '请完善拍照信息')
			return
		}

		const {navigation} = this.props;
		let handleId = navigation.getParam('handleId');
		let params = {
			handleUser: this.store.user.realName,
			handleStyle: this.state.value,
			handlePic1: this.state.picPath1,
			handlePic2: this.state.picPath2,
			handlePic3: this.state.picPath3,
			info: this.state.text,
			customerNo: this.state.customerNo,
			handleId: handleId,
			orderCustomerNo: this.state.orderCustomerNo
		}
		this.tip.open();
		axios.post('/admin/handleVehicle/complete', params)
			.then(({data}) => {
				this.tip.close().then(() => {
					navigation.navigate('HandOver')
				})
			}).catch(() => this.tip.close())
	}

	onChange(value) {
		this.setState({
			text: value
		})
	}

	render() {
		return (
			<CluesBg>
				<ScrollView>
					<StepsBox>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText>
									<Icon name='check' size={16} style={{alignSelf: 'center', paddingTop: 2}}
										  color='white'></Icon>
								</StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>交车信息</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
						<Line style={{backgroundColor: colors.primary}}></Line>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText><Text style={{
									alignSelf: 'center',
									color: 'white',
									paddingTop: 1
								}}>2</Text></StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>进行交车</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
					</StepsBox>
					<Form>
						<Form.Item style={{paddingVertical: 15, paddingRight: 100}} label="交车时间:" hasLine>
							<ValueText style={{textAlign: 'right'}}>
								<Text>{this.state.handleTime ? moment(this.state.handleTime).format('YYYY-MM-DD HH:mm') : ''}</Text>
							</ValueText>
						</Form.Item>
						<Form.Item style={{paddingVertical: 15, paddingRight: 100}} label="交付小驰:" hasLine>
							<ValueText style={{textAlign: 'right'}}><Text>{this.store.user.realName}</Text></ValueText>
						</Form.Item>
						<Form.Item style={{paddingVertical: 0, paddingRight: 100}} label='交车方式:'>
							<CRadio
								value={this.state.value}
								onChange={(value) => {
									this.setState({
										value: value
									})
								}}>
								<Radio.Item label='上门' style={{marginRight: 30}} value={1}/>
								<Radio.Item label='店内' value={2}/>
							</CRadio>
						</Form.Item>
					</Form>
					<View style={styles.line,{height: 8}}><Text></Text></View>
					<Content style={styles.content}>
						<InfoItem style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
							<Text style={{color: colors.grey0, fontSize: 16}}>上传附件</Text>
						</InfoItem>
						<View style={{
							flexDirection: 'row',
							justifyContent: 'space-around',
							paddingTop: 5,
							paddingBottom: 10
						}}>
							<View style={styles.photo}>
								<ImagePickerCamera callBack={value => this.setState({picPath1: value})}
												   description={this.state.description1}/>
							</View>
							<View style={styles.photo}>
								<ImagePickerCamera callBack={value => this.setState({picPath2: value})}
												   description={this.state.description2}/>
							</View>
							<View style={styles.photo}>
								<ImagePickerCamera callBack={value => this.setState({picPath3: value})}
												   description={this.state.description3}/>
							</View>
						</View>
					</Content>
					<View style={styles.line}></View>
					<Content style={styles.content}>
						<InfoItem style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
							<Text style={{color: colors.grey0, fontSize: 16}}>备注信息</Text>
						</InfoItem>
						<Textarea
							onChangeText={this.onChange}
							defaultValue={this.state.text}
							maxLength={50}
							placeholder={'请输入备注信息'}
							placeholderTextColor={'#c7c7c7'}
							underlineColorAndroid={'transparent'}
						/>
					</Content>
					<View style={{paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 20}}>
						<Button
							testID='submit'
							type='primary'
							onPress={this.save}>
							确认交车
						</Button>
					</View>
				</ScrollView>
				{/*  提示  */}
				<Tip
					ref={(c) => {
						this.tip = c
					}}
					body={
						<View>
							<ActivityIndicator size='small' color='#fff'/>
							<Text style={{color: '#fff', textAlign: 'center', marginTop: 10}}>提交中</Text>
						</View>
					}
					cancelable={true}>
				</Tip>
			</CluesBg>
		);
	}
}

const styles = StyleSheet.create({
	StepsBoxItem: {paddingLeft: 22, paddingBottom: 10},
	content: {backgroundColor: 'white', paddingTop: 16, marginBottom: 10},
	content1: {backgroundColor: 'white', paddingTop: 16, marginBottom: 0},
	photo: {
		width: 100,
		height: 133,
		borderBottomColor: colors.grey5,
		borderBottomWidth: 1,
		borderTopColor: colors.grey5,
		borderTopWidth: 1,
		borderLeftColor: colors.grey5,
		borderLeftWidth: 1,
		borderRightColor: colors.grey5,
		borderRightWidth: 1
	}
});
