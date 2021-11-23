import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, ImageBackground} from 'react-native';
import {Button, Tip} from 'beeshell';
import navigation from "../../../common/services/navigation";
import OssImage from '../../../common/components/oss-image'
import {
	CluesBg, StepsBox, StepsBoxItem, StepsBoxItemText, StepsBoxItemTitle, Line, Content, ContentInner, ContentInnerImg,
	InfoItem, LabelText, ValueText
} from './styles'
import {colors} from "../../../style/variables";
import DeliveryDateInfo from './components/delivery-date-info'
import Swiper from 'react-native-swiper'


export default class Handle extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: 1,
			info: {},
			show: false
		}
	}

	componentDidMount() {
		const {navigation} = this.props
		let handleId = navigation.getParam('handleId')
		axios.get('/admin/handleVehicle/load', {params: {handleId}})
			.then(({data}) => this.setState({info: data}))
	}

	render() {
		let {orderPicPathList} = this.state.info
		orderPicPathList = orderPicPathList ? orderPicPathList : []
		return (
			<CluesBg>
				<ScrollView>
					<StepsBox>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText><Text style={{
									color: 'white',
									alignSelf: 'center',
									paddingTop: 1
								}}>1</Text></StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>交车信息</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
						<Line/>
						<StepsBoxItem>
							<View style={styles.StepsBoxItem}>
								<StepsBoxItemText style={{backgroundColor: '#e3e6e6'}}><Text style={{
									alignSelf: 'center',
									color: colors.white,
									paddingTop: 1
								}}>2</Text></StepsBoxItemText>
							</View>
							<View>
								<StepsBoxItemTitle>进行交车</StepsBoxItemTitle>
							</View>
						</StepsBoxItem>
					</StepsBox>
					<Content>
						<ContentInner>
							<Swiper style={styles.wrapper} showsButtons={true}>
								{orderPicPathList.map((item, i) => {
									return (
										<OssImage imageKey={item} 
											   key={i}
											   style={{height: '100%', resizeMode: 'contain'}}/>
									)
								})}
							</Swiper>
							<InfoItem style={{marginTop:20}}>
								<LabelText><Text>客户姓名:</Text></LabelText>
								<ValueText><Text>{this.state.info.name}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>客户电话:</Text></LabelText>
								<ValueText><Text>{this.state.info.phone}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>品鉴顾问:</Text></LabelText>
								<ValueText><Text>{this.state.info.userName}</Text></ValueText>
							</InfoItem>
							<InfoItem style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
								<LabelText><Text>联系地址:</Text></LabelText>
								<ValueText><Text>{this.state.info.addr}</Text></ValueText>
							</InfoItem>
							<InfoItem style={{paddingTop: 16}}>
								<LabelText><Text>发票编号:</Text></LabelText>
								<ValueText><Text>{this.state.info.invoiceCode}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>开票金额:</Text></LabelText>
								<ValueText><Text>￥{this.state.info.invoiceMoney}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>VIN码:</Text></LabelText>
								<ValueText><Text>{this.state.info.vin}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>车型车系:</Text></LabelText>
								<ValueText><Text>{this.state.info.productName}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>外观颜色:</Text></LabelText>
								<ValueText><Text>{this.state.info.colorNameOut}</Text></ValueText>
							</InfoItem>
							<InfoItem>
								<LabelText><Text>内饰颜色:</Text></LabelText>
								<ValueText><Text>{this.state.info.colorNameIn}</Text></ValueText>
							</InfoItem>
						</ContentInner>
						<ContentInner>
							<DeliveryDateInfo order={this.state.info}/>
						</ContentInner>
					</Content>
				</ScrollView>
			</CluesBg>
		);
	}
}

const styles = StyleSheet.create({
	StepsBoxItem: {paddingLeft: 22, paddingBottom: 10},
	wrapper: {
		height: 90
	},
	text: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold'
	}
});
