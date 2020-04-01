import React, { useRef } from 'react';
import { bLog } from '../utils/b-log';
import { request } from '../utils/request';

const UploadDogPic = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <form
      method="post"
      encType="multipart/form-data"
      onSubmit={async (evt) => {
        evt.preventDefault();
        bLog.debug();
        try {
          const fd = new FormData();
          if (
            fileInput.current &&
            fileInput.current.files &&
            fileInput.current.files.length > 0
          ) {
            fd.append(fileInput.current.name, fileInput.current?.files[0]);
          }
          const resp = await request({
            url: 'upload1',
            method: 'post',
            data: fd,
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
      Files: <input type="file" name="file" ref={fileInput} />
      <br />
      <input type="submit" />
    </form>
  );
};

export default UploadDogPic;
