<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" size="mini" :inline="true">
        <el-form-item label="题库名称">
          <el-input v-model="search.tikumingcheng"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus"
            >新增题库</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" stripe highlight-current-row>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->

      <el-table-column label="题库编号" align="center">
        <template slot-scope="{ row }">
          {{ row.tikubianhao }}
        </template>
      </el-table-column>
      <el-table-column label="题库名称" align="center">
        <template slot-scope="{ row }">
          {{ row.tikumingcheng }}
        </template>
      </el-table-column>
      <el-table-column label="教师工号" align="center">
        <template slot-scope="{ row }">
          {{ row.jiaoshi }}
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }">
          {{ row.faburen }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="$goto('/admin/shitiadd?id=' + row.id)" type="text">
            试题添加
          </el-button>

          <el-button
            @click="$goto({ path: '/admin/tikudetail', query: { id: row.id } })"
            type="text"
            >详情</el-button
          >

          <el-button
            @click="$goto({ path: '/admin/tikuupdt', query: { id: row.id } })"
            type="text"
            >编辑</el-button
          >

          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
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

    <el-dialog
      :title="headerTitle"
      :visible.sync="dialogVisible"
      size="mini"
      :inline="true"
    >
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item
            label="题库编号"
            prop="tikubianhao"
            :rules="[{ required: true, message: '请填写题库编号' }]"
          >
            <el-input
              placeholder="请输入题库编号"
              disabled
              v-model="form.tikubianhao"
            />
          </el-form-item>

          <el-form-item
            label="题库名称"
            prop="tikumingcheng"
            required
            :rules="[{ required: true, message: '请填写题库名称' }]"
          >
            <el-input
              placeholder="请输入题库名称"
              v-model="form.tikumingcheng"
            />
          </el-form-item>
          <!-- 后续增加---先注释掉 -->
          <!-- <el-form-item label="题库类型" prop="tikuleixing">
            <el-select v-model="form.tikuleixing">
              <el-option
                v-for="m in tikuleixinglist"
                :value="m.value"
                :label="m.label"
                :key="m.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="课程名称"
            prop="jiaoshi"
            v-if="form.tikuleixing != '评价题库'"
          >
            <el-select v-model="form.jiaoshi">
              <el-option
                v-for="m in jiaoshiList"
                :value="m.gonghao"
                :label="m.gonghao"
                :key="m.gonghao"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="教师工号" prop="jiaoshi">
            <el-select v-model="form.jiaoshi" style="width:100%;">
              <el-option
                v-for="m in jiaoshiList"
                :value="m.gonghao"
                :label="m.gonghao"
                :key="m.gonghao"
                >{{ m.xingming }}</el-option
              >
            </el-select>
          </el-form-item>

          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
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
<style type="text/scss" scoped lang="scss"></style>
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
      tikuleixinglist: [
        {
          value: "评价题库",
          label: "评价题库",
        },
        {
          value: "考试题库",
          label: "考试题库",
        },
        {
          value: "测验题库",
          label: "测验题库",
        },
      ],
      oper: "",
      dialogVisible: false,
      headerTitle: "",
      loading: false,
      list: [],
      search: {
        tikumingcheng: "",
      },
      total: {},
      page: 1, // 当前页
      pagesize: 10, // 页大小
      totalCount: 0, // 总行数
      rule,

      form: {
        tikubianhao: rule.getID(),
        tikumingcheng: "",
        jiaoshi: "",
        faburen: this.$store.state.user.session.username,
      },

      jiaoshiList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    submit() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.tiku.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加评价题库成功");
                this.loadList(1);
                this.dialogVisible = false;
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
      var form = this.form;
      // 获取模块得数据
      this.loading = true;
      this.$post(api.tiku.create, {
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
      this.oper = "add";
      this.dialogVisible = true;
      this.operChange();
    },
    operChange() {
      if (this.oper == "add") {
        this.headerTitle = "添加题库";
      } else {
        this.headerTitle = "编辑题库";
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
      this.$post(api.tiku.list, filter)
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
          this.$post(api.tiku.delete, {
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
  //   beforeRouteUpdate(to, form, next) {
  //     extend(this.search, to.query);
  //     this.loadList(1);
  //     next();
  //   },
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
    this.loadList(1);
    this.loadInfo();
  },
  mounted() {},
  destroyed() {},
};
</script>
