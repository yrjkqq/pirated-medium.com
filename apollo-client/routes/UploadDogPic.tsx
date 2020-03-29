import React from 'react';
import { bLog } from '../utils/b-log';
import Button from '../components/Button';

const UploadDogPic = () => {
  return (
    <form
      method="post"
      encType="multipart/form-data"
      onSubmit={(evt) => {
        evt.preventDefault();
        bLog.debug();
        // const data = new FormData(evt.target.elements[2].value);
      }}
    >
      Name: <input type="text" name="name" />
      <br />
      Email: <input type="email" name="email" />
      <br />
      Files: <input type="file" name="file" />
      <br />
      <input type="submit" />
    </form>
  );
};

export default UploadDogPic;
