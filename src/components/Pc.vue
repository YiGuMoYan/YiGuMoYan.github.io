<template>
  <div>
    <div class="pc">
      <span class="aside">
        <div class="asideHead">
          <img src="../assets/Head.jpg" class="asideHeadImage" />
        </div>
        <div class="asideMain">
          <ul>
            <li
              id="1"
              @click="onClickLabel = 1"
              :class="{ waitClick: onClickLabel != 1 }"
            >
              导航
            </li>
            <li id="2" @click="blog" :class="{ waitClick: onClickLabel != 2 }">
              博客
            </li>
            <li
              id="3"
              @click="onClickLabel = 3"
              :class="{ waitClick: onClickLabel != 3 }"
            >
              关于
            </li>
          </ul>
        </div>
      </span>
      <span class="main">
        <div v-if="onClickLabel == 1" class="mainContent guild">
          <h1 style="font-size: 70px">重新出发</h1>
          <br /><br />
          <h1>Hi~这里是忆古陌烟</h1>
          <h1>很高兴与您在这里相遇</h1>
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
        <div v-else-if="onClickLabel == 3" class="mainContent">
          <div class="about">
            <v-md-preview :text="text"></v-md-preview>
          </div>
        </div>
      </span>
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
          document.getElementById(i).style.fontSize = "37px";
        } else {
          document.getElementById(i).style.fontSize = "30px";
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.pc {
  margin: 13vh auto;
  width: 70vw;
  height: 70vh;
  background: white;
  border-radius: 30px;
  margin-bottom: 0;
}
.pc span {
  display: inline-block;
  float: left;
}
.aside {
  width: 18vw;
  height: 70vh;
  background-color: rgb(124, 207, 255);
  border-radius: 30px 0 0 30px;
}
.asideHead {
  width: 18vw;
  height: 20vh;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.asideHeadImage {
  border-radius: 50%;
  width: 16vh;
  margin: auto;
}
.asideMain {
  li {
    list-style-type: none;
    width: 18vw;
    height: 13vh;
    line-height: 13vh;
    text-align: center;
    font-size: 30px;
    color: white;
    transition: all 1s;
    cursor: pointer;
  }
}
.waitClick:hover {
  font-size: 34px !important;
}
.main {
  width: 52vw;
  height: 70vh;
  border-radius: 0 30px 30px 0;
}
.mainContent {
  margin: 10%;
}
.guild {
  margin-top: 20%;
  text-align: center;
}
.about {
  width: 41.6vw;
  height: 56vh;
  overflow-y: scroll;
}
.foot {
  text-align: center;
  margin-top: 5vh;
  a {
    text-decoration: none;
    color: black;
  }
}
</style>