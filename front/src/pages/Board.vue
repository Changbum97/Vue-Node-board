<template>
  <v-app>
    <v-app-bar app color="red" dark>
      <v-spacer></v-spacer>
      <v-app-bar-title>
        <div align="center" :style="{fontSize:'xx-large'} ">게시판 {{$route.params.id}}</div>
      </v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="4"></v-col>
          <v-col cols="12" md="2">
            <v-btn color="cyan" @click="movetomain"
                   :style="{height:'50px', width:'170px', fontWeight:'bold', fontSize:'large'}">홈으로</v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="pink accent-1" @click="movetowrite"
                   :style="{height:'50px', width:'170px', fontWeight:'bold', fontSize:'large'}">글작성</v-btn>
          </v-col>
          <v-col cols="12" md="2"></v-col>
          <v-col cols="12" md="2">
            <div :style="{fontSize:'x-large', marginTop: '7px'}">글갯수 : {{cnt}}개</div>
          </v-col>
        </v-row>
        <v-row>
          <v-simple-table style="width: 100%;">
            <thead>
              <tr style="font-weight: bolder;">
                <td style="width:20%; font-size: x-large;">작성자</td>
                <td style="width:50%; font-size: x-large;">제목</td>
                <td style="width:30%; font-size: x-large;">작성일</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in contentlist" :key="item.id" @click="movetocontent(item.id)">
                <td>{{item.writer}}</td>
                <td>{{item.title}}</td>
                <td>{{item.createdAt.split('T')[0]}}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-row>
        <v-row style="padding-top: 20px;">
          <v-spacer/>
          <v-btn width="10px" @click="movetopreviouspage">
            <v-icon color="red" large> mdi-arrow-left-bold-outline </v-icon>
          </v-btn>
          <div style="margin-top: 5px; margin-right: 10px; margin-left: 10px;">
            {{$route.query.page}}/{{totalpage}} page</div>
          <v-btn width="10px" @click="movetonextpage">
            <v-icon color="red" large> mdi-arrow-right-bold-outline </v-icon>
          </v-btn>
          <v-spacer/>
        </v-row>
      </v-container>

    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return {
      contentlist: [],
      cnt: 0,
    }
  },
  computed: {
    totalpage(){
      if(this.cnt == 0) {
        return 1;
      }else {
        return Math.ceil(this.cnt/10);
      }
    }
  },
  mounted() {
    axios({
      url: "http://127.0.0.1:52273/content/boardlist/",
      method: "POST",
      data: {
        boardnum: this.$route.params.id,
        page: this.$route.query.page,
      },
    }).then(res => {
      this.contentlist = res.data;
    }).catch(err => {
      alert(err);
    });
    axios({
      url: "http://127.0.0.1:52273/content/boardlistcnt/",
      method: "POST",
      data: {
        boardnum: this.$route.params.id,
      },
    }).then(res => {
      this.cnt = res.data;
    }).catch(err => {
      alert(err);
    });
  },
  methods: {
    movetomain() {
      window.location.href="/"
    },
    movetowrite() {
      window.location.href = window.location.pathname + 'write'
    },
    movetocontent(id) {
      window.location.href = window.location.pathname+ 'content?id=' + id
    },
    movetopreviouspage(){
      if(this.$route.query.page == 1) {
        alert('첫번째 페이지입니다!');
      } else {
        var pp = parseInt(this.$route.query.page) - 1;
        window.location.href = window.location.pathname + '?page=' + pp
      }
    },
    movetonextpage(){
      if(this.$route.query.page == Math.ceil(this.cnt/10)) {
        alert('마지막 페이지입니다!');
      } else{
        var pp = parseInt(this.$route.query.page) + 1;
        window.location.href = window.location.pathname + '?page=' + pp
      }
    },
  },
};
</script>

<style scoped>
.tr,td {
  border: 1px solid;
  text-align: center;
}
</style>