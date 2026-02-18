<script setup>
import { AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  modelToDelete: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  messages: {
    type: String,
    required: true
  },
  messages2: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['confirm', 'close']);

const handleDelete = () => {
  emit('confirm');
};

const closeDeleteModal = () => {
  emit('close');
};

</script>

<template>
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl scale-in-center">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">{{ props.title }}</h3>
            <p class="text-sm text-slate-500">{{ props.messages2 }}</p>
          </div>
        </div>
        <p class="text-slate-600 mb-6">
          {{ props.messages }}<span class="font-semibold text-slate-900">{{ props.modelToDelete?.name || props.modelToDelete?.nombre }}</span>?
        </p>
        <div class="flex gap-3">
          <button @click="closeDeleteModal" class="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button @click="handleDelete" class="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            Eliminar
          </button>
        </div>
      </div>
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
