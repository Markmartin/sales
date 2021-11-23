import {createAppContainer, createSwitchNavigator} from 'react-navigation';

// 主页
import AppScreen from './drawer-navigation'

// 登陆页
import Login from '../login'

// 加载页
import Loading from '../loading'

const switchNavigation = createSwitchNavigator(
	{
		Loading: Loading,
		App: AppScreen,
		Auth: Login,
	},
	{
		initialRouteName: 'Loading'
	}
)

const AppContainer = createAppContainer(switchNavigation)

export default AppContainer
