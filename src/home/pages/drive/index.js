import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Tab, Longlist} from 'beeshell';
import Icon from 'react-native-vector-icons/dist/Feather';
import navigation from "../../../common/services/navigation";
import {
    CluesWrapperItem,
    CluesBg,
    CluesWrapper,
    CluesInfo,
    CluesAction,
    CluesUserInfo,
    CluesTimeInfo,
    CluesCarInfo,
    Button,
    ButtonText
} from './style'
import {colors, size} from "../../../style/variables";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {level, apply} from '../../../common/tool/dictionaries'
import {inject} from 'mobx-react';
import {withNavigationFocus} from 'react-navigation';
import PhoneCall from "../../../common/components/phone-call";
import {UserInfo} from "../todo-list/style";
import {Loading} from "../../../common/components/loading";
import AddTestDriverButton from '../../../common/components/add-test-driver-button'


const testDriveTab = [
    {value: 1, label: '待试驾'},
    // {value: 2, label: '试驾中'},
    {value: 3, label: '已试驾'}
]
const salesTab = [
    {value: 1, label: '待试驾'},
    // {value: 2, label: '试驾中'},
    {value: 3, label: '已完成'}
]

@inject(['userStore']) // 注入对应的store
class DriveList extends Component {
    static navigationOptions = {
        headerRight: (<AddTestDriverButton/>),
    };

    constructor(props) {
        super(props)
        this.store = this.props.userStore
        this.role = this.props.userStore.role
        this.state = {
            value: 1,
            pageNum: 1,
            list: [],
            total: 0
        }
        this.levelHandel = this.levelHandel.bind(this)
        this.applyHandel = this.applyHandel.bind(this)
    }

    // 加载数据
    refresh(num, state) {
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
            testDriveStatus: state ? state : this.state.value
        }
        Loading.show();
        return axios.get('/admin/satTestDrive/page', {params: params})
            .then(({data}) => {
                Loading.hidden();
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
            }).catch(error => {
                Loading.hidden();
            })
    }

    // 获取焦点时刻
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.props.isFocused) {
            // 如果reload了不再请求
            if (this.reload) return null
            this.refresh(1, this.state.value)
            this.props.navigation.setParams({roleCode: this.store.role.roleCode})
            // 标记reload
            this.reload = true
        } else {
            this.reload = false
        }
        return null
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    levelHandel(value) {
        if (!value) return '其他'
        let obj = null
        level.filter(item => {
            if (item.dictKey === value) obj = item
        })
        return obj ? obj.dictValue : ''
    }

    applyHandel(value) {
        if (!value) return ''
        let obj = null
        apply.filter(item => {
            if (item.dictKey === value) obj = item
        })
        return obj ? obj.dictValue : ''
    }

    testButton(item) {
        console.log(item)
        this.props.navigation.navigate('HandleTest', item)
    }

    render() {
        return (
            <CluesBg>
                <Tab
                    value={this.state.value}
                    data={this.role.roleCode === 'rolePartnerTestDrive' ? testDriveTab : salesTab}
                    dataContainerStyle={styles.tab}
                    onChange={(item) => {
                        this.setState({value: item.value})
                        this.list = []
                        this.refresh(1, item.value)
                    }}
                />
                <Longlist
                    ref={c => this._longlist = c}
                    data={this.state.list}
                    total={this.state.total}
                    renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                if (item.testDriveStatus === 1) {
                                    //试驾专员&& this.role.roleCode === 'rolePartnerTestDrive
                                    // 按钮跳转navigation.navigate('HandleTest', {driveId: item.driveId})
                                } else {
                                    navigation.navigate('DriveDetails', {driveId: item.driveId})
                                }
                            }}>
                                <CluesWrapperItem>
                                    <CluesWrapper>
                                        <CluesInfo>
                                            <CluesUserInfo>
                                                <View style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                }}>
                                                    <Text style={styles.boldTextStyle}>{item.customerName}</Text>
                                                    <MaterialIcon
                                                        name={item.sex === '2' ? 'gender-female' : 'gender-male'}
                                                        size={16}
                                                        color={item.sex === '2' ? '#df5095' : '#4296f4'}
                                                        style={{
                                                            marginLeft: 12,
                                                            marginRight: 12
                                                        }}
                                                    />
                                                    {/*<PhoneCall style={styles.boldTextStyle} phone={item.phone}/>*/}
                                                    <PhoneCall style={styles.boldTextStyle}
                                                               phone={item.contacterPhoneOne ? item.contacterPhoneOne : item.phone}/>
                                                </View>
                                            </CluesUserInfo>
                                            <View style={{flexDirection: 'row'}}>
                                                <CluesTimeInfo>{this.levelHandel(item.level)}</CluesTimeInfo>
                                                {/*<Text style={{}}>{item.productName}</Text>*/}
                                                <CluesTimeInfo>{this.applyHandel(item.applyType)}</CluesTimeInfo>
                                            </View>
                                            <CluesCarInfo>
                                                {
                                                    this.state.value === 1 ? (
                                                            <Text>预计试驾时间：{moment(item.planDriveTime).format('YYYY-MM-DD HH:mm')}</Text>) :
                                                        (
                                                            <Text>试驾时间：{moment(item.completeDriveTime).format('YYYY-MM-DD HH:mm')}</Text>)
                                                }
                                            </CluesCarInfo>
                                        </CluesInfo>
                                        <View>
                                            {
                                                this.state.value === 1 ? (
                                                    <CluesAction>
                                                        <TouchableOpacity onPress={this.testButton.bind(this, item)}>
                                                            <ButtonText>
                                                                <Button style={{overflow: 'hidden'}}>进入试驾</Button>
                                                            </ButtonText>
                                                        </TouchableOpacity>
                                                    </CluesAction>
                                                ) : (
                                                    <CluesAction>
                                                        <Text style={styles.listRightCont}>试驾订单</Text>
                                                        <Image style={styles.listRightIcon}
                                                               source={require('../../../assets/images/ic_next.png')}></Image>
                                                    </CluesAction>
                                                )
                                            }
                                        </View>
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
            </CluesBg>
        );
    }
}

export default withNavigationFocus(DriveList)

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
    },
    listRightCont: {
        alignSelf: 'center',
        fontSize: 14,
        color: colors.grey3
    },
    listRightIcon: {
        width: 15,
        height: 15,
        marginLeft: 6,
        alignSelf: 'center'
    }
})
