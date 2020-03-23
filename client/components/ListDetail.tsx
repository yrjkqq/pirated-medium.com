import * as React from 'react';

import { User } from '../interfaces';

type ListDetailProps = {
  item: User;
};

const ListDetail: React.FC<ListDetailProps> = ({ item }) => (
  <div>
    <h1>Detail for {item.name}</h1>
    <p>ID: {item.id}</p>
  </div>
);

export default ListDetail;
