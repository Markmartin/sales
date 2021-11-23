import { setPreId, getNodes } from './set-pre-id'
import { forEach, join, map, slice } from 'lodash'

class Vehicle {
  constructor() {
    this.list = []
    this.instance = null
    // hash化后的车辆 使用id 做键
    this.hashList = {}
  }

  // 获取车辆
  getList() {
    return new Promise((resolve, reject) => {
      if (this.list.length) {
        // 内存中有数据使用内存数据
        resolve(this.list)
      } else {
        // 车型选择api，看后期变化不变化
        axios.get('/admin/vehicleSpectrum/treeByPartner').then(({ data }) => {
          this.list = data.data
          resolve(this.list)
          // hash化 并存入父级节点信息
          forEach(this.list, (item) => setPreId(item, this.hashList))
        })
      }
    })
  }

  // 根据车辆15位码输出车辆名称以及组成数组
  getNodes(lastNode) {
    return this.getList().then(() => {
      let list = getNodes(lastNode, this.hashList)
      // 截取前两位
      list = slice(list, 2)
      const listMap = map(list, (item) => this.hashList[item])
      const name = join(map(listMap, (item) => item.label), '-')
      return {
        name,
        list,
        listMap
      }
    })
  }

  // 构造一个广为人知的接口，供用户对该类进行实例化
  static getInstance() {
    if (!this.instance) {
      this.instance = new Vehicle()
    }
    return this.instance
  }
}

export default Vehicle
