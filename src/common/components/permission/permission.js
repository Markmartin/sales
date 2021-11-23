
import {PermissionsAndroid} from 'react-native'

//返回String类型
//'granted'： 同意了
//'denied' : 拒绝了
//'never_ask_again' ： 永久性拒绝下次再请求用户也看不到了，尴不尴尬

/***
 * Android Only
 * 检查是否获取读写权限
 */
export async function CheckPermission () {
    try {
        //返回Promise类型
        const granted = PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        return granted;
    } catch (err) {
        this.show(err.toString())
    }
}

/***
 * 弹出提示框向用户请求某项权限。返回一个promise，最终值为用户是否同意了权限申请的布尔值。
 * 其中rationale参数是可选的，其结构为包含title和message)的对象。
 * 此方法会和系统协商，是弹出系统内置的权限申请对话框，
 * 还是显示rationale中的信息以向用户进行解释。
 */
export async function RequestReadPermission () {
    try {
        //返回string类型
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                //第一次请求拒绝后提示用户你为什么要这个权限
                'title': '读写权限申请',
                'message': '亲，没读写权限我不能愉快玩耍！'
            }
        )
        return granted;
    } catch (err) {
        this.show(err.toString())
    }
}

/***
 * Android Only
 * 相机权限
 * @returns {Promise<void>}
 */
export async function RequestCarmeraPermission () {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                //第一次请求拒绝后提示用户你为什么要这个权限
                'title': '相机权限申请',
                'message': '亲，没相机权限我不能愉快玩耍！'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.show("您已获取了相机权限")
        } else {
            this.show("获取相机失败")
        }
    } catch (err) {
        this.show(err.toString())
    }
}

/***
 * Android Only
 * 地址查询权限
 * @returns {Promise<void>}
 */
export async function RequestLocationPermission () {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                //第一次请求拒绝后提示用户你为什么要这个权限
                'title': '地址查询权限申请',
                'message': '亲，没权限我不能愉快玩耍！'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.show("您已获取了地址查询权限")
        } else {
            this.show("获取地址查询失败")
        }
    } catch (err) {
        this.show(err.toString())
    }
}

/***
 * 一次性请求所有的权限
 * @returns {Promise<void>}
 */
export async function RequestMultiplePermission () {
    try {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.CAMERA
        ]
        //返回得是对象类型
        const granteds = await PermissionsAndroid.requestMultiple(permissions)
        var data = "是否同意地址权限: "
        if (granteds["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
            data = data + "是\n"
        } else {
            data = data + "否\n"
        }
        data = data+"是否同意相机权限: "
        if (granteds["android.permission.CAMERA"] === "granted") {
            data = data + "是\n"
        } else {
            data = data + "否\n"
        }
        data = data+"是否同意存储权限: "
        if (granteds["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted") {
            data = data + "是\n"
        } else {
            data = data + "否\n"
        }
        this.show(data)
    } catch (err) {
        this.show(err.toString())
    }
}

