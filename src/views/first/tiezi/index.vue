<template>
  <div class="app">
    <el-row :gutter="40">
      <el-col :span="4">
        <div class="left-box">
          <div @click="view()" class="box">
            全部
          </div>
          <div
            v-for="m in tiezifenleiList"
            :key="m.id"
            :label="m.fenleimingcheng"
            class="box"
            @click="view(m.id)"
          >
            {{ m.fenleimingcheng }}
          </div>
        </div></el-col
      >
      <el-col :span="20"
        ><div class="right-box">
          <div class="search_box">
            <el-form inline :model="search" size="mini">
              <!-- <el-form-item label="帖子编号">
                <el-input v-model="search.tiezibianhao"></el-input>
              </el-form-item> -->
              <el-form-item label="标题">
                <el-input v-model="search.biaoti"></el-input>
              </el-form-item>
              <!-- <el-form-item label="分类">
                <el-select v-model="search.fenlei"
                  ><el-option label="请选择" value=""></el-option>
                  <el-option
                    v-for="m in tiezifenleiList"
                    :value="m.id"
                    :label="m.fenleimingcheng"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-button
                  type="primary"
                  @click="searchSubmit"
                  icon="el-icon-search"
                  >查询</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="addSubmit"
                  icon="el-icon-plus"
                  v-if="role != '管理员'"
                  >发帖子</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <el-row
            class="box-content"
            v-for="r in list"
            :key="r.id"
            @click.native="detail(r.id)"
            :gutter="20"
          >
            <el-col :span="4">
              <div class="picture" v-if="r.tupian != ''">
                <img :src="r.tupian" />
              </div>
              <div class="picture" v-else>
                <img src="./pic/picluntan.jpg" />
              </div>
            </el-col>
            <el-col :span="20">
              <div class="tiezititle">{{ r.biaoti }}</div>
              <div class="tieziconcent" v-html="r.neirong"></div>
              <div class="tieziconcent">
                <span class="el-icon-s-custom">{{ r.faburen }}</span>
                <!-- <span>帖子分类：{{ r.fenlei }}</span> -->
              </div>
            </el-col>
          </el-row>
        </div></el-col
      >
    </el-row>
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
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
            <el-input disabled v-model="form.tiezibianhao" />
          </el-form-item>

          <el-form-item
            label="帖子标题"
            prop="biaoti"
            required
            :rules="[{ required: true, message: '请填写标题' }]"
          >
            <el-input placeholder="请输入标题" v-model="form.biaoti" />
          </el-form-item>

          <el-form-item
            label="帖子类型"
            prop="fenlei"
            required
            :rules="[{ required: true, message: '请选择帖子类型' }]"
          >
            <el-select v-model="form.fenlei" style="width:100%">
              <el-option
                :key="m.id"
                v-for="m in tiezifenleiList"
                :value="m.id"
                :label="m.fenleimingcheng"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>
          <el-form-item
            label="图片"
            prop="tupian"
            :rules="[{ required: true, message: '请选择帖子类型' }]"
          >
            <e-upload-image v-model="form.tupian"></e-upload-image>
          </el-form-item>
          <el-form-item label="内容" prop="neirong">
            <e-editor v-model="form.neirong"></e-editor>
          </el-form-item>
          <el-form-item label="附件" prop="fujian">
            <e-upload-file v-model="form.fujian"></e-upload-file>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" v-if="oper == 'add'"
          >确 定</el-button
        >
        <el-button type="primary" @click="submit1" v-if="oper == 'edit'"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import rule from "@/utils/rule";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";
export default {
  data() {
    return {
      role: "",
      rule,
      oper: "",
      headerTitle: "",
      dialogVisible: false,
      list: [],
      tiezifenleiList: [],
      search: {
        tiezibianhao: "",
        biaoti: "",
        fenlei: "",
        fujian: "",
        dianzanliang_start: "",
        dianzanliang_end: "",
        tupian: "",
        neirong: "",
        faburen: "",
      },
      page: 1, // 当前页
      pagesize: 12, // 页大小
      totalCount: 0, // 总行数
      total: {},
      form: {
        tiezibianhao: rule.getID(),
        biaoti: "",
        fenlei: "",
        fujian: "",
        tupian: "",
        neirong: "",
        faburen: this.$store.state.user.session.username,
      },
    };
  },
  methods: {
    loadInfo() {
      var form = this.form;
      // 获取模块得数据
      this.loading = true;
      this.$post(api.tiezi.create, {
        id: this.$route.query.id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            this.tiezifenleiList = res.data.tiezifenleiList;
            // extend(this, res.data);
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
    addSubmit() {
      this.oper = "add";
      this.dialogVisible = true;
      this.operChange();
    },
    operChange() {
      if (this.oper == "add") {
        this.headerTitle = "发帖子";
      } else {
        this.headerTitle = "编辑帖子";
      }
    },
    detail(id) {
      this.$router.push("/tiezidetail?id=" + id);
    },
    view(fenleimingcheng) {
      // 筛选条件
      this.search.fenlei = fenleimingcheng;
      var filter = extend(true, {}, this.search, {
        page: 1,
        pagesize: 10,
      });

      this.$post(api.tiezi.weblist, filter)
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
    searchSubmit() {
      this.loadList(1);
    },
    loadList(page) {
      // 防止重新点加载列表
      if (this.loading) return;
      this.loading = true;
      this.page = page;
      // 筛选条件
      var filter = extend(true, {}, this.search, {
        page: page + "",
        pagesize: this.pagesize + "",
      });
      var diff = objectDiff.diff(filter, this.$route.query);
      if (diff.changed != "equal") {
        // 筛选的条件不一致则更新链接
        this.$router.replace({
          // 更新query
          path: this.$route.path,
          query: filter,
        });
      }
      this.$post(api.tiezi.weblist, filter)
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
    submit() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.tiezi.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加成功");
                this.dialogVisible = false;
                this.loadList(1);
                this.$emit("success", res.data);
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
    loadInfo1() {
      var form = this.form;
      // 获取模块得数据
      this.loading = true;
      this.$post(api.tiezi.create, {
        id: this.$route.query.id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
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

  beforeRouteUpdate(to, form, next) {
    var search = extend(this.search, to.query);
    if (search.page) {
      this.page = Math.floor(to.query.page);
      delete search.page;
    }
    if (search.pagesize) {
      this.pagesize = Math.floor(to.query.pagesize);
      delete search.pagesize;
    }
    this.loadList(1);
    next();
  },
  created() {
    this.role = localStorage.getItem("role");
    var search = extend(this.search, this.$route.query);
    if (search.page) {
      this.page = Math.floor(this.$route.query.page);
      delete search.page;
    }
    if (search.pagesize) {
      this.pagesize = Math.floor(this.$route.query.pagesize);
      delete search.pagesize;
    }
    this.loadList(1);
    this.loadInfo();
    this.view();
  },
};
</script>

<style lang="scss" scoped>
.app {
  padding: 20px 60px;
  background: #ecf7e1;
  .left-box {
    border: 1px solid white;
    border-bottom: none;
    .box {
      padding: 10px;
      text-align: center;
      cursor: pointer;
      border-bottom: 1px solid white;
    }
  }
  .box-content {
    cursor: pointer;
    display: flex;
    padding: 10px;
    border: 1px solid white;
    margin-bottom: 10px;
    .tiezititle {
      font-size: 18px;
      font-weight: bolder;
      color: #5a9c15;
      margin: 10px 0;
    }
    .tieziconcent {
      width: 800px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #888;
      font-size: 14px;
      margin-bottom: 10px;
      span {
        margin-right: 20px;
      }
    }
    .tiezibottom {
    }
  }
}
</style>
