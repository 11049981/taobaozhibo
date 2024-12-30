import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { 
    Button,
    Cell,
    CellGroup,
    Field,
    Toast,
    Dialog,
    Switch,
    Tabbar, 
    TabbarItem,
    Card,
    Tag,
    Space,
    SwipeCell,
    Checkbox,
    CheckboxGroup,
    Popup
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

// 注册 Vuex store
app.use(store)

// 注册路由
app.use(router)

// 注册 Vant 组件
app.use(Button)
   .use(Cell)
   .use(CellGroup)
   .use(Field)
   .use(Toast)
   .use(Dialog)
   .use(Switch)
   .use(Tabbar)
   .use(TabbarItem)
   .use(Card)
   .use(Tag)
   .use(Space)
   .use(SwipeCell)
   .use(Checkbox)
   .use(CheckboxGroup)
   .use(Popup)

// 挂载应用
app.mount('#app')

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
    console.error('Global Error:', err)
    store.dispatch('setError', err)
    Toast.fail('操作失败：' + err.message)
} 