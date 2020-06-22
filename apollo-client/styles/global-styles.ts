import { createGlobalStyle } from './styled';
import { antdStyles, customStyles } from './overrides-styles.js';

// 覆盖样式
const overridesStyle = `
#root {
}
`;

const GlobalStyle = createGlobalStyle`
body {
  font-size: 0.875rem;
  /* overflow-y: scroll !important; */
}

/* *::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #f2f2f2;
  padding-right: 2px;
}

*::-webkit-scrollbar-track {
  background: ${antdStyles['body-background']};
  border: 0;
}

*::-webkit-scrollbar-thumb {
  background: #b4bbc5;
  border: 0;
}

*::-webkit-scrollbar-thumb:hover {
  background: #555;
} */

${overridesStyle}
`;

export default GlobalStyle;
