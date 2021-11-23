import React, {Component} from "react";
import {SafeAreaView, Text, View} from "react-native";
import {SlideModal, Scrollpicker, Switch, Button, Tip} from "beeshell";
import {map} from "lodash";
import {colors} from "../../../style/variables";
import {modalUseCancel,shareClues,setShareClues} from "./share-service";
import {inject, observer} from "mobx-react";


/**
 * 用来选择要分享的渠道商
 *
 */
@inject(['userStore']) // 注入对应的store
@observer // 监听当前组件
export default class SharePartner extends Component {
	constructor(props) {
		super(props)
		this.user = this.props.userStore.user
		this.state = {
			list: [],
			value: [],
			partnerList: [],
			partnerValue: []
		}
	}

	componentDidMount() {
		// 获取线索数据
		axios.get('/admin/area/page', {params: {type: 1, pageSize: 999, pcode: 0, pageNum: 1}})
			.then(({data}) => {
				const list = map(data.list, item => {
					return {
						value: item.code,
						label: item.name
					}
				})
				this.setState({list})
				this.getPartner(list[0].value)
			})
	}

	// 获取渠道商
	getPartner(areaCode) {
		if (!areaCode) return
		axios.post('/admin/partner/findPartnerByAreaCode', {
			areaCode,
			"pageNum": 0,
			"pageSize": 999
		})
			.then(({data}) => {
				const partnerList = map(data.list, item => {
					return {
						value: item.partnerCode,
						label: item.partnerName
					}
				})
				const partnerValue = partnerList.length ? [0] : []
				this.setState({partnerList, partnerValue})
			})
	}

	// 打开modal
	open() {
		return this.dialog.open()
	}

	// 取消并关闭弹窗
	close() {
		modalUseCancel()
		this.dialog.close()
	}

	// 提交保存数据
	submit(){
		// 获取当前渠道商信息
		const {partnerValue,partnerList} = this.state
		if(!partnerValue.length || !partnerList.length) return Tip.show('尚未选择任何渠道商！', 1000, 'center')
		if(!shareClues.length) return Tip.show('尚未选择要分享的线索！', 1000, 'center')
		const partner = partnerList[partnerValue[0]]
		const data = map(shareClues,item=>{
			return{
				"beSharePartnerCode":partner.value,
				"clueNo": item.clueNo,
				"createBy": this.user.userCode,
				"customerNo":  item.customerNo,
				"sharePartnerCode": this.user.partnerCode,
				"shareUser":  this.user.userCode,
			}
		})
		axios.post('/admin/satcustomerclueshare/clueShare',data)
			.then(()=> {
				modalUseCancel()
				this.dialog.close()
				// 重新获取数据
				this.props.refresh()
				// 重置分享数据
				setShareClues([])
			})
	}

	render() {
		const {list, partnerList} = this.state
		return (
			<SlideModal
				ref={(c) => this.dialog = c}
				styles={{
					container: {top: 0, bottom: 0, left: 0, right: 0},
					//backdrop: [{ backgroundColor: 'red' }],
					content: {width: '100%', backgroundColor: '#fff'}
				}}
			>
				<View>
					<Text style={{
						width: '100%', textAlign: 'center', fontSize: 16, paddingTop: 15, paddingBottom: 10,
						borderBottomWidth: 1, borderBottomColor: '#eee'
					}}>请选择渠道商</Text>
					<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
						<View style={{width: '35%',}}>
							<Scrollpicker
								style={{paddingHorizontal: 0}}
								offsetCount={2}
								list={[list]}
								onChange={(columnIndex, rowIndex) => {
									this.setState({value: [rowIndex]})
									this.getPartner(list[rowIndex].value)
								}}
								value={this.state.value}
								renderItem={(item) => {
									return (
										<View
											style={{
												flexDirection: 'row',
												paddingVertical: 10
											}}>
											<Text>{item.label}</Text>
										</View>
									)
								}}
							/>
						</View>
						<View style={{width: '60%'}}>
							<Scrollpicker
								style={{paddingHorizontal: 10}}
								offsetCount={2}
								list={[partnerList]}
								onChange={(columnIndex, rowIndex) => {
									this.setState({
										partnerValue: [rowIndex]
									})
								}}
								value={this.state.partnerValue}
								renderItem={(item) => {
									return (
										<View
											style={{
												flexDirection: 'row',
												paddingVertical: 10
											}}>
											<Text>{item.label}</Text>
										</View>
									)
								}}
							/>
						</View>
					</View>

					<View style={{
						flexDirection: 'row', justifyContent: 'space-between',
						paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#eee'
					}}>
						<Button
							style={{borderRadius: 0, flex: 1}}
							onPress={() => this.close()}
							type='default'>
							取消
						</Button>
						<Button
							style={{borderRadius: 0, flex: 1}}
							onPress={() => this.submit()}
							type='primary'>
							确定
						</Button>
					</View>

				</View>

			</SlideModal>
		);
	}

	// 底部按钮渲染函数
	getLabel(label) {
		const color = colors.grey2
		return (
			<View style={{
				flex: 1,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				paddingVertical: 0,
				paddingHorizontal: 0,
				height: 0,
				width: 0
			}}>
				<Text style={{fontSize: 0, color, marginLeft: 5, height: 0, width: 0}}>{label}</Text>
			</View>
		)
	}
}
