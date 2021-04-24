<template>
  <div class="tiezihuifu-add" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix updt">
        <el-page-header @back="$router.go(-1)" content="编辑帖子回复1212">
        </el-page-header>
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
            {{ form.tiezibianhao }}
          </el-form-item>

          <el-form-item v-if="isRead" label="标题" prop="biaoti">
            {{ form.biaoti }}
          </el-form-item>

          <el-form-item v-if="isRead" label="分类" prop="fenlei">
            <e-select-view
              module="tiezifenlei"
              :value="form.fenlei"
              select="id"
              show="fenleimingcheng"
            ></e-select-view>
          </el-form-item>

          <el-form-item label="回复内容" prop="huifuneirong">
            <e-editor v-model="form.huifuneirong"></e-editor>
          </el-form-item>

          <el-form-item label="回复人" prop="huifuren">
            <el-input
              disabled
              v-model="form.huifuren"
              readonly
              style="width: 250px;"
            ></el-input>
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

          this.$post(api.tiezihuifu.update, form)
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
      this.$post(api.tiezihuifu.edit, {
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
