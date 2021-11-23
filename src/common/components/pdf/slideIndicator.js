import React, {Component}from 'react';
import PropTypes from 'prop-types'
import {View, StyleSheet}from 'react-native';
import * as ScreenUtils from './screenUtils';


const INDICATOR_LEFT = 8;
const INDICATOR_WIDTH = 12;

export default class SlideIndicator extends Component {
    static propTypes = {
        count: PropTypes.number.isRequired,
        position: PropTypes.number.isRequired,
        selectedColor:PropTypes.string,
        unselectColor:PropTypes.string
    }
    static defaultProps = {
        position: 0,
        unselectColor:'black',
        selectedColor:'red',
    }
    // 构造
    constructor(props) {
        super(props);
        this.currIndicator = this.props.position;
    }

    renderSecondView(index){
        // 样式的变化
        let style = [styles.circle];
        if (index != 0) {
            style.push({marginLeft: ScreenUtils.scaleSize(INDICATOR_LEFT)});
        }
        style.push({backgroundColor:this.props.unselectColor});
        return (
            <View
                key={index}
                style={style}
            />
        );
    }
    renderView(){
        let views=[];
        for (let index = 0; index < this.props.count; index++) {
            views.push(this.renderSecondView(index));
        }
        return views;
    }

    render() {
        let self = this;
        let translateX = self._computeOffset();
        return (
            <View
                style={styles.indicatorStyle}
            >
                {this.renderView()}
                <View
                    ref={(ref)=>this.indicatorBall=ref}
                    style={[
                        styles.circleIndicator,
                        {
                            transform:[
                                {
                                    translateX:-translateX
                                }
                            ],
                            backgroundColor: this.props.selectedColor
                        }
                    ]}
                />
            </View>
        );
    }

    setCurrPage(nextPage:number) {
        this.currIndicator = nextPage;
        let translateX = this._computeOffset();
        if (this.indicatorBall != null) {
            this.indicatorBall.setNativeProps({
                style: {
                    transform: [
                        {
                            translateX: -translateX
                        }
                    ]
                }
            });
        }
    }
    _computeOffset() {
        let count = this.props.count;
        let translateX = (count - this.currIndicator) * ScreenUtils.scaleSize(INDICATOR_WIDTH) + (count - this.currIndicator - 1) * ScreenUtils.scaleSize(INDICATOR_LEFT);
        return translateX;
    }
}
const styles = StyleSheet.create({
    indicatorStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: ScreenUtils.scaleSize(5),
    },
    circle: {
        width: ScreenUtils.scaleSize(INDICATOR_WIDTH),
        height: ScreenUtils.scaleSize(INDICATOR_WIDTH),
        borderRadius: ScreenUtils.scaleSize(INDICATOR_WIDTH / 2),
        backgroundColor: 'gray'
    },
    circleIndicator: {
        width: ScreenUtils.scaleSize(INDICATOR_WIDTH),
        height: ScreenUtils.scaleSize(INDICATOR_WIDTH),
        borderRadius: ScreenUtils.scaleSize(INDICATOR_WIDTH / 2),
        backgroundColor: 'red'
    },
});
