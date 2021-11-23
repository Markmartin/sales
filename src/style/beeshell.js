import { useTheme } from 'beeshell/dist/common/styles/variables'
import { StyleSheet } from 'react-native'

// 自定义主题
const customVariables = {
	mtdBrandPrimary: '#00CFB4',
	mtdBrandPrimaryDark: '#00CFB4',
	mtdBrandSuccess: '#19be6b',
	mtdBrandWarning: '#f90',
	mtdBrandDanger: '#FF4444',
	mtdBrandInfo: '#188afa',

	// 灰度
	mtdGrayBase: '#111',    // 正文，主标题
	mtdGrayDarker: '#333',  // 副标题
	mtdGrayDark: '#555',    // 补充、提示信息
	mtdGray: '#888',        // 取消按钮等
	mtdGrayLight: '#aaaaaa',
	mtdGrayLighter: '#cccccc',
	mtdGrayLightest: '#ebebeb',

	// 背景色
	mtdFillBase: '#ffffff',
	mtdFillGray: '#F5F5F5',
	mtdFillBody: '#F8F8F8',
	mtdFillBackdrop: 'rgba(0, 0, 0, .3)',
	mtdFillBackdropDark: 'rgba(0, 0, 0, 0.75)',

	// 字体尺寸
	mtdFontSizeXS: 10,
	mtdFontSizeS: 12,
	mtdFontSizeM: 14,
	mtdFontSizeL: 16,
	mtdFontSizeXL: 18,
	mtdFontSizeX2L: 20,
	mtdFontSizeX3L: 22,
	mtdFontSizeX4L: 24,
	mtdFontSizeX5L: 28,

	// 水平间距
	mtdHSpacingS: 4,
	mtdHSpacingM: 8,
	mtdHSpacingL: 12,
	mtdHSpacingXL: 16,
	mtdHSpacingX2L: 20,
	// 垂直间距
	mtdVSpacingXS: 2,
	mtdVSpacingS: 4,
	mtdVSpacingM: 8,
	mtdVSpacingL: 10,
	mtdVSpacingXL: 12,
	mtdVSpacingX2L: 16,
	mtdVSpacingX3L: 18,
	mtdVSpacingX4L: 20,
	// 圆角
	mtdRadiusXS: 2,
	mtdRadiusS: 4,
	mtdRadiusM: 6,
	mtdRadiusL: 8,

	mtdBorderWidth: StyleSheet.hairlineWidth,
	mtdBorderColor: '#F5F5F5',
	mtdBorderColorDark: '#e5e5e5',
	mtdBorderColorDarker: '#d5d5d5',

	// button组件

	buttonLHSpacing: 50,
	buttonLVSpacing: 14,


	buttonMHSpacing: 46,
	buttonMVSpacing: 12,

	buttonSVSpacing: 8,

	// formitem
	formItemVSpacing: 18,

	formItemLabelWidth: 90,
	formItemLabelMarginRight: 32
}
const ret = useTheme(customVariables)

export default ret
