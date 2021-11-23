import UpdatePassword from "../drawer/password";
import SwitchRole from "../drawer/role"

const DrawerStack ={
    UpdatePassword: {
        screen: UpdatePassword,
        navigationOptions: ({navigation}) => ({
            title: '修改密码'
        })
    },
    SwitchRole:{
        screen: SwitchRole
    }
}
export default DrawerStack
