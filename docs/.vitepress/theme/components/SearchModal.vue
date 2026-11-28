<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { withBase } from "vitepress";
import { notes } from "../data/notes";
import Icon from "./Icon.vue";

const open = defineModel<boolean>("open", { default: false });
const query = ref("");
const input = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const results = ref<{ title: string; url: string; excerpt: string }[]>([]);
const activeIndex = ref(0);
let pagefind: any = null;
let pagefindTried = false;

const fallback = computed(() => {
	const keyword = query.value.trim().toLowerCase();
	if (!keyword) return [];
	return notes
		.filter(
			(note) =>
				note.title.toLowerCase().includes(keyword) ||
				note.dir.toLowerCase().includes(keyword) ||
				note.tags.some((tag) => tag.toLowerCase().includes(keyword)),
		)
		.slice(0, 10)
		.map((note) => ({ title: note.title, url: note.url, excerpt: note.dir }));
});

async function loadPagefind() {
	if (pagefindTried) return;
	pagefindTried = true;
	try {
		const pagefindUrl = "/pagefind/pagefind.js";
		const mod = await import(/* @vite-ignore */ pagefindUrl);
		await mod.init();
		pagefind = mod;
	} catch {
		// dev 或没有索引时退回本地标题搜索
		pagefind = null;
	}
}

async function runSearch() {
	if (!query.value.trim()) {
		results.value = [];
		return;
	}
	loading.value = true;
	try {
		if (!pagefind) {
			results.value = fallback.value;
			return;
		}
		const search = await pagefind.search(query.value.trim());
		const items = await Promise.all(
			search.results.slice(0, 10).map(async (item: any) => {
				const data = await item.data();
				return {
					title: data.meta?.title || "未命名",
					url: data.url,
					excerpt: data.excerpt?.replace(/<[^>]+>/g, "") || "",
				};
			}),
		);
		results.value = items;
	} finally {
		loading.value = false;
		activeIndex.value = 0;
	}
}

watch(query, runSearch);

watch(open, async (value) => {
	if (!value) return;
	await loadPagefind();
	await nextTick();
	input.value?.focus();
	if (!query.value) results.value = [];
});

function close() {
	open.value = false;
}

function go(url: string) {
	window.location.href = withBase(url);
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === "Escape") close();
	if (event.key === "ArrowDown") {
		event.preventDefault();
		activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1);
	}
	if (event.key === "ArrowUp") {
		event.preventDefault();
		activeIndex.value = Math.max(activeIndex.value - 1, 0);
	}
	if (event.key === "Enter" && results.value[activeIndex.value]) {
		go(results.value[activeIndex.value].url);
	}
}
</script>

<template>
	<Teleport to="body">
		<div v-if="open" class="kb-search-modal" @click.self="close">
			<div class="kb-search-panel" role="dialog" aria-modal="true" aria-label="搜索笔记">
				<div class="kb-search-input-row">
					<Icon name="search" :size="18" />
					<input
						ref="input"
						v-model="query"
						type="search"
						placeholder="搜索标题、目录或标签…"
						aria-label="搜索笔记"
						@keydown="onKeydown"
					/>
					<button class="kb-search-cancel" type="button" @click="close">ESC</button>
				</div>

				<div class="kb-search-results">
					<p v-if="loading" class="kb-search-hint">搜索中…</p>
					<p v-else-if="!query.trim()" class="kb-search-hint">输入关键词开始搜索</p>
					<p v-else-if="!results.length" class="kb-search-hint">没有找到相关笔记</p>
					<a
						v-for="(result, index) in results"
						:key="result.url"
						class="kb-search-result"
						:class="{ active: index === activeIndex }"
						:href="withBase(result.url)"
						@mouseenter="activeIndex = index"
						@click.prevent="go(result.url)"
					>
						<strong>{{ result.title }}</strong>
						<span v-if="result.excerpt">{{ result.excerpt }}</span>
					</a>
				</div>

				<div class="kb-search-foot">
					<span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
					<span><kbd>Enter</kbd> 打开</span>
					<span><kbd>Esc</kbd> 关闭</span>
				</div>
			</div>
		</div>
	</Teleport>
</template>
