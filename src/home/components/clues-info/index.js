import React, { Component } from 'react'
import { CluesWrapper, CluesTitle, CluesTitleText } from './style'
import Icon from 'react-native-vector-icons/dist/Feather'
import { withNavigationFocus } from 'react-navigation'
import { inject } from 'mobx-react'
import { Animated, Easing, Text, View } from 'react-native'

@inject(['userStore']) // 注入对应的store
class CluesInfo extends Component {
  constructor(props) {
    super(props)
    // 标记状态
    this.reload = false
    this.store = this.props.userStore
    this.state = {
      number: 0,
      clueNumber: 0,
      show: true,
      showRole: this.store.role.roleCode === 'rolePartnerSale' || this.store.role.roleCode === 'rolePartnerSaleManager',
      translateX: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.runAnimation()
  }

  runAnimation = () => {
    this.setState({ translateX: new Animated.Value(0) }, () => {
      Animated.timing(this.state.translateX, {
        toValue: -150,
        duration: 10000,
        useNativeDriver: true
      }).start(() => this.runAnimation())
    })
  }

  // // 获取焦点时刻
  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.isFocused) {
      // 如果reload了不再请求
      if (this.reload) return null
      this.setState({
        showRole:
          this.store.role.roleCode === 'rolePartnerSale' || this.store.role.roleCode === 'rolePartnerSaleManager'
      })
      axios.get('/admin/satCustomerClue/todayClueCountV2').then(({ data }) => {
        let array = data.split(',') || [0, 0]
        this.setState({ number: array[0], clueNumber: array[1] })
        this.store.setData({ key: 'cluesCount', value: array[0] })
      })
      // 标记reload
      this.reload = true
    } else {
      this.reload = false
    }
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    const { showRole, show, number, clueNumber } = this.state
    if (show && showRole) {
      return (
        <CluesWrapper>
          <View
            style={{
              height: '100%',
              zIndex: 999,
              backgroundColor: '#fffbe8',
              justifyContent: 'center',
              paddingHorizontal: 10
            }}>
            <Icon name="volume" size={24} color="#ED6A0C" light />
          </View>
          <Animated.View
            style={{
              paddingHorizontal: 5,
              flex: 1,
              flexDirection: 'row',
              height: 24,
              transform: [{ translateX: this.state.translateX }, { perspective: 500 }]
            }}>
            <Text>今日有{number}位客户待处理!</Text>
            {clueNumber > 0 && <Text style={{ paddingLeft: 5 }}>今日有逾期线索待处理!</Text>}
          </Animated.View>

          <View
            style={{
              height: '100%',
              zIndex: 999,
              backgroundColor: '#fffbe8',
              justifyContent: 'center',
              paddingHorizontal: 10
            }}>
            <Icon
              name="x"
              size={24}
              color="#ED6A0C"
              onPress={() => {
                this.setState({ show: false })
              }}
              light
            />
          </View>
        </CluesWrapper>
      )
    } else {
      return null
    }
  }
}

export default withNavigationFocus(CluesInfo)
