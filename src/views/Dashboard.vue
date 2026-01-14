<script setup>
import { UserPlus } from 'lucide-vue-next';
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p class="text-slate-500 text-sm">Todo el control en un lugar.</p>
      </div>
      <button class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95">
        <UserPlus class="w-5 h-5" />
        <span>Nueva Acción</span>
      </button>
    </div>

    <!-- Estadísticas Rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <UserPlus class="w-6 h-6" />
          </div>
          <span class="text-emerald-500 text-sm font-bold">+12%</span>
        </div>
        <h3 class="text-slate-500 text-sm font-medium">Estadística {{ i }}</h3>
        <p class="text-2xl font-bold text-slate-900 mt-1">1,234</p>
      </div>
    </div>
  </div>
</template>