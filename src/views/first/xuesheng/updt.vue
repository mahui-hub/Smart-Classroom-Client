<template>
  <div class="xuesheng-add" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix updt">
        <el-page-header @back="$router.go(-1)" content="编辑学生">
        </el-page-header>
      </div>
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
          <el-form-item label="学号" prop="xuehao" required :rules="[
              { required: true, message: '请填写学号' },
              {
                validator: rule.checkRemote,
                message: '内容重复了',
                checktype: 'update',
                module: 'xuesheng',
                col: 'xuehao',
                id: '{{   form.id   }}',
                trigger: 'blur',
              },
            ]">
            <el-input placeholder="输入学号" style="width:250px;" v-model="form.xuehao" />
          </el-form-item>

          <el-form-item label="姓名" prop="xingming" required :rules="[{ required: true, message: '请填写姓名' }]">
            <el-input placeholder="输入姓名" style="width:250px;" v-model="form.xingming" />
          </el-form-item>

          <el-form-item label="性别" prop="xingbie" required :rules="[{ required: true, message: '请填写性别' }]">
            <el-select v-model="form.xingbie">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="班级" prop="banji">
            <el-select v-model="form.banji">
              <el-option v-for="m in banjiList" :value="m.banjimingcheng" :label="m.banjimingcheng"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="专业" prop="zhuanye">
            <el-select v-model="form.zhuanye">
              <el-option v-for="m in zhuanyeList" :value="m.zhuanye" :label="m.zhuanye"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系电话" prop="lianxidianhua" required :rules="[
              { required: true, message: '请填写联系电话' },
              { validator: rule.checkPhone, message: '请输入正确手机号码' },
            ]">
            <el-input placeholder="输入联系电话" style="width:250px;" v-model="form.lianxidianhua" />
          </el-form-item>

          <el-form-item label="QQ号" prop="qqhao">
            <el-input placeholder="输入QQ号" style="width:250px;" v-model="form.qqhao" />
          </el-form-item>

          <el-form-item label="头像" prop="touxiang">
            <e-upload-image v-model="form.touxiang"></e-upload-image>
          </el-form-item>

          <el-form-item label="详情" prop="xiangqing">
            <e-editor v-model="form.xiangqing"></e-editor>
          </el-form-item>

          <el-form-item v-if="btnText">
            <el-button type="primary" @click="submit">{{ btnText }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<style type="text/scss" scoped lang="scss">
  .xuesheng-add {
}
</style>
<script>
  import api from "@/api";
  import rule from "@/utils/rule";
  import {
    extend
  } from "@/utils/extend";

  export default {
    name: "xuesheng-add",
    data() {
      return {
        rule,
        loading: false,
        form: {
          xuehao: "",
          xingming: "",
          xingbie: "",
          banji: "",
          zhuanye: "",
          lianxidianhua: "",
          qqhao: "",
          touxiang: "",
          xiangqing: "",
        },

        banjiList: [],
        zhuanyeList: [],
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

            this.$post(api.xuesheng.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加成功");
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
        this.$post(api.xuesheng.edit, {
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