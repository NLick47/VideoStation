<template>
  <div style="user-select:none">
    <div id="head">
      <div id="head-text" @click="reDirectToLingyi">泠倚</div>
    </div>
    <div id="main">
      <div id="bg" ref="main_bg"></div>
      <div id="main-login" ref="main_login">
        <div id="main-login-switch">
          <ul>
            <li :class="{ border_bottom: isLogin }"
              @click="isLogin != true ? isLogin = !isLogin : isLogin; register_input.register_name = ''; register_input.register_pw = ''; inputAddListenerLogin();">
              登录</li>
            <li :class="{ border_bottom: !isLogin }"
              @click="isLogin != false ? isLogin = !isLogin : isLogin; login_input.login_uid = ''; login_input.login_pw = ''; inputAddEventListenerRegister();">
              注册</li>
          </ul>
        </div>
        <div v-if="isLogin" class="main_input_div">
          <input ref="input_account" class="main_input" type="text" autocomplete="off" name="id"
            v-model="login_input.login_uid">
          <div ref="id_holder" class="id_holder">账号ID</div>
          <input ref="input_password" class="main_input" type="password" autocomplete="off" name="pw"
            v-model="login_input.login_pw">
          <div ref="password_holder" class="password_holder">密码</div>


         <div>
           <input class="code_input main_input " type="text"  autocomplete="off" name="code" v-model="code"/>
          <img :src="'data:image;base64,'+imgbase64" class="code_img" width="120" height="33" @click="getCode"/>
          <div class="code" >
            验证码
          </div>  
         </div>

          
          <div class="main_btn" :class="{ disabled: !isAllow_login }" ref="btn_login">{{ btn_login }}</div>

         
        </div>




        <div v-else class="main_input_div">
          <input ref="register_account" class="main_input" type="text" autocomplete="off" name="name"
            v-model="register_input.register_name">
          <div ref="id_holder" class="id_holder">用户名</div>
          <input ref="register_password" class="main_input" type="password" autocomplete="off" name="pw"
            v-model="register_input.register_pw">
          <div ref="password_holder" class="password_holder">密码</div>

             <div>
           <input class="code_input main_input " type="text"  autocomplete="off" name="code" v-model="code"/>
          <img :src="'data:image;base64,'+imgbase64" class="code_img" width="120" height="33" @click="getCode"/>
          <div class="code" >
            验证码
          </div>  
         </div>
          <div class="main_btn" :class="{ disabled: !isAllow_register }"
            style="background-image: linear-gradient(-60deg,rgb(175, 154, 255),rgb(232, 183, 255));" ref="btn_register">
            {{ btn_register }}</div>
        </div>
        <div style="height: 100px;display: flex;align-items: center;justify-content: center;">
          <input type="checkbox" v-model="isSelected">&nbsp;&nbsp;<span>选中即代表同意<span
              style="cursor:pointer;color:rgb(232, 183, 255);" @click="open">用户协议</span></span>
        </div>
      </div>
    </div>
    <div id="footer">
      <span style="color:rgb(232, 183, 255);cursor: pointer;" @click="reDirectToLingyi">泠倚</span> &nbsp; · &nbsp; 版权所有
    </div>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus'
import userapi from '@/api/user'
export default {
  name: 'App',
  components: {

  },
   created() {
    this.getCode()
  },
  data() {
    return {
      imgbase64:"",
      click:true,
      code: "",
      isLogin: true,
      isSelected: true,
      isAllow_login: false,
      isAllow_register: false,
      login_input: {
        login_uid: '',
        login_pw: ''
      },
      register_input: {
        register_name: '',
        register_pw: ''
      },
      btn_login: '登录',
      btn_register: '注册'
    }
  },
   
  watch: {
     
    login_input: {
      handler() {
        if (this.login_input.login_uid != '') this.$refs.id_holder.style.top = '25%';
        else this.$refs.id_holder.style.top = '30%';
        if (this.login_input.login_pw != '') this.$refs.password_holder.style.top = '41%';
        else this.$refs.password_holder.style.top = '47.5%';
        if (this.isSelected && this.login_input.login_uid != '' && this.login_input.login_pw != '') {
          this.isAllow_login = true;
        } else this.isAllow_login = false;
      },
      deep: true
    },
    register_input: {
      handler() {
        if (this.register_input.register_name != '') this.$refs.id_holder.style.top = '25%';
        else this.$refs.id_holder.style.top = '30%';
        if (this.register_input.register_pw != '') this.$refs.password_holder.style.top = '41%';
        else this.$refs.password_holder.style.top = '47.5%';
        if (this.isSelected && this.register_input.register_name != '' && this.register_input.register_pw != '') {
          this.isAllow_register = true;
        } else this.isAllow_register = false;
      },
      deep: true
    },
    isSelected(newValue) {
      if (newValue && this.login_input.login_uid != '' && this.login_input.login_pw != '') {
        this.isAllow_login = true;
      } else this.isAllow_login = false;
      if (newValue && this.register_input.register_name != '' && this.register_input.register_pw != '') {
        this.isAllow_register = true;
      } else this.isAllow_register = false;
    },
    isLogin(newValue) {
      if (!newValue) {
        this.$nextTick(() => {
          this.$refs.btn_register.addEventListener("click", () => {
            if (this.isAllow_register) this.register();
          });
        })
      }
    }
  },
  methods: {
   getCode() {
  if (this.click) {
    this.click = false;
    userapi.getCode().then(response => {
      this.imgbase64 = response.data.value.baseimg;
    }).catch(error => {
      console.error(error);
    });
  }
  setTimeout(() => {
    this.click = true;
  }, 1000);
},

login() {
  this.isAllow_login = false;
  this.btn_login = '登录中';
  userapi.login({
    Account: this.login_input.login_uid,
    Password: this.login_input.login_pw,
    Code: this.code
  }).then(response => {
    response.data.value.result ? ElMessageBox.alert('登录成功', '提示', {
        confirmButtonText: '确定',
      
      }) : ElMessageBox.alert(response.data.value.error, '提示', {
        confirmButtonText: '确定'
      });
    if(response.data.value.result)
    {
      window.localStorage.setItem('token', response.data.value.token);
      this.$router.push('/');
    }else
    {
      this.isAllow_login = true;
      this.btn_register = "登录";
      this.getCode();
    }
      
  }).catch(error => {
    this.isAllow_login = true;
      this.btn_register = "登录";
     this.getCode();
  })
},

 
register() {
  this.isAllow_register = false;
  this.btn_register = "注册中";
  userapi.register({
    Account: this.register_input.register_name,
    Password: this.register_input.register_pw,
    Code: this.code
  }).then(response => {
    response.data.value.result ? ElMessageBox.alert('注册成功，请登录', '提示', {
      confirmButtonText: '确定',
    }) : ElMessageBox.alert(response.data.value.error, '提示', {
      confirmButtonText: '确定'
    });
    if(!response.data.value.result)
    {
      this.isAllow_register = true;
      this.btn_register = "注册";
      this.getCode();
    }
    
  }).catch(error => {
    this.isAllow_register = true;
      this.btn_register = "注册";
      this.getCode();
  });
},
    inputAddListenerLogin() {
      /* 登录 */
      this.$nextTick(() => {
        this.$refs.btn_login.addEventListener("click", () => {
          if (this.isAllow_login) this.login();
        });
        this.$refs.input_password.addEventListener("focus", () => {
          window.addEventListener("keyup", this.pressEnterLogin);
        });
        this.$refs.input_password.addEventListener("blur", () => {
          window.removeEventListener("keyup", this.pressEnterLogin);
        });
      });
    },
    inputAddEventListenerRegister() {
      this.$nextTick(() => {
        /* 注册 */
        this.$refs.btn_register.addEventListener("click", () => {
          if (this.isAllow_register) this.register();
        });
        this.$refs.register_password.addEventListener("focus", () => {
          window.addEventListener("keyup", this.pressEnterRegister);
        });
        this.$refs.register_password.addEventListener("blur", () => {
          window.removeEventListener("keyup", this.pressEnterRegister);
        });
      });
    },
    pressEnterLogin(e) {
      if (e.key == "Enter")
        if (this.isAllow_login) this.login();
    },
    pressEnterRegister(e) {
      if (e.key == "Enter")
        if (this.isAllow_register) this.register();
    },
    open() {
      window.open('https://space.bilibili.com/672346917');
    },
     handleMouseEnter() {
  if (this.$refs.main_login) {
    this.$refs.main_login.classList.remove("main-login-hover");
      this.$refs.main_bg.classList.remove("bg-mask");
  }
  // 其他代码
},
handleMouseLeave() {
  if (this.$refs.main_login) {
    this.$refs.main_login.classList.add("main-login-hover");
      this.$refs.main_bg.classList.add("bg-mask");
  }
  // 其他代码
}
  },
  
  mounted() {

   this.$nextTick(() => {
      this.inputAddListenerLogin();
    if (this.$refs.main_login) {
     
      this.$refs.main_login.addEventListener("mouseenter", this.handleMouseEnter);
      this.$refs.main_login.addEventListener("mouseleave", this.handleMouseLeave);
    }
  });
  },
  destroyed() {
    if (this.$refs.main_login) {
    this.$refs.main_login.removeEventListener("mouseenter", this.handleMouseEnter);
    this.$refs.main_login.removeEventListener("mouseleave", this.handleMouseLeave);
  }
  
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}


body {
  height: 100vh;
  -webkit-tap-highlight-color: transparent;
}

ul {
  margin: 0;
}

li {
  list-style: none;
  margin: 0 15px 0 0;
}
.code_img{
  position: absolute;
  top: 65%;
  right: 15%;
  transition: top .3s ease, color .3s ease;
  color: #000;
}
input {
  outline: none;
  padding-left: 10px;
}

#footer {
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.disabled {
  cursor: not-allowed !important;
}

.main_input_div {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.main_input {
  display: block;
  height: 50px;
  width: 300px;
  font-size: 20px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid rgb(94, 94, 94);
  transition: border .3s ease;
  margin-top: 10%;
}

.code_input{
  width: 20vh !important;
  margin-right:140px;
}

.main_input:focus+.id_holder {
  top: 25% !important;
  color: rgb(105, 105, 105);
}

.main_input:focus+.password_holder {
  top: 41% !important;
  color: rgb(105, 105, 105);
}

.main_input:nth-child(2) {
  margin-top: 15%;
}

.main_input:focus {
  border-bottom: 2px solid rgba(232, 183, 255, 0.8);
}

.id_holder {
  position: absolute;
  top: 30%;
  right: 20%;
  transition: top .3s ease, color .3s ease;
  color: #000;
}
.code
{
  position: absolute;
  top: 60%;
  right: 20%;
  transition: top .3s ease, color .3s ease;
  color: #000;
}
.password_holder {
  position: absolute;
  top: 47.5%;
  right: 20%;
  transition: top .3s ease, color .3s ease;
  color: #000;
}

.main_btn {
  height: 50px;
  width: 300px;
  margin-top: 15%;
  color: #000;
  background-image: linear-gradient(-60deg, rgb(232, 183, 255), rgb(175, 154, 255));
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-left: 4px;
  font-size: larger;
  cursor: pointer;
}

#main-login-switch {
  padding-left: 20%;
  height: 20%;
}

#main-login-switch ul {
  display: flex;
  transform: translate(0, 70%);
}

#main-login-switch li {
  display: inline-block;
  font-size: 20px;
  padding: 5px;
  border-bottom: 2px solid rgb(255, 255, 255);
  transition: border .3s ease;
  cursor: pointer;
}

.border_bottom {
  border-bottom: 2px solid rgb(0, 0, 0) !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#head {
  position: relative;
  height: 10vh;
  user-select: none;
}

#head-text {
  position: absolute;
  right: 10vw;
  top: 25%;
  color: rgb(232, 183, 255);
  font-size: 40px;
  font-family: 'Songti';
  text-shadow: 1px 1px 1px rgb(232, 183, 255, 0.8);
  cursor: pointer;
}

#main {
  position: relative;
  width: 100%;
  height: 700px;
}

#main-login {
  position: absolute;
  top: 10%;
  left: 10vw;
  height: 80%;
  width: 450px;
  background-color: transparent;
  border: 1px solid #fff;
  border-radius: 5px;
  transition: border .3s ease, box-shadow .3s ease, background-color .3s ease;
  backdrop-filter: blur(7px);
}

#main-login input {
  background-color: transparent;
}

.main-login-hover {
  border: 1px solid rgb(232, 183, 255) !important;
  box-shadow: 1px 0px 10px 3px rgba(232, 183, 255, 0.6) !important;
  background-color: #fff !important;
}

#bg {
  height: 100%;
  width: 100%;
  position: absolute;
  background: url('https://kotokawa-akira-mywife.site/web/image?filePath=%2Fimg%2Fmanagement%2F%5B7205%5D64486749.png') left top no-repeat;
  transition: filter .3s ease;
}

.bg-mask {
  filter: blur(7px);
}

@media screen and (max-width:500px) {
  #main-login {
    position: unset;
    margin: 0 auto;
    width: 95%;
    transform: translate(0, 10%);
  }

  #main-login-switch {
    padding-left: 10%;
  }

  #main_input_div {
    padding-left: 10%;
  }

  #main {
    height: 600px;
  }
}
</style>
