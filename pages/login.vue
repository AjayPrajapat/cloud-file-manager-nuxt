<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div class="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
      <div class="hidden h-full flex-col justify-between bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-8 text-white md:flex">
        <div>
          <h1 class="text-2xl font-bold">Cloud File Manager</h1>
          <p class="mt-3 text-sm text-primary-100">Upload, organize, and collaborate on documents securely with AI-powered automation.</p>
        </div>
        <ul class="space-y-4 text-sm">
          <li class="flex items-center gap-2"><span class="text-lg">🔒</span> Secure JWT authentication</li>
          <li class="flex items-center gap-2"><span class="text-lg">🤖</span> Smart AI tagging & summaries</li>
          <li class="flex items-center gap-2"><span class="text-lg">📄</span> Rich previews for PDF, images, markdown</li>
        </ul>
      </div>
      <div class="p-8">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">{{ mode === 'login' ? 'Welcome back' : 'Create an account' }}</h2>
        <p class="mt-1 text-sm text-slate-500">Use the seeded accounts to explore: admin@example.com / admin123</p>
        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
          <div v-if="mode === 'signup'" class="space-y-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</label>
            <input v-model="form.name" class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900" placeholder="Ada Admin" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
            <input v-model="form.email" class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900" placeholder="you@example.com" type="email" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
            <input v-model="form.password" class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900" placeholder="••••••••" type="password" />
          </div>
          <div v-if="mode === 'signup'" class="space-y-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</label>
            <select v-model="form.role" class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            class="w-full rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="auth.loading"
            type="submit"
          >
            {{ auth.loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Create account' }}
          </button>
          <p v-if="auth.error" class="text-sm text-red-500">{{ auth.error }}</p>
        </form>
        <p class="mt-6 text-center text-xs text-slate-500">
          {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
          <button class="font-semibold text-primary-600" @click="toggleMode">
            {{ mode === 'login' ? 'Sign up' : 'Sign in' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()

const mode = ref<'login' | 'signup'>('login')

const form = reactive({
  name: 'Ada Admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
})

watch(
  () => auth.isAuthenticated,
  (value) => {
    if (value) {
      router.push('/dashboard')
    }
  },
  { immediate: true }
)

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
}

async function handleSubmit() {
  try {
    if (mode.value === 'login') {
      await auth.login({ email: form.email, password: form.password })
    } else {
      await auth.signup({ ...form })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
