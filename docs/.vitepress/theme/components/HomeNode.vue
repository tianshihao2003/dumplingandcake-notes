<script setup lang="ts">
import { computed, ref } from "vue";
import Icon from "./Icon.vue";
import type { TreeNode } from "../types";

const props = defineProps<{ node: TreeNode; level: number; defaultOpen?: boolean }>();
const open = ref(!!props.defaultOpen);

const count = computed(() => {
	let total = props.node.notes.length;
	for (const dir of props.node.dirs) total += countNode(dir);
	return total;
});

function countNode(node: TreeNode): number {
	let total = node.notes.length;
	for (const dir of node.dirs) total += countNode(dir);
	return total;
}

function formatDate(value: string) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return date.getFullYear() === new Date().getFullYear()
		? `${month}-${day}`
		: `${date.getFullYear()}-${month}-${day}`;
}
</script>

<template>
	<li class="kb-home-node">
		<button
			class="kb-home-dir"
			type="button"
			:style="{ paddingLeft: `${8 + level * 18}px` }"
			:aria-expanded="open"
			@click="open = !open"
		>
			<Icon :name="open ? 'chevron-down' : 'chevron-right'" :size="13" class="kb-home-chevron" />
			<Icon name="folder" :size="16" class="kb-home-folder" />
			<span class="kb-home-dir-name">{{ node.name }}</span>
			<span class="kb-home-dir-count">{{ count }}</span>
		</button>

		<ul v-if="open" class="kb-home-children">
			<HomeNode v-for="dir in node.dirs" :key="dir.path" :node="dir" :level="level + 1" />			<li v-for="note in node.notes" :key="note.url">
				<a
					class="kb-home-note"
					:href="note.url"
					:style="{ paddingLeft: `${30 + level * 18}px` }"
				>
					<Icon name="file" :size="15" class="kb-home-file" />
					<span class="kb-home-note-title">{{ note.title }}</span>
					<span class="kb-home-leader" aria-hidden="true" />
					<time class="kb-home-note-date">{{ formatDate(note.date) }}</time>
				</a>
			</li>
		</ul>
	</li>
</template>
