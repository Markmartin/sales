/**
 * @description 用来实现竞品的底部选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, { Component } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { Scrollpicker, BottomModal } from 'beeshell';
import { inject } from 'mobx-react';
import {findIndex} from 'lodash'

@inject(['dictStore']) // 注入对应的store
export default class FirstSources extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedItem:null,
            selectedRow:[0]
        }
    }
    // 设置默认回显方法
    setDefault(value) {
        const selectedRow = findIndex(this.props.list,item=>item.value === value)
        const selectedItem = this.props.list[selectedRow]
        this.setState({ selectedItem,selectedRow: [selectedRow] })
    }

    // 打开modal
    open() {
        return this.bottomModal.open()
    }

    renderSafeArea() {
        return (
            <View style={{ maxHeight: 30 }} >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ height: 30 }} />
                </SafeAreaView>
            </View >
        )
    }

    render() {
        return (
            <BottomModal ref={c => this.bottomModal = c}
                title={this.props.title}
                rightCallback={() => {
                    this.props.list.forEach((item,index) => {
                        if(index == this.state.selectedRow[0]) {
                            this.state.selectedItem = item
                        }
                        else if(this.state.selectedRow[0]=='-1'){
                            this.state.selectedItem=item
                        }
                    });
                    this.props.rightCallback(this.state.selectedItem)
                }}
                cancelable={true}>
                <View style={{ paddingVertical: 15 }}>
                    <Scrollpicker
                        style={{ paddingHorizontal: 80 }}
                        offsetCount={2}
                        list={[this.props.list]}
                        onChange={(columnIndex, rowIndex) => {
                            let item = this.props.list[rowIndex]
                            this.setState({
                                selectedItem:item,
                                selectedRow:[rowIndex]
                            })
                        }}
                        value={this.state.selectedRow}
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
