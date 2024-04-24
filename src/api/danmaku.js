import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:8080',
 
});
instance.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('token')}`;
export const getDanmaku = (id) => {
  return instance.get('/Danmaku/Danlist?id='+id)
};

export const addDanmaku = (danmaku) => {
  return instance.post('/Danmaku/Add', danmaku)
};
