<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import Icon from "./Icon.vue";

const { page, theme } = useData();

const date = computed(() => {
	const value = page.value.frontmatter.date;
	if (value === false || !value) return "";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return String(value);
	return `${parsed.getFullYear()}年${parsed.getMonth() + 1}月${parsed.getDate()}日`;
});

const tags = computed(() => {
	const value = page.value.frontmatter.tags;
	if (Array.isArray(value)) return value.map(String);
	return [];
});
</script>

<template>
	<div class="kb-doc-meta">
		<span class="kb-doc-meta-item">
			<img class="kb-doc-avatar" :src="'/logo.webp'" alt="" width="20" height="20" />
			{{ theme.author || "团子和蛋糕" }}
		</span>
		<span v-if="date" class="kb-doc-meta-item">
			<Icon name="clock" :size="14" />
			{{ date }} 修改
		</span>
		<span v-if="tags.length" class="kb-doc-meta-tags">
			<a v-for="tag in tags" :key="tag" class="kb-tag" :href="`/?tag=${encodeURIComponent(tag)}`">
				<Icon name="tag" :size="12" />{{ tag }}
			</a>
		</span>
	</div>
</template>
