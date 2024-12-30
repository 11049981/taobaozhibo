from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 使用简单的文件存储替代数据库
class Storage:
    def __init__(self):
        self.messages_file = "data/messages.json"
        self.accounts_file = "data/accounts.json"
        
    def load_messages(self):
        try:
            with open(self.messages_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
            
    def save_messages(self, messages):
        with open(self.messages_file, 'w', encoding='utf-8') as f:
            json.dump(messages, f, ensure_ascii=False)
            
    def load_accounts(self):
        try:
            with open(self.accounts_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
            
    def save_accounts(self, accounts):
        with open(self.accounts_file, 'w', encoding='utf-8') as f:
            json.dump(accounts, f, ensure_ascii=False)

storage = Storage()

# 数据模型
class Message(BaseModel):
    content: str
    accountId: int
    delay: Optional[int] = 1000

class Account(BaseModel):
    name: str
    isMain: Optional[bool] = False

# 消息相关接口
@app.post("/api/messages/send")
async def send_message(message: Message):
    messages = storage.load_messages()
    new_message = {
        "id": int(datetime.now().timestamp() * 1000),
        "content": message.content,
        "accountId": message.accountId,
        "time": datetime.now().isoformat(),
        "status": "sent"
    }
    messages.insert(0, new_message)
    storage.save_messages(messages)
    return {"success": True, "message": new_message}

@app.get("/api/messages/history")
async def get_messages(limit: int = 20):
    messages = storage.load_messages()
    return {"success": True, "messages": messages[:limit]}

# 账号相关接口
@app.post("/api/accounts")
async def add_account(account: Account):
    accounts = storage.load_accounts()
    new_account = {
        "id": int(datetime.now().timestamp() * 1000),
        "name": account.name,
        "isMain": account.isMain
    }
    accounts.append(new_account)
    storage.save_accounts(accounts)
    return {"success": True, "account": new_account}

@app.get("/api/accounts")
async def get_accounts():
    accounts = storage.load_accounts()
    return {"success": True, "accounts": accounts}

@app.put("/api/accounts/{account_id}/main")
async def set_main_account(account_id: int):
    accounts = storage.load_accounts()
    for acc in accounts:
        acc["isMain"] = (acc["id"] == account_id)
    storage.save_accounts(accounts)
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 