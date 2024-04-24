import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:8080',
 
});
instance.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('token')}`;



export const UploadFrom = (formData) => {
  return instance.post('file/uploadfrom', formData)
};

export const UploadChunk = (formData) => {
  return instance.post('file/uploadchunk', formData)
};

export const DoCombine = (formData) => {
  return instance.post('file/filecombine',formData)
};
