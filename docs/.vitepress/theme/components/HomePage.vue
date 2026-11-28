<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import { notes } from "../data/notes";

const { site, theme } = useData();

const visible = computed(() => notes.filter((note) => !note.hidden && note.date));

const recent = computed(() =>
	[...visible.value]
		.sort((a, b) => +new Date(b.date) - +new Date(a.date))
		.slice(0, 10),
);

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate(),
	).padStart(2, "0")}`;
}
</script>

<template>
	<div class="kb-home">
		<section class="kb-hero">
			<p class="kb-hero-eyebrow">学习笔记</p>
			<h1 class="kb-hero-title">{{ theme.siteTitle || site.title }}</h1>
			<p class="kb-hero-desc">{{ theme.tagline || site.description }}</p>
			<div class="kb-hero-stats">
				<span><strong>{{ visible.length }}</strong> 篇笔记</span>
			</div>
		</section>

		<section v-if="recent.length" class="kb-section">
			<div class="kb-section-head">
				<h2>最近更新</h2>
				<span>最新 {{ recent.length }} 篇</span>
			</div>
			<ul class="kb-recent-list">
				<li v-for="note in recent" :key="note.url">
					<a :href="note.url" class="kb-recent-link">
						<span class="kb-recent-title">{{ note.title }}</span>
						<span class="kb-recent-dots" aria-hidden="true" />
						<span class="kb-recent-date">{{ formatDate(note.date) }}</span>
					</a>
					<span class="kb-recent-dir">{{ note.dir }}</span>
				</li>
			</ul>
		</section>
	</div>
</template>
