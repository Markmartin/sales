/**
 * 试乘试驾-详情
 * @param customerNo 根据客户编号获取试驾信息
 * @param driveId 根据driveId获取试驾信息
 */
import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Card, CustomerBg, FollowUpItem, FollowUpListText, RateBox, RateDesText } from './driver-detail-style'
import { Loading } from '../../../common/components/loading'
import { inject } from 'mobx-react'
import { Rating } from 'react-native-elements'
import variables from '../../../style/beeshell'
import PhoneCall from '../../../common/components/phone-call'
import OssImage from '../../../common/components/oss-image'

@inject(['userStore']) // 注入对应的store
export default class DriverDetail extends Component {
  constructor(props) {
    super(props)
    this.role = this.props.userStore.role
    this.user = this.props.userStore.user
    this.photos = []
    this.links = []
    this.state = {
      driverInfo: {},
      showMore: false,
      rateList: []
    }
  }

  // 挂载阶段获取信息
  componentDidMount() {
    // 根据props决定如何获取数据
    const driveId = this.props.navigation.getParam('driveId')
    // 获取试驾数据
    Loading.show()
    axios
      .get('/admin/satTestDrive/load', { params: { driveId } })
      .then(({ data }) => {
        //已完成的获取评价信息
        if (data.testDriveStatus === 3) {
          this.getRates(driveId, data)
        } else {
          this.setState({ driverInfo: data })
        }
      })
      .finally(() => Loading.hidden())
  }

  getRates(driveId, driveInfo) {
    // 获取评价信息
    axios.get('/admin/sattestdriveevaluation/loadByDriveId', { params: { driveId } }).then(({ data }) => {
      this.setState({ rateList: data, driverInfo: driveInfo })
    })
  }

  // 全屏浏览
  fullScreenBrows(image) {
    if (!image) return
    const { navigation } = this.props
    let mediaArr = [{ photo: image }]
    // 跳转
    navigation.navigate('Photo', { media: mediaArr, index: 0 })
  }

  // 评价展示信息
  renderRate() {
    // let showList = [this.state.rateList.length ? this.state.rateList[0] : '']
    // let list = this.state.showMore ? this.state.rateList : showList
    let { rateList } = this.state
    const hasRate = rateList && rateList.length !== 0
    const hasMore = rateList && rateList.length > 1
    const showMore = this.state.showMore && hasMore
    if (hasRate) {
      let list = showMore ? rateList : [rateList[0]]
      return (
        <Card style={{ paddingBottom: 15, backgroundColor: 'transparent' }}>
          {list.map((item, i) => {
            let text = ''
            switch (item.evaluationType) {
              case 1:
                text = '整体评价'
                break
              case 2:
                text = '品鉴顾问评价'
                break
              case 3:
                text = '试乘试驾专家评价'
                break
              case 4:
                text = '试乘试驾路线评价'
                break
              case 5:
                text = '试乘试驾门店评价'
                break
              case 6:
                text = '试乘试驾准备工作评价'
                break
            }
            return (
              <RateBox key={i}>
                <FollowUpItem>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={{ marginBottom: 12 }}>{text}</Text>
                    <Rating startingValue={item.entiretyStar} readonly imageSize={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        textAlign: 'right',
                        color: variables.mtdGray
                      }}>
                      {item.evaluationsTime}
                    </Text>
                  </View>
                </FollowUpItem>
                <RateDesText>{item.comment}</RateDesText>
              </RateBox>
            )
          })}
          <TouchableOpacity
            onPress={() => {
              this.handleShowMore(hasMore)
            }}>
            {hasMore ? (
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: variables.mtdBrandPrimary,
                  marginTop: 20,
                  marginBottom: 20
                }}>
                {showMore ? '收起' : '更多评价'}
              </Text>
            ) : null}
          </TouchableOpacity>
        </Card>
      )
    } else {
      return (
        <View style={{ marginLeft: 13, marginRight: 13, flexDirection: 'row', flex: 1 }}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: variables.mtdGray,
              margin: 15
            }}>
            暂无评价信息
          </Text>
        </View>
      )
    }
  }

  renderCancel() {
    return (
      <FollowUpItem>
        <View style={{ width: 100 }}>
          <FollowUpListText>试驾状态：</FollowUpListText>
        </View>
        <View>
          <Text style={{ color: 'red' }}>已取消</Text>
        </View>
      </FollowUpItem>
    )
  }

  // 点击切换更多评价
  handleShowMore(hasMore) {
    if (!hasMore) {
      return
    }
    this.setState({
      showMore: !this.state.showMore
    })
  }

  render() {
    const { driverInfo } = this.state
    const driveCertType = driverInfo.certType === '1' ? '身份证' : driverInfo.certType === '5' ? '驾驶证' : ''
    const driveStyle = driverInfo.driveStyle === 1 ? '上门试驾' : driverInfo.driveStyle === 2 ? '到店试驾' : ''
    const driveType = driverInfo.driveType === '1' ? '本人试驾' : driverInfo.driveType === '2' ? '家人试驾' : ''

    //是否显示评价
    const showRate = driverInfo.testDriveStatus === 3

    return (
      <CustomerBg style={{ flex: 1, paddingTop: 10 }}>
        <ScrollView>
          <Card style={{ paddingHorizontal: 10, paddingBottom: 15, margin: 13, borderRadius: 5 }}>
            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>客户姓名：</FollowUpListText>
              </View>
              <View>
                {/*<FollowUpListText>{driverInfo.name}</FollowUpListText>*/}
                <FollowUpListText>{driverInfo.customerName}</FollowUpListText>
              </View>
            </FollowUpItem>
            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>客户电话：</FollowUpListText>
              </View>
              {/*<PhoneCall phone={driverInfo.phone} style={{color: variables.mtdGrayBase}}/>*/}
              <PhoneCall
                phone={driverInfo.contacterPhoneOne ? driverInfo.contacterPhoneOne : driverInfo.phone}
                style={{ color: variables.mtdGrayBase }}
              />
            </FollowUpItem>

            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>试驾日期：</FollowUpListText>
              </View>
              <View>
                <FollowUpListText>
                  {driverInfo.driveTime ? moment(driverInfo.driveTime).format('YYYY-MM-DD HH:mm') : ''}
                </FollowUpListText>
              </View>
            </FollowUpItem>

            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>试驾车型：</FollowUpListText>
              </View>
              <View>
                <FollowUpListText>{driverInfo.seriesName}</FollowUpListText>
              </View>
            </FollowUpItem>

            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>试驾路线：</FollowUpListText>
              </View>
              <View>
                <FollowUpListText>{driverInfo.routeName}</FollowUpListText>
              </View>
            </FollowUpItem>

            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>试驾方式：</FollowUpListText>
              </View>
              <View>
                <FollowUpListText>{driveStyle}</FollowUpListText>
              </View>
            </FollowUpItem>

            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>试驾类型：</FollowUpListText>
              </View>
              <View>
                <FollowUpListText>{driveType}</FollowUpListText>
              </View>
            </FollowUpItem>

            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>证件类型：</FollowUpListText>
              </View>
              <View>
                <FollowUpListText>{driveCertType}</FollowUpListText>
              </View>
            </FollowUpItem>

            {!!driverInfo.driveInfo && (
              <FollowUpItem>
                <View style={{ width: 100 }}>
                  <FollowUpListText>试驾感受：</FollowUpListText>
                </View>
                <View style={{ flex: 1 }}>
                  <FollowUpListText>{driverInfo.driveInfo}</FollowUpListText>
                </View>
              </FollowUpItem>
            )}

            <FollowUpItem>
              <View style={{ width: 100 }}>
                <FollowUpListText>上传附件：</FollowUpListText>
              </View>

              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity onPress={() => this.fullScreenBrows(driverInfo.certPicFront)}>
                  <OssImage imageKey={driverInfo.certPicFront} style={{ height: 80, width: 80 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.fullScreenBrows(driverInfo.agreementPicPath)}>
                  <OssImage imageKey={driverInfo.agreementPicPath} style={{ height: 80, width: 80, marginLeft: 15 }} />
                </TouchableOpacity>
              </View>
            </FollowUpItem>

            {/*已取消就显示已取消状态*/}
            {driverInfo.testDriveStatus === 4 ? this.renderCancel() : null}
          </Card>
          {/*1待试驾,3试驾完成,4已取消试驾*/}
          {/*已完成试驾就显示评价*/}
          {showRate ? this.renderRate() : null}
        </ScrollView>
      </CustomerBg>
    )
  }
}
