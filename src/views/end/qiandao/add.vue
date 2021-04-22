<template>
    <div class="qiandao-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                                <span class="title"> 添加签到</span>
                            </div>
            <div class="form-database-form">
                

            <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                                <el-form-item v-if="isRead" label="课程信息" prop="kechengxinxi">
                                            <table>
            <tr>
            <td colspan="2">课程信息：</td>
</tr><tr><td style="width: 130px">课程编号</td><td>{{  form.kechengbianhao  }}</td></tr><tr><td style="width: 130px">课程名称</td><td>{{  form.kechengmingcheng  }}</td></tr><tr><td style="width: 130px">课程类型</td><td>{{  form.kechengleixing  }}</td></tr></table>                                    </el-form-item>

                                <el-form-item v-if="isRead" label="开始时间" prop="kaishishijian">
                                            {{  form.kaishishijian  }}                                    </el-form-item>

                                <el-form-item v-if="isRead" label="结束时间" prop="jieshushijian">
                                            {{  form.jieshushijian  }}                                    </el-form-item>

                                <el-form-item v-if="isRead" label="发布人" prop="faburen">
                                            {{  form.faburen  }}                                    </el-form-item>

                                <el-form-item label="签到时间" prop="qiandaoshijian">
                                            <el-date-picker
          v-model="form.qiandaoshijian"
          type="datetime"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>                                    </el-form-item>

                                <el-form-item label="签到人" prop="qiandaoren">
                                            <el-input v-model="form.qiandaoren" readonly style="width: 250px;"></el-input>                                    </el-form-item>

                                <el-form-item v-if="btnText">
                    <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                </el-form-item>
            </el-form>

            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
.qiandao-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import { extend } from '@/utils/extend'

    
    export default {
        name:'qiandao-add',
        data() {
            return {
                                readMap:{},
                                rule,
                loading:false,
                form:{
                    kechengxinxi:'',
kechengbianhao:rule.getID(),
                    kechengmingcheng:'',
                    kechengleixing:'',
                    kaishishijian:'',
                    jieshushijian:'',
faburen:this.$store.state.user.session.username,                    qiandaoshijian:'',
qiandaoren:this.$store.state.user.session.username,
            keqiankaoqinid:0,
                        
                },

            
            }
        },
                watch: {
                    },
        props: {
            isRead:{
                type:Boolean,
                default:true
            },
            btnText:{
                type:String,
                default:'提交'
            },
                    },

        computed: {},
        methods: {
            submit(){
                this.$refs.formModel.validate().then(res=>{
                    if(this.loading)return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.qiandao.insert , form).then(res=>{
                        this.loading = false;
                        if(res.code == api.code.OK){
                            this.$message.success('添加成功');
                            this.$emit('success' , res.data);
                            this.$refs.formModel.resetFields();
                                                        this.$router.go(-1);
                                                    }else{
                            this.$message.error(res.msg);
                        }
                    }).catch(err=>{
                        this.loading = false;
                        this.$message.error(err.message);
                    })

                }).catch(err=>{
                    console.log(err.message);
                })

            },
            loadInfo(){

                                var form = this.form;
                // 获取模块得数据
                this.loading = true;
                this.$post(api.qiandao.create , {
                    id:this.$route.query.id
                }).then(res=>{
                    this.loading = false;
                    if(res.code == api.code.OK){
                        extend(this , res.data);
                                                var readMap = res.data.readMap;
                        for (var i in form){
                            if(readMap[i] && i != 'id')
                            {
                                form[i] = res.data.readMap[i];
                            }
                        }
                        form.keqiankaoqinid = readMap.id;
                                            }else{
                        this.$message.error(res.msg);
                        this.$router.go(-1);
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                    this.$router.go(-1);
                });
                            },
                    },
        created() {
            this.loadInfo();
                    },
        mounted() {
                    },
        destroyed() {
                    }
    }
</script>
