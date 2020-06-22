import * as styledComponents from 'styled-components';
import { antdStyles, customStyles } from './overrides-styles.js';

// theme.ts
// your theme variables
export interface IThemeInterface {
  // 全局主色
  'primary-color': string;
  // 链接色
  'link-color': string;
  // 成功色
  'success-color': string;
  // 警告色
  'warning-color': string;
  // 错误色
  'error-color': string;
  // 主字号
  'font-size-base': string;
  // 标题色
  'heading-color': string;
  // 主文本色
  'text-color': string;
  // 次文本色
  'text-color-secondary': string;
  // 失效色
  'disabled-color': string;
  // 组件/浮层圆角
  'border-radius-base': string;
  // 边框色
  'border-color-base': string;
  // 浮层阴影
  'box-shadow-base': string;
  // Buttons
  'btn-primary-bg': string;

  // Background color for `<body>`
  'body-background': string;

  // Input
  'input-placeholder-color': string;

  // Tooltip
  'tooltip-bg': string;

  // Select
  'select-item-selected-bg': string;
  'select-item-active-bg': string;

  // Modal
  'modal-body-padding': string;

  'input-focus-outline-color': string;
  'input-focus-border-color': string;
  'dense-text-color': string;

  /**
   * 最小宽度
   */
  'page-min-width': string;

  /**
   * 内容区域边框圆角
   */
  'content-border-radius': string;
}

export const theme = {
  default: { ...antdStyles, ...customStyles },
};
const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
  ServerStyleSheet,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

export { css, createGlobalStyle, keyframes, ThemeProvider, ServerStyleSheet };
export default styled;
