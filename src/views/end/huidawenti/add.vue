<template>
    <div class="huidawenti-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="title"> 添加回答问题</span>
            </div>
            <div class="form-database-form">


                <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                    <el-form-item v-if="isRead" label="编号" prop="bianhao">
                        {{  form.bianhao  }} </el-form-item>

                    <el-form-item v-if="isRead" label="标题" prop="biaoti">
                        {{  form.biaoti  }} </el-form-item>

                    <el-form-item v-if="isRead" label="图片" prop="tupian">
                        <e-img :src="form.tupian" style="max-width:120px" />
                    </el-form-item>

                    <el-form-item v-if="isRead" label="发布人" prop="faburen">
                        {{  form.faburen  }} </el-form-item>

                    <el-form-item v-if="isRead" label="抢答人" prop="qiangdaren">
                        {{  form.qiangdaren  }} </el-form-item>

                    <el-form-item label="回答附件" prop="huidafujian">
                        <e-upload-file v-model="form.huidafujian"></e-upload-file>
                    </el-form-item>

                    <el-form-item label="备注" prop="beizhu">
                        <el-input type="textarea" v-model="form.beizhu"></el-input>
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
    .huidawenti-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import {
        extend
    } from '@/utils/extend'


    export default {
        name: 'huidawenti-add',
        data() {
            return {
                readMap: {},
                rule,
                loading: false,
                form: {
                    bianhao: '',
                    biaoti: '',
                    tupian: '',
                    faburen: this.$store.state.user.session.username,
                    qiangdaren: this.$store.state.user.session.username,
                    huidafujian: '',
                    beizhu: '',

                    qiangdawentiid: 0,

                },


            }
        },
        watch: {},
        props: {
            isRead: {
                type: Boolean,
                default: true
            },
            btnText: {
                type: String,
                default: '提交'
            },
        },

        computed: {},
        methods: {
            submit() {
                this.$refs.formModel.validate().then(res => {
                    if (this.loading) return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.huidawenti.insert, form).then(res => {
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

                var form = this.form;
                // 获取模块得数据
                this.loading = true;
                this.$post(api.huidawenti.create, {
                    id: this.$route.query.id
                }).then(res => {
                    this.loading = false;
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                        var readMap = res.data.readMap;
                        for (var i in form) {
                            if (readMap[i] && i != 'id') {
                                form[i] = res.data.readMap[i];
                            }
                        }
                        form.qiangdawentiid = readMap.id;
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