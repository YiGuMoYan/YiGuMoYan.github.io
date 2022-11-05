<template>
  <div class="mobile">
    <div class="head">
      <div>
        <img src="../assets/Head.jpg" class="headImage" />
      </div>
      <div class="label">
        <span @click="blog" id="2">博客</span>
        <span @click="onClickLabel = 1" id="1">导航</span>
        <span @click="onClickLabel = 3" id="3">关于</span>
      </div>
    </div>
    <div class="main">
      <div v-if="onClickLabel == 1" class="mainContent">
        <h1 style="font-size: 70px">重新出发</h1>
        <br /><br />
        <h3>Hi~这里是忆古陌烟</h3>
        <h3>很高兴与您在这里相遇</h3>
        <div>
          <a href="tencent://message/?uin=3194775246"
            ><img src="../assets/qq.png" alt="" width="50px"
          /></a>
          <a href="https://space.bilibili.com/442384066"
            ><img src="../assets/bilibili.png" alt="" width="50px"
          /></a>
          <a href="https://github.com/YiGuMoYan"
            ><img src="../assets/github.png" alt="" width="50px"
          /></a>
        </div>
      </div>
      <div v-else-if="onClickLabel == 3">
        <div class="about">
          <v-md-preview :text="text"></v-md-preview>
        </div>
      </div>
    </div>
    <div class="foot">
      <h5>
        {{ message1 }}<a href="http://yigumoyan.top">{{ name }}</a
        >{{ message2 }}
      </h5>
      <h5>
        <a href="https://beian.miit.gov.cn">{{ port }}</a>
      </h5>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    this.onClickLabel = "1";
    this.getAboutMarkDown();
  },
  data() {
    return {
      onClickLabel: "",
      text: "",
      message1: " Copyright © 2022 ",
      name: "忆古陌烟",
      message2: " All rights reserved. ",
      port: "陕ICP备2022009553号",
    };
  },
  methods: {
    getAboutMarkDown() {
      const _this = this;
      axios({
        method: "GET",
        url: "http://api.yigumoyan.top/blog/getAbout.php",
      }).then(function (resp) {
        _this.text = resp.data;
      });
    },
    blog() {
      window.location.href = "http://blog.yigumoyan.top";
    },
  },
  watch: {
    onClickLabel(val) {
      this.onClickLabel = val;
      for (let i = 1; i < 4; i++) {
        if (i == val) {
          document.getElementById(i).style.fontSize = "32px";
        } else {
          document.getElementById(i).style.fontSize = "25px";
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
  transition: all 1s;
}
.mobile {
  width: 80vw;
  height: 80vh;
  background-color: white;
  border-radius: 30px;
  margin: auto;
  margin-top: 5vh;
}
.head {
  width: 80vw;
  height: 25vh;
  background-color: rgb(124, 207, 255);
  border-radius: 30px 30px 0 0;
  text-align: center;
  span {
    flex: flex;
    justify-content: space-around;
    color: white;
    font-size: 25px;
    margin: auto 15px;
    display: inline-block;
  }
}
.headImage {
  border-radius: 50%;
  width: 15vh;
  margin: auto;
  margin-top: 2vh;
}
.label {
  margin-top: 1vh;
}
.main {
  width: 80vw;
  height: 55vh;
  border-radius: 0 0 30px 30px;
  margin: 0;
}
.mainContent {
  margin: 5%;
  margin-top: 15%;
  text-align: center;
}
.about {
  padding: 5%;
  width: 72vw;
  height: 50vh;
  overflow-y: scroll;
}
.foot {
  text-align: center;
  a {
    text-decoration: none;
    color: black;
  }
}
</style>