import React, { useState } from 'react';
import styled from '../styles/styled';

interface TextProps {
  fontSize?: string;
}

const Text = styled.div<TextProps>`
  font-size: ${(props) => props.fontSize}px;
`;

const Other = () => {
  const [fs, setFs] = useState('16');
  return (
    <div>
      <Text style={{ fontSize: `${fs}px` }}>other...</Text>
      <input
        value={fs}
        type="number"
        onChange={(evt) => setFs(evt.target.value)}
      ></input>
    </div>
  );
};

export default Other;
