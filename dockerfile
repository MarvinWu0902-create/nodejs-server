# 使用官方 Node.js 鏡像
FROM node:16

# 設置工作目錄
WORKDIR /usr/src/app

# 複製 package.json 並安裝依賴
COPY package*.json ./
RUN npm install

# 複製代碼
COPY . .

# 安裝 PM2
RUN npm install pm2 -g

# 暴露應用的端口
EXPOSE 3000

# 使用 PM2 啟動應用
CMD ["pm2-runtime", "app.js"]
