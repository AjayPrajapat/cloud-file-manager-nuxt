<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950">
    <ToastContainer />
    <header class="border-b border-slate-200 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
              <path d="M7.5 7.5a4.5 4.5 0 0 1 8.74-1.5 3.75 3.75 0 0 1 5.76 2.96A3.75 3.75 0 0 1 21 18H6.75a4.5 4.5 0 0 1 .242-9 4.47 4.47 0 0 1 .508-.5Z" />
            </svg>
          </div>
          <div>
            <p class="text-lg font-semibold text-slate-900 dark:text-white">Nuxt Cloud File Manager</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Securely manage and preview your documents</p>
          </div>
        </div>
        <nav class="flex items-center gap-4 text-sm text-slate-500">
          <NuxtLink class="hover:text-primary-500" to="/dashboard">Dashboard</NuxtLink>
          <NuxtLink class="hover:text-primary-500" to="/login">Login</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-6 py-8">
      <slot />
    </main>
  </div>
</template>
