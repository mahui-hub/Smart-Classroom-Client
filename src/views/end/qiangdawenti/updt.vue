<template>
  <div class="qiangdawenti-add" v-loading="loading">
    <el-page-header @back="$router.go(-1)" content="编辑抢答问题">
    </el-page-header>
    <div class="form-database-form">
      <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
        <el-form-item v-if="isRead" label="抢答编号" prop="bianhao">
          <el-input v-model="form.bianhao" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="isRead" label="问题标题" prop="biaoti">
          <el-input v-model="form.biaoti" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="isRead&& form.tupian!=''" label="图片" prop="tupian">
          <e-img :src="form.tupian" style="max-width: 120px" />
        </el-form-item>
        <el-form-item v-if="isRead" label="发布人" prop="faburen">
          <el-input v-model="form.faburen" disabled></el-input>
        </el-form-item>
        <el-form-item label="抢答人" prop="qiangdaren">
          <el-input v-model="form.qiangdaren" readonly disabled></el-input>
        </el-form-item>
        <el-form-item label="问题内容" prop="beizhu">
          <el-input type="textarea" v-model="form.beizhu"></el-input>
        </el-form-item>
        <el-form-item v-if="btnText">
          <el-button type="primary" @click="submit">{{ btnText }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style type="text/scss" scoped lang="scss">
  .qiangdawenti-add {
  .form-database-form {
    margin-top: 30px;
  }
}
</style>
<script>
  import api from "@/api";
  import rule from "@/utils/rule";
  import {
    extend
  } from "@/utils/extend";

  export default {
    name: "qiangdawenti-add",
    data() {
      return {
        rule,
        loading: false,
        form: {
          bianhao: "",
          biaoti: "",
          tupian: "",
          faburen: this.$store.state.user.session.username,
          beizhu: "",
          qiangdaren: this.$store.state.user.session.username,
          wentiqiangdaid: 0,
        },
      };
    },
    watch: {
      id: {
        handler() {
          this.loadInfo();
        },
      },
    },
    props: {
      isRead: {
        type: Boolean,
        default: true,
      },
      btnText: {
        type: String,
        default: "提交",
      },
      id: {
        type: [String, Number],
        required: true,
      },
    },

    computed: {},
    methods: {
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.qiangdawenti.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加成功");
                  this.$emit("success", res.data);
                  this.$refs.formModel.resetFields();
                  this.$router.go(-1);
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      loadInfo() {
        // 更新数据,获取数据
        this.loading = true;
        var form = this.form;
        this.$post(api.qiangdawenti.edit, {
            id: this.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              this.form = res.data.mmm;
            } else {
              this.$message.error(res.msg);
              this.$router.go(-1);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
            this.$router.go(-1);
          });
      },
    },
    created() {
      this.loadInfo();
    },
    mounted() {},
    destroyed() {},
  };
</script>