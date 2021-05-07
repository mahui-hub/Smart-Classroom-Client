<template>
  <div class="app1">
    <table width="100%" class="floot">
      <tbody>
        <tr class="vt">
          <td rowspan="2" class="floot_left">
            <slot name="user"> </slot>
          </td>
          <td class="floot_right">
            <a name="post_2920754"></a>
            <!--印戳-->
            <!--楼层信息及编辑-->
            <div class="tipTop s6">
              <a class="s2 b cp">{{ floor }}</a>&nbsp;<span>发表于: {{ addtime ? addtime.substr(0, 10) : "" }}</span>
              <span v-if="username == nickname" style="float: right">
                <el-button type="success" @click="edit()" size="mini">编辑</el-button>
                <el-button type="success" @click="deleteItem()" size="mini">删除</el-button>
              </span>
            </div>
            <div class="read_h1" v-if="title" style="margin-bottom: 10px">
              {{ title }}
            </div>
            <div class="tpc_content">
              <div class="f14 mb10" v-html="content"></div>
            </div>
            <!--content_read-->
          </td>
        </tr>
        <tr>
          <td class="floot_bottom">
            <!--评分-->
            <div id="w_2920754" class="c"></div>
            <!--评分结束-->
            <div class="tipBottom cc">
              <div class="fl">
                <slot name="bottom-left"></slot>
              </div>
              <div class="fr">
                <slot name="bottom-right"></slot>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <el-dialog title="编辑回复内容" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="帖子编号" prop="tiezibianhao">
            <el-input v-model="form.tiezibianhao" disabled> </el-input>
          </el-form-item>

          <el-form-item label="帖子标题" prop="biaoti">
            <el-input v-model="form.biaoti" disabled> </el-input>
          </el-form-item>

          <el-form-item label="帖子分类" prop="fenlei">
            <e-select-view module="tiezifenlei" :value="form.fenlei" select="id" show="fenleimingcheng"></e-select-view>
          </el-form-item>

          <el-form-item label="回复内容" prop="huifuneirong">
            <e-editor v-model="form.huifuneirong"></e-editor>
          </el-form-item>

          <el-form-item label="回复人" prop="huifuren">
            <el-input disabled v-model="form.huifuren" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" lang="scss">
  .floot_bottom {
  background: #ffffff;
}
</style>
<script>
  import api from "@/api";
  import rule from "@/utils/rule";
  import {
    remove
  } from "@/utils/utils";
  import {
    extend
  } from "@/utils/extend";
  export default {
    name: "e-forum-item",
    data() {
      return {
        rule,
        dialogVisible: false,
        username: "",
        form: {
          tiezibianhao: "",
          biaoti: "",
          fenlei: "",
          huifuneirong: "",
          huifuren: this.$store.state.user.session.username,
          tieziid: 0,
        },
        search: {
          tiezibianhao: "",
          biaoti: "",
          fenlei: "",
          huifuneirong: "",
          huifuren: "",
        },
      };
    },
    props: {
      nickname: {
        type: String,
      },
      row: {
        type: Object,
      },
      id: {
        type: String,
      },
      title: {
        type: String,
      },
      content: {
        type: String,
        required: true,
      },
      addtime: {
        type: String,
      },
      floor: [Number, String],
    },
    watch: {},
    computed: {},
    methods: {
      loadList() {
        const params = {};
        params.tiezibianhao = "";
        params.biaoti = "";
        params.fenlei = "";
        params.huifuneirong = "";
        params.huifuren = "";
        params.page = 1;
        params.pagesize = 10;

        this.$post(api.tiezihuifu.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              // extend(this, res.data);
              this.list = res.data.list;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      deleteItem() {
        this.loadList();
        this.$confirm("确定删除数据？", "提示", {
            // 弹出 确认框提示是否要删除
            type: "warning",
          })
          .then(() => {
            // 确定操作
            this.loading = true; // 滚动条
            this.$post(api.tiezihuifu.delete, {
                // 提交后台
                id: this.id,
              })
              .then((res) => {
                if (res.code != api.code.OK) {
                  this.$message.error(res.msg);
                } else {
                  remove(this.list, this.row);
                  this.$message.success("删除成功");
                  this.$router.go(0);
                }
              })
              .catch((err) => {
                // 访问网络错误
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch(() => {
            // 取消操作
          });
      },
      edit() {
        this.dialogVisible = true;
        this.loadInfo(this.id);
      },
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
                  this.$message.success("修改成功");
                  this.dialogVisible = false;
                  this.$router.go(0);
                  this.$refs.formModel.resetFields();
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
      loadInfo(id) {
        // 更新数据,获取数据
        this.loading = true;
        var form = this.form;
        this.$post(api.tiezihuifu.edit, {
            id: id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              // extend(this, res.data);
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
      this.username = localStorage.getItem("username");
    },
    mounted() {},
    destroyed() {},
  };
</script>