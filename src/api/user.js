// request.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  
});
instance.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('token')}`;
const userapi = {
  getCode() {
    return instance.get('/middle/getCode');
  },
  login(data) {
    return instance.post('/user/login', data);
  },
  register(data) {
    return instance.post('/user/create', data);
  },
  getUserInfo() {
    return instance.get('/user/getinfo',{headers:{'Authorization': 'Bearer '+window.localStorage.getItem('token')}});
  },
  getUserbyId(id) {
    return instance.get('/user/getbyid/' + id)
      .then(response => {
        return response.data;
      });
  }
  
}

export default userapi;
