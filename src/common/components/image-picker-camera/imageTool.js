import ImagePicker from 'react-native-image-crop-picker';
import {uploadOss} from "../../services/oss";


const takePhoto = async function () {
    // 获取返回的图片
    return ImagePicker.openCamera({compressImageMaxWidth: 1980})
}

const uploadImgToAliCloud = async function(image) {
    // 执行回调函数，传递图片
    return uploadOss(image);
}


export {
    takePhoto,
    uploadImgToAliCloud
}
