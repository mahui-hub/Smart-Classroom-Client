<template>
  <div class="jiaoshi-add" v-loading="loading">
    <el-page-header @back="$router.go(-1)" content="编辑教师"> </el-page-header>
    <div class="form-database-form">
      <el-form :model="form" ref="formModel" label-width="100px">
        <el-form-item label="教师工号" prop="gonghao" required :rules="[
            { required: true, message: '请填写工号' },
            {
              validator: rule.checkRemote,
              message: '内容重复了',
              checktype: 'update',
              module: 'jiaoshi',
              col: 'gonghao',
              id: form.id,
              trigger: 'blur',
            },
          ]">
          <el-input placeholder="请输入工号" disabled v-model="form.gonghao" />
        </el-form-item>

        <el-form-item label="教师姓名" prop="xingming">
          <el-input placeholder="请输入姓名" v-model="form.xingming" />
        </el-form-item>

        <el-form-item label="性别" prop="xingbie">
          <el-select v-model="form.xingbie" style="width:100%;">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学院" prop="xueyuan" required>
          <el-select v-model="form.xueyuan" style="width:100%;">
            <el-option v-for="v in xueyuanlist" :value="v.xueyuan" :label="v.xueyuan" :key="v.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="教师职称" prop="zhicheng" required>
          <el-select v-model="form.zhicheng" filterable style="width:100%;">
            <el-option :value="v.zhicheng" :label="v.zhicheng" v-for="v in zhichenglist" :key="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="QQ号" prop="qqhao" required>
          <el-input placeholder="请输入QQ号" v-model="form.qqhao" />
        </el-form-item>

        <el-form-item label="联系方式" prop="shouji">
          <el-input placeholder="请输入联系方式" v-model="form.shouji" />
        </el-form-item>

        <el-form-item label="教师简介" prop="xiangqing">
          <el-input v-model="form.xiangqing" type="textarea" :rows="3"></el-input>
        </el-form-item>

        <el-form-item v-if="btnText">
          <el-button type="primary" @click="submit" v-if="role=='管理员'">{{ btnText }}</el-button>
          <el-button type="primary" @click="submit1" v-if="role=='教师'">{{ btnText }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- </el-card> -->
  </div>
</template>
<style type="text/scss" scoped lang="scss">
  .jiaoshi-add {
  .form-database-form {
    padding: 40px 80px;
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
    name: "jiaoshi-add",
    data() {
      return {
        zhichenglist: [],
        xueyuanlist: [],
        role: '',
        rule,
        loading: false,
        form: {
          xueyuan: "",
          zhicheng: "",
          gonghao: "",
          xingming: "",
          xingbie: "",
          qqhao: "",
          shouji: "",
          suojiaobanji: [],
          xiangqing: "",
        },
        banjiList: [],
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
    methods: {
      initZhicheng() {
        const params = {}
        params.page = 1
        params.pagesize = 10
        this.$post(api.zhicheng.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.zhichenglist = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });

      },
      initXueyuan() {
        const params = {}
        params.page = 1
        params.pagesize = 10
        this.$post(api.xueyuan.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.xueyuanlist = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;
            this.$post(api.jiaoshi.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改成功");
                  this.$emit("success", res.data);
                  this.$refs.formModel.resetFields();
                  this.loadInfo();
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
        this.$post(api.jiaoshi.edit, {
            id: this.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              this.form = res.data.mmm;
              this.form.suojiaobanji = this.form.suojiaobanji.split(",");
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
      loadInfo1() {
        // 更新数据,获取数据
        this.loading = true;
        var form = this.form;
        this.$post(api.jiaoshi.edit, {
            id: localStorage.getItem('jiaoshiid'),
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              this.form = res.data.mmm;
              this.form.suojiaobanji = this.form.suojiaobanji.split(",");
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
      submit1() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;
            this.$post(api.jiaoshi.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改成功");

                  this.$refs.formModel.resetFields();
                  this.loadInfo1();
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
    },
    created() {
      this.initXueyuan()
      this.initZhicheng()
      this.role = localStorage.getItem('role')
      if (localStorage.getItem('role') == '教师') {
        this.loadInfo1()
      } else {
        this.loadInfo();
      }

    },
    mounted() {},
    destroyed() {},
  };
</script>