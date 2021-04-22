<template>
  <div class="dianzan-add" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title"> 添加点赞</span>
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

          <el-form-item v-if="isRead" label="发布人" prop="faburen">
            {{ form.faburen }}
          </el-form-item>

          <el-form-item label="备注" prop="beizhu">
            <el-input type="textarea" v-model="form.beizhu"></el-input>
          </el-form-item>

          <el-form-item label="点赞人" prop="dianzanren">
            <el-input
              v-model="form.dianzanren"
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
.dianzan-add {
}
</style>
<script>
import api from "@/api";
import rule from "@/utils/rule";
import { extend } from "@/utils/extend";

export default {
  name: "dianzan-add",
  data() {
    return {
      readMap: {},
      rule,
      loading: false,
      form: {
        tiezibianhao: "",
        biaoti: "",
        fenlei: "",
        faburen: this.$store.state.user.session.username,
        beizhu: "",
        dianzanren: this.$store.state.user.session.username,
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

          this.$post(api.dianzan.insert, form)
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
      this.$post(api.dianzan.create, {
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
