<template>
  <div>
    <el-upload
      ref="upload"
      :action="actionUrl"
      :data="dataObj"
      :http-request="doUpload"
      :list-type="listType"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
      :show-file-list="showFile"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { policy,minIoImgUpdate } from "./policy";
import { getUUID } from '@/utils'
export default {
  name: "multiUpload",
  props: {
    //图片属性数组
    value: Array,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 30
    },
    listType:{
      type: String,
      default: "picture-card"
    },
    showFile:{
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      headerObj: {
        'Request Method': 'put',
      },
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
        uuid: ""
      },
      dialogVisible: false,
      // actionUrl: '',
      dialogImageUrl: null,
      resourcesUrl: 'http://devhost2:9000/gulimall-learning'
    };
  },
  computed: {
    actionUrl() {
      return this.resourcesUrl;
    },
    fileList() {
      let fileList = [];
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({ url: this.value[i] });
      }

      return fileList;
    },
    getImgSrc () {
      if (!this.value) {
        return ''
      }
      if (this.value.indexOf('http://') === 0 || this.value.indexOf('https://') === 0) {
        return this.value
      }
      return this.resourcesUrl + this.value
    }
  },
  mounted() {},
  methods: {
    doUpload(data) {
      console.log(data)
      let file = data.file;
      minIoImgUpdate(data.action,file).then(data => {
        console.log(data)
        let url = data.config.url;
        let index = url.indexOf('?');
        let s = url.substring(0, index);
        console.log(s)
        this.fileList.push({
          name: file.name,
          // url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name； 替换${filename}为真正的文件名
          url: s
        });
        this.emitInput(this.fileList);

      })
      return true
    },
    handleBeforeUpload(file) {
      this.$refs.upload.xhr.open('PUT', this.actionUrl, true);
      this.$refs.upload.xhr.send(file);
      return false;
    },
    emitInput(fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url);
      }
      this.$emit("input", value);
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    beforeUpload(file) {
      let _self = this;
      return new Promise((resolve, reject) => {
        policy({fileNum: 1})
          .then(response => {
            console.log("这是什么${filename}");
            let data = response.data;
            _self.dataObj.policy = data.policy;
            _self.dataObj.signature = data.signature;
            _self.dataObj.ossaccessKeyId = data.accessid;
            _self.dataObj.key = data.dir +getUUID();
            _self.dataObj.dir = data.dir;
            _self.dataObj.host = data.host;
            _self.resourcesUrl = data.ossList[0].actionUrl;
            resolve(true);
          })
          .catch(err => {
            console.log("出错了...",err)
            reject(false);
          });
      });

    },
    handleUploadSuccess(res, file) {
      // console.log(res)
      // this.fileList.push({
      //   name: file.name,
      //   // url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name； 替换${filename}为真正的文件名
      //   url: this.dataObj.host + "/" + this.dataObj.key.replace("${filename}",file.name)
      // });
      // console.log(this.fileList)
      // this.emitInput(this.fileList);
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "最多只能上传" + this.maxCount + "张图片",
        type: "warning",
        duration: 1000
      });
    }
  }
};
</script>
<style>
</style>


