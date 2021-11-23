import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Tab, Longlist, Calendar, SlideModal, Tag} from 'beeshell';
import Icon from 'react-native-vector-icons/dist/Feather';
import navigation from "../../../common/services/navigation";
import {CluesWrapperItem, CluesName, CluesBg, CluesWrapper, CluesInfo, CluesAction, CluesUserInfo, CluesTimeInfo, CluesCarInfo, Button, ButtonText} from './styles'
import {colors, size} from "../../../style/variables";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import PhoneCall from "../../../common/components/phone-call";

export default class Clues extends Component {
	static navigationOptions = ({navigation}) => {
		return {
			headerRight: (
				<Icon
					onPress={navigation.getParam('show')}
					name='calendar'
					size={24}
					color='#F5FBFF' light/>
			)
		};
	};

	constructor(props) {
		super(props)
		this.state = {
			value: 1,
			date: '',
			show: false,
			pageNum: 1,
			list: [],
			total: 0,
			activeItem: {},
			distributionItem: {}
		}
	}

	state = {
		show: false
	}

	// 加载数据
	refresh(num, state, date) {
		// 如果明确传入参数，则是刷新或者首次加载
		let pageNum
		if (num) {
			pageNum = 1
		} else {
			// 没有明确参数是下拉刷新
			pageNum = this.state.pageNum + 1
		}
		// 请求数据
		// 清空上拉方法禁止拉动
		let params = {
			pageNum: pageNum,
			pageSize: 10,
			handleStatus: state
		}
		const timeStr = date ? date : this.state.date
		if (timeStr) {
			if (this.state.value === 1) {
				params.handleTimeStr = timeStr
			} else {
				params.finishTimeStr = timeStr
			}
		}
		return axios.get('/admin/handleVehicle/page', {params: params})
			.then(({data}) => {
				// 判断如果是刷新则清空数据
				this.setState(
					(prevState) => {
						let oldList = pageNum === 1 ? [] : prevState.list
						return {
							pageNum,
							list: [...oldList, ...data.list],
							total: data.total
						}
					})
			})
	}

	// 日历显示隐藏
	_showHandle = () => {
		this.setState({show: true});
	};

	componentDidMount() {
		// 获取线索数据
		// 标题栏日历状态
		this.refresh(1, 1)
		this.props.navigation.setParams({show: this._showHandle});
	}

	componentDidUpdate() {
		if (this.state.show) {
			this._slideModal.open()
			this.setState({show: false});
		}
	}

	render() {
		return (
			<CluesBg>
				<Tab
					value={this.state.value}
					data={[{value: 1, label: '待交车'},
						{value: 2, label: '已交车'}]}
					dataContainerStyle={styles.tab}
					onChange={(item, index) => {
						this.setState({
							value: item.value
						})
						this.list = []
						this.refresh(1, item.value)
					}}
				/>
				{
					this.state.value === 1 ? (
						<Longlist
							ref={c => this._longlist = c}
							data={this.state.list}
							total={this.state.total}
							renderItem={({item, index}) => {
								return (
									<CluesWrapperItem>
										<CluesWrapper>
											<CluesInfo>
												<CluesUserInfo>
													<View style={{
														flexDirection: "row",
														alignItems: "center"
													}}>
														<Text style={styles.boldTextStyle}>{item.name}</Text>
														<MaterialIcon
															name={item.sex === '2' ? 'gender-female' : 'gender-male'}
															size={16}
															color={item.sex === '2' ? '#df5095' : '#4296f4'}
															style={{
																marginLeft: 12,
																marginRight: 12
															}}
														/>
														<PhoneCall style={styles.boldTextStyle} phone={item.phone}/>
													</View>
												</CluesUserInfo>
												<CluesTimeInfo>
													{item.productName}
												</CluesTimeInfo>
												<CluesCarInfo>
													{
														this.state.value === 1 ? (
															<Text>预计交车时间：{item.handleTime?moment(item.handleTime).format('YYYY-MM-DD HH:mm'):''}</Text>) : (
															<Text>完成时间：{item.finishDate?moment(item.finishDate).format('YYYY-MM-DD HH:mm'):''}</Text>)
													}
												</CluesCarInfo>
											</CluesInfo>
											<CluesAction>
												{
													this.state.value === 1 ? (<TouchableOpacity onPress={() => {
														navigation.navigate('Handle', {handleId: item.handleId})
													}}>
														<Button>交车</Button>
													</TouchableOpacity>) : (
														<TouchableOpacity onPress={() => {
															navigation.navigate('Detail', {
																handleId: item.handleId,
																isFromMsg: false
															})
														}}>
															<ButtonText>
																<Icon name="chevron-right" size={20}></Icon>
															</ButtonText>
														</TouchableOpacity>)
												}
											</CluesAction>
										</CluesWrapper>
									</CluesWrapperItem>
								)
							}}
							onEndReachedThreshold={0.05}
							onEndReached={() => this.refresh()}
							onRefresh={() => this.refresh(1, this.state.value)}
							// 必须 否则容易出问题
							getItemLayout={(data, index) => {
								return {length: 107, offset: 107 * index, index}
							}}
						/>
					) : (
						<Longlist
							ref={c => this._longlist = c}
							data={this.state.list}
							total={this.state.total}
							renderItem={({item, index}) => {
								return (
									<TouchableOpacity onPress={() => {
										navigation.navigate('Detail', {handleId: item.handleId})
									}}>
										<CluesWrapperItem>
											<CluesWrapper>
												<CluesInfo>
													<CluesUserInfo>
														<View style={{
															flexDirection: "row",
															alignItems: "center"
														}}>
															<Text style={styles.boldTextStyle}>{item.name}</Text>
															<MaterialIcon
																name={item.sex === '2' ? 'gender-female' : 'gender-male'}
																size={16}
																color={item.sex === '2' ? '#df5095' : '#4296f4'}
																style={{
																	marginLeft: 12,
																	marginRight: 12
																}}
															/>
															<PhoneCall style={styles.boldTextStyle} phone={item.phone}/>
														</View>
													</CluesUserInfo>
													<CluesTimeInfo>
														{item.productName}
													</CluesTimeInfo>
													<CluesCarInfo>
														<Text>完成时间：{item.finishDate?moment(item.finishDate).format('YYYY-MM-DD HH:mm'):''}</Text>
													</CluesCarInfo>
												</CluesInfo>
												<CluesAction>
													<ButtonText>
														<Icon name="chevron-right" size={20}></Icon>
													</ButtonText>
												</CluesAction>
											</CluesWrapper>
										</CluesWrapperItem>
									</TouchableOpacity>
								)
							}}
							onEndReachedThreshold={0.05}
							onEndReached={() => this.refresh()}
							onRefresh={() => this.refresh(1, this.state.value)}
							// 必须 否则容易出问题
							getItemLayout={(data, index) => {
								return {length: 107, offset: 107 * index, index}
							}}
						/>
					)
				}
				<SlideModal
					ref={(c) => {
						this._slideModal = c
					}}
					cancelable={true}
					styles={{
						content: {
							height: '55%',
							width: '100%',
							backgroundColor: 'white'
						}
					}}
				>
					<View style={styles.calendarBox}>
						<Calendar
							date={this.state.date}
							onChange={(date) => {
								this.setState({date})
								this.refresh(1, this.state.value, date)
								this._slideModal.close()
							}}>
						</Calendar>
					</View>
				</SlideModal>
			</CluesBg>
		);
	}
}

const styles = StyleSheet.create({
	bodyBox: {
		flex: 1,
		backgroundColor: colors.background
	},
	tab: {
		height: 46,
		borderBottomWidth: 1,
		borderBottomColor: colors.grey5
	},
	calendarBox: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%'
	},
	titleTextStyle: {
		fontSize: size.fontSizeBase,
		color: "#292d35",
		marginRight: 5
	},

	timeTextStyle: {
		fontSize: size.fontSizeBase,
		color: '#99999a',
	},

	boldTextStyle: {
		fontSize: size.fontsizeMd,
		color: colors.black,
		fontWeight: "bold"
	},

	carSeriesStyle: {
		fontSize: size.fontSizeBase,
		color: '#99999a',
		marginLeft: 12
	},

	customerTypeText: {
		borderRadius: 2,
		backgroundColor: "#e3e3e6",
		fontSize: 12,
		borderColor: "#e3e3e6",
	},

	touchableTitle: {
		flex: 0.5,
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 10
	},
	Itemcontainer: {
		padding: 16,
		backgroundColor: colors.white,
		marginBottom: 10
	},

	checkBoxStyle: {
		flexDirection: "row",
		marginLeft: 16,
		flexWrap: "wrap",
		alignItems: 'flex-start'
	},

	checkItemStyle: {
		paddingTop: 0,
		paddingBottom: 0,
		margin: 5,
		width: 80,
		height: 30,
		backgroundColor: '#f0f0f0',
		alignContent: 'center',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},

	filterSection: {
		color: colors.black,
		marginTop: 24,
		fontSize: size.fontsizeMd,
		marginLeft: 16,
		marginBottom: 16
	},

	dateTextStyle: {
		backgroundColor: '#f0f0f0',
		height: 30,
		width: 116,
		alignContent: 'center',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center'
	}

})
