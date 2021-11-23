/**
 * @description 用来实现竞品的底部选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, { Component } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { Scrollpicker, BottomModal } from 'beeshell';
import { findIndex, map } from 'lodash'
import { inject } from 'mobx-react';
import { second } from "../../../../data-config";

@inject(['dictStore']) // 注入对应的store
export default class UserSource2 extends Component {
    constructor(props) {
        super(props)
        let data = [
            {
                "dictId": "e53675459c2b652f3124001bf41d974c",
                "dictValue": "展厅留资",
                "dictKey": "1",
                "pid": "41ff2d2a4ca55ff9875ac34aca2ba03d",
                "sortNo": 1,
                "state": 1,
                "source": 0,
                "dictlist": []
            },
            {
                "dictId": "fe1cf277f2e712a8d55d6396a4205fbc",
                "dictValue": "区域活动",
                "dictKey": "2",
                "pid": "41ff2d2a4ca55ff9875ac34aca2ba03d",
                "sortNo": 2,
                "state": 1,
                "source": 0,
                "dictlist": []
            },
            {
                "dictId": "3e9be29bbae56611ec67c4ef536ad842",
                "dictValue": "区域外拓",
                "dictKey": "3",
                "pid": "41ff2d2a4ca55ff9875ac34aca2ba03d",
                "sortNo": 3,
                "state": 1,
                "source": 0,
                "dictlist": []
            },
            {
                "dictId": "f8856a3ba120cf99ae0970d24aae2c0c",
                "dictValue": "区域车展",
                "dictKey": "4",
                "pid": "41ff2d2a4ca55ff9875ac34aca2ba03d",
                "sortNo": 4,
                "state": 1,
                "source": 0,
                "dictlist": []
            }

        ]
        this.state = {
            list: map(data, item => {
                return {
                    label: item.dictValue,
                    value: item.dictKey
                }
            }),
            value: [0]
        }
    }


    // 打开modal
    open() {
        return this.bottomModal.open()
    }

    // 设置默认回显方法
    setDefault(value) {
        this.setState({ value: [value] })
    }

    renderSafeArea() {
        return (
            <View style={{ maxHeight: 30 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ height: 30 }} />
                </SafeAreaView>
            </View>
        )
    }

    render() {
        return (
            <BottomModal ref={c => this.bottomModal = c}
                title='请选择二级来源'
                rightCallback={() => {
                    const data = this.state.list[this.state.value[0]].value

                    this.props.rightCallback(data)
                }}
                cancelable={true}>
                <View style={{ paddingVertical: 15 }}>
                    <Scrollpicker
                        style={{ paddingHorizontal: 80 }}
                        offsetCount={2}
                        list={[this.state.list]}
                        onChange={(columnIndex, rowIndex) => {
                            this.setState({
                                value: [rowIndex]
                            })
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
                {this.renderSafeArea()}
            </BottomModal>
        );
    }
}
