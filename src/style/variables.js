const colors = {
  // 全局应用
  primary: '#00CFB4',
  secondary: '#6c757d',
  success: '#19be6b',
  info: '#4296F4',
  warning: '#f90',
  error: '#FF4444',
  light: '#fafbff',
  dark: '#343a40',
  searchBg: '#303337',
  disabled: 'hsl(208, 8%, 90%)',
  background: '#f0f3f5',

  // 文本
  grey0: '#292D35',
  grey1: '#43484d',
  grey2: '#5e6977',
  grey3: '#969799',
  grey4: '#ecedef',
  grey5: '#eff3f6',
  greyOutline: '#bbb',
  white: '#fff',
  black: '#000',

  // 平台
  platform: {
    ios: {
      primary: '#00CFB4',
      secondary: '#6c757d',
      success: '#19be6b',
      info: '#2db7f5',
      warning: '#f90',
      error: '#FF4444'
    },
    android: {
      primary: '#00CFB4',
      secondary: '#6c757d',
      success: '#19be6b',
      info: '#2db7f5',
      warning: '#f90',
      error: '#FF4444'
    }
  }
}

const size = {
  // 屏幕宽度
  // 字体
  fontSizeSm: 12,
  fontSizeBase: 14,
  fontsizeMd: 16,
  fontsizeLg: 18,

  h0FontSize: 32,
  h1FontSize: 30,
  h2FontSize: 24,
  h3FontSize: 21,
  h4FontSize: 18,
  h5FontSize: 16,
  h6FontSize: 12,

  // 字重
  fontWeightLight: '300',
  fontWeightNormal: 'normal',
  fontWeightBold: 'bold',
  fontWeightBolder: '900',

  // 边宽
  borderWidthBase: 1,
  borderWidthSm: 0.5,
  borderWidthLg: 2,

  // 圆角
  radiusBase: 5,
  radiusSm: 3,
  radiusLg: 7,

  lineHeightBase: 1, // 单行行高
  lineHeightParagraph: 1.5, // 多行行高

  // 水平间距
  hSpacingXs: 3,
  hSpacingSm: 5,
  hSpacingBase: 8,
  hSpacingLg: 15,
  hSpacingXl: 21,

  // 垂直间距
  vSpacingXs: 3,
  vSpacingSm: 6,
  vSpacingBase: 9,
  vSpacingLg: 15,
  vSpacingXl: 21,

  // 图标尺寸
  iconSizeXxs: 15,
  iconSizeXs: 18,
  iconSizeSm: 21,
  iconSizeBase: 22, // 导航条上的图标
  iconSizeLg: 36
}
export { colors, size }
