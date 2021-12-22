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
          <v-col cols="12" md="1">
            <v-btn color="cyan" @click="movetomain"
                   :style="{height:'50px', width:'90px', fontWeight:'bold', fontSize:'large'}">홈으로</v-btn>
          </v-col>
          <v-col cols="12" md="10">
            <v-card>
              <div style="width: 300px; margin-left: 100px; padding-top: 20px;">글쓴이 : {{writer}}</div>
              <div style="width: 300px; margin-left: 100px; padding-top: 10px;">제목 : {{title}}</div>
              <div style="width: 300px; margin-left: 100px; padding-top: 10px;">작성일 : {{createdAt}}</div>
              <div style="width: 300px; margin-left: 100px; padding-top: 10px;">최근수정일 : {{updatedAt}}</div>
              <div style="width: 300px; margin-left: 100px; padding-top: 10px;">내용</div>
              <v-textarea v-model="text" outlined rows="13" style="width: 730px; margin-left: 100px; padding-top: 10px;"
                          :disabled="editable===false"></v-textarea>
              <v-btn width="100px" style="margin-left: 470px; margin-bottom:20px;" @click="moveback">뒤로가기</v-btn>
              <v-btn width="100px" style="margin-left: 30px; margin-bottom:20px;" @click="editcontent"
                      v-if="editable===false">수정</v-btn>
              <v-btn width="100px" style="margin-left: 30px; margin-bottom:20px;" @click="editcontentfinish"
                     v-if="editable===true">수정완료</v-btn>
              <v-btn width="100px" style="margin-left: 30px; margin-bottom:20px;" @click="deletecontent">삭제</v-btn>
              <v-img v-for="(item, i) in imagelist" :key="i" :src="require(`../../../back/uploads/${item}`)"
                     contain height="150px" width="200px" style="border: 2px solid black; margin-left:100px;"/>
            </v-card>
          </v-col>
          <v-col cols="12" md="1"/>
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
      writer: '',
      title: '',
      createdAt: '',
      updatedAt: '',
      text: '',
      editable: false,
      imagelist: [],
      imagecnt: 0,
    }
  },
  mounted() {
    axios({
      url: "http://127.0.0.1:52273/content/content/",
      method: "POST",
      data: {
        id: this.$route.query.id
      },
    }).then(res => {
      this.writer = res.data.writer;
      this.title = res.data.title;
      this.createdAt = res.data.createdAt.split('T')[0] ;
      this.updatedAt = res.data.updatedAt.split('T')[0];
      this.text = res.data.text;
      this.imagecnt = res.data.imagecnt;
      for(var i = 1; i <= res.data.imagecnt; i++){
        this.imagelist.push(this.$route.query.id + '-' + i + '.png');
      }
    }).catch(err => {
      alert(err);
    });
  },
  methods: {
    moveback() {
      window.history.back();
    },
    deletecontent() {
      axios({
        url: "http://127.0.0.1:52273/content/delete/",
        method: "POST",
        data: {
          id: this.$route.query.id
        },
      }).then(res => {
        alert(res.data.message);
        window.location.href = window.location.pathname.slice(0,-8) + '/?page=1';
      }).catch(err => {
        alert(err);
      });
    },
    editcontent() {
      this.editable = true;
    },
    editcontentfinish() {
      axios({
        url: "http://127.0.0.1:52273/content/edit/",
        method: "POST",
        data: {
          id: this.$route.query.id,
          text: this.text,
        },
      }).then(res => {
        alert(res.data.message);
        this.editable = false;
      }).catch(err => {
        alert(err);
      });
    },
    movetomain() {
      window.location.href='/';
    },
  },
};
</script>