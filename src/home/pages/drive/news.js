import React, {Component} from 'react';
import {View, ActivityIndicator, FlatList, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';
import navigation from '../../../common/services/navigation'

import {NewsWrapper,LoadingWrapper,CardWrapper,CardListItem,CardDate,CardTitle,CardInfo,CardLevel,CardPhone,CardInfoContent,
    UserName,PublishBtn,PublishMethods,CardInfoBottom} from "./style";

export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }
    componentDidMount() {
        fetch('https://www.easy-mock.com/mock/5ad8564d8ddd0450275c0d51/example/shichengshijia')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                let list = responseJson.data.list;
                this.setState({
                    isLoading: false,
                    dataSource: list
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <NewsWrapper>
                <LoadingWrapper isLoading={this.state.isLoading}>
                    <ActivityIndicator/>
                </LoadingWrapper>
                <View style={{flex:1}}>
                    <FlatList
                        data={this.state.dataSource}
                        extraData={this.state}
                        renderItem={({item}) =>
                            <CardWrapper>
                                <CardListItem>
                                    <CardTitle>
                                        <UserName><Icon name="user" size={18}/>{item.name}</UserName>
                                        <CardDate>预约试驾时间：{item.date}</CardDate>
                                    </CardTitle>
                                    <CardInfo>
                                        <CardInfoContent>
                                            <CardLevel>{item.leval}级别</CardLevel>
                                            <CardPhone>{item.phone}</CardPhone>
                                        </CardInfoContent>
                                        <CardInfoBottom>
                                            <PublishMethods>{item.methods}</PublishMethods>
                                            <TouchableNativeFeedback
                                                onPress={()=> navigation.navigate('Agreement',{methods: item.methods})}>
                                                <PublishBtn>查看试驾协议</PublishBtn>
                                            </TouchableNativeFeedback>
                                        </CardInfoBottom>
                                    </CardInfo>
                                </CardListItem>
                            </CardWrapper>
                        }
                        keyExtractor={(item, index) => index.toString()}
                        removeClippedSubviews={false}
                        getItemLayout={(data, index) => {
                            return { length: 40, offset: 40 * index, index }
                        }}
                    />
                </View>
            </NewsWrapper>
        )
    }

}
