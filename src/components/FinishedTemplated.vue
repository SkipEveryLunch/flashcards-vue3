<template>
  <div
    data-testid="study-finish-message"
    class="py-4 m-4 text-white bg-gray-900 rounded-lg px-7"
  >
    本日の学習は終了しました。
    <div class="flex justify-center mt-5">
      <button class="mr-2 btn btn-primary" @click="onSubmit">同期</button>
      <router-link to="/">
        <button class="btn btn-sub-white">戻る</button>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  props: ['submit'],
  setup(_, { emit }) {
    const onSubmit = () => {
      emit('submit');
    };
    return {
      onSubmit,
    };
  },
};
</script>
