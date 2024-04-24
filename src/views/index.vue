<template>
  <Navigate ></Navigate>
  <div class="main-recommend-title">推荐</div>
  <Main></Main>

</template>

<script>
import Main from '@/components/Main.vue';
import Navigate from '@/components/Navigate.vue';

export default {
  name: 'App',
  components: {
    Main,
    Navigate,
    
  },
  data() {
    return {
      user:{name:"Kirara",uid:10063301},
      token: "",
      isLogin: false,
    }
  }

}
</script>

<style>
:root {
  --ava: #9AC8E2;
  --line_regular: #E3E5E7;
  --bg_regular: #F1F2F3;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
}

img {
  display: block;
}
a{
  color:unset;
  text-decoration: none;
}
.main-recommend-title {
    text-align: left;
    font-size: 40px;
    padding: 20px 15px 0px 15px;
    width: 80%;
    margin: 0 auto;
}
</style>
