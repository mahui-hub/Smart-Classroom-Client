<template>
    <div class="v-list" v-loading="loading" element-loading-text="加载中">
        <div class="form-search">
            <el-form @submit.prevent.stop :inline="true" size="mini">
                <el-form-item label="课程名称">
                    <el-input v-model="search.kechengmingcheng"></el-input>
                </el-form-item>
                <el-form-item label="课程类型">
                    <el-select v-model="search.kechengleixing">
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="m in kechengleixingList" :value="m.kechengleixing" :key="m.id"
                            :label="m.kechengleixing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addSubmit" icon="el-icon-plus">添加课程考勤</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table border :data="list" stripe highlight-current-row>
            <el-table-column type="index" label=" "></el-table-column> <!-- 序号 -->
            <el-table-column label="课程名称" align="center" prop="kechengmingcheng">
            </el-table-column>
            <el-table-column label="课程类型" align="center" :formatter="kechengType">
            </el-table-column>
            <el-table-column label="开始时间" align="center" prop="kaishishijian">
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="jieshushijian">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button type="text" @click="$goto({path:'/end/qiandao',query:{keqiankaoqinid:row.id } })"
                        size="mini">
                        签到查询
                    </el-button>
                    <el-button @click="$goto({path:'/end/keqiankaoqindetail',query:{id:row.id } })" type="text">详情
                    </el-button>
                    <!-- @click="$goto({path:'/end/keqiankaoqinupdt',query:{id:row.id } })" -->
                    <el-button @click="edit(row)" type="text">编辑
                    </el-button>
                    <el-button type="text" @click="deleteItem(row)">
                        删除
                    </el-button>

                </template>
            </el-table-column>
        </el-table>
        <div class="e-pages" style="margin-top: 10px;text-align: center">
            <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize"
                @size-change="sizeChange" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 添加考勤、编辑考勤 -->
        <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
            <div class="form-database-form">
                <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
                    <el-form-item label="课程信息" prop="kechengxinxi">
                        <e-select-list :model="form" v-model="form.kechengxinxi" module="kecheng"
                            select-update="kechengbianhao,kechengmingcheng,kechengleixing" search-update="">
                        </e-select-list>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="kaishishijian">
                        <el-date-picker v-model="form.kaishishijian" type="datetime" :editable="false"
                            value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="jieshushijian">
                        <el-date-picker v-model="form.jieshushijian" type="datetime" :editable="false"
                            value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="发布人" prop="faburen">
                        <el-input v-model="form.faburen" readonly disabled></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit" v-if="oper=='add'">确 定</el-button>
                <el-button type="primary" @click="submit1" v-if="oper=='edit'">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style type="text/scss" scoped lang="scss">

</style>
<script>
    import api from '@/api';
    import {
        remove,
        checkIssh
    } from '@/utils/utils';
    import {
        extend
    } from '@/utils/extend';
    import objectDiff from 'objectdiff';
    import rule from '@/utils/rule'


    /**
     * 后台列表页面
     */
    export default {
        data() {
            return {
                rule,
                oper: "",
                headerTitle: "",
                dialogVisible: false,
                form: {
                    kechengxinxi: '',
                    kechengbianhao: rule.getID(),
                    kechengmingcheng: '',
                    kechengleixing: '',
                    kaishishijian: '',
                    jieshushijian: '',
                    faburen: this.$store.state.user.session.username,
                },
                loading: false,
                list: [],
                search: {
                    kechengmingcheng: '',
                    kechengleixing: ''
                },
                total: {},
                page: 1, // 当前页
                pagesize: 10, // 页大小
                totalCount: 0, // 总行数
                kechengleixingList: [],
            }
        },
        methods: {
            kechengType(row) {
                var name = "";
                this.kechengleixingList.map(function (item) {
                    if (item.id == row.kechengleixing) {
                        name = item.kechengleixing;
                    }
                });
                return name;
            },
            searchSubmit() {
                this.loadList(1);
            },
            operChange() {
                if (this.oper == "add") {
                    this.headerTitle = "添加课程考勤";
                } else {
                    this.headerTitle = "编辑课程考勤";
                }
            },
            edit(row) {
                this.form = row;
                this.loadInfo2(row.id)
                this.oper = "edit";
                this.dialogVisible = true;
                this.operChange();
            },
            addSubmit() {
                this.oper = "add";
                this.dialogVisible = true;
                this.operChange();
            },
            submit() {
                this.$refs.formModel.validate().then(res => {
                    if (this.loading) return;
                    this.loading = true;
                    var form = this.form;
                    this.$post(api.keqiankaoqin.insert, form).then(res => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.$message.success('添加考勤成功');
                            this.dialogVisible = false
                            this.loadList(1)
                            this.$refs.formModel.resetFields();
                            this.loadInfo1();
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error(err.message);
                    })

                }).catch(err => {
                    console.log(err.message);
                })

            },
            submit1() {
                this.$refs.formModel.validate().then(res => {
                    if (this.loading) return;
                    this.loading = true;
                    var form = this.form;
                    this.$post(api.keqiankaoqin.update, form).then(res => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.$message.success('添加成功');
                            this.dialogVisible = false
                            this.loadList(1)
                            this.$refs.formModel.resetFields();
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error(err.message);
                    })
                }).catch(err => {
                    console.log(err.message);
                })
            },
            loadInfo2(id) {
                // 更新数据,获取数据
                this.loading = true;
                var form = this.form;
                this.$post(api.keqiankaoqin.edit, {
                    id: id
                }).then(res => {
                    this.loading = false;
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                        this.form = res.data.mmm;
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                });
            },
            loadInfo1() {

                var form = this.form;
                // 获取模块得数据
                this.loading = true;
                this.$post(api.keqiankaoqin.create, {
                    id: this.$route.query.id
                }).then(res => {
                    this.loading = false;
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                    } else {
                        this.$message.error(res.msg);
                        this.$router.go(-1);
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                    this.$router.go(-1);
                });
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
                    faburen: localStorage.getItem('username'),
                    page: page + "",
                    pagesize: this.pagesize
                });

                var diff = objectDiff.diff(filter, this.$route.query);
                if (diff.changed != 'equal') { // 筛选的条件不一致则更新链接
                    this.$router.push({ // 更新query
                        path: this.$route.path,
                        query: filter
                    });
                }
                this.$post(api.keqiankaoqin.list, filter).then(res => {
                    this.loading = false;
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error(err.message);
                });
            },
            loadList1() {
                var filter = extend(true, {}, this.search, {
                    faburen: localStorage.getItem('username'),
                    page: 1,
                    pagesize: 10
                });
                this.$post(api.keqiankaoqin.list, filter).then(res => {
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                });
            },
            // 删除某行方法
            deleteItem(row) {
                this.$confirm('确定删除数据？', '提示', { // 弹出 确认框提示是否要删除
                    type: 'warning'
                }).then(() => { // 确定操作

                    this.loading = true; // 滚动条
                    this.$post(api.keqiankaoqin.delete, { // 提交后台
                        id: row.id
                    }).then(res => {
                        this.loading = false;
                        if (res.code != api.code.OK) {
                            this.$message.error(res.msg);
                        } else {
                            remove(this.list, row);
                        }
                    }).catch(err => { // 访问网络错误
                        this.loading = false;
                        this.$message.error(err.message)
                    })
                }).catch(() => {
                    // 取消操作
                })
            },
        },
        beforeRouteUpdate(to, form, next) {
            extend(this.search, to.query)
            this.loadList(1);
            next();
        },
        created() {
            var search = extend(this.search, this.$route.query)
            if (search.page) {
                this.page = Math.floor(this.$route.query.page)
                delete search.page
            }
            if (search.pagesize) {
                this.pagesize = Math.floor(this.$route.query.pagesize)
                delete search.pagesize
            }
            this.loadList1();
        },
        mounted() {},
        destroyed() {}
    }
</script>