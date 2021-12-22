<template>
  <v-app>
    <v-app-bar app color="red" dark>
      <v-spacer></v-spacer>
      <v-app-bar-title>
        <div align="center" :style="{fontSize:'xx-large'} ">게시판 {{$route.params.id}} 글쓰기</div>
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
              <v-form ref="form" @submit.prevent="onSubmitForm">
                <v-text-field v-model="writer" dense outlined label="작성자" style="width: 300px; margin-left: 100px; padding-top: 20px;"
                              :rules="[v => !!v || '작성자는 필수입니다.']"/>
                <v-text-field v-model="title" dense outlined label="제목" style="width: 500px; margin-left: 100px;"
                              :rules="[v => !!v || '제목은 필수입니다.']"/>
                <v-textarea v-model="text" label="내용" outlined rows="13" style="width: 730px; margin-left: 100px;" />

                <v-file-input class="input" type="file" counter show-size label="이미지 제출(여러개 가능)"
                              outlined dense multiple prepend-icon="mdi-camera" style="width: 400px; margin-left: 100px;"
                              @change="onImageChange"/>
                <v-img v-for="(item,i) in uploadimageurl" :key="i" :src="item.url"
                       contain height="150px" width="200px" style="border: 2px solid black; margin-left:100px;"/>

                <v-btn width="100px" style="margin-left: 600px; margin-bottom:30px;" @click="moveback">취소</v-btn>
                <v-btn width="100px" style="margin-left: 30px; margin-bottom:30px;" type="submit">제출</v-btn>
              </v-form>
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
      text: '',
      uploadimageurl: [],
      imagecnt: 0,
    }
  },
  methods: {
    onImageChange(file) {
      if (!file) {
        return;
      }
      const formData = new FormData();
      this.uploadimageurl = [];
      file.forEach((item) => {
        formData.append('filelist', item)
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadimageurl.push({url: e.target.result});
        };
        reader.readAsDataURL(item);
      });
      axios({
        url: "http://127.0.0.1:52273/content/imagesave/",
        method: "POST",
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData,
      }).then(res => {
        console.log(res.data.message);
        this.imagecnt = file.length;
      }).catch(err => {
        alert(err);
      });
    },
    onSubmitForm(){
      if(this.$refs.form.validate()) {
        axios({
          url: "http://127.0.0.1:52273/content/write/",
          method: "POST",
          data: {
            boardnum: this.$route.params.id,
            writer: this.writer,
            title: this.title,
            text: this.text,
            imagecnt: this.imagecnt,
          },
        }).then(res => {
          alert(res.data.message);
          window.history.back();
        }).catch(err => {
          alert(err);
        });
      }
    },
    moveback() {
      window.history.back();
    },
    movetomain() {
      window.location.href='/';
    },
  },
};

</script>