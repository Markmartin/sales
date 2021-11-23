/**
 * @description 用来显示试驾路线的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, StyleSheet} from 'react-native';
import Swiper from "react-native-swiper";
import {colors} from "../../../../style/variables";
import {Card, CardTitle,} from '../driver-detail-style'
import OssImage from '../../../../common/components/oss-image'
import {findIndex} from 'lodash'

export default class DriverRouters extends Component {

    constructor(props) {
        super(props)
        this.state = {
            routes: []
        }
    }

    componentDidMount() {
        // 获取试驾线路
        axios.get('/admin/satTestDriveRoute/page', {params: {pageSize: 100, pageNum: 1}})
            .then(({data}) => {
                this.total = data.list.length
                this.setState({routes: data.list})
                if (this.props.callback) this.props.callback(0, this.state.routes[0])
            })
    }

    // 回显当前路线
    setDefault(id) {
        // 查找id的index
        const {routes} = this.state
        if (!routes.length) return
        const index = findIndex(routes, item => item.testDriveRouteId === id)
        this.Swiper.scrollBy(index)
        this.Swiper.get
    }

    getTotal() {
        return this.total
    }

    render() {
        return (
            <Card>
                {this.props.showTitle ?
                    <CardTitle style={{borderBottomWidth: 0}}>
                        <Text>试驾线路:</Text>
                    </CardTitle> : null
                }
                <Swiper ref={c => this.Swiper = c}
                        scrollEnabled={this.props.editable !== false}
                        showsPagination={false}
                        loop={false}
                        style={styles.wrapper}
                        onIndexChanged={(index) => {
                            if (this.props.callback) this.props.callback(index, this.state.routes[index])
                        }}>
                    {this.state.routes.map((item, i) => {
                        return (
                            <View style={styles.slide} key={i}>
                                <Text style={styles.text}>{item.routeName}</Text>
                                <OssImage
                                    imageKey={item.picPath}
                                    style={{height: 144, width: '100%'}}/>
                            </View>
                        )
                    })}
                </Swiper>
            </Card>
        );
    }
}

DriverRouters.defaultProps = {
    showTitle: true
}

const styles = StyleSheet.create({
    wrapper: {
        height: 174
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 4,
        overflow: 'hidden',
    },
    text: {
        color: colors.dark,
        fontSize: 26,
        marginTop: 10,
        marginBottom: 10
    }
});
