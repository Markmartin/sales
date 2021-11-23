import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { FollowUpList, FollowUpItem, FollowUpListText, CardTitle, Card, CardTitleIcon} from "../style";
import {camelCase, last} from 'lodash'

// 预置数据
import {userLevelHash, followItemHash, followStyleHash,historyFollowItemHash} from '../../../data-config'
import Icon from "react-native-vector-icons/dist/Feather";
import variables from "../../../../style/beeshell";
import {inject} from 'mobx-react'
@inject(['userStore']) // 注入对应的store
export default class FollowUpHistoryList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			followList: []
		}
		this.store = this.props.userStore
	}

	// 生命周期挂载阶段
	componentDidMount() {
		this.refresh()
	}

	// 刷新数据
	refresh() {
		const {customerNo} = this.props
		if (!customerNo) return
		axios.get('/admin/satCustomerFollow/getFollowsByNo', {params: {customerNo}})
			.then(({data}) => {
				this.setState({
					followList: [...data]
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
		if (this.state.showMore) {
			return (
				<View style={{paddingHorizontal:13}}>
					{
						this.state.followList.map((item, i) => {
							return (
								<FollowUpList key={i}>
									<FollowUpItem>
										<View style={{width: 90}}>
											<FollowUpListText>跟进时间：</FollowUpListText>
										</View>
										<View style={{width: 230}}>
											<FollowUpListText>{item.updateTime ? item.updateTime : item.createTime}</FollowUpListText>
										</View>
									</FollowUpItem>
									<FollowUpItem>
										<View style={{width: 90}}>
											<FollowUpListText>跟进事项：</FollowUpListText>
										</View>
										<View style={{width: 230}}>
											<FollowUpListText>{historyFollowItemHash[item.followItem]}</FollowUpListText>
										</View>
									</FollowUpItem>
									<FollowUpItem>
										<View style={{width: 90}}>
											<FollowUpListText>意向级别：</FollowUpListText>
										</View>
										<View style={{width: 230}}>
											<FollowUpListText>{userLevelHash[item.newCustlevel] ? userLevelHash[item.newCustlevel] : userLevelHash[item.level]}</FollowUpListText>
										</View>
									</FollowUpItem>
									<FollowUpItem>
										<View style={{width: 90}}>
											<FollowUpListText>跟进方式：</FollowUpListText>
										</View>
										<View style={{width: 230}}>
											<FollowUpListText>{followStyleHash[item.followStyle]}</FollowUpListText>
										</View>
									</FollowUpItem>
									<FollowUpItem>
										<View style={{width: 90}}>
											<FollowUpListText >跟进结果：</FollowUpListText>
										</View>
										<View style={{width: 230}}>
										 <FollowUpListText>{item.followReasult}</FollowUpListText>
										
										</View>
									</FollowUpItem>
									{item.memo?<FollowUpItem>
										<View style={{width: 90}}>
											<FollowUpListText>计划描述：</FollowUpListText>
										</View>
										<View style={{width: 230}}>
											<FollowUpListText>{item.memo}</FollowUpListText>
										</View>
									</FollowUpItem>:null}
								</FollowUpList>
							)
						})}
				</View>
			)
		} else {
			return null
		}
	}
	render() {
		return (
			<Card style={{marginTop:10}}>
				<TouchableOpacity onPress={() => {
					this.handleShowMore()
				}}>
					<CardTitle>
						<Text>
							历史跟进信息
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
	}
}
