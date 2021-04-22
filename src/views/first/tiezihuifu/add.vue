<template>
  <div class="tiezihuifu-add" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title"> 评论帖子</span>
      </div>
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="130px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item v-if="isRead" label="帖子编号" prop="tiezibianhao">
            <el-input v-model="form.tiezibianhao" disabled> </el-input>
          </el-form-item>

          <el-form-item v-if="isRead" label="帖子标题" prop="biaoti">
            <el-input v-model="form.biaoti" disabled> </el-input>
          </el-form-item>

          <el-form-item v-if="isRead" label="帖子类型" prop="fenlei">
            <el-input v-model="form.fenlei" disabled> </el-input>
            <!-- <e-select-view
              module="tiezifenlei"
              :value="form.fenlei"
              select="id"
              show="fenleimingcheng"
            ></e-select-view> -->
          </el-form-item>
          <el-form-item label="评论人" prop="huifuren">
            <el-input v-model="form.huifuren" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="评论内容" prop="huifuneirong">
            <e-editor v-model="form.huifuneirong"></e-editor>
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
.tiezihuifu-add {
}
</style>
<script>
import api from "@/api";
import rule from "@/utils/rule";
import { extend } from "@/utils/extend";

export default {
  name: "tiezihuifu-add",
  data() {
    return {
      readMap: {},
      rule,
      loading: false,
      form: {
        tiezibianhao: "",
        biaoti: "",
        fenlei: "",
        huifuneirong: "",
        huifuren: this.$store.state.user.session.username,
        tieziid: 0,
      },
    };
  },
  watch: {},
  props: {
    isRead: {
      type: Boolean,
      default: true,
    },
    btnText: {
      type: String,
      default: "提交",
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

          this.$post(api.tiezihuifu.insert, form)
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
      var form = this.form;
      // 获取模块得数据
      this.loading = true;
      this.$post(api.tiezihuifu.create, {
        id: this.$route.query.id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
            var readMap = res.data.readMap;
            for (var i in form) {
              if (readMap[i] && i != "id") {
                form[i] = res.data.readMap[i];
              }
            }
            form.tieziid = readMap.id;
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
