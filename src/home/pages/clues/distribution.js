// 这是分配的对话框

import React, { Component } from 'react'
import { Text, View, SafeAreaView, Alert } from 'react-native'
import { Scrollpicker, BottomModal, Tip } from 'beeshell'

export default class Distribution extends Component {
  constructor(props) {
    super(props)
    this.getUser = null
    this.clues = null
    this.state = {
      list: []
    }
  }

  // 生命周期挂载阶段
  componentDidMount() {
    storage.load({ key: 'user' }).then((user) => {
      axios.get('/admin/staff/listSaler', { params: { partnerCode: user.partnerCode } }).then(({ data }) => {
        this.setState({
          list: [{ staffName: '请选择' }, ...data]
        })
      })
    })
  }

  show(item) {
    this.clues = item
    this.bottomModal.open()
  }

  // 关闭对话框
  distribution() {
    if (!this.getUser) {
      Tip.show('请重新选择人员', 1000, 'center')
      return
    }

    const sales = this.state.list.find((item) => item.accountNo === this.getUser)
    if (!sales.mobilePhone) {
      Tip.show('请维护产品专家的手机号!', 1000, 'center')
      return
    }

    axios
      .post('/admin/satCustomerClue/assignClueToS', {
        clueId: this.clues.clueId,
        getUser: this.getUser
      })
      .then(() => {
        Tip.show('线索分配成功', 1000, 'center')
        this.props.refresh()
      })
  }

  renderSafeArea() {
    return (
      <View style={{ maxHeight: 30 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ height: 60 }} />
        </SafeAreaView>
      </View>
    )
  }

  render() {
    return (
      <View>
        <BottomModal
          ref={(c) => {
            this.bottomModal = c
          }}
          title="请选择品鉴顾问"
          rightCallback={() => {
            this.distribution()
          }}
          leftCallback={() => {}}
          cancelable={true}>
          <View style={{ paddingVertical: 15 }}>
            <Scrollpicker
              style={{ paddingHorizontal: 80 }}
              offsetCount={2}
              list={[this.state.list]}
              onChange={(columnIndex, rowIndex) => {
                this.getUser = this.state.list[rowIndex].accountNo
              }}
              renderItem={(item) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10
                    }}>
                    <Text>{item.staffName}</Text>
                  </View>
                )
              }}
            />
          </View>
          {this.renderSafeArea()}
        </BottomModal>
      </View>
    )
  }
}
