import {createDrawerNavigator} from 'react-navigation';
import Tabs from './customer-bottom-bar'
import CustomDrawer from "../drawer";

const RootScreen = createDrawerNavigator(
	{
		MainScreen: {
			screen: Tabs
		}
	},
	{
		drawerPosition: 'left',
		contentComponent: CustomDrawer,
		drawerLockMode:'locked-closed'
	}
)

export default RootScreen
