<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { notes } from "../data/notes";
import type { TreeNode } from "../types";
import HomeNode from "./HomeNode.vue";
import Icon from "./Icon.vue";

const { site, theme } = useData();

const visible = computed(() => notes.filter((note) => !note.hidden && note.date));

const totalWords = computed(() =>
	visible.value.reduce((total, note) => total + (note.words || 0), 0),
);

const tree = computed(() => {
	const root: TreeNode = { name: "", path: "", dirs: [], notes: [] };
	for (const note of visible.value) {
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
});

function sortTree(node: TreeNode) {
	node.dirs.sort((a, b) => a.name.localeCompare(b.name, "zh", { numeric: true }));
	node.notes.sort((a, b) => a.filename.localeCompare(b.filename, "zh", { numeric: true }));
	for (const dir of node.dirs) sortTree(dir);
}
</script>

<template>
	<div class="kb-home">
		<header class="kb-home-head">
			<div class="kb-home-title-row">
				<span class="kb-home-icon">📘</span>
				<h1>{{ theme.siteTitle || site.title }}</h1>
			</div>

			<div class="kb-home-stats">
				<span><strong>{{ visible.length }}</strong> 文档</span>
				<span><strong>{{ totalWords.toLocaleString("zh-CN") }}</strong> 字</span>
			</div>

			<img class="kb-home-avatar" :src="withBase('/logo.webp')" alt="" width="36" height="36" />

			<div class="kb-home-welcome">
				<h2>{{ theme.welcomeTitle || "👋 欢迎来到知识库" }}</h2>
				<p>{{ theme.welcomeText || "知识库就像书一样，让多篇文档结构化，方便知识的创作与沉淀" }}</p>
			</div>
		</header>

		<ul class="kb-home-tree">
			<HomeNode
				v-for="(dir, index) in tree.dirs"
				:key="dir.path"
				:node="dir"
				:level="0"
				:default-open="index === 0"
			/>
			<li v-for="note in tree.notes" :key="note.url">
				<a class="kb-home-note kb-home-note-root" :href="note.url">
					<Icon name="file" :size="15" class="kb-home-file" />
					<span class="kb-home-note-title">{{ note.title }}</span>
					<span class="kb-home-leader" aria-hidden="true" />
					<time class="kb-home-note-date">{{ note.date }}</time>
				</a>
			</li>
		</ul>
	</div>
</template>
