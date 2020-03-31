import React from 'react';
import { bLog } from '../utils/b-log';
import { request } from '../utils/request';
import { FORM_CONTENT_TYPE } from '../utils/constants';

const UploadDogPic = () => {
  return (
    <form
      method="post"
      encType="multipart/form-data"
      onSubmit={async (evt) => {
        evt.preventDefault();
        bLog.debug();
        try {
          const resp = await request({
            url: 'form',
            method: 'post',
            headers: {
              ...FORM_CONTENT_TYPE,
            },
            data: {
              username: 'qiu',
              password: 'yuan',
            },
          });
          bLog.info(resp);
        } catch (error) {
          bLog.error(error);
        }
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
