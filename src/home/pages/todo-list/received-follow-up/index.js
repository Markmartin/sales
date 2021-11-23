import React, { Component, useEffect, useState, useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { NavigationContext } from '@react-navigation/core'
import { inject } from 'mobx-react'
import { colors, size } from '../../../../style/variables'
import Sex from '../../../../common/components/sex'
import { userLevelHash } from '../../../data-config'
import { ListItem, ListInfo, ListAction, UserInfo, OrderInfo } from '../style'
import PhoneCall from '../../../../common/components/phone-call'
import Icon from 'react-native-vector-icons/dist/Feather'

function ReceivedFollowUp(prpos) {
  const navigation = useContext(NavigationContext)

  const [customers, setCustomers] = useState([])

  async function apiCustomers() {
    const response = await baseRequest({
      method: 'get',
      url: '/admin/customer/gotWaitFollowList'
    })
    if (response.status) {
      setCustomers(response.data)
    }
  }

  useEffect(() => {
    apiCustomers()
  }, [])

  return (
    <View>
      <FlatList
        data={customers}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.customerId}
            onPress={() => {
              navigation.navigate('Customers', {
                customerNo: item.customerNo,
                eventId: item.eventId,
                eventRemark: item.eventRemark
              })
            }}>
            <ListItem>
              <ListInfo>
                <UserInfo>
                  <View>
                    <Text style={{ fontSize: size.fontsizeMd }}>{item.name}</Text>
                  </View>
                  <Sex data={item.sex} />
                  <PhoneCall style={{ fontSize: size.fontsizeMd }} phone={item.phone} />
                </UserInfo>
                <OrderInfo>
                  <View style={{ width: 40 }}>
                    <Text style={{ color: colors.grey3 }}>{userLevelHash[item.level]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.grey3 }}>{item.catalogName}</Text>
                  </View>
                  <View style={{ width: 130 }}>
                    <Text style={{ color: colors.grey3 }}>
                      {/* {moment(item.planFollowTime).format('YYYY-MM-DD HH:mm')} */}
                    </Text>
                  </View>
                </OrderInfo>
              </ListInfo>
              <ListAction>
                <Icon size={24} name="chevron-right" color={colors.grey3} />
              </ListAction>
            </ListItem>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

// export default ReceivedFollowUp

export default withNavigationFocus(inject((stores) => stores.userStore)(ReceivedFollowUp))
