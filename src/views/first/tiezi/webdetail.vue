<template>
  <div class="app">
    <div class="app-title">
      {{ map.biaoti }}
    </div>
    <div class="app-title-bottom">
      <span class="el-icon-user">
        楼主：<span style="color:blue;">{{ user.xingming }}</span>
      </span>
      <span class="el-icon-timer">时间：{{ map.addtime }}</span>
      <span class="el-icon-thumb">点赞量：{{ map.dianzanliang }}</span>
      <span class="el-icon-info">回复数：{{ map.tiezihuifuCount }}</span>
      <span class="el-icon-download" v-if="map.fujian != ''">
        资源：
        <e-file-list v-model="map.fujian"> </e-file-list>
      </span>
    </div>
    <div class="app-content">
      <img :src="map.tupian" alt="" style="width:100px;height:100px;" />
      <div v-html="map.neirong" style="margin-left:40px;"></div>
    </div>
    <div style="margin: 10px 0;text-align:right ">
      <el-button type="success" @click="dianzan(map.id)">点赞 </el-button>
      <el-button type="success" @click="pinglun(map.id)">评论 </el-button>
      <el-button
        v-if="map.faburen == userName"
        type="success"
        @click="edit(map.id)"
        >编辑帖子
      </el-button>
    </div>

    <e-forum>
      <e-forum-page :lists="replyList">
        <template v-slot:default="{ row, floor }">
          <e-forum-item
            :floor="floor"
            :addtime="row.addtime"
            :nickname="row.user.xuehao"
            :content="row.huifuneirong"
          >
            <e-user
              slot="user"
              :nickname="row.user.xuehao"
              :headimg="row.user.touxiang"
            >
              <dl class="cc">
                <dd>{{ row.user.xingming }}</dd>
              </dl>
            </e-user>
          </e-forum-item>
        </template>
      </e-forum-page>
    </e-forum>
    <!-- 编辑帖子 -->
    <el-dialog title="编辑帖子" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item
            label="帖子编号"
            prop="tiezibianhao"
            :rules="[{ required: true, message: '请填写帖子编号' }]"
          >
            <el-input
              placeholder="请输入帖子编号"
              disabled
              v-model="form.tiezibianhao"
            />
          </el-form-item>

          <el-form-item
            label="帖子标题"
            prop="biaoti"
            required
            :rules="[{ required: true, message: '请填写帖子标题' }]"
          >
            <el-input placeholder="请输入帖子标题" v-model="form.biaoti" />
          </el-form-item>

          <el-form-item
            label="帖子类型"
            prop="fenlei"
            required
            :rules="[{ required: true, message: '请选择帖子类型' }]"
          >
            <el-select v-model="form.fenlei" style="width:100%;">
              <el-option
                v-for="m in tiezifenleiList"
                :value="m.id"
                :key="m.id"
                :label="m.fenleimingcheng"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="帖子内容" prop="neirong">
            <e-editor v-model="form.neirong"></e-editor>
          </el-form-item>
          <el-form-item label="附件" prop="fujian">
            <e-upload-file v-model="form.fujian"></e-upload-file>
          </el-form-item>

          <el-form-item label="图片" prop="tupian">
            <e-upload-image v-model="form.tupian"></e-upload-image>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 帖子评论 -->
    <el-dialog title="评论帖子" :visible.sync="dialogVisible2" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form2"
          ref="formModel2"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item label="帖子编号" prop="tiezibianhao">
            <el-input v-model="form2.tiezibianhao" disabled> </el-input>
          </el-form-item>

          <el-form-item label="帖子标题" prop="biaoti">
            <el-input v-model="form2.biaoti" disabled> </el-input>
          </el-form-item>

          <el-form-item label="帖子类型" prop="fenlei">
            <e-select-view
              module="tiezifenlei"
              :value="form2.fenlei"
              select="id"
              show="fenleimingcheng"
            ></e-select-view>
            <!-- <el-input v-model="form2.fenlei" disabled> </el-input> -->
          </el-form-item>
          <el-form-item label="评论人" prop="huifuren">
            <el-input v-model="form2.huifuren" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="评论内容" prop="huifuneirong">
            <e-editor v-model="form2.huifuneirong"></e-editor>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submit2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import rule from "@/utils/rule";
import { extend } from "@/utils/extend";

export default {
  data() {
    return {
      rule,
      dialogVisible2: false,
      readMap: {},
      form2: {
        tiezibianhao: "",
        biaoti: "",
        fenlei: "",
        huifuneirong: "",
        huifuren: this.$store.state.user.session.username,
        tieziid: 0,
      },
      form: {
        tiezibianhao: rule.getID(),
        biaoti: "",
        fenlei: "",
        fujian: "",
        tupian: "",
        neirong: "",
        faburen: this.$store.state.user.session.username,
      },
      tiezifenleiList: [],
      dialogVisible: false,
      loading: false, // 加载
      map: {
        addtime: "",
        tiezibianhao: "",
        biaoti: "",
        fenlei: "",
        tiezihuifuCount: "",
        dianzanliang: "",
        tupian: "",
        neirong: "",
        faburen: "",
      },
      //点赞列表
      form1: {
        tiezibianhao: "",
        biaoti: "",
        fenlei: "",
        faburen: "",
        beizhu: "",
        dianzanren: "",
        tieziid: "",
      },
      userName: "",
      replyList: [],
      user: {},
    };
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  watch: {
    id: {
      handler() {
        this.loadDetail();
      },
      immediate: true,
    },
  },
  computed: {},
  methods: {
    pinglun(id) {
      this.loadInfo2(id);
      this.dialogVisible2 = true;
    },
    submit2() {
      this.$refs.formModel2
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form2;
          this.$post(api.tiezihuifu.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("评论成功");
                this.dialogVisible2 = false;
                this.$router.go(0);
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
    loadInfo2(id) {
      this.$post(api.tiezihuifu.create, {
        id: id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            this.form2.huifuren = this.$store.state.user.session.username;
            this.form2.tiezibianhao = res.data.readMap.tiezibianhao;
            this.form2.biaoti = res.data.readMap.biaoti;
            this.form2.fenlei = res.data.readMap.fenlei;
            this.form2.tieziid = res.data.readMap.id;
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
    dianzan(id) {
      this.loadInfo1(id);
    },
    submit1(data) {
      this.$post(api.dianzan.insert, data)
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            this.$message.success("点赞成功");
            this.$router.go(0);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
    },
    loadInfo1(id) {
      // 获取模块得数据
      this.loading = true;
      this.$post(api.dianzan.create, {
        id: id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            this.form1.tiezibianhao = res.data.readMap.tiezibianhao;
            this.form1.biaoti = res.data.readMap.biaoti;
            this.form1.fenlei = res.data.readMap.fenlei;
            this.form1.beizhu = res.data.readMap.beizhu;
            this.form1.dianzanren = res.data.readMap.dianzanren;
            this.form1.tieziid = res.data.readMap.id;
            this.submit1(this.form1);
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
    submit() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;
          this.$post(api.tiezi.update, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("修改帖子成功");
                this.dialogVisible = false;
                location.reload();
                this.$router.go(0);
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
    loadInfo(id) {
      // 更新数据,获取数据
      this.loading = true;
      var form = this.form;
      this.$post(api.tiezi.edit, {
        id: id,
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
    edit(id) {
      this.loadInfo(id);

      this.dialogVisible = true;
    },
    loadDetail() {
      if (this.loading) return;
      this.loading = true;
      this.$get(api.tiezi.webdetail, {
        id: this.id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
    },
  },
  created() {
    this.userName = localStorage.getItem("username");
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.app {
  background-color: #ecf7e1;
  padding: 20px 60px;
  .app-title {
    text-align: center;
    font-size: 20px;
    font-weight: bolder;
    color: #5a9c15;
  }
  .app-title-bottom {
    text-align: center;
    margin-top: 20px;
    span {
      margin-right: 20px;
    }
  }
  .app-content {
    display: flex;
    margin-top: 20px;
    padding: 20px;
    border: 1px solid white;
  }
}
</style>
