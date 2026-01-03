<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <router-view />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue';
import api from './api/axios';
import { useRouter } from 'vue-router';

const router = useRouter()

const auth = useAuthStore();

onMounted(() => {
  verifyToken()
})

const verifyToken = async () => {
  try {
    const response = await api.post('me');
    console.log(response.data)
    if (response.data.status == false) {
      console.log(23)
      router.push('/login');
    }else{
      console.log(response.data.auth)
      auth.setAuthUser(response.data.auth);
      router.push('/dashboard');
    }
  } catch (error) {
    console.error(error);
  }
}

</script>