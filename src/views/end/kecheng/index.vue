<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <!-- <el-form-item label="课程编号">
          <el-input v-model="search.kechengbianhao"></el-input>
        </el-form-item> -->
        <el-form-item label="课程名称">
          <el-input v-model="search.kechengmingcheng"></el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="search.kechengleixing"
            ><el-option label="请选择" value=""></el-option>
            <el-option
              :key="m.kechengleixing"
              v-for="m in kechengleixingList"
              :value="m.kechengleixing"
              :label="m.kechengleixing"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus"
            >添加课程</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->
      <el-table-column label="图片" align="center">
        <template slot-scope="{ row }">
          <e-img :src="row.tupian" style="width: 80px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="课程编号" align="center">
        <template slot-scope="{ row }"> {{ row.kechengbianhao }} </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center">
        <template slot-scope="{ row }"> {{ row.kechengmingcheng }} </template>
      </el-table-column>
      <el-table-column
        label="课程类型"
        prop="kechengleixing"
        align="center"
        :formatter="typeformatter"
      >
        <!-- <template slot-scope="{ row }"> {{ row.kechengleixing }} </template> -->
      </el-table-column>

      <el-table-column label="班级名称" align="center">
        <template slot-scope="{ row }"> {{ row.banjimingcheng }} </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <!-- <el-button
            @click="
              $goto({ path: '/end/kechengdetail', query: { id: row.id } })
            "
            type="text"
            >详情</el-button
          > -->
          <el-button @click="edit(row)" type="text">编辑</el-button>
          <!-- <el-button
            @click="$goto({ path: '/end/kechengupdt', query: { id: row.id } })"
            type="text"
            >编辑</el-button
          > -->
          <el-button type="text" @click="deleteItem(row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px; text-align: center">
      <el-pagination
        @current-change="loadList"
        :current-page="page"
        :page-size="pagesize"
        @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>

    <!-- 添加课程 -->
    <el-dialog title="添加课程信息" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="课程编号" prop="kechengbianhao">
            <el-input
              disabled
              placeholder="请输入课程编号"
              v-model="form.kechengbianhao"
            />
          </el-form-item>

          <el-form-item label="课程名称" prop="kechengmingcheng">
            <el-input
              placeholder="请输入课程名称"
              v-model="form.kechengmingcheng"
            />
          </el-form-item>

          <!-- <el-form-item label="专业名称" prop="kechengmingcheng">
            <el-select v-model="form.zhuanye" style="width:100%">
              <el-option
                v-for="m in zhuanyeList"
                :key="m.zhuanye"
                :value="m.zhuanye"
                :label="m.zhuanye"
              ></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="课程类型" prop="kechengleixing">
            <el-select v-model="form.kechengleixing" style="width: 100%">
              <el-option
                :key="m.kechengleixing"
                v-for="m in kechengleixingList"
                :value="m.id"
                :label="m.kechengleixing"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师姓名" prop="jiaoshiid" v-if="role=='管理员'">
            <el-select v-model="form.jiaoshiid" style="width: 100%">
              <el-option
                :key="m.id"
                v-for="m in jiaoshilist"
                :value="m.id"
                :label="m.xingming"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="banjimingcheng">
            <!-- <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group
              v-model="form.banjimingcheng"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="m in banjiList"
                :key="m.id"
                :value="m.banjimingcheng"
                :label="m.banjimingcheng"
                >{{ m.banjimingcheng }}</el-checkbox
              >
            </el-checkbox-group> -->
            <el-select
              v-model="form.banjimingcheng"
              style="width: 100%"
              @change="handleChange"
            >
              <el-option
                v-for="m in banjiList"
                :key="m.id"
                :value="m.banjimingcheng"
                :label="m.banjimingcheng"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>

          <el-form-item label="课程图片" prop="tupian">
            <e-upload-image v-model="form.tupian"></e-upload-image>
          </el-form-item>

          <el-form-item label="课程介绍" prop="kechengjieshao">
            <e-editor v-model="form.kechengjieshao"></e-editor>
          </el-form-item>
          <el-form-item
            label="课程文档"
            prop="kechengwendang"
            required
            :rules="[{ required: true, message: '请填写课程文档' }]"
          >
            <e-upload-file v-model="form.kechengwendang"></e-upload-file>
          </el-form-item>
          <el-form-item
            label="课程视频"
            prop="kechengshipin"
            required
            :rules="[{ required: true, message: '请填写课程视频' }]"
          >
            <e-upload-file v-model="form.kechengshipin"></e-upload-file>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改课程 -->
    <el-dialog title="修改课程信息" :visible.sync="dialogVisible1" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form1"
          ref="formModel1"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item label="课程编号" prop="kechengbianhao">
            <el-input
              disabled
              placeholder="请输入课程编号"
              v-model="form1.kechengbianhao"
            />
          </el-form-item>

          <el-form-item
            label="课程名称"
            prop="kechengmingcheng"
            :rules="[{ required: true, message: '请填写课程名称' }]"
          >
            <el-input
              placeholder="请输入课程名称"
              v-model="form1.kechengmingcheng"
            />
          </el-form-item>

          <el-form-item
            label="课程类型"
            prop="kechengleixing"
            :rules="[{ required: true, message: '请选择课程类型' }]"
          >
            <el-select v-model="form1.kechengleixing" style="width: 100%">
              <el-option
                :key="m.kechengleixing"
                v-for="m in kechengleixingList"
                :value="m.id"
                :label="m.kechengleixing"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师姓名" prop="jiaoshiid">
            <el-select v-model="form1.jiaoshiid" style="width: 100%" disabled>
              <el-option
                :key="m.id"
                v-for="m in jiaoshilist"
                :value="m.id"
                :label="m.xingming"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="banjimingcheng">
            <!-- <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group
              v-model="form.banjimingcheng"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="m in banjiList"
                :key="m.id"
                :value="m.banjimingcheng"
                :label="m.banjimingcheng"
                >{{ m.banjimingcheng }}</el-checkbox
              >
            </el-checkbox-group> -->
            <el-select
              v-model="form1.banjimingcheng"
              style="width: 100%"
              @change="handleChange1"
            >
              <el-option
                v-for="m in banjiList"
                :key="m.id"
                :value="m.banjimingcheng"
                :label="m.banjimingcheng"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form1.faburen" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="tupian" required>
            <e-upload-image v-model="form1.tupian"></e-upload-image>
          </el-form-item>

          <el-form-item label="课程介绍" prop="kechengjieshao">
            <e-editor v-model="form1.kechengjieshao"></e-editor>
          </el-form-item>
          <el-form-item
            label="课程文档"
            prop="kechengwendang"
            required
            :rules="[{ required: true, message: '请提交课程文档' }]"
          >
            <e-upload-file v-model="form1.kechengwendang"></e-upload-file>
          </el-form-item>

          <el-form-item
            label="课程视频"
            prop="kechengshipin"
            required
            :rules="[{ required: true, message: '请填写课程视频' }]"
          >
            <e-upload-file v-model="form1.kechengshipin"></e-upload-file>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss"></style>
<script>
import api from "@/api";
import { remove, checkIssh } from "@/utils/utils";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";
import rule from "@/utils/rule";

/**
 * 后台列表页面
 */
export default {
  data() {
    return {
      role:'',
      jiaoshilist: [],
      checkAll: false,
      isIndeterminate: true,
      form1: {
        kechengwendang: "",
        kechengshipin: "",
        kechengbianhao: "",
        kechengmingcheng: "",
        kechengleixing: "",
        tupian: "",
        jiaoshiid: "",
        banjiid: "",
        banjimingcheng: "",
        kechengjieshao: "",
        faburen: "",
      },
      checkAll: false,
      isIndeterminate: true,
      dialogVisible: false,
      dialogVisible1: false,
      loading: false,
      list: [],
      search: {
        jiaoshiid: "",

        kechengbianhao: "",
        kechengmingcheng: "",
        kechengleixing: "",
      },
      total: {},
      page: 1, // 当前页
      pagesize: 10, // 页大小
      totalCount: 0, // 总行数
      kechengleixingList: [],
      form: {
        kechengwendang: "",
        kechengshipin: "",
        kechengbianhao: rule.getID(),
        kechengmingcheng: "",
        kechengleixing: "",
        tupian: "",
        jiaoshiid: "",
        banjiid: "",
        banjimingcheng: "",
        // banjimingcheng: [],
        kechengjieshao: "",
        faburen: this.$store.state.user.session.username,
      },
      banjiList: [],
      rules: {
        kechengbianhao: [
          { required: true, message: "请填写课程编号", trigger: "blur" },
        ],
        kechengmingcheng: [
          { required: true, message: "请填写课程名称", trigger: "blur" },
        ],
        kechengleixing: [
          { required: true, message: "请填写课程类型", trigger: "change" },
        ],
      },
      zhuanyeList: [],
    };
  },
  methods: {
    panduan() {
      if (localStorage.getItem("role") == "管理员") {
        this.loadList1();
      } else if (localStorage.getItem("role") == "教师") {
        this.search.jiaoshiid = localStorage.getItem("jiaoshiid");
        this.loadList1();
      }
    },
    typeformatter(row) {
      var name = "";
      this.kechengleixingList.forEach(function (item) {
        if (row.kechengleixing == item.id) {
          name = item.kechengleixing;
        }
      });
      return name;
    },
    loadList2() {
      // 防止重新点加载列表
      var filter = extend(true, {}, this.search, {
        page: 1,
        pagesize: 10,
      });

      this.$post(api.jiaoshi.list, filter)
        .then((res) => {
          if (res.code == api.code.OK) {
            this.jiaoshilist = res.data.list;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    handleChange(data) {
      var id = "";
      this.banjiList.map(function (item) {
        if (item.banjimingcheng == data) {
          id = item.id;
        }
      });
      this.form.banjiid = id;
    },
    handleChange1(data) {
      var id = "";
      this.banjiList.map(function (item) {
        if (item.banjimingcheng == data) {
          id = item.id;
        }
      });

      this.form1.banjiid = id;
    },
    edit(row) {
      this.form1 = row;
      this.dialogVisible1 = true;
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.banjiList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.banjiList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.banjiList.length;
    },
    submit1() {
      this.$refs.formModel1
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form1;
          this.$post(api.kecheng.update, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("修改成功");
                this.dialogVisible1 = false;
                this.loading = false;
                this.loadList1();
                this.$refs.formModel1.resetFields();
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
      // 更新数据,获取数据
      this.loading = true;
      var form = this.form1;
      this.$post(api.kecheng.edit, {
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
          this.$message.error(err.message);
        });
    },
    handleCheckAllChange(val) {
      console.log(val);
      this.form.banjimingcheng = val ? this.banjiList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.banjiList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.banjiList.length;
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
        this.$router.push({
          // 更新query
          path: this.$route.path,
          query: filter,
        });
      }
      this.$post(api.banji.list, filter)
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
            this.zhuanyeList = res.data.zhuanyeList;
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
          if (localStorage.getItem("role") == "教师") {
            this.form.jiaoshiid = localStorage.getItem("jiaoshiid");
          }
          var form = this.form;
          console.log(form);
          this.$post(api.kecheng.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加课程信息成功");
                this.dialogVisible = false;
                this.$emit("success", res.data);
                this.$refs.formModel.resetFields();
                this.loadInfo();
                this.loadList1();
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
      this.$post(api.kecheng.create, {
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
    addSubmit() {
      this.dialogVisible = true;
      if(localStorage.getItem('role')=='教师'){
        this.form.jiaoshiid=localStorage.getItem('jiaoshiid')
      }
    },
    searchSubmit() {
      this.loadList(1);
    },
    sizeChange(e) {
      this.pagesize = e;
      this.loadList(1);
    },
    checkIssh,
    loadList1(page) {
      // 筛选条件
      var filter = extend(true, {}, this.search, {
        page: page,
        pagesize: 10,
      });
      this.$post(api.kecheng.list, filter)
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            this.kechengleixingList = res.data.kechengleixingList;
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
            // extend(this, res.data);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
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
      console.log(this.pagesize + "");
      var diff = objectDiff.diff(filter, this.$route.query);
      if (diff.changed != "equal") {
        // 筛选的条件不一致则更新链接
        this.$router.push({
          // 更新query
          path: this.$route.path,
          query: filter,
        });
      }
      console.log(filter);
      this.$post(api.kecheng.list, filter)
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
    // 删除某行方法
    deleteItem(row) {
      this.$confirm("确定删除数据？", "提示", {
        // 弹出 确认框提示是否要删除
        type: "warning",
      })
        .then(() => {
          // 确定操作

          this.loading = true; // 滚动条
          this.$post(api.kecheng.delete, {
            // 提交后台
            id: row.id,
          })
            .then((res) => {
              this.loading = false;
              if (res.code != api.code.OK) {
                this.$message.error(res.msg);
              } else {
                remove(this.list, row);
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
  },
  beforeRouteUpdate(to, form, next) {
    extend(this.search, to.query);
    this.loadList(1);
    next();
  },
  created() {
    var search = extend(this.search, this.$route.query);
    if (search.page) {
      this.page = Math.floor(this.$route.query.page);
      delete search.page;
    }
    if (search.pagesize) {
      this.pagesize = Math.floor(this.$route.query.pagesize);
      delete search.pagesize;
    }
    this.role=localStorage.getItem('role')
    this.panduan();
    this.loadList2();
    // this.loadList1();
    this.loadInfo();
  },
};
</script>
