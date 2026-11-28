import raw from "./notes.json";

export interface Note {
	url: string;
	title: string;
	date: string;
	tags: string[];
	description: string;
	hidden: boolean;
	/** 笔记所在目录，相对 posts/，例如 编程学习/python/50-归档 */
	dir: string;
	filename: string;
}

export const notes = raw as Note[];
