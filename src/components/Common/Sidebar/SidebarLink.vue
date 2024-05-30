<template>
    <li class="sidebar-link">
        <router-link :to="item.path" class="link" :class="{ 'active': isActive }">
            <div class="flex items-center">
                <font-awesome-icon :icon="['fas', item.icon]" class="icon" />
                <span class="ml-2">{{ item.label }}</span>
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
    @apply px-4 py-3 text-left;
}

.link {
    @apply flex items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-100 transition duration-150 ease-in-out;
}

.link.active {
    @apply bg-blue-100 text-blue-600;
}

.icon {
    @apply mr-2;
}
</style>