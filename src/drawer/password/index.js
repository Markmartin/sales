import React, {Component} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {inject, observer} from 'mobx-react';
import {Input} from "react-native-elements";
import Icon from 'react-native-vector-icons/Octicons';
import Button from '../../common/components/button'
import {Tip} from 'beeshell';
import {Loading} from "../../common/components/loading"

@inject(['userStore']) // 注入对应的store
@observer // 监听当前组件
export default class UpdatePassword extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.userStore //通过props来导入访问已注入的store
        this.state = {
            originalHide: true,
            newHide: true,
            newConfirmHide: true,
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: ''
        }
    }

    update() {
        if (!this.state.oldPassword || this.state.oldPassword.length === 0) {
            return Tip.show('请输入原密码', 1000, true, 'bottom');
        }

        if (!this.state.newPassword || this.state.newPassword.length === 0) {
            return Tip.show('请输入新密码', 1000, true, 'bottom');
        }

        if (!this.state.newPasswordConfirm || this.state.newPasswordConfirm.length === 0) {
            return Tip.show('请确认新密码', 1000, true, 'bottom');
        }

        if (this.state.newPasswordConfirm !== this.state.newPassword) {
            return Tip.show('两次输入密码不一致', 1000, true, 'bottom');
        }

        Loading.show()
        axios({
            method: 'post',
            url: '/admin/user/updatePassword',
            data: {
                oldPassword: this.state.oldPassword,
                password: this.state.newPassword,
                userId: this.store.user.userId
            }
        }).then(() => {
            Loading.hidden()
            Tip.show('修改成功,请重新登录', 2000, true, 'bottom');
            this.store.loginOut()
        }).catch(() => {
            Loading.hidden()
        });
    }


    render() {
        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.textStyle}>原密码</Text>
                    <Input
                        rightIcon={
                            <Icon
                                name={this.state.originalHide ? 'eye-closed' : 'eye'}
                                size={20}
                                color='black'
                                onPress={() => this.setState({originalHide: !this.state.originalHide})}
                            />
                        }
                        secureTextEntry={this.state.originalHide}
                        containerStyle={{flex: 0.75, marginLeft: 12}}
                        onChangeText={
                            (value) => {
                                this.setState({oldPassword: value})
                            }
                        }
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.textStyle}>新密码</Text>
                    <Input
                        rightIcon={
                            <Icon
                                name={this.state.newHide ? 'eye-closed' : 'eye'}
                                size={20}
                                color='black'
                                onPress={() => this.setState({newHide: !this.state.newHide})}
                            />
                        }
                        secureTextEntry={this.state.newHide}
                        containerStyle={{flex: 0.75, marginLeft: 12}}
                        onChangeText={
                            (value) => {
                                this.setState({newPassword: value})
                            }
                        }
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.textStyle}>再次确认</Text>
                    <Input
                        rightIcon={
                            <Icon
                                name={this.state.newConfirmHide ? 'eye-closed' : 'eye'}
                                size={20}
                                color='black'
                                onPress={() => this.setState({newConfirmHide: !this.state.newConfirmHide})}
                            />
                        }
                        secureTextEntry={this.state.newConfirmHide}
                        containerStyle={{flex: 0.75, marginLeft: 12}}
                        onChangeText={
                            (value) => {
                                this.setState({newPasswordConfirm: value})
                            }
                        }
                    />
                </View>

                <View style={{marginTop: 32, marginLeft: 28, marginRight: 28}}>
                    <Button
                        title='保存'
                        buttonStyle={
                            {
                                height: 48,
                                fontSize: 20
                            }
                        }
                        onPress={
                            this.update.bind(this)
                        }
                    />
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 17,
        color: "#292D35",
        flex: 0.25
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 28,
        marginRight: 28,
        marginTop: 32
    }
})
