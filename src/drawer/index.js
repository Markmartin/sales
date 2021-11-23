import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Alert, Linking, Platform, TouchableOpacity, ImageBackground} from 'react-native';
import {inject, observer} from 'mobx-react';

import {Image} from "react-native-elements";
import {ImageAvatar, NameText, RoleText, ItemContainer} from "./style";
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import navigation from "../common/services/navigation";
import {Loading} from "../common/components/loading"
import {colors} from "../style/variables";
import {ButtonWrapper} from "../login/style";
import {Button, Modal} from "beeshell";
import PrivacyContent from "../login/privacy-content";
import ServicesContent from "../login/services-content";

@inject(['userStore']) // 注入对应的store
@observer // 监听当前组件
export default class CustomDrawer extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.userStore //通过props来导入访问已注入的store
    }

    checkUpdate() {

        Loading.show()
        axios.get('/admin/app/version/getNewVersion', {
            params: {
                type: 1,
                platform: Platform.OS
            }
        })
            .then(({data}) => {
                Loading.hidden()
                if (data !== null) {
                    if (data.versionCode > versionCode) {
                        //有新版本
                        let url = data.downUrl
                        Alert.alert('检查更新', '发现新版本' + data.versionName, [
                            {
                                text: '稍后再说',
                                onPress: () => {
                                }
                            },
                            {
                                text: '立即更新',
                                onPress: () => {
                                    Linking.canOpenURL(url).then(supported => {
                                        if (!supported) {
                                            console.log('Can\'t handle url: ' + url);
                                        } else {
                                            return Linking.openURL(url);
                                        }
                                    }).catch(err => console.error('An error occurred', err));
                                }
                            },

                        ])

                    } else {
                        //当前已是最新版
                        Alert.alert('检查更新', '当前已是最新版本', [
                            {
                                text: '确定'
                            }
                        ])
                    }

                }

            }).catch((data) => {
            Loading.hidden()
        })
    }


    render() {
        let rightArrow = <Image source={require('../assets/images/ic_next.png')} style={{width: 16, height: 16}}/>
        let version = '(' + versionName + ')'
        let menus
        if (this.store.user.userCode !== 'admin' || Platform.OS === 'android') {
            menus = [
                {
                    title: "切换角色",
                    icon: <AntIcon name="sync"
                                   size={18}
                                   color="black"
                    />,
                    onPress: () => navigation.navigate('SwitchRole')
                },
                // {
                //     title: "修改密码",
                //     icon: <SimpleLineIcon
                //         name="lock"
                //         size={18}
                //         color="black"/>,
                //     onPress: () => navigation.navigate('UpdatePassword')
                // },
                {
                    title: "检查更新",
                    icon: <AntIcon name="API"
                                   size={18}
                                   color="black"/>,
                    subTitle: version,
                    onPress: () => this.checkUpdate()
                },
                {
                    title: "退出",
                    icon: <AntIcon name="poweroff"
                                   size={18}
                                   color="black"/>,
                    onPress: () => this.store.loginOut()
                }

            ]
        } else {
            menus = [
                {
                    title: "切换角色",
                    icon: <AntIcon name="sync"
                                   size={18}
                                   color="black"
                    />,
                    onPress: () => navigation.navigate('SwitchRole')
                },
                {
                    title: "修改密码",
                    icon: <SimpleLineIcon
                        name="lock"
                        size={18}
                        color="black"/>,
                    onPress: () => navigation.navigate('UpdatePassword')
                },
                {
                    title: "退出",
                    icon: <AntIcon name="poweroff"
                                   size={18}
                                   color="black"/>,
                    onPress: () => this.store.loginOut()
                }

            ]
        }


        return (
            <View style={{flex:1,justifyContent: 'space-around'}}>
                <View style={{height:230}}>
                    <ImageAvatar source={require('../assets/images/default_avatar.png')}/>
                    <NameText>{this.store.realName}</NameText>
                    <RoleText>{this.store.role.roleName}</RoleText>
                </View>
                <View style={{flex:1}}>
                    {
                        menus.map((item, i) => (
                            <TouchableHighlight key={i}
                                                underlayColor={'#e1e8ee'}
                                                onPress={item.onPress}>
                                <ItemContainer>
                                    {item.icon}
                                    <Text style={{color: "#323233", fontSize: 16, marginLeft: 10}}>{item.title}</Text>
                                    <Text style={{color: "#99999A", fontSize: 14, marginLeft: 4}}>{item.subTitle}</Text>
                                    <View style={{flex: 1}}/>
                                    {rightArrow}
                                </ItemContainer>
                            </TouchableHighlight>
                        ))
                    }
                </View>

                <View style={{flexDirection: 'row',height:50, justifyContent: 'center',marginTop:10}}>
                    <TouchableOpacity onPress={() => this.servicesModal.open()}>
                        <Text style={{textDecorationLine:'underline', color:colors.info}}>服务协议</Text>
                    </TouchableOpacity>
                    <View style={{marginLeft: 5, marginRight: 5}}><Text>|</Text></View>
                    <TouchableOpacity onPress={() => this._modal.open()}>
                        <Text style={{textDecorationLine:'underline', color:colors.info}}>隐私政策</Text>
                    </TouchableOpacity>
                </View>
                <Modal ref={(c) => this._modal = c}
                       style={{margin: 20,}}
                       cancelable={true} scrollable>
                    <View style={{
                        padding: 10,
                        backgroundColor: '#fff',
                        borderRadius: 4
                    }}>
                        <PrivacyContent/>
                        <View style={{marginTop:10}}>
                            <Button
                                type='default'
                                onPress={()=>this._modal.close()}>
                                关闭
                            </Button>
                        </View>
                    </View>
                </Modal>
                <Modal ref={(c) => this.servicesModal = c}
                       style={{margin: 20,}}
                       cancelable={true} scrollable>
                    <View style={{
                        padding: 10,
                        backgroundColor: '#fff',
                        borderRadius: 4
                    }}>
                        <ServicesContent/>
                        <View style={{marginTop:10}}>
                            <Button
                                type='default'
                                onPress={()=>this.servicesModal.close()}>
                                关闭
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }


}
