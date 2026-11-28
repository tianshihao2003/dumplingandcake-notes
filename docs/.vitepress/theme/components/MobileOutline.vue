<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vitepress";
import Icon from "./Icon.vue";

interface Header {
	level: number;
	title: string;
	slug: string;
}

const route = useRoute();
const headers = ref<Header[]>([]);

function scan() {
	if (typeof document === "undefined") return;
	const nodes = document.querySelectorAll<HTMLElement>(".kb-doc-body h2, .kb-doc-body h3");
	headers.value = [...nodes].map((node) => ({
		level: Number(node.tagName.slice(1)),
		title: node.textContent?.replace(/\u200b/g, "").trim() ?? "",
		slug: node.id,
	}));
}

onMounted(() => {
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
</script>

<template>
	<details v-if="headers.length" class="kb-mobile-outline">
		<summary>
			<span><Icon name="hash" :size="14" />本页目录</span>
			<em>{{ headers.length }}</em>
		</summary>
		<nav>
			<ul>
				<li v-for="header in headers" :key="header.slug" :class="`level-${header.level}`">
					<a :href="`#${header.slug}`">{{ header.title }}</a>
				</li>
			</ul>
		</nav>
	</details>
</template>
