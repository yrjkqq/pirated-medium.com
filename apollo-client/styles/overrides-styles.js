// 覆盖 antd 样式常量
const antdStyles = {
  'primary-color': '#2a6fd0', // 全局主色
  'link-color': '#2a6fd0', // 链接色
  'success-color': '#41b1a6', // 成功色
  'warning-color': '#ff7e27', // 警告色
  'error-color': '#ff5d58', // 错误色

  'font-size-base': '14px', // 主字号

  'heading-color': '#1a1c21', // 标题色
  'text-color': '#1a1c21', // 主文本色
  'text-color-secondary': '#62666d', // 次文本色
  'disabled-color': '#d9d9d9', // 失效色
  'border-radius-base': '2px', // 组件/浮层圆角
  'border-color-base': '#bdc5d5', // 边框色
  'box-shadow-base': `0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`, // 浮层阴影

  // Buttons
  'btn-primary-bg': '#4c8ae0',

  // Background color for `<body>`
  'body-background': '#e6eaee',

  // Input
  'input-placeholder-color': '#9ca1b0',

  // Tooltip
  'tooltip-bg': 'rgba(28, 27, 27, 0.9)',

  // Select
  'select-item-selected-bg': '#4c8ae0',
  'select-item-active-bg': '#e6e8ef',

  // Modal
  'modal-body-padding': '20px',

  // Form
};

// 全局样式常量
const customStyles = {
  'input-focus-outline-color': 'rgba(42, 111, 208, 0.2)',
  'input-focus-border-color': '#f3f9fe',
  'dense-text-color': '#0f0f0f',
  'page-min-width': 'calc(4px + 88.75rem + 4px)',
  'content-border-radius': '4px',
};

module.exports = { antdStyles, customStyles };
