<template>
  <div class="flex flex-col mb-2">
    <label class="mb-2" :for="id">{{ name }}:</label>
    <input
      :id="id"
      :type="type"
      class="formInput"
      @input="onInput"
      :value="modelValue"
      :data-testid="testid"
    />
    <span class="text-red-600">{{ error.join(' ') }}</span>
  </div>
</template>
<script>
import { computed } from 'vue';
export default {
  props: ['name', 'id', 'error', 'modelValue'],
  emits: ['custom-input'],
  setup(props, { emit }) {
    const type = computed(() => {
      return props.id.includes('password') ? 'password' : 'text';
    });
    const onInput = (e) => {
      emit('custom-input', e.target.value);
    };
    const testid = computed(() => `${props.id}-input`);
    return {
      type,
      testid,
      onInput,
    };
  },
};
</script>
<style scoped>
.formInput {
  @apply w-full px-2 py-1 mx-2 border-2 border-gray-200 rounded focus:outline-none focus:border-gray-400;
}
</style>
