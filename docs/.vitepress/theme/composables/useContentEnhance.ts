import { nextTick, onMounted, watch } from "vue";
import { useRoute } from "vitepress";

function enhance() {
	if (typeof document === "undefined") return;
	const root = document.querySelector<HTMLElement>(".kb-doc-body");
	if (!root) return;

	const title = document.querySelector(".kb-doc-title")?.textContent?.trim();
	const firstH1 = root.querySelector<HTMLElement>(":scope > h1");
	if (title && firstH1 && firstH1.textContent?.trim() === title) {
		root.classList.add("kb-drop-first-h1");
	}

	root.querySelectorAll<HTMLImageElement>("img").forEach((img, index) => {
		img.decoding = "async";
		img.loading = index === 0 ? "eager" : "lazy";
		if (index === 0) img.setAttribute("fetchpriority", "high");
		if (!img.getAttribute("width") && img.naturalWidth) {
			img.setAttribute("width", String(img.naturalWidth));
			img.setAttribute("height", String(img.naturalHeight));
		}
	});

	root.querySelectorAll<HTMLElement>("div[class*='language-']").forEach((block) => {
		if (block.querySelector(".kb-copy")) return;
		const code = block.querySelector("code");
		if (!code) return;
		const button = document.createElement("button");
		button.type = "button";
		button.className = "kb-copy";
		button.textContent = "复制";
		button.setAttribute("aria-label", "复制代码");
		button.addEventListener("click", async () => {
			try {
				await navigator.clipboard.writeText(code.innerText);
				button.textContent = "已复制";
			} catch {
				button.textContent = "复制失败";
			}
			setTimeout(() => {
				button.textContent = "复制";
			}, 1500);
		});
		block.appendChild(button);
	});
}

export function useContentEnhance() {
	const route = useRoute();
	onMounted(() => {
		watch(
			() => route.path,
			async () => {
				await nextTick();
				enhance();
			},
			{ immediate: true, flush: "post" },
		);
	});
}
