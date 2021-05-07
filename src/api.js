import http from "@/utils/ajax/http";
import { extend } from "@/utils/extend";

const api = {
  code: {
    OK: 0,
  },
  user: {
    login: "authLogin.do?ac=login",
    tokenLogin: "tokenLogin.do",
    logout: "logout.do",
  },
  checkUpdate: "sh.do",
  editorPassword: "editPassword",
  checkField: "checkno.do",

  captch() {
    var url = "captcha.do?rd=" + Math.floor(Math.random() * 100000);
    return new Promise((resolve, reject) => {
      http.get(url).then((res) => {
        var url = res.data;
        resolve(url);
      }, reject);
    });
  },
  search: {
    select: "selectUpdateSearch.do",
    table: "tableAjax.do?a=table",
    selectView: "selectView.do",
    all: "selectAll.do",
  },
  attachment: {
    uploadUrl: "upload_re.do",
    upload(file) {
      return new Promise((resolve, reject) => {
        var formdata = new FormData();
        formdata.append("fujian", file, file.name || "tmp.png");
        http
          .post(api.attachment.uploadUrl, formdata)
          .then((res) => {
            if (res.code == api.code.OK) {
              resolve(res.data);
            } else {
              reject(res.msg);
            }
          })
          .catch((err) => {
            reject(err.message);
          });
      });
    },
  },
  admins: {
    list: "admins_list.do",
    insert: "adminsinsert.do",
    update: "adminsupdate.do",
    delete: "admins_delete.do",
    detail: "admins_detail.do",
    create: "admins_add.do",
    edit: "admins_updt.do",
  },
  youqinglianjie: {
    list: "youqinglianjie_list.do",
    insert: "youqinglianjieinsert.do",
    update: "youqinglianjieupdate.do",
    delete: "youqinglianjie_delete.do",
    // detail: "youqinglianjie_detail.do",
    // create: "youqinglianjie_add.do",
    edit: "youqinglianjie_updt.do",
  },
  lunbotu: {
    list: "lunbotu_list.do",
    insert: "lunbotuinsert.do",
    update: "lunbotuupdate.do",
    delete: "lunbotu_delete.do",
    // detail: "lunbotu_detail.do",
    create: "lunbotu_add.do",
    edit: "lunbotu_updt.do",
  },
  xuesheng: {
    list: "xuesheng_list.do",
    insert: "xueshenginsert.do",
    update: "xueshengupdate.do",
    delete: "xuesheng_delete.do",
    detail: "xuesheng_detail.do",
    create: "xuesheng_add.do",
    edit: "xuesheng_updt.do",
    weblist: "xueshenglist.do",
  },
  banji: {
    list: "banji_list.do",
    insert: "banjiinsert.do",
    update: "banjiupdate.do",
    delete: "banji_delete.do",
    detail: "banji_detail.do",
    create: "banji_add.do",
    edit: "banji_updt.do",
  },
  kecheng: {
    list: "kecheng_list.do",
    insert: "kechenginsert.do",
    update: "kechengupdate.do",
    delete: "kecheng_delete.do",
    detail: "kecheng_detail.do",
    create: "kecheng_add.do",
    edit: "kecheng_updt.do",
    listfaburen: "kecheng_list_faburen.do",
    weblist: "kechenglist.do",
    webdetail: "kechengdetail.do",
  },
  gonggao: {
    list: "gonggao_list.do",
    insert: "gonggaoinsert.do",
    update: "gonggaoupdate.do",
    delete: "gonggao_delete.do",
    detail: "gonggao_detail.do",
    create: "gonggao_add.do",
    edit: "gonggao_updt.do",
    listfaburen: "gonggao_list_faburen.do",
    weblist: "gonggaolist.do",
    webdetail: "gonggaodetail.do",
  },
  dianzan: {
    list: "dianzan_list.do",
    insert: "dianzaninsert.do",
    update: "dianzanupdate.do",
    delete: "dianzan_delete.do",
    detail: "dianzan_detail.do",
    create: "dianzan_add.do",
    edit: "dianzan_updt.do",
    listfaburen: "dianzan_list_faburen.do",
    listdianzanren: "dianzan_list_dianzanren.do",
  },
  suitangceshi: {
    list: "suitangceshi_list.do",
    insert: "suitangceshiinsert.do",
    update: "suitangceshiupdate.do",
    delete: "suitangceshi_delete.do",
    detail: "suitangceshi_detail.do",
    create: "suitangceshi_add.do",
    edit: "suitangceshi_updt.do",
    listfaburen: "suitangceshi_list_faburen.do",
    weblist: "suitangceshilist.do",
    webdetail: "suitangceshidetail.do",
  },
  kechengleixing: {
    list: "kechengleixing_list.do",
    insert: "kechengleixinginsert.do",
    update: "kechengleixingupdate.do",
    delete: "kechengleixing_delete.do",
    detail: "kechengleixing_detail.do",
    create: "kechengleixing_add.do",
    edit: "kechengleixing_updt.do",
  },
  dati: {
    list: "dati_list.do",
    insert: "datiinsert.do",
    update: "datiupdate.do",
    delete: "dati_delete.do",
    detail: "dati_detail.do",
    create: "dati_add.do",
    edit: "dati_updt.do",
    listfaburen: "dati_list_faburen.do",
    listhuidaren: "dati_list_huidaren.do",
  },
  chengji: {
    list: "chengji_list.do",
    insert: "chengjiinsert.do",
    update: "chengjiupdate.do",
    delete: "chengji_delete.do",
    detail: "chengji_detail.do",
    create: "chengji_add.do",
    edit: "chengji_updt.do",
    // listxuehao: "chengji_list_xuehao.do",
    listtianjiaren: "chengji_list_tianjiaren.do",
  },
  tiezi: {
    list: "tiezi_list.do",
    insert: "tieziinsert.do",
    update: "tieziupdate.do",
    delete: "tiezi_delete.do",
    detail: "tiezi_detail.do",
    create: "tiezi_add.do",
    edit: "tiezi_updt.do",
    listfaburen: "tiezi_list_faburen.do",
    weblist: "tiezilist.do",
    webdetail: "tiezidetail.do",
  },
  tiezifenlei: {
    list: "tiezifenlei_list.do",
    insert: "tiezifenleiinsert.do",
    update: "tiezifenleiupdate.do",
    delete: "tiezifenlei_delete.do",
    detail: "tiezifenlei_detail.do",
    create: "tiezifenlei_add.do",
    edit: "tiezifenlei_updt.do",
  },
  tiezihuifu: {
    list: "tiezihuifu_list.do",
    insert: "tiezihuifuinsert.do",
    update: "tiezihuifuupdate.do",
    delete: "tiezihuifu_delete.do",
    detail: "tiezihuifu_detail.do",
    create: "tiezihuifu_add.do",
    edit: "tiezihuifu_updt.do",
    listhuifuren: "tiezihuifu_list_huifuren.do",
  },
  wentiqiangda: {
    list: "wentiqiangda_list.do",
    insert: "wentiqiangdainsert.do",
    update: "wentiqiangdaupdate.do",
    delete: "wentiqiangda_delete.do",
    detail: "wentiqiangda_detail.do",
    create: "wentiqiangda_add.do",
    edit: "wentiqiangda_updt.do",
    listfaburen: "wentiqiangda_list_faburen.do",
    weblist: "wentiqiangdalist.do",
    webdetail: "wentiqiangdadetail.do",
  },
  qiangdawenti: {
    list: "qiangdawenti_list.do",
    insert: "qiangdawentiinsert.do",
    update: "qiangdawentiupdate.do",
    delete: "qiangdawenti_delete.do",
    detail: "qiangdawenti_detail.do",
    create: "qiangdawenti_add.do",
    edit: "qiangdawenti_updt.do",
    listfaburen: "qiangdawenti_list_faburen.do",
    listqiangdaren: "qiangdawenti_list_qiangdaren.do",
  },
  huidawenti: {
    list: "huidawenti_list.do",
    insert: "huidawentiinsert.do",
    update: "huidawentiupdate.do",
    delete: "huidawenti_delete.do",
    detail: "huidawenti_detail.do",
    create: "huidawenti_add.do",
    edit: "huidawenti_updt.do",
    listfaburen: "huidawenti_list_faburen.do",
    listqiangdaren: "huidawenti_list_qiangdaren.do",
  },
  pingyuewenti: {
    list: "pingyuewenti_list.do",
    insert: "pingyuewentiinsert.do",
    update: "pingyuewentiupdate.do",
    delete: "pingyuewenti_delete.do",
    detail: "pingyuewenti_detail.do",
    create: "pingyuewenti_add.do",
    edit: "pingyuewenti_updt.do",
    listfaburen: "pingyuewenti_list_faburen.do",
    listqiangdaren: "pingyuewenti_list_qiangdaren.do",
    listpingyueren: "pingyuewenti_list_pingyueren.do",
  },
  zhuanye: {
    list: "zhuanye_list.do",
    insert: "zhuanyeinsert.do",
    update: "zhuanyeupdate.do",
    delete: "zhuanye_delete.do",
    detail: "zhuanye_detail.do",
    create: "zhuanye_add.do",
    edit: "zhuanye_updt.do",
  },
  jiaoshi: {
    list: "jiaoshi_list.do",
    insert: "jiaoshiinsert.do",
    update: "jiaoshiupdate.do",
    delete: "jiaoshi_delete.do",
    detail: "jiaoshi_detail.do",
    create: "jiaoshi_add.do",
    edit: "jiaoshi_updt.do",
    weblist: "jiaoshilist.do",
    webdetail: "jiaoshidetail.do",
  },
  wentisousuo: {
    list: "wentisousuo_list.do",
    insert: "wentisousuoinsert.do",
    update: "wentisousuoupdate.do",
    delete: "wentisousuo_delete.do",
    detail: "wentisousuo_detail.do",
    create: "wentisousuo_add.do",
    edit: "wentisousuo_updt.do",
    listxuehao: "wentisousuo_list_xuehao.do",
    weblist: "wentisousuolist.do",
    webdetail: "wentisousuodetail.do",
  },
  qiuzhujiaoshi: {
    list: "qiuzhujiaoshi_list.do",
    insert: "qiuzhujiaoshiinsert.do",
    update: "qiuzhujiaoshiupdate.do",
    delete: "qiuzhujiaoshi_delete.do",
    detail: "qiuzhujiaoshi_detail.do",
    create: "qiuzhujiaoshi_add.do",
    edit: "qiuzhujiaoshi_updt.do",
    weblist: "qiuzhujiaoshilist.do",
    webdetail: "qiuzhujiaoshidetail.do",
  },
  tiku: {
    list: "tiku_list.do",
    insert: "tikuinsert.do",
    update: "tikuupdate.do",
    delete: "tiku_delete.do",
    detail: "tiku_detail.do",
    create: "tiku_add.do",
    edit: "tiku_updt.do",
    listfaburen: "tiku_list_faburen.do",
    weblist: "tikulist.do",
    webdetail: "tikudetail.do",
  },
  shiti: {
    list: "shiti_list.do",
    insert: "shitiinsert.do",
    update: "shitiupdate.do",
    delete: "shiti_delete.do",
    detail: "shiti_detail.do",
    create: "shiti_add.do",
    edit: "shiti_updt.do",
    listfaburen: "shiti_list_faburen.do",
  },
  jieguo: {
    list: "jieguo_list.do",
    insert: "jieguoinsert.do",
    update: "jieguoupdate.do",
    delete: "jieguo_delete.do",
    detail: "jieguo_detail.do",
    create: "jieguo_add.do",
    edit: "jieguo_updt.do",
    listfaburen: "jieguo_list_faburen.do",
    listkaoshiren: "jieguo_list_kaoshiren.do",
  },
  kaoshijieguo: {
    list: "kaoshijieguo_list.do",
    insert: "kaoshijieguoinsert.do",
    update: "kaoshijieguoupdate.do",
    delete: "kaoshijieguo_delete.do",
    detail: "kaoshijieguo_detail.do",
    create: "kaoshijieguo_add.do",
    edit: "kaoshijieguo_updt.do",
    listfaburen: "kaoshijieguo_list_faburen.do",
    listkaoshiren: "kaoshijieguo_list_kaoshiren.do",
  },
  keqiankaoqin: {
    list: "keqiankaoqin_list.do",
    insert: "keqiankaoqininsert.do",
    update: "keqiankaoqinupdate.do",
    delete: "keqiankaoqin_delete.do",
    detail: "keqiankaoqin_detail.do",
    create: "keqiankaoqin_add.do",
    edit: "keqiankaoqin_updt.do",
    listfaburen: "keqiankaoqin_list_faburen.do",
    weblist: "keqiankaoqinlist.do",
    webdetail: "keqiankaoqindetail.do",
  },
  qiandao: {
    list: "qiandao_list.do",
    insert: "qiandaoinsert.do",
    update: "qiandaoupdate.do",
    delete: "qiandao_delete.do",
    detail: "qiandao_detail.do",
    create: "qiandao_add.do",
    edit: "qiandao_updt.do",
    listfaburen: "qiandao_list_faburen.do",
    listqiandaoren: "qiandao_list_qiandaoren.do",
  },
  datipingyue: {
    list: "datipingyue_list.do",
    insert: "datipingyueinsert.do",
    update: "datipingyueupdate.do",
    delete: "datipingyue_delete.do",
    detail: "datipingyue_detail.do",
    create: "datipingyue_add.do",
    edit: "datipingyue_updt.do",
    listfaburen: "datipingyue_list_faburen.do",
    listhuidaren: "datipingyue_list_huidaren.do",
  },
  xueshenghuping: {
    list: "xueshenghuping_list.do",
    insert: "xueshenghupinginsert.do",
    update: "xueshenghupingupdate.do",
    delete: "xueshenghuping_delete.do",
    detail: "xueshenghuping_detail.do",
    create: "xueshenghuping_add.do",
    edit: "xueshenghuping_updt.do",
    listhupingren: "xueshenghuping_list_hupingren.do",
  },
  pingbici: {
    list: "pingbici_list.do",
    insert: "pingbiciinsert.do",
    update: "pingbiciupdate.do",
    delete: "pingbici_delete.do",
    detail: "pingbici_detail.do",
    create: "pingbici_add.do",
    edit: "pingbici_updt.do",
  },
  ziyuan: {
    list: "ziyuan_list.do",
    insert: "ziyuaninsert.do",
    update: "ziyuanupdate.do",
    delete: "ziyuan_delete.do",
    detail: "ziyuan_detail.do",
    create: "ziyuan_add.do",
    edit: "ziyuan_updt.do",
    listfaburen: "ziyuan_list_faburen.do",
    weblist: "ziyuanlist.do",
    webdetail: "ziyuandetail.do",
  },
  pinglun: {
    list: "pinglun_list.do",
    insert: "pingluninsert.do",
    update: "pinglunupdate.do",
    delete: "pinglun_delete.do",
    detail: "pinglun_detail.do",
    create: "pinglun_add.do",
    edit: "pinglun_updt.do",
    listpinglunren: "pinglun_list_pinglunren.do",
  },
};

export default api;
