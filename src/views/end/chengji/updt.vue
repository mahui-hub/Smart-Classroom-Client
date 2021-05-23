<template>
    <div class="chengji-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix updt">
                <el-page-header @back="$router.go(-1)" content="编辑成绩">
                </el-page-header>
            </div>
            <div class="form-database-form">


                <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                    <el-form-item v-if="isRead" label="学号" prop="xuehao">
                        {{  form.xuehao  }} </el-form-item>

                    <el-form-item v-if="isRead" label="姓名" prop="xingming">
                        {{  form.xingming  }} </el-form-item>

                    <el-form-item v-if="isRead" label="班级" prop="banji">
                        {{  form.banji  }} </el-form-item>

                    <el-form-item v-if="isRead" label="专业" prop="zhuanye">
                        {{  form.zhuanye  }} </el-form-item>

                    <el-form-item label="期末成绩" prop="qimochengji"
                        :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最小不能小于1', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
                        <el-input placeholder="输入期末成绩" style="width:250px;" v-model="form.qimochengji" />
                    </el-form-item>

                    <el-form-item label="生互评成绩" prop="shenghupingchengji"
                        :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最少不能小于1', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
                        <el-input placeholder="输入生互评成绩" style="width:250px;" v-model="form.shenghupingchengji" />
                    </el-form-item>

                    <el-form-item label="教师评价成绩" prop="jiaoshipingjiachengji"
                        :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最少不能小于1', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
                        <el-input placeholder="输入教师评价成绩" style="width:250px;" v-model="form.jiaoshipingjiachengji" />
                    </el-form-item>

                    <el-form-item label="随堂测试成绩" prop="suitangceshichengji"
                        :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最少不能少于1', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
                        <el-input placeholder="输入随堂测试成绩" style="width:250px;" v-model="form.suitangceshichengji" />
                    </el-form-item>

                    <el-form-item label="抢答问题成绩" prop="qiangdawentichengji"
                        :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最少不能少于1', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
                        <el-input placeholder="输入抢答问题成绩" style="width:250px;" v-model="form.qiangdawentichengji" />
                    </el-form-item>

                    <el-form-item label="添加人" prop="tianjiaren">
                        <el-input v-model="form.tianjiaren" readonly style="width: 250px;"></el-input>
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
    .chengji-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import {
        extend
    } from '@/utils/extend'


    export default {
        name: 'chengji-add',
        data() {
            return {
                rule,
                loading: false,
                form: {
                    xuehao: this.$store.state.user.session.username,
                    xingming: '',
                    banji: '',
                    zhuanye: '',
                    qimochengji: '',
                    shenghupingchengji: '',
                    jiaoshipingjiachengji: '',
                    suitangceshichengji: '',
                    qiangdawentichengji: '',
                    tianjiaren: this.$store.state.user.session.username,
                    xueshengid: 0,

                },


            }
        },
        watch: {
            id: {
                handler() {
                    this.loadInfo();
                }
            }
        },
        props: {
            isRead: {
                type: Boolean,
                default: true
            },
            btnText: {
                type: String,
                default: '提交'
            },
            id: {
                type: [String, Number],
                required: true
            },
        },

        computed: {},
        methods: {
            submit() {
                this.$refs.formModel.validate().then(res => {
                    if (this.loading) return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.chengji.update, form).then(res => {
                        this.loading = false;
                        if (res.code == api.code.OK) {
                            this.$message.success('添加成功');
                            this.$emit('success', res.data);
                            this.$refs.formModel.resetFields();
                            this.$router.go(-1);
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
            loadInfo() {

                // 更新数据,获取数据
                this.loading = true;
                var form = this.form;
                this.$post(api.chengji.edit, {
                    id: this.id
                }).then(res => {
                    this.loading = false;
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                        this.form = res.data.mmm;

                    } else {
                        this.$message.error(res.msg);
                        this.$router.go(-1);
                    }
                }).catch(err => {
                    this.$message.error(err.message);
                    this.$router.go(-1);
                });
            },
        },
        created() {
            this.loadInfo();
        },
        mounted() {},
        destroyed() {}
    }
</script>