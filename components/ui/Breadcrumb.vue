<template>
  <nav aria-label="breadcrumb" class="breadcrumb-container">
    <ol class="breadcrumb">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="breadcrumb-item"
        :class="{ 'active': index === items.length - 1 }"
      >
        <router-link v-if="index < items.length - 1 && item.to" :to="item.to" class="breadcrumb-link">
          <component v-if="item.icon" :is="item.icon" class="breadcrumb-icon" />
          <span>{{ item.text }}</span>
        </router-link>
        <a v-else-if="index < items.length - 1 && item.href" :href="item.href" class="breadcrumb-link">
          <component v-if="item.icon" :is="item.icon" class="breadcrumb-icon" />
          <span>{{ item.text }}</span>
        </a>
        <span v-else class="breadcrumb-text">
          <component v-if="item.icon" :is="item.icon" class="breadcrumb-icon" />
          <span>{{ item.text }}</span>
        </span>
        
        <span v-if="index < items.length - 1" class="breadcrumb-separator">
          <component :is="separatorIcon || RightOutlined" v-if="separator === 'icon'" />
          <span v-else>{{ separator }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { RightOutlined } from '@ant-design/icons-vue';

defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(item => 'text' in item);
    }
  },
  separator: {
    type: String,
    default: 'icon',
    validator: (value) => typeof value === 'string'
  },
  separatorIcon: {
    type: Object,
    default: null
  }
});
</script>

<style scoped>
.breadcrumb-container {
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.breadcrumb-container::-webkit-scrollbar {
  display: none;
}

.breadcrumb {
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: nowrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #ec4899;
}

.breadcrumb-text {
  display: flex;
  align-items: center;
}

.breadcrumb-icon {
  margin-right: 0.25rem;
}

.breadcrumb-separator {
  color: #4b5563;
  margin: 0 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.breadcrumb-item.active {
  color: #ec4899;
  font-weight: 500;
}
</style>