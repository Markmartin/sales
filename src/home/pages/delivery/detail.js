import React, {Component} from 'react';
import {Text, View, StyleSheet,ScrollView, Image} from 'react-native';
import {CluesBg,Content,ContentInner,InfoItem,LabelText,ValueText} from './styles'
import {colors} from "../../../style/variables";
import {Loading} from "../../../common/components/loading";
import {Tip} from "beeshell";
import PhoneCall from "../../../common/components/phone-call";
import OssImage from "../../../common/components/oss-image";

export default class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            info: {}
        }
        this.getLoad = this.getLoad.bind(this)
    }
    componentDidMount() {
        const { navigation } = this.props;
        let handleId = navigation.getParam('handleId')
        let isFromMsg = navigation.getParam('isFromMsg')
        this.getLoad(handleId, isFromMsg)
    }
    // 获取交车详情
    getLoad (id, status) {
        let urlPath = status ? '/admin/handleVehicle/handleInfo' : '/admin/handleVehicle/load'
        let param = status ? {customerNo: id} : {handleId: id}
        // 开启菊花
        Loading.show()
        return axios.get(urlPath, {
            params: param
        }).then(({data}) => {
            // 关闭菊花
            Loading.hidden()
            this.setState({
                info: data
            })
        }).catch(({data}) => {
            // 隐藏菊花
            Loading.hidden()
            Tip.show(data.msg, 1000, 'center');
        })
    }
    render() {
        return (
            <CluesBg>
                <ScrollView>
                    <Content style={{paddingTop: 10, marginBottom: 0}}>
                        <ContentInner style={{marginBottom: 10}}>
                            <InfoItem>
                                <LabelText><Text>客户姓名:</Text></LabelText>
                                <ValueText><Text>{this.state.info.name}</Text></ValueText>
                            </InfoItem>
                            <InfoItem style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
                                <LabelText><Text>客户电话:</Text></LabelText>
                                <PhoneCall  phone={this.state.info.phone}/>
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
                            <InfoItem  style={{borderBottomWidth: 1, borderBottomColor: colors.grey5}}>
                                <LabelText><Text>内饰颜色:</Text></LabelText>
                                <ValueText><Text>{this.state.info.colorNameIn}</Text></ValueText>
                            </InfoItem>
                            <InfoItem style={{paddingTop: 16}}>
                                <LabelText><Text>品鉴顾问:</Text></LabelText>
                                <ValueText><Text>{this.state.info.userName}</Text></ValueText>
                            </InfoItem>
                            <InfoItem>
                                <LabelText><Text>完成交车时间:</Text></LabelText>
                                <ValueText><Text>{moment(this.state.info.finishDate).format('YYYY-MM-DD HH:mm')}</Text></ValueText>
                            </InfoItem>
                            <InfoItem>
                                <LabelText><Text>交付小驰:</Text></LabelText>
                                <ValueText><Text>{this.state.info.handleUser}</Text></ValueText>
                            </InfoItem>
                            <InfoItem>
                                <LabelText><Text>交车方式:</Text></LabelText>
                                <ValueText><Text>{this.state.info.handleStyle == '1' ? '上门' : '店内'}</Text></ValueText>
                            </InfoItem>
                            <InfoItem>
                                <LabelText><Text>备注信息:</Text></LabelText>
                                <ValueText><Text>{this.state.info.info}</Text></ValueText>
                            </InfoItem>
                            <InfoItem>
                                <LabelText><Text>上传信息:</Text></LabelText>
                                <View style={{flexDirection: 'row',justifyContent: 'space-around'}}>
                                    <OssImage imageKey={this.state.info.handlePic1} style={styles.img}/>
                                    <OssImage imageKey={this.state.info.handlePic2} style={styles.img}/>
                                    <OssImage imageKey={this.state.info.handlePic3} style={styles.img}/>
                                </View>
                            </InfoItem>
                        </ContentInner>
                    </Content>
                </ScrollView>
            </CluesBg>
        );
    }
}


const styles = StyleSheet.create({
    img:{width:60,height:60,backgroundColor: '#ccc',marginLeft: 10}
});
