import { onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";

interface Header {
	level: number;
	title: string;
	slug: string;
	link: string;
}

/** 取「最后一个已经滚过标题栏」的标题作为当前小节。 */
export function useActiveHeading(headers: Ref<Header[]>) {
	const active = ref("");
	let ticking = false;

	function update() {
		ticking = false;
		if (typeof document === "undefined") return;
		let current = headers.value[0]?.slug ?? "";
		for (const header of headers.value) {
			const el = document.getElementById(header.slug);
			if (!el) continue;
			if (el.getBoundingClientRect().top <= 96) current = header.slug;
			else break;
		}
		active.value = current;
	}

	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	}

	onMounted(() => {
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		update();
	});

	watch(headers, () => requestAnimationFrame(update), { deep: true });

	onBeforeUnmount(() => {
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onScroll);
	});

	return active;
}
