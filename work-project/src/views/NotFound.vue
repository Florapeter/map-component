<template>
  <div class="notfound-view">
    <div class="notfound-icon">😕</div>
    <h1>404</h1>
    <p class="notfound-message">抱歉，您访问的页面不存在</p>
    <router-link to="/" class="notfound-btn">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// 404 页面逻辑
</script>

<style scoped lang="less">
.notfound-view {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
  color: #444;
}
.notfound-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
h1 {
  font-size: 64px;
  margin: 0 0 8px 0;
  font-weight: bold;
  color: #ff6f61;
}
.notfound-message {
  font-size: 20px;
  margin-bottom: 32px;
}
.notfound-btn {
  display: inline-block;
  padding: 10px 32px;
  background: #ff6f61;
  color: #fff;
  border-radius: 24px;
  text-decoration: none;
  font-size: 16px;
  transition: background 0.2s;
}
.notfound-btn:hover {
  background: #ff3b2f;
}
</style> 