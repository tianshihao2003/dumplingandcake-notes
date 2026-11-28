<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useData, useRoute } from "vitepress";
import Icon from "./Icon.vue";
import { useActiveHeading } from "../composables/useActiveHeading";

const { page, theme } = useData();
const route = useRoute();
const open = ref(true);
const KEY = "kb:outline-open";
const domHeaders = ref<{ level: number; title: string; slug: string; link: string }[]>([]);

const levels = computed<number[]>(() => theme.value.outline ?? [2, 3]);
const headers = computed(() => {
	const source = page.value.headers?.length ? page.value.headers : domHeaders.value;
	return source.filter((header) => levels.value.includes(header.level));
});
const active = useActiveHeading(headers);

function scan() {
	if (typeof document === "undefined") return;
	const nodes = document.querySelectorAll<HTMLElement>(".kb-doc-body h2, .kb-doc-body h3");
	domHeaders.value = [...nodes].map((node) => ({
		level: Number(node.tagName.slice(1)),
		title: node.textContent?.replace(/#$/, "").trim() ?? "",
		slug: node.id,
		link: `#${node.id}`,
	}));
}

onMounted(() => {
	try {
		const saved = localStorage.getItem(KEY);
		if (saved !== null) open.value = saved === "1";
	} catch {
		// 忽略
	}
	scan();
	watch(
		() => route.path,
		async () => {
			await nextTick();
			scan();
		},
		{ flush: "post" },
	);
});

function toggle() {
	open.value = !open.value;
	try {
		localStorage.setItem(KEY, open.value ? "1" : "0");
	} catch {
		// 忽略
	}
}
</script>

<template>
	<aside v-if="headers.length" class="kb-outline" :class="{ 'is-closed': !open }" aria-label="本页目录" data-pagefind-ignore>
		<div class="kb-outline-top">
			<button
				class="kb-outline-toggle"
				type="button"
				:title="open ? '收起目录' : '展开目录'"
				:aria-label="open ? '收起目录' : '展开目录'"
				:aria-expanded="open"
				@click="toggle"
			>
				<Icon :name="open ? 'chevrons-left' : 'menu'" :size="16" />
			</button>
			<span v-if="open" class="kb-outline-title">本页目录</span>
		</div>
		<nav v-if="open">
			<ul class="kb-outline-list">
				<li
					v-for="header in headers"
					:key="header.slug"
					:class="[`level-${header.level}`, { active: active === header.slug }]"
				>
					<a :href="header.link" @click="active = header.slug">{{ header.title }}</a>
				</li>
			</ul>
		</nav>
	</aside>
</template>
