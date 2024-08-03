<script setup>
import MenuIcon from './MenuIcon'
const props = defineProps(['children', 'ignore'])
</script>

<template>
    <template v-for="cur in children" :key="cur.name">
        <div v-power="cur.meta.permission">
            <a-menu-item :key="cur.name" v-if="ignore || cur.meta.hidden">
                <template #icon>
                    <MenuIcon :icon="cur.meta.icon" />
                </template>
                {{ cur.meta.title }}
            </a-menu-item>
        </div>
    </template>
</template>