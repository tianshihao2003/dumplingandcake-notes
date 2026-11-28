<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vitepress";
import Icon from "./Icon.vue";
import { useSidebarState } from "../composables/useSidebarState";
import type { Note } from "../data/notes";
import type { TreeNode } from "../types";

const props = defineProps<{ node: TreeNode; level: number; forceOpen?: boolean }>();
const route = useRoute();
const { isExpanded, toggleDir, closeMobile } = useSidebarState();

const expanded = computed(() => props.forceOpen || isExpanded(props.node.path));
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

function isActive(note: Note) {
	return decodeURIComponent(route.path) === decodeURIComponent(note.url);
}
</script>

<template>
	<li class="kb-tree-dir">
		<button
			class="kb-tree-row kb-tree-dir-row"
			type="button"
			:style="{ paddingLeft: `${10 + level * 14}px` }"
			:aria-expanded="expanded"
			@click="toggleDir(node.path)"
		>
			<Icon :name="expanded ? 'chevron-down' : 'chevron-right'" :size="13" class="kb-tree-chevron" />
			<Icon name="folder" :size="15" class="kb-tree-folder" />
			<span class="kb-tree-label">{{ node.name }}</span>
			<em class="kb-tree-count">{{ count }}</em>
		</button>

		<ul v-if="expanded" class="kb-tree-children">
			<SidebarNode
				v-for="dir in node.dirs"
				:key="dir.path"
				:node="dir"
				:level="level + 1"
				:force-open="forceOpen"
			/>
			<li v-for="note in node.notes" :key="note.url">
				<a
					class="kb-tree-row kb-tree-note"
					:class="{ active: isActive(note) }"
					:href="note.url"
					:style="{ paddingLeft: `${24 + level * 14}px` }"
					:title="note.filename"
					@click="closeMobile"
				>
					<Icon name="file" :size="14" class="kb-tree-file" />
					<span class="kb-tree-label">{{ note.title }}</span>
				</a>
			</li>
		</ul>
	</li>
</template>
