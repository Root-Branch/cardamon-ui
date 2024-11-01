<template>
    <li class="sidebar-link">
        <router-link :to="item.path" class="sidebar-link__link" :class="{ 'sidebar-link__link--active': isActive }">
            <div class="sidebar-link__content">
                <font-awesome-icon :icon="['fas', item.icon]" class="sidebar-link__icon" />
                <span class="sidebar-link__label">{{ item.label }}</span>
            </div>
        </router-link>
    </li>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { defineProps, computed } from 'vue';
import { useRoute } from 'vue-router';

interface MenuItem {
    path: string;
    label: string;
    icon: string;
}

const props = defineProps<{
    item: MenuItem;
}>();

const route = useRoute();
const isActive = computed(() => route.path === props.item.path);
</script>

<style scoped>
.sidebar-link {
    @apply px-4 py-3 text-left 
}

.sidebar-link__link {
    @apply flex items-center justify-between rounded-lg px-4 py-2 transition duration-150 ease-in-out dark:text-white dark:hover:bg-blue-700 dark:hover:bg-opacity-80;
}

.sidebar-link__link--active {
    @apply bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-white;
}

.sidebar-link__content {
    @apply flex items-center;
}

.sidebar-link__icon {
    @apply mr-2 dark:text-white;
}

.sidebar-link__label {
    @apply ml-2;
}
</style>
