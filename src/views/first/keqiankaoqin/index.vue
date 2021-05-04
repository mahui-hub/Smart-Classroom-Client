<template>
    <div class="app">
        <e-module-widget-title title="课前考勤">
            <div class="list-table">
                <el-table border :data="list" stripe highlight-current-row>
                    <el-table-column type="index" align="center"></el-table-column>
                    <!-- 序号 -->
                    <el-table-column label="课程名称" align="center" prop="kechengmingcheng">
                    </el-table-column>
                    <el-table-column label="课程类型" align="center" prop="kechengleixing">
                    </el-table-column>
                    <el-table-column label="开始时间" align="center" prop="kaishishijian">
                    </el-table-column>
                    <el-table-column label="结束时间" align="center" prop="jieshushijian">
                    </el-table-column>
                    <el-table-column label="发布人" align="center" prop="faburen">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="{ row }">
                            <el-button type="text" @click="qiandao(row)"
                                v-if="currentTime<= new Date(row.jieshushijian)">
                                签到
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-top: 10px;text-align: center">
                <el-pagination @current-change="loadList" :current-page="page" :page-size="15"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
        </e-module-widget-title>
        <el-dialog title="签到" :visible.sync="dialogVisible" size="mini">
            <div class="form-database-form">
                <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
                    <el-form-item label="课程名称" prop="kechengmingcheng">
                        <el-input v-model="form.kechengmingcheng" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="发布人" prop="faburen">
                        <el-input v-model="form.faburen" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="签到人" prop="qiandaoren">
                        <el-input v-model="form.qiandaoren" readonly disabled></el-input>
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
<style type="text/scss" scoped lang="scss">
</style>
<script>
    import api from '@/api';
    import {
        extend
    } from '@/utils/extend';
    import objectDiff from 'objectdiff';
    import rule from '@/utils/rule'
    export default {
        data() {
            return {
                rule,
                dialogVisible: false,
                loading: false,
                list: [],
                search: {
                    kechengbianhao: '',
                    kechengmingcheng: '',
                    kechengleixing: '',
                    kaishishijian_start: '',
                    kaishishijian_end: '',
                    jieshushijian_start: '',
                    jieshushijian_end: '',
                    faburen: '',
                },
                page: 1, // 当前页
                pagesize: 12, // 页大小
                totalCount: 0, // 总行数
                total: {},
                form: {
                    kechengxinxi: '',
                    kechengbianhao: rule.getID(),
                    kechengmingcheng: '',
                    kechengleixing: '',
                    kaishishijian: '',
                    jieshushijian: '',
                    faburen: this.$store.state.user.session.username,
                    qiandaoshijian: "",
                    qiandaoren: this.$store.state.user.session.username,
                    keqiankaoqinid: 0,
                },
                currentTime: new Date()
            }
        },
        watch: {},
        computed: {},
        methods: {
            getYMDHMS(timestamp) {
                let time = new Date(timestamp)
                let year = time.getFullYear()
                const month = (time.getMonth() + 1).toString().padStart(2, '0')
                const date = (time.getDate()).toString().padStart(2, '0')
                const hours = (time.getHours()).toString().padStart(2, '0')
                const minute = (time.getMinutes()).toString().padStart(2, '0')
                const second = (time.getSeconds()).toString().padStart(2, '0')

                return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
            },
            qiandao(row) {
                this.form = row
                this.dialogVisible = true
                this.form.qiandaoren = localStorage.getItem('username')
            },
            submit() {
                this.$refs.formModel.validate().then(res => {
                    this.form.qiandaoshijian = this.getYMDHMS(new Date())
                    var form = this.form;
                    this.$post(api.qiandao.insert, form).then(res => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.$message.success('签到成功');
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
                    pagesize: this.pagesize + ""
                });
                var diff = objectDiff.diff(filter, this.$route.query);
                if (diff.changed != 'equal') { // 筛选的条件不一致则更新链接
                    this.$router.replace({ // 更新query
                        path: this.$route.path,
                        query: filter
                    });
                }
                this.$post(api.keqiankaoqin.weblist, filter).then(res => {
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

                // 筛选条件
                var filter = extend(true, {}, this.search, {
                    page: 1,
                    pagesize: 12
                });
                this.$post(api.keqiankaoqin.weblist, filter).then(res => {
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
        },
        beforeRouteUpdate(to, form, next) {
            var search = extend(this.search, to.query)
            if (search.page) {
                this.page = Math.floor(to.query.page)
                delete search.page
            }
            if (search.pagesize) {
                this.pagesize = Math.floor(to.query.pagesize)
                delete search.pagesize
            }
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
            console.log(this.currentTime)
            this.loadList1()
            // this.loadList(this.page);
        },
        mounted() {},
        destroyed() {}
    }
</script>