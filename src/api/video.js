import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8080',
 
});
api.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('token')}`;

export const getFirstVideos = (pageNo) => {
  return api.get('video/VideoList?curr_page=' + pageNo + '&recom=true')
    .then(response => response.data.value.data)
    .catch(error => {
      
    });
};

export const getMoreVideos = (pageNo) => {
  return api.get('video/VideoList?curr_page=' + pageNo + '&recom=true')
    .then(response => response.data.value.data)
    .catch(error => {
      
    });
};

export const getVideoDetail = async (videoId) => {
  try {
      const response = await api.get('video/GetVideo/' + videoId);
    
      return response.data.value.data;
  } catch (error) {
      
      console.error(error);
  }
}

export const AddLike = async (videoId) => { 
  try { 
      const response = await api.put('video/Like/' + videoId);
      return response.data.data;
  } catch (error) { 
      
  }
}

export const getComments = async (videoId,no) => { 
  try { 
    const response = await api.get('Comment/List?videoId=' + videoId+"&pageNumber="+no);
    return response.data;
} catch (error) { 
    
}
}

export const adCollection =(videoId,name) => {

  return api.post('Collection/AddVideo',{videoId:videoId,name:name})
   .then(response => response.data)
   .catch(error => {
      
    });
}
export const createCollection = (name) => {
  return api.post('Collection/Create', JSON.stringify({  name }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
   .then(response => response.data)
   .catch(error => {
      // 处理错误
    });
}

export const getCollections = () => {
  return api.get('Collection/List')
   .then(response => response.data.data)
   .catch(error => {
      
    });
}

export const removeCollection = (collectionId) => { 
  return api.put('Collection/Remove/' + collectionId)
   .then(response => response.data)
   .catch(error => {
      
    });
}
export const addComment = (rely) => {
  return api.post('Comment/Add', JSON.stringify(rely), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
   .then(response => response.data)
   .catch(error => {
      // 处理错误
    });
}

export const addReply = (commentId,text) => {
  return api.post('Comment/AddRep' , JSON.stringify({commId:commentId,text:text}),{
    headers: {
      'Content-Type': 'application/json'
    }
  })
   .then(response => response.data)
   .catch(error => {
     
    });
}
