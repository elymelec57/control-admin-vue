<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Settings, Pencil, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open-edit-modal', 'confirm-delete', 'toggle']);

const buttonRef = ref(null);
const activeMenuId = ref(null);
const menuStyle = ref({
  top: '0px',
  left: '0px'
});

const updatePosition = () => {
  if (buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect();
    menuStyle.value = {
      top: `${rect.bottom + window.scrollY + 8}px`,
      left: `${rect.right - 192}px`, // 192px is w-48
    };
  }
};

const handleToggle = (id) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null;
  } else {
    updatePosition();
    activeMenuId.value = id;
  }
};

const openEditModal = (item) => {
  activeMenuId.value = null;
  emit('open-edit-modal', item);
};

const confirmDelete = (item) => {
  activeMenuId.value = null;
  emit('confirm-delete', item);
};

// Update position if window is resized or scrolled
const handleScrollOrResize = () => {
  if (activeMenuId.value === props.item.id) {
    updatePosition();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScrollOrResize, true);
  window.addEventListener('resize', handleScrollOrResize);
  window.addEventListener('click', handleWindowClick);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollOrResize, true);
  window.removeEventListener('resize', handleScrollOrResize);
  window.removeEventListener('click', handleWindowClick);
});

watch(() => activeMenuId.value, (newVal) => {
  if (newVal === props.item.id) {
    nextTick(updatePosition);
  }
});

// Cerrar menús al hacer clic en cualquier lugar
const handleWindowClick = (event) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target)) {
    activeMenuId.value = null;
  }
};
</script>

<template>
  <div class="relative inline-block text-left menu-container">
    <button 
      ref="buttonRef"
      @click.stop="handleToggle(props.item.id)"
      class="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none"
    >
      <Settings class="w-5 h-5" />
    </button>
    
    <!-- Dropdown Menu Teleported to Body -->
    <Teleport to="body">
      <div 
        v-if="activeMenuId === item.id"
        class="absolute w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-[90] py-2 overflow-hidden scale-in-center"
        :style="menuStyle"
      >
        <button 
          @click="openEditModal(item)"
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
        >
          <Pencil class="w-4 h-4" />
          Editar
        </button>
        <button 
          @click="confirmDelete(item)"
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
        >
          <Trash2 class="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.scale-in-center {
	animation: scale-in-center 0.15s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@keyframes scale-in-center {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
