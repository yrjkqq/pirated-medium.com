import { createAction } from 'typesafe-actions';
import cuid from 'cuid';

// export const add = (title: string) =>
// action('todos/ADD', { id: cuid(), title, completed: false });

export const add = createAction('todos/ADD', (action) => {
  return (title: string) => action({ id: cuid(), title, completed: false });
});
