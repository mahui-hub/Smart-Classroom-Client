import forum from "./forum";
import item from "./item";
import itemPage from "./forum-page";
import user from './user'
function install(Vue) {
    Vue.component(forum.name , forum)
    Vue.component(itemPage.name , itemPage)
    Vue.component(item.name , item)
    Vue.component(user.name , user)
}

export default {
    install,
    forum,
    item
}
