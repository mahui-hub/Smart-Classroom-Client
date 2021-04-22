<template>
  <div class="wentisousuo-add" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix updt">
        <el-page-header @back="$router.go(-1)" content="编辑答疑内容">
        </el-page-header>
      </div>
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item label="课程名称" prop="kechengmingcheng" required>
            <el-input
              placeholder="输入课程名称"
              v-model="form.kechengmingcheng"
            />
          </el-form-item>

          <el-form-item label="问题标题" prop="wentibiaoti" required>
            <el-input type="textarea" v-model="form.wentibiaoti"></el-input>
          </el-form-item>

          <el-form-item label="问题内容" prop="wentineirong" required>
            <el-input
              type="textarea"
              v-model="form.wentineirong"
              :rows="2"
            ></el-input>
          </el-form-item>

          <el-form-item label="答疑内容" prop="dayineirong" required>
            <el-input
              type="textarea"
              v-model="form.dayineirong"
              :rows="4"
            ></el-input>
          </el-form-item>

          <el-form-item label="发布人" prop="xuehao">
            <el-input v-model="form.xuehao" readonly disabled></el-input>
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
.form-database-form {
  width: 80%;
  margin: auto;
}
</style>
<script>
import api from "@/api";
import rule from "@/utils/rule";
import { extend } from "@/utils/extend";

export default {
  name: "wentisousuo-add",
  data() {
    return {
      rule,
      loading: false,
      form: {
        kechengmingcheng: "",
        wentibiaoti: "",
        wentineirong: "",
        dayineirong: "",
        xuehao: this.$store.state.user.session.username,
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

          this.$post(api.wentisousuo.update, form)
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
      this.$post(api.wentisousuo.edit, {
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
