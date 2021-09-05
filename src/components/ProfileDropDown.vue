<template>
  <div
    data-testid="profile-dropdown"
    class="absolute right-0 text-black bg-white border border-gray-400 rounded shadow-sm  top-full w-max"
  >
    <ul>
      <ul class="profileList">
        <router-link data-testid="profile-link" to="/profile_show">
          プロフィールを見る
        </router-link>
      </ul>
      <ul class="profileList">
        <router-link to="/profile_edit"> プロフィールを編集する </router-link>
      </ul>
      <ul class="profileList">
        <router-link to="/password_edit"> パスワードを変更する </router-link>
      </ul>
      <ul data-testid="logout-button" @click="onLogout" class="profileList">
        ログアウトする
      </ul>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ProfileDropDown',
  props: ['onLogout'],
};
</script>
<style scoped>
.profileList {
  @apply w-full border-b pl-2 mr-4 py-2 text-gray-800
    text-lg hover:bg-gray-100 cursor-pointer;
}
</style>
