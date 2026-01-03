import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthGuard = () => {
  const router = useRouter()

  const checkAuth = () => {
    const token = localStorage.getItem('jwt_token')
    if (!token) {
      router.push('/login')
    }
  }

  onMounted(() => {
    checkAuth()
  })

  return { checkAuth }
}