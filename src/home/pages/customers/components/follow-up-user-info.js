import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {colors, size} from "../../../../style/variables";
import {CustomerInfo, CardTitle, Card, CardTitleIcon} from "../style";
// 预置数据
import {userLevelHash} from '../../../data-config'
import Vehicle from '../../../../common/services/vehicle'
import Sex from "../../../../common/components/sex";
import Icon from "react-native-vector-icons/dist/Feather";
import variables from "../../../../style/beeshell";
import PhoneCall from "../../../../common/components/phone-call";

export default class FollowUpUserInfo extends Component {
	constructor(props) {
		super(props)
		this.vehicle = Vehicle.getInstance()
		this.state = {
			customer: {},
			vehicle: ''
		}
	}

	// 生命周期挂载阶段
	componentDidMount() {
		const {customerNo} = this.props
		if (!customerNo) return
		// 获取客户资料
		axios.get('/admin/customer/loadDetail', {params: {customerNo}})
			.then(({data}) => {

				// 如果isShare 则锁定跟进表单
				if(data.isShare==1){
					this.props.lockForm()
				}

				// 存在level 则设置跟进时间
				if(data.level && this.props.setPlanTime){
					this.props.setPlanTime(data.level)
				}

				// 如果存在code
				let vehicle = ''
				if (data.satCustomerIntentionVO && data.satCustomerIntentionVO.catalogCode) {
					this.vehicle.getNodes(data.satCustomerIntentionVO.catalogCode)
						.then(({name}) => {
							vehicle = name
							this.setState({vehicle})
						})
				}
				this.setState({
					customer: {...data}
				})
			})
	}

	// 点击切换显示更多资料
	handleShowMore() {
		this.setState({
			showMore: !this.state.showMore
		})
	}

	// 更多资料渲染
	renderMore() {
		const {customer} = this.state
		if (this.state.showMore) {
			return (
				<View style={{paddingHorizontal:13,paddingVertical:13}}>
					<CustomerInfo style={{justifyContent:'space-between'}}>
						<View style={{flexDirection:'row'}}>
							<Text style={{fontSize: size.fontsizeMd,marginRight:5,fontWeight:'bold'}}>{customer.name}</Text>
							<Sex data={customer.sex}/>
							<PhoneCall style={{fontWeight:'bold'}} phone={customer.phone}/>
						</View>
						<View>
							<Text >{moment(customer.custCreateTime).format('YYYY-MM-DD HH:mm')}</Text>
						</View>
					</CustomerInfo>
					<CustomerInfo style={{justifyContent:'flex-start'}}>
						<View style={{marginRight: 10}}>
							<Text style={{color: colors.grey3}}>
								{userLevelHash[customer.level] ? userLevelHash[customer.level] : ''}
							</Text>
						</View>
						<View>
							<Text
								style={{color: colors.grey3}}>{this.state.vehicle}</Text>
						</View>
					</CustomerInfo>
				</View>
			)
		} else {
			return null
		}
	}

	render() {
		if (this.props.customerNo) {
			return (
					<Card style={{marginTop:10}}>
						<TouchableOpacity onPress={() => {
							this.handleShowMore()
						}}>
							<CardTitle>
								<Text>
									客户资料
								</Text>
								<CardTitleIcon>
									<Icon
										name={this.state.showMore ? 'chevron-down' : 'chevron-up'}
										size={20}
										color={variables.mtdGrayLight}/>
								</CardTitleIcon>
							</CardTitle>
						</TouchableOpacity>
						{this.renderMore()}
					</Card>
			)
		} else {
			return null
		}
	}
}
