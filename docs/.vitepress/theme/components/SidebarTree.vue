<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, withBase } from "vitepress";
import { notes } from "../data/notes";
import Icon from "./Icon.vue";
import SidebarNode from "./SidebarNode.vue";
import type { TreeNode } from "../types";
import { useSidebarState } from "../composables/useSidebarState";

const route = useRoute();
const { open, mobileOpen, closeMobile, expandDirs, collapseAll } = useSidebarState();const query = ref("");

function createRoot(): TreeNode {
	return { name: "", path: "", dirs: [], notes: [] };
}

function buildTree(): TreeNode {
	const root = createRoot();
	for (const note of notes) {
		const parts = note.dir ? note.dir.split("/") : [];
		let node = root;
		let path = "";
		for (const part of parts) {
			path = path ? `${path}/${part}` : part;
			let dir = node.dirs.find((item) => item.name === part);
			if (!dir) {
				dir = { name: part, path, dirs: [], notes: [] };
				node.dirs.push(dir);
			}
			node = dir;
		}
		node.notes.push(note);
	}
	sortTree(root);
	return root;
}

function sortTree(node: TreeNode) {
	node.dirs.sort((a, b) => a.name.localeCompare(b.name, "zh", { numeric: true }));
	node.notes.sort((a, b) =>
		a.filename.localeCompare(b.filename, "zh", { numeric: true }),
	);
	for (const dir of node.dirs) sortTree(dir);
}

const tree = buildTree();

const filteredTree = computed(() => {
	const keyword = query.value.trim().toLowerCase();
	if (!keyword) return tree;
	return filterTree(tree, keyword);
});

function filterTree(node: TreeNode, keyword: string): TreeNode | null {
	const dirs = node.dirs
		.map((dir) => filterTree(dir, keyword))
		.filter((dir): dir is TreeNode => !!dir);
	const notesMatched = node.notes.filter(
		(note) =>
			note.title.toLowerCase().includes(keyword) ||
			note.filename.toLowerCase().includes(keyword),
	);
	if (node.name.toLowerCase().includes(keyword)) {
		return node;
	}
	if (dirs.length === 0 && notesMatched.length === 0) return null;
	return { ...node, dirs, notes: notesMatched };
}

function ancestorsOfCurrent(): string[] {
	const current = decodeURIComponent(route.path);
	const note = notes.find((item) => decodeURIComponent(item.url) === current);
	if (!note) return [];
	const parts = note.dir ? note.dir.split("/") : [];
	return parts.map((_, index) => parts.slice(0, index + 1).join("/"));
}

onMounted(() => {
	expandDirs(ancestorsOfCurrent());
});
</script>

<template>
	<aside
		class="kb-sidebar"
		:class="{ 'is-open': mobileOpen, 'is-collapsed': !open }"
		aria-label="笔记目录"
		data-pagefind-ignore
	>
		<div class="kb-sidebar-head">
			<div class="kb-sidebar-title">
				<Icon name="folder" :size="15" />
				<span>目录</span>
			</div>
			<div class="kb-sidebar-head-actions">
				<button
					class="kb-icon-btn kb-sidebar-collapse"
					type="button"
					title="折叠全部目录"
					aria-label="折叠全部目录"
					@click="collapseAll"
				>
					<Icon name="chevrons-up-down" :size="20" />
				</button>
				<button class="kb-icon-btn kb-mobile-only" type="button" aria-label="关闭目录" @click="closeMobile">
					<Icon name="x" />
				</button>
			</div>
		</div>

		<label class="kb-sidebar-filter">
			<Icon name="search" :size="14" />
			<input v-model="query" type="search" placeholder="筛选笔记" aria-label="筛选笔记" />
		</label>

		<nav class="kb-tree">
			<ul class="kb-tree-root">
				<li>
					<a
						class="kb-tree-row kb-tree-home"
						:class="{ active: route.path === '/' }"
						:href="withBase('/')"
						@click="closeMobile"
					>
						<Icon name="home" :size="15" />
						<span class="kb-tree-label">首页</span>
					</a>
				</li>
				<SidebarNode
					v-for="dir in filteredTree.dirs"
					:key="dir.path"
					:node="dir"
					:level="0"
					:force-open="!!query.trim()"
				/>
				<li v-for="note in filteredTree.notes" :key="note.url">
					<a
						class="kb-tree-row kb-tree-note"
						:class="{ active: decodeURIComponent(route.path) === decodeURIComponent(note.url) }"
						:href="note.url"
						:style="{ paddingLeft: '24px' }"
						@click="closeMobile"
					>
						<Icon name="file" :size="14" class="kb-tree-file" />
						<span class="kb-tree-label">{{ note.title }}</span>
					</a>
				</li>
			</ul>
			<p v-if="!filteredTree.dirs.length && !filteredTree.notes.length" class="kb-tree-empty">
				没有匹配的笔记
			</p>
		</nav>

		<footer class="kb-sidebar-foot">
			共 {{ notes.length }} 篇笔记
		</footer>
	</aside>
	<div v-if="mobileOpen" class="kb-overlay" @click="closeMobile" />
</template>
