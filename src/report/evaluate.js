import React, {Component} from 'react';
import {Divider} from "react-native-elements"
import AntIcon from 'react-native-vector-icons/AntDesign';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {colors, size} from "../style/variables"
import {StyleSheet, TouchableOpacity, View, Text} from "react-native"
import {Longlist} from "beeshell"
import {Loading} from "../common/components/loading"
import {Rate} from 'beeshell'

const customIcons = {
    empty: <AwesomeIcon
        name='star'
        size={18}
        color='#E7E7E7'
    />,
    half: <AwesomeIcon
        name='star-half-empty'
        size={18}
        color='#E38D4E'
    />,
    full: <AwesomeIcon
        name='star'
        size={18}
        color='#E38D4E'
    />
}

export default class Evaluate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            up: false,
            pageNum: 1,
            list: [],
            total: 0
        }
    }

    sort() {
        this.setState({up: !this.state.up})
    }

    refresh(num) {
        // 如果明确传入参数，则是刷新或者首次加载
        let pageNum
        if (num) {
            pageNum = 1
            if (this.state.list.length !== 0) {
                this.longList.flatList.scrollToIndex({
                    index: 0
                })
            }

        } else {
            // 没有明确参数是下拉刷新
            pageNum = this.state.pageNum + 1
        }
        // console.warn(pageNum)
        // 请求数据
        // 清空上拉方法禁止拉动
        Loading.show()
        return axios.get('/admin/evaluate/page', {
            params: {
                pageNum,
                pageSize: 10,
                evalType: '0',
                isStarOrder: this.state.up ? 1 : 0
            }
        })
            .then(({data}) => {
                Loading.hidden()
                // 判断如果是刷新则清空数据
                this.setState(
                    (prevState) => {
                        let oldList = pageNum === 1 ? [] : prevState.list
                        return {
                            pageNum,
                            list: [...oldList, ...data.list],
                            total: data.total
                        }
                    });
            }).catch((data) => {
                Loading.hidden()
            })
    }

    componentDidMount() {

        this.refresh(1)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.up !== this.state.up) {
            // this.longList.flatList.scrollToIndex({
            //     index: 0
            // })
            this.refresh(1)
        }

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", height: 50, alignItems: "center"}}>
                    <TouchableOpacity
                        onPress={this.sort.bind(this)}
                        style={styles.touchableTitle}
                        activeOpacity={0.8}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={styles.titleTextStyle}>评价星级</Text>
                            <View>
                                <AntIcon
                                    name='caretup'
                                    size={6}
                                    color={this.state.up ? colors.primary : '#D7D7D9'}
                                />
                                <AntIcon
                                    name='caretdown'
                                    size={6}
                                    color={!this.state.up ? colors.primary : '#D7D7D9'}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <Divider style={{backgroundColor: '#EDEEF0', height: 1}}/>

                {/*这里是列表*/}
                <View style={{flex: 1, backgroundColor: colors.background}}>
                    <Longlist
                        ref={(c) => {
                            this.longList = c;
                        }}
                        total={this.state.total}
                        data={this.state.list}
                        renderItem={({item, index}) => {
                            return (
                                <View style={styles.itemContainer}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        }}>
                                            {item.customerName}
                                        </Text>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginLeft: 12

                                        }}>
                                            {item.customerNo}
                                        </Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: colors.greyOutline,
                                            flex: 1,
                                            textAlign: 'right'
                                        }}>
                                            {item.createTime}
                                        </Text>
                                    </View>

                                    <Rate
                                        total={5}
                                        value={item.evalStar}
                                        iconSize={18}
                                        iconSpace={4}
                                        enableHalf={true}
                                        onChange={(value) => {
                                            console.log(value)
                                        }}
                                        style={{
                                            marginTop: 13
                                        }}
                                        icons={customIcons}
                                    />
                                </View>

                            )
                        }}
                        onEndReachedThreshold={0.05}
                        onEndReached={() => this.refresh()}
                        onRefresh={() => this.refresh(1)}
                        // 必须 否则容易出问题
                        getItemLayout={(data, index) => {
                            return {length: 94, offset: 94 * index, index}
                        }}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleTextStyle: {
        fontSize: size.fontSizeBase,
        color: "#292D35",
        marginRight: 5
    },
    touchableTitle: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },

    itemContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 19,
        paddingBottom: 19,
        backgroundColor: colors.white
    },

    boldTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',

    }

})
