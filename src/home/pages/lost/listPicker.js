import React, {Component} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../../style/variables";
import {Button, Tip} from "beeshell";
import Feather from "react-native-vector-icons/Feather";
import {Divider} from "react-native-elements";
const window = Dimensions.get('window')

export default class ListPicker extends Component {

    static show() {

    }

    static dismiss(){

    }

    constructor(props) {
        super(props);
        // 给选项增加一个是否选中的属性
        for (let i = 0; i < this.props.data.length; i++) {
            this.props.data[i].selected = false;
        }
        this.state = {
            selectedIndex:null, // 当前选中项索引
            listData:this.props.data,
        }
        this._onPress= this._onPress.bind(this);
    }

    render() {
        return (
            <View style={styles.backGroundView}>
                <View style={styles.bodyView}>
                    {/*// 关闭按钮*/}
                    <TouchableOpacity
                        onPress={() => {
                            this._onPress(true);
                        }}
                        style={{flex:1,marginRight:5,alignItems:'flex-end'}}
                    >
                        <Feather name={'x'} size={20} color='#FFF'/>
                    </TouchableOpacity>
                    <View style={styles.contentView}>
                        {/*标题*/}
                        <Text style={styles.titleView}> {this.props.title} </Text>
                        <View style={styles.listContentView}>
                            <Divider style={styles.itemDivider}/>
                            {/*列表*/}
                            <FlatList
                                keyExtractor={(item: item) => item.accountNo}
                                data={this.state.listData}
                                showsVerticalScrollIndicator={false}
                                renderItem={({item,index}) => { /*列表项*/
                                    return (this.renderCell(item,index))
                                }}
                            />
                        </View>
                        {/*确定按钮*/}
                        <Button
                            style={styles.confirmButton}
                            size='sm'
                            type='primary'
                            textColorInverse
                            onPress={() => {
                                this._onPress(false);
                            }}>
                            <Text style={{color: '#fff', fontSize: 16}}>确定</Text>
                        </Button>
                    </View>
                </View>
            </View>
        )
    }

    renderCell(item,index){
      return(
          <TouchableOpacity
              onPress={()=>{
                  this.selectItemWithIndex(index);
              }}>
              <View style={{flexDirection: 'row', height: 44}}>
                  <Feather
                      style={{lineHeight: 44}}
                      name={item.selected?'check':'circle'}
                      size={20}
                      color={item.selected?'#37C1B4':'#969799'}
                  />
                  <Text style={styles.itemNameText}>{item.staffName}</Text>
                  <Text style={styles.itemCodeText}>{item.accountNo}</Text>
              </View>
              <Divider style={styles.itemDivider}/>
          </TouchableOpacity>
      )
    }

    // 选中其中一项, 除了选中的选项，其他选项均为非选中状态
    selectItemWithIndex(index){
        let temp = [];
        for (let i = 0; i < this.state.listData.length; i++) {
            let item = this.state.listData[i];
            item.selected = false;
            if (i===index) {
                item.selected = true;
            }
            temp.push(item);
        }
        this.setState({
            listData:temp,
            selectedIndex:index,
         })
    }

    _onPress(isCancel) {
        if (this.state.selectedIndex == null && !isCancel) {
            Tip.show('请选择分配人员',1000,'center');
            return;
        }
        else {

            this.props.onPress(isCancel,this.state.listData[this.state.selectedIndex]);
        }
    }
}

const styles = {
    backGroundView:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center'
    },
    bodyView:{
        marginTop: (window.height - 358) * 0.5,
        width: 270,
        height: 388,
        // alignItems: 'center',
    },
    contentView:{
        width: 270,
        height: 358,
        backgroundColor: colors.white,
        alignItems: 'center',
        borderRadius: 12,
    },
    closeButton:{
        position: 'absolute',
        top: -30,
        right: 0,
        width: 20,
        height: 20,
    },
    titleView:{
        height: 57,
        fontWeight: 'bold',
        fontSize: 17,
        lineHeight: 57
    },
    listContentView:{
        height: 226
    },
    itemDivider:{
        backgroundColor: colors.grey5,
        paddingRight: 16,
        paddingLeft: 16,
        height: 1
    },
    itemNameText:{
        paddingRight: 12,
        paddingLeft: 8,
        lineHeight: 44,
        width: 100,
        textAlign: 'center',
        color:'#323233'
    },
    itemCodeText:{
        lineHeight: 44,
        color:'#323233'
    },
    confirmButton:{
        marginTop: 20,
        width: 146,
        height: 40,
        borderRadius: 20
    }
}
