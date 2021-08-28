<template>
  <nav
    data-testid="header"
    class="flex justify-between px-3 text-xl text-white bg-gray-900"
  >
    <div class="flex space-x-1">
      <div class="flex items-center px-2 py-5">
        <router-link to="/">
          <span>💡</span>
          <span>Fla$hApp</span>
        </router-link>
      </div>
      <div class="flex items-center px-2 py-5">
        <a class="px-2">セクション</a>
        <a class="px-2">今日の宿題</a>
      </div>
    </div>
    <div>
      <div class="flex items-center px-2 py-5">
        <router-link data-testid="login-link" to="/login" class="px-2 pr-4"
          >ログイン</router-link
        >
        <router-link
          to="/register"
          class="px-2 py-2 text-yellow-700 bg-yellow-300 rounded-md"
          >新規登録</router-link
        >
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'Header',
};
</script>
