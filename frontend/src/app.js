const { createApp, ref, computed } = Vue;
const { showToast, showDialog } = vant;

const app = createApp({
    setup() {
        // 页面状态
        const currentPage = ref('accounts')
        const isSending = ref(false)

        // 弹窗控制
        const showAddDialog = ref(false)
        const showAddGroupDialog = ref(false)
        const showGroupPicker = ref(false)
        const showScheduleDialog = ref(false)
        const showDatetimePicker = ref(false)

        // 账号管理
        const accountGroups = ref([])
        const newAccount = ref({
            name: '',
            groupId: null
        })
        const newGroupName = ref('')

        // 消息管理
        const message = ref('')
        const messageHistory = ref([])
        const scheduledTasks = ref([])
        const scheduleTime = ref('')

        // 设置
        const settings = ref({
            randomDelay: false,
            minDelay: 1,
            maxDelay: 5
        })

        // 计算主账号
        const mainAccount = computed(() => {
            for (const group of accountGroups.value) {
                const main = group.accounts.find(acc => acc.isMain)
                if (main) return main
            }
            return null
        })

        // 初始化数据
        const initData = () => {
            // 加载账号组
            const savedGroups = localStorage.getItem('accountGroups')
            if (savedGroups) {
                accountGroups.value = JSON.parse(savedGroups)
            }

            // 加载消息历史
            const savedHistory = localStorage.getItem('messageHistory')
            if (savedHistory) {
                messageHistory.value = JSON.parse(savedHistory)
            }

            // 加载定时任务
            const savedTasks = localStorage.getItem('scheduledTasks')
            if (savedTasks) {
                scheduledTasks.value = JSON.parse(savedTasks)
                // 重新启动定时任务
                scheduledTasks.value.forEach(task => {
                    if (new Date(task.scheduledTime) > new Date()) {
                        scheduleTask(task)
                    }
                })
            }

            // 加载设置
            const savedSettings = localStorage.getItem('settings')
            if (savedSettings) {
                settings.value = JSON.parse(savedSettings)
            }

            // 启动在线状态检查
            startStatusCheck()
        }

        // 保存数据
        const saveData = () => {
            localStorage.setItem('accountGroups', JSON.stringify(accountGroups.value))
            localStorage.setItem('messageHistory', JSON.stringify(messageHistory.value))
            localStorage.setItem('scheduledTasks', JSON.stringify(scheduledTasks.value))
            localStorage.setItem('settings', JSON.stringify(settings.value))
        }

        // 账号管理功能
        const saveGroup = () => {
            if (!newGroupName.value) {
                showToast('请输入分组名称')
                return
            }

            accountGroups.value.push({
                id: Date.now(),
                name: newGroupName.value,
                accounts: []
            })

            saveData()
            newGroupName.value = ''
            showAddGroupDialog.value = false
            showToast('分组添加成功')
        }

        const selectGroup = (name) => {
            const group = accountGroups.value.find(g => g.name === name)
            if (group) {
                newAccount.value.groupId = group.id
                showGroupPicker.value = false
            }
        }

        const saveAccount = () => {
            if (!newAccount.value.name || !newAccount.value.groupId) {
                showToast('请填写完整信息')
                return
            }

            const group = accountGroups.value.find(g => g.id === newAccount.value.groupId)
            if (group) {
                group.accounts.push({
                    id: Date.now(),
                    name: newAccount.value.name,
                    isMain: group.accounts.length === 0,
                    online: true // 初始状态设为在线
                })

                saveData()
                newAccount.value = { name: '', groupId: null }
                showAddDialog.value = false
                showToast('账号添加成功')
            }
        }

        const setMainAccount = (account) => {
            accountGroups.value.forEach(group => {
                group.accounts.forEach(acc => {
                    acc.isMain = (acc.id === account.id)
                })
            })
            saveData()
        }

        // 消息发送功能
        const sendMessage = async () => {
            if (!mainAccount.value || !message.value) {
                showToast('请检查主账号和消息内容')
                return
            }

            try {
                isSending.value = true

                // 随机延迟
                if (settings.value.randomDelay) {
                    const delay = Math.floor(Math.random() * 
                        (settings.value.maxDelay - settings.value.minDelay + 1) + 
                        settings.value.minDelay)
                    await new Promise(resolve => setTimeout(resolve, delay * 1000))
                }

                // 模拟消息发送
                await new Promise(resolve => setTimeout(resolve, 1000))

                // 添加到历史记录
                messageHistory.value.unshift({
                    id: Date.now(),
                    content: message.value,
                    time: new Date().toLocaleString(),
                    status: 'success'
                })

                saveData()
                message.value = ''
                showToast('发送成功')
            } catch (error) {
                messageHistory.value.unshift({
                    id: Date.now(),
                    content: message.value,
                    time: new Date().toLocaleString(),
                    status: 'failed'
                })
                showToast({
                    type: 'fail',
                    message: '发送失败：' + error.message
                })
            } finally {
                isSending.value = false
            }
        }

        // 定时任务功能
        const selectDateTime = (time) => {
            scheduleTime.value = time.toLocaleString()
            showDatetimePicker.value = false
        }

        const scheduleMessage = () => {
            if (!mainAccount.value || !message.value || !scheduleTime.value) {
                showToast('请填写完整信息')
                return
            }

            const task = {
                id: Date.now(),
                message: message.value,
                scheduledTime: scheduleTime.value,
                accountId: mainAccount.value.id
            }

            scheduledTasks.value.push(task)
            scheduleTask(task)
            saveData()

            message.value = ''
            scheduleTime.value = ''
            showToast('定时任务已创建')
        }

        const scheduleTask = (task) => {
            const timeUntil = new Date(task.scheduledTime) - new Date()
            if (timeUntil > 0) {
                setTimeout(async () => {
                    try {
                        // 执行发送
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        messageHistory.value.unshift({
                            id: Date.now(),
                            content: task.message,
                            time: new Date().toLocaleString(),
                            status: 'success'
                        })
                        // 移除已完成的任务
                        scheduledTasks.value = scheduledTasks.value.filter(t => t.id !== task.id)
                        saveData()
                    } catch (error) {
                        showToast({
                            type: 'fail',
                            message: '定时任务执行失败'
                        })
                    }
                }, timeUntil)
            }
        }

        const deleteTask = (taskId) => {
            scheduledTasks.value = scheduledTasks.value.filter(t => t.id !== taskId)
            saveData()
            showToast('任务已取消')
        }

        // 在线状态检查
        const startStatusCheck = () => {
            setInterval(() => {
                accountGroups.value.forEach(group => {
                    group.accounts.forEach(account => {
                        // 模拟随机在线状态
                        account.online = Math.random() > 0.2
                    })
                })
            }, 30000) // 每30秒检查一次
        }

        // 初始化
        initData()

        return {
            // 状态
            currentPage,
            isSending,
            accountGroups,
            messageHistory,
            scheduledTasks,
            settings,
            mainAccount,

            // 表单数据
            newAccount,
            newGroupName,
            message,
            scheduleTime,

            // 弹窗控制
            showAddDialog,
            showAddGroupDialog,
            showGroupPicker,
            showScheduleDialog,
            showDatetimePicker,

            // 方法
            saveGroup,
            selectGroup,
            saveAccount,
            setMainAccount,
            sendMessage,
            selectDateTime,
            scheduleMessage,
            deleteTask
        }
    }
})

app.use(vant)
app.mount('#app') 