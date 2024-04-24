<template>
  <!-- <Navigate  ></Navigate> -->
<diV>
 <div class="player" ref="player"></div>
</diV>
</template>


<script>
import Navigate from '@/components/Navigate.vue'
import Hls from 'hls.js';

import { ElPagination, ElMessageBox, ElImage, ElNotification } from 'element-plus';
import BackTop from '@/components/BackTop.vue';
import {getVideoDetail} from '@/api/video';
import { getDanmaku } from '@/api/danmaku';
import Dplayer from 'dplayer';

export default{
name: 'App',
  components: {
   Navigate,
   ElPagination,
   ElImage,
   BackTop
  },
  data() {
        return {
          isLogin: false,
          user:{},
          collection: [],
            video: {},
            uper: {},
            player: {},
            videoList: [],
            now: 0,
            summary_show: false,
            comments: [],
            pageSize: 3,
            currentPages: [],
            reply_show: false,
            reply_list: [],
            replyVideo: '',
            userNames: [],
            isCollected: false,
            isLiked: false,
            isCenter: true,
            dialogVisible: false,
            switcher_isActive: true,
            newCollection: '',
            profile: 'https://kotokawa-akira-mywife.site/web/api/account/getProfile/000',
            profiles: [],
            isUp: false,
            showUpLoad: false,
            loader: {},
            progress: 0,
            file: document.createElement("input"),
            video_file: null,
            video_resouce: [],
        }
    },
    watch: {
        video(value) {
            document.title = value.title;
            // this.getUper(value.up);
            // this.getVideoList();
            // this.getComments(value.id);
            // this.getProfile();
            //设置简介 等待页面渲染
            this.$nextTick(() => {
                if (this.$refs.summary_text.offsetHeight > 55) {
                    this.summary_show = true;
                    this.$refs.summary_more.addEventListener("click", () => {
                        if (this.$refs.text_container.offsetHeight > 55) {
                            this.$refs.summary_more.innerText = "展开";
                            this.$refs.text_container.style.height = "50px";
                        } else {
                            this.$refs.summary_more.innerText = "收起";
                            this.$refs.text_container.style.height = "auto";
                        }
                    });
                }
            });
        },
        comments() {
            for (let i = 0; i < this.comments.length; i++) {
                this.currentPages.push(1);
            }
            this.$nextTick(() => {
                let comments = document.querySelectorAll(".lower-comments-li-text");
                comments.forEach(el => {
                    let text = el.querySelector(".lower-comments-li-text-main");
                    if (text.offsetHeight > 55) {
                        let btn_show = el.querySelector(".lower-comments-li-text-more");
                        let container = el.querySelector(".lower-comments-li-text-container")
                        btn_show.style.display = "unset"
                        btn_show.onclick = () => {
                            if (container.offsetHeight > 55) {
                                btn_show.innerText = "展开";
                                container.style.maxHeight = "55px";
                            } else {
                                btn_show.innerText = "收起";
                                container.style.maxHeight = "none";
                            }
                        }
                    }
                    this.reply_list.push('');
                    this.userNames.push('');
                });
            });
        },
        collection(value) {
            this.isCollected = this.judgeIsCollected(value);
        },
        progress(value) {
            this.$refs.progress_inner.style.width = value + "%";
        }
    },
    methods: {
        handleClose() {
            ElMessageBox.confirm("确定关闭上传窗口吗? 将会停止上传!", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                this.showUpLoad = false;
                this.progress = 0;
                this.loader.abort();
                this.video_file = null;
            }).catch(() => { });
        },
        selectFile() {
            this.file.click();
        },
        beforeVideoUpload(rawFile) {
            if (rawFile.type != 'video/mp4' && rawFile.type != 'video/ogg') {
                ElMessageBox.alert('只能上传 <b style="color:var(--ava)">mp4、ogg</b> 格式的视频', '提示', { dangerouslyUseHTMLString: true, confirmButtonText: "确定" });
                return false;
            } else if (rawFile.size / 1024 / 1024 > 500) {
                ElMessageBox.alert('视频大小不能超过 <b style="color:var(--ava)">500MB</b> ', '提示', { dangerouslyUseHTMLString: true, confirmButtonText: "确定" });
                return false
            }
            return true
        },
        uploadVideo(id) {
            // this.showUpLoad = true;
            // const xhr = new XMLHttpRequest();
            // this.loader = xhr;
            // xhr.open('post', 'https://kotokawa-akira-mywife.site/web/api/video/uploadVideo/' + id);
            // const data = new FormData();
            // data.append("video", this.video_file);
            // xhr.upload.addEventListener("progress", (e) => {
            //     let num = e.loaded * 100 / e.total;
            //     this.progress = num.toFixed(2);
            // });
            // xhr.addEventListener("readystatechange", () => {
            //     if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            //         this.upload_id = "";
            //         ElNotification({
            //             title: "上传完毕",
            //             message: "上传完毕",
            //             duration: 0,
            //             dangerouslyUseHTMLString: true
            //         });
            //         this.showUpLoad = false;
            //         this.progress = 0;
            //         this.clear();
            //     }
            // });
            // xhr.send(data);
        },
        ajax(options, success, failure) {
            // 默认参数
            const defaultOptions = {
                url: "",
                method: "get",
                responseType: "text"
            };
            // 合并参数
            Object.assign(defaultOptions, options);
            // 创建xhr
            const xhr = new XMLHttpRequest();
            xhr.open(defaultOptions.method, defaultOptions.url);
            xhr.responseType = defaultOptions.responseType;
            // 设置header
            if (defaultOptions.header) {
                const header_keys = Object.keys(defaultOptions.header);
                const header_values = Object.values(defaultOptions.header);
                for (const index in header_keys) {
                    xhr.setRequestHeader(header_keys[index], header_values[index]);
                }
            }
            // 处理回调
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState == xhr.DONE) {
                    if (xhr.status == 200)
                        if (xhr.responseType == "blob")
                            success(xhr.response);
                        else
                            success(xhr.responseText);
                    else if (xhr.status >= 400 && failure) {
                        failure({ statusCode: xhr.status, statusText: xhr.statusText });
                    }
                }
            });
            // 发送请求
            if (defaultOptions.method == "post")
                xhr.send(JSON.stringify(defaultOptions.body));
            else
                xhr.send();
        },
        getProfile() {
            // this.ajax({
            //     method: 'get',
            //     url: 'https://kotokawa-akira-mywife.site/web/api/account/getProfile/' + this.video.up,
            //     responseType: 'blob'
            // }, (res) => {
            //     if (res.type != "image/png") return;
            //     let profile_blob = res;
            //     this.profile = URL.createObjectURL(profile_blob);
            // });
        },
        getVideoId() {
            let sps = window.location.pathname.split("/");
            return sps[sps.length - 1];
        },
      async  getVideoInfo() {
          const res = await getVideoDetail(this.getVideoId())
          this.video = res.video
          this.uper = res.user
          console.log(res)
          for(let i =0;i<this.video.videoResouce.length;i++)
          {
            let item =this.video.videoResouce[i]
            this.video_resouce.push({name:item.videoSize == 0?"720p":"480p",url:"http://localhost:8080/static/"+item.playerPath,type:"customHls"});
          } 
          
        },
      
       
        changeVideo(file, index) {
            // this.now = index;
            // this.player.video.src = "https://kotokawa-akira-mywife.site/web/api/video/" + this.video.id + "/" + file;
            // this.player.video.play();
            // let list = document.querySelectorAll(".video-change-li");
            // list.forEach(element => {
            //     element.style.color = 'unset';
            // });
            // list[index].style.color = 'var(--ava)';
        },
        getComments(id) {
            // fetch('https://kotokawa-akira-mywife.site/web/api/comments/getComments/' + id, { method: 'get' })
            //     .then(res => {
            //         return res.json();
            //     }).then(data => {
            //         this.comments = data;
            //     });
        },
        currentChange(index, value) {
            this.currentPages[index] = value;
            this.$nextTick(() => {
                let comments = document.querySelectorAll(".lower-comments-li-text");
                comments.forEach(el => {
                    let text = el.querySelector(".lower-comments-li-text-main");
                    let btn_show = el.querySelector(".lower-comments-li-text-more");
                    let container = el.querySelector(".lower-comments-li-text-container")
                    btn_show.onclick = null;
                    if (text.offsetHeight > 55) {
                        btn_show.style.display = "unset"
                        btn_show.onclick = () => {
                            if (container.offsetHeight > 55) {
                                btn_show.innerText = "展开";
                                container.style.maxHeight = "55px";
                            } else {
                                btn_show.innerText = "收起";
                                container.style.maxHeight = "none";
                            }
                        }
                    } else {
                        btn_show.style.display = "none";
                    }
                });
            });
        },
        replyBtn(id, userName, index) {
            let reply_lis = document.querySelectorAll(".reply-li");
            reply_lis[index].style.setProperty("display", "flex", "important");
            let textarea = reply_lis[index].querySelector("textarea");
            textarea.placeholder = `@${userName} | uid:${id}`;
            this.userNames[index] = userName;
        },
        replyForVideo() {
            if (!this.isLogin) {
                ElMessageBox.alert('登录后即可发布评论', '提示', {
                    confirmButtonText: "确定"
                });
                return;
            }
            if (this.replyVideo == "") return;
            this.addComment(this.video.id, this.user.id, this.user.name, this.replyVideo);
            this.replyVideo = "";
        },
        replyForUser(userName, commentId, index) {
            if (!this.isLogin) {
                ElMessageBox.alert('登录后即可回复', '提示', {
                    confirmButtonText: "确定"
                });
                return;
            }
            if (this.reply_list[index] == '') return;
            let text = '';
            if (userName == this.userNames[index])
                text = this.reply_list[index];
            else
                text = `@${this.userNames[index]} ` + this.reply_list[index];
            this.addComment(commentId, this.user.id, this.user.name, text);
            this.reply_list[index] = "";
        },
        addComment(forid, uId, userName, text) {
            // fetch('https://kotokawa-akira-mywife.site/web/api/comments/addComment', {
            //     method: "post",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         forId: forid,
            //         uid: uId,
            //         text: text,
            //         userName: userName
            //     }),
            //     credentials: "include"
            // }).then(res => {
            //     return res.json();
            // }).then(data => {
            //     if (data.success == "true") {
            //         ElMessageBox.alert('发布成功!');
            //         this.getComments(this.video.id);
            //     } else if (data.reason == "WordsForbidden")
            //         ElMessageBox.alert('评论包含敏感词汇!', '提示', {
            //             confirmButtonText: "确定"
            //         });
            // });
        },
        judgeIsCollected(collection) {
            return collection.some(el => {
                return el.videos.some(video => {
                    return video.id == this.video.id;
                });
            })
        },
        btnLike() {
            this.btnLikeClick(!this.isLiked);
            this.isLiked = !this.isLiked;
        },
        btnLikeClick(isLiked) {
            let path = 'addLike';
            if (!isLiked) path = 'disLike';
            // fetch('https://kotokawa-akira-mywife.site/web/api/video/' + path + '/' + this.video.id, { method: "get" })
            //     .then(res => {
            //         return res.json();
            //     }).then(data => {
            //         this.video.like = data;
            //     });
        },
        btnCollection() {
            if (!this.$store.state.userinfo) {
                ElMessageBox.alert('登录后即可加入收藏', '提示', {
                    confirmButtonText: "确定"
                });
                return;
            }
            if (this.isCollected) {
                let Name = '';
                this.collection.some(el => {
                    return el.videos.some(video => {
                        if (video.id == this.video.id) Name = el.name;
                        return video.id == this.video.id;
                    });
                });
                fetch('https://kotokawa-akira-mywife.site/web/api/collection/removeFromCollection', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: this.user.id, name: Name, videoId: this.video.id }),
                    credentials: "include"
                }).then(res => {
                    return res.json();
                }).then(data => {
                    if (data.success == "true") {
                        this.video.collection -= 1;
                        this.isCollected = false;
                    }
                });
            } else this.dialogVisible = true;
        },
        addCollection(Name) {
            fetch('https://kotokawa-akira-mywife.site/web/api/collection/addToCollection', {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: this.user.id, name: Name, videoId: this.video.id }),
                credentials: "include"
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.success == "true") {
                    this.$parent.getCollection();
                    this.video.collection += 1;
                }
            });
            this.dialogVisible = false;
        },
        showComment() {
            this.switcher_isActive = true;
            this.$refs.lower_left.style.display = "block";
            this.$refs.lower_more.style.display = "none";
        },
        showMore() {
            this.switcher_isActive = false;
            this.$refs.lower_left.style.display = "none";
            this.$refs.lower_more.style.display = "block";
        },
        addNewCollection() {
            ElMessageBox.prompt(null, '添加到新建收藏夹', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '收藏夹名'
            }).then(msg => {
                if (msg.value.includes(":")) {
                    ElMessageBox.alert("由于系统设计，不能输入 ':' 字符","错误",{
                        confirmButtonText:"确定",
                        type:"error"
                    });
                    return;
                }
                if (msg.value == "" || msg.value == null) {
                    ElMessageBox.alert("文件名不能为空!");
                    return;
                }
                this.addCollection(msg.value);
            }).catch(() => { });
        },
    },
   async created() {
      
    },
  
   async mounted() {
        window.addEventListener("scroll", () => {
            if (document.documentElement.scrollTop > 380) {
                this.reply_show = true;
            } else this.reply_show = false;
        });

        await  this.getVideoInfo();
        this.file.type = "file";

         const player = new Dplayer({
            container: this.$refs.player,
          
           danmaku:{
             id: '9E2E3368B56CDBB4',
                api: 'http://localhost:5176/Danmaku/Ase'
           },
            video: {
                 quality: this.video_resouce,
                 defaultQuality:0,
                 customType:{
                    customHls: function (video, player) {
                    const hls = new Hls();
                    hls.loadSource(video.src);
                    hls.attachMedia(video);
            },
                 }
            },
    //        
            theme: "#9AC8E2",
        
    //       apiBackend: {
    //     read:async  (options) =>{
           
    //        const data = await getDanmaku()
          
    //         options.success(data.data.data);
    //     },
    //     send: function (options) {
    //         console.log('Pretend to send danmaku via WebSocket', options.data);
    //         options.success(options.data);
    //     },
    // },
        });
    player.on('danmaku_loaded', function () {
    console.log('player ended');
});
        this.player = player;
        this.player.on("ended", () => {
            if (this.now !== this.videoList.length - 1) {
                const next = this.now + 1;
                this.changeVideo(this.videoList[next], next);
            }
        })
      setTimeout( x => {
        const danmaku = {
            text: 'Get a danmaku via WebSocket',
            color: '#fff',
            type: 'right',
        }
        player.danmaku.draw(danmaku)
      }, 8000)    
    

        // this.file.addEventListener("change", () => {
        //     let can = this.beforeVideoUpload(this.file.files[0]);
        //     if (can) {
        //         this.video_file = this.file.files[0];
        //         this.uploadVideo(this.video.id);
        //     }
        // });
    }
}

</script>
<style lang="css" scoped>
.dialog-collection-ul {
    max-height: 300px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}



</style>

