<template>
  <button
    :class="[
      'rounded-lg transition-all duration-300 font-medium',
      variant === 'primary' ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white' : '',
      variant === 'secondary' ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' : '',
      variant === 'outline' ? 'bg-transparent border border-[#333] text-gray-300 hover:border-pink-500 hover:text-pink-500' : '',
      size === 'sm' ? 'px-3 py-1 text-sm' : '',
      size === 'md' ? 'px-4 py-2' : '',
      size === 'lg' ? 'px-6 py-3 text-lg' : '',
      block ? 'w-full' : '',
      className
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>
