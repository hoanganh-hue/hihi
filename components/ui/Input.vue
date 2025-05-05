<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm text-gray-400 mb-1">{{ label }}</label>
    <div class="relative">
      <div v-if="prefixIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <slot name="prefix-icon"></slot>
      </div>
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-[#222] border border-[#333] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500 transition-all duration-300"
        :class="[
          prefixIcon ? 'pl-10' : '',
          suffixIcon ? 'pr-10' : '',
          className
        ]"
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <div v-if="suffixIcon" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <slot name="suffix-icon"></slot>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'UiInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: Boolean,
      default: false
    },
    suffixIcon: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
}
</script>
