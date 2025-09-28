<template>
  <div class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Folders</h3>
    <ul class="mt-4 space-y-1 text-sm">
      <FolderNode
        v-for="folder in tree"
        :key="folder.id"
        :folder="folder"
        :active-id="modelValue"
        @select="$emit('update:modelValue', $event)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { FolderItem } from '~/server/types'

interface TreeFolder extends FolderItem {
  children?: TreeFolder[]
}

withDefaults(defineProps<{ tree: TreeFolder[]; modelValue?: string }>(), { modelValue: 'root' })

defineEmits<{ (event: 'update:modelValue', value: string): void }>()
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import type { FolderItem } from '~/server/types'

interface TreeFolder extends FolderItem {
  children?: TreeFolder[]
}

export default {}

export const FolderNode = defineComponent({
  name: 'FolderNode',
  props: {
    folder: { type: Object as () => TreeFolder, required: true },
    activeId: { type: String, required: true }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const expanded = ref(true)

    function toggle() {
      expanded.value = !expanded.value
    }

    function select() {
      emit('select', props.folder.id)
    }

    return () => (
      <li>
        <div
          class={[
            'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition',
            props.activeId === props.folder.id
              ? 'bg-primary-500/10 font-semibold text-primary-600'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          ]}
        >
          <div class="flex items-center gap-2" onClick={select}>
            <span class="text-lg">📁</span>
            <span>{props.folder.name}</span>
          </div>
          {props.folder.children?.length ? (
            <button class="text-xs text-slate-400" onClick={toggle}>
              {expanded.value ? '−' : '+'}
            </button>
          ) : null}
        </div>
        {props.folder.children?.length && expanded.value ? (
          <ul class="ml-4 border-l border-dashed border-slate-200 pl-3">
            {props.folder.children.map(child => (
              <FolderNode
                key={child.id}
                folder={child}
                activeId={props.activeId}
                onSelect={(id: string) => emit('select', id)}
              />
            ))}
          </ul>
        ) : null}
      </li>
    )
  }
})
</script>
