/**
 * 这是一个用来做导航服务的文件，用于没有组件或者没有注册的页面
 * https://reactnavigation.org/docs/zh-Hans/navigating-without-navigation-prop.html
 *
 * @format
 */
import { NavigationActions } from 'react-navigation'

var _navigator

const setTopLevelNavigator = (navigatorRef) => (_navigator = navigatorRef)

const navigate = (routeName, params) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

const navigateSubRoute = (routeName, params, subRouteName, subParams) => {
  const currentRouteName = getCurrentRoute(_navigator.state.nav)
  if (currentRouteName === subRouteName) {
    return
  }

  if (currentRouteName === routeName) {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName: subRouteName,
        params: subParams
      })
    )
    return
  }

  if (currentRouteName !== routeName) {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
        action: !!subRouteName ? NavigationActions.navigate({ routeName: subRouteName, params: subParams }) : null
      })
    )
    return
  }
}

function getCurrentRoute(nav) {
  if (Array.isArray(nav.routes) && nav.routes.length > 0) {
    return getCurrentRoute(nav.routes[nav.index])
  } else {
    return nav.routeName
  }
}

export default { navigate, navigateSubRoute, setTopLevelNavigator }

export { navigate, navigateSubRoute, setTopLevelNavigator }
