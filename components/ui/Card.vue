<template>
  <div 
    class="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl overflow-hidden border border-[#333] hover:border-pink-500/30 transition-all duration-300 group"
    :class="[className]"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'UiCard',
  props: {
    className: {
      type: String,
      default: ''
    }
  }
}
</script>
