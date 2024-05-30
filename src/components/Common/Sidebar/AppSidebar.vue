<template>
  <aside class="sidebar">
    <nav class="py-4">
      <ul class="list-none mt-0">
        <SidebarLink v-for="item in menuItems" :key="item.path" :item="item" />
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import SidebarLink from './SidebarLink.vue';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'clone' },
];

</script>

<style scoped>
.sidebar {
  @apply fixed z-50 flex min-w-[240px] flex-col border-r border-solid border-gray-200 bg-white h-full;
}
</style>
