import React, {Component} from 'react';
import {View, Text, SectionList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {colors} from "../../../style/variables";
import {Divider} from "react-native-elements";
import {Button, Modal, Tip, TopviewGetInstance} from "beeshell";
import Feather from "react-native-vector-icons/Feather";
import ListPicker from './listPicker';
import {level,lostReason,followItem,followStyle} from '../../../common/tool/dictionaries';
import {
    LostBG,
    LostDetailRow,
    LostDetailSubRow,
    LostDetailText, LostItemButtonRowView,
} from './styles'
import {inject} from 'mobx-react';

@inject(['userStore']) // 注入对应的store
export default class Detail extends Component {
    constructor(props){
        super(props);
        this.store = this.props.userStore
        this.state = {
            mainList:[],
            historyList:[],
            isHistoryOpen:true,
        }
    }
    componentDidMount(): void {
        this.getDetail();
    }

    getDetail() {
        const { navigation } = this.props;
        let applyId = navigation.getParam('applyId')
        this.tip.open();
        return axios.get('/admin/satLostApply/load', {
            params: {
                applyId: applyId,
            }
        }).then(({data}) => {
            // 数据请求结果
            if (data != null)  {
                this.setState( {
                    mainList:[data],
                })
            }
            this.getHistoryList(data.customerNo);
        }).catch(({data})=>{
            this.tip.close();
            Tip.show(data.msg, 1000, 'center')
        })
    }

    getHistoryList(customerNo) {
        return axios.get('/admin/satCustomerFollow/getFollowsByNo', {
            params: {
                customerNo: customerNo,
            }
        }).then(({data}) => {
            this.tip.close();
            // 数据请求结果
            this.setState({
                historyList:data
            })
        }).catch(({data})=> {
            this.tip.close();
            Tip.show(data.msg, 1000, 'center')
        })
    }

    // 同意战败
    agreeLost(applyId) {
        this.tip.open();
        return axios.post('/admin/satLostApply/agree', {
            applyIdList:[applyId],
        }).then(() => {
            Tip.show('战败成功', 1000, 'center')
            this.getDetail();
        }).catch(()=>{
            this.tip.close();
            Tip.show(data.msg, 1000, 'center')
        })
    }

    // 战败分配获取 销售顾问列表
    getListSaler() {
        this.tip.open();
        return axios.get('/admin/staff/listSaler', {
            params: {
                partnerCode:this.store.user.partner.partnerCode,
            }
        }).then(({data}) => {
            this.tip.close();
            // 数据请求结果
            this.showDispatchList(data);
        }).catch((data)=> {
            this.tip.close();
            Tip.show(data.msg, 1000, 'center')
        })
    }

    // 分配
    dispatchSaler(accountNo) {
        this.tip.open();
        return axios.post('/admin/satLostApply/dispatch', {
            getUser:accountNo,
            applyIdList:[this.props.navigation.getParam('applyId')],
        }).then(({data}) => {
            this.tip.close();
            Tip.show('分配成功', 1000, 'center')
            this.getDetail();
        }).catch((data)=>{
            this.tip.close();
            Tip.show(data.msg, 1000, 'center')
        })
    }

    showDispatchList(list,applyId) {
        TopviewGetInstance().add(
            <ListPicker
                title='线索分配'
                onPress={(isCancel,item)=>{
                    this.dismissDispatchList();
                    if (!isCancel) {
                        this.dispatchSaler(item.accountNo,applyId)
                    }
                }}
                data={list}/>).then((id)=>{
            this.setState({
                clueListId:id,
            })
        })
    }

    dismissDispatchList() {
        TopviewGetInstance().remove(this.state.clueListId);
    }

    stringForKey(dict,key) {
        if (!key) return ''
        let obj = null
        dict.filter(item => {
            if (item.dictKey === key) obj = item
        })
        if(obj == null) {
            return ''
        }
        return obj.dictValue
    }


    render() {
        const mainList = this.state.mainList;
        const showList = this.state.isHistoryOpen?this.state.historyList:[];
       return (
           <LostBG>
               {/*加载指示器*/}
               <Tip
                   ref={(c) => { this.tip = c }}
                   body={
                       <View>
                           <ActivityIndicator size='small' color='#fff' />
                       </View>
                   }
                   cancelable={true}>
               </Tip>
               <SectionList
                   renderItem={({item, section}) =>{
                       if (section.title == '1') {
                           return this.renderMainCell(item);
                       }
                       else {
                           return this.renderHistoryCell(item);
                       }
                   }}
                   renderSectionHeader={({ section: {title} }) => {
                       if (title == '2')
                       return (
                          this.renderHistoryHeader()
                       )
                   }}
                   renderSectionFooter={({section:{title}}) =>{
                       if (title == '1')
                       return(
                           this.renderOperationView()
                       )
                   }}
                   sections={[
                       { title: "1", data: mainList},
                       { title: "2", data: showList},
                   ]}
                   keyExtractor={(item, index) => item + index}
               />
           </LostBG>
       )
    }

    renderOperationView (item){
        if (!this.state.mainList.length) {
            return <View></View>;
        }
        const mainData =  this.state.mainList[0];
        if (mainData.applyOrderStatus > 1) {
            return <View></View>;
        }else {
            return (
                <View style={{height:80,justifyContent:'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <Button onPress={()=>{
                                this.dispatchAlert.open();
                            }}
                            type='primary' size='lg' style={{height:48}}>
                            战败
                        </Button>
                        {this.renderDispatchAlert()}
                        <Button onPress={()=>{
                                this.getListSaler(this.props)
                            }}
                            type='primary' size='lg' style={{height:48}}>
                            分配
                        </Button>

                    </View>
                </View>
            )
        }
        // else if (mainData.applyCount >= 2) {
        //     return (
        //         <View style={{height:80,justifyContent:'center'}}>
        //             <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        //                 <Button onPress={()=>{
        //                         this.dispatchAlert.open();
        //                     }}
        //                     type='primary' size='lg' style={{height:48}}>
        //                     战败
        //                 </Button>
        //                 {this.renderDispatchAlert()}
        //                 <Button onPress={()=>{
        //                         this.getListSaler(this.props)
        //                     }}
        //                     type='primary' size='lg' style={{height:48}}>
        //                     分配
        //                 </Button>

        //             </View>
        //         </View>
        //     )
        // }
        // else {
        //     return (
        //         <View style={{height:80,justifyContent:'center'}}>
        //             <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        //                 <Button
        //                     onPress={()=>{
        //                         this.getListSaler(this.props)
        //                     }}
        //                     type='primary' size='lg' style={{height:48}}>分配</Button>
        //             </View>
        //         </View>
        //     )
        // }
    }

    renderHistoryHeader() {
        return (
            <View>
                <TouchableOpacity
                    style={{paddingRight:24,paddingLeft:24,height:44,justifyContent:'space-between',flexDirection: 'row',backgroundColor:'#fff'}}
                    onPress={()=>{
                        this.setState({
                            isHistoryOpen:!this.state.isHistoryOpen
                        })
                    }}
                >
                    <Text style={{lineHeight:44,fontWeight: '500'}}>历史跟进信息</Text>
                    <View style={{justifyContent:'center'}}>
                        <Feather name={this.state.isHistoryOpen?'chevron-down':'chevron-up'}  size={20} color={'#969799'} />
                    </View>
                </TouchableOpacity>
                <Divider style={{height:0.5,backgroundColor:colors.grey5}}></Divider>
            </View>
        )
    }

    renderMainCell(item) {
        return (
            <View>
                <LostDetailRow>
                    <LostDetailText>客户姓名: {item.name}</LostDetailText>
                    <LostDetailText>客户电话: {item.phone}</LostDetailText>
                    <LostDetailText>意向级别: {this.stringForKey(level,item.level)}</LostDetailText>
                </LostDetailRow>
                <Divider style={{height:0.5,backgroundColor:colors.grey5,paddingLeft:16,paddingRight:16}}></Divider>
                <LostDetailRow>
                    <LostDetailText>申请品鉴顾问: {item.applyUserName}</LostDetailText>
                    <LostDetailText>申请原因: {this.stringForKey(lostReason,item.lostReason)}</LostDetailText>
                    <LostDetailText>申请时间: {item.applyTime}</LostDetailText>
                    <LostDetailSubRow>
                        <LostDetailText >跟进结果:</LostDetailText>
                        <View style={{flex:1,marginLeft:3}}>
                            <LostDetailText>
                                {item.followReasult}
                            </LostDetailText>
                        </View>
                    </LostDetailSubRow>
                </LostDetailRow>
                <Divider style={{height:0.5,backgroundColor:colors.grey5,paddingLeft:16,paddingRight:16}}></Divider>
            </View>
        )
    }

    renderHistoryCell(item){
        return (
            <View>
                <LostDetailRow>
                    <LostDetailText>跟进时间: {item.completeFollowTime}</LostDetailText>
                    <LostDetailText>跟进事项: {this.stringForKey(followItem,item.followItem)}</LostDetailText>
                    <LostDetailText>意向级别: {this.stringForKey(level,item.newCustlevel)}</LostDetailText>
                    <LostDetailText>跟进方式: {this.stringForKey(followStyle,item.followStyle)}</LostDetailText>
                    <LostDetailSubRow>
                        <LostDetailText >跟进结果:</LostDetailText>
                        <View style={{flex:1,marginLeft:3}}>
                            <LostDetailText>
                                {item.followReasult}
                            </LostDetailText>
                        </View>
                    </LostDetailSubRow>
                </LostDetailRow>
                <Divider style={{height:0.5,backgroundColor:colors.grey5,paddingLeft:16,paddingRight:16}}></Divider>
            </View>
           );
    }

    renderDispatchAlert() {
        return(
            <Modal
                ref={(c) => {this.dispatchAlert = c;}}
                cancelable={false}>
                <View style={{
                    width: 270,
                    height:140,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12
                }}>
                    <Text style={{padding: 20,fontSize:17,fontWeight:'bold'}}>战败</Text>
                    <Text style={{paddingLeft:20,paddingRight:20,paddingBottom:20}}>是否确定将客户置为战败？</Text>
                    <LostItemButtonRowView style={{height:48}}>
                        <Button style={{flex: 1, borderRadius: 0,borderBottomLeftRadius:12}}
                                onPress={() => {
                                    this.dispatchAlert.close();
                                }}>
                            <Text style={{color: '#37C1B4', fontSize: 15}}>取消</Text>
                        </Button>
                        <Button style={{flex: 1, borderRadius: 0,borderBottomRightRadius:12}}
                                onPress={() => {
                                    this.dispatchAlert.close();
                                    const { navigation } = this.props;
                                    let applyId = navigation.getParam('applyId')
                                    this.agreeLost(applyId);
                                }}>
                            <Text style={{color: '#37C1B4', fontSize: 15}}>确定</Text>
                        </Button>
                    </LostItemButtonRowView>
                </View>
            </Modal>
        );
    }
}
