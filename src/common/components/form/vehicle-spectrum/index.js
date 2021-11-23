/**
 * @description 用来实现车辆型谱级联选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 * @param {leafNode} 是否必须选中叶子节点，默认必须
 */

import React, { Component } from 'react'
import { Cascader, BottomModal, Tip } from 'beeshell'
import Vehicle from '../../../services/vehicle'

export default class VehicleSpectrum extends Component {
  static defaultProps = {
    leafNode: true
  }

  constructor(props) {
    super(props)
    this.vehicle = Vehicle.getInstance()
    this.state = {
      list: [],
      value: [0],
      info: []
    }
  }

  // 生命周期挂载阶段
  componentDidMount() {
    this.vehicle.getList().then((data) => {
      // 默认前两级

      const list = data[0].children[0].children

      // let list = data[0].children[0].children

      // list = list.map((item) => {
      //   let children = [...item.children]
      //   children = children.map((cItem) => {
      //     delete cItem['children']
      //     return cItem
      //   })
      //   return {
      //     ...item,
      //     children
      //   }
      // })

      this.setState({
        list: [...list]
      })
    })
  }

  // 设置默认回显方法
  setDefault(listMap) {
    this.vehicle.getList().then(() => {
      // 需要数据完善
      const value = listMap[2].value
      this.setState({
        value: [value],
        info: [listMap]
      })
    })
  }

  // 打开modal
  open() {
    return this.bottomModal.open()
  }

  // 异步加载数据
  handleChange(value, info) {
    this.setState({
      value: value,
      info: info
    })
  }

  render() {
    return (
      <BottomModal
        ref={(c) => (this.bottomModal = c)}
        title="请选择型谱"
        rightCallback={() => {
          // 检查是否必选叶子节点
          if (this.props.leafNode) {
            if (!this.state.info[0] || this.state.info[0].length !== 3) {
              // if (!this.state.info[0] || this.state.info[0].length !== 2) {
              Tip.show('请选择到最后一级！', 2000, 'center')
              return false
            }
          }
          // 组合型谱
          this.props.rightCallback(this.state.info[0])
        }}
        cancelable={true}>
        <Cascader
          style={{ height: 260, marginBottom: 50 }}
          proportion={[1]}
          fieldKeys={{ idKey: 'value' }}
          data={this.state.list}
          value={this.state.value}
          onChange={(value, info) => this.handleChange(value, info)}
        />
      </BottomModal>
    )
  }
}
