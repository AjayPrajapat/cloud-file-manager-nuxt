const toasts = ref<{ id: number; message: string; type: 'success' | 'error' }[]>([])
let counter = 0

export function useToast() {
  function push(message: string, type: 'success' | 'error' = 'success', timeout = 4000) {
    const id = counter++
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), timeout)
  }

  function dismiss(id: number) {
    const index = toasts.value.findIndex(item => item.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return { toasts, push, dismiss }
}
