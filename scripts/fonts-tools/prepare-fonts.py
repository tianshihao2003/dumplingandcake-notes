"""生成手绘图要用的手写体字体（一次性，需要联网 + Python 3）。

Excalidraw 的手写体是两套字：
  Excalifont（拉丁手写）+ Xiaolai SC（中文手写，LXGW 2020）
它们被官方拆成几百个 woff2 分片（Xiaolai 209 个 / Excalifont 7 个），
这里下载全部分片 → 合并成单个字体 → 裁到常用字，得到：

  scripts/fonts/Xiaolai-subset.woff2      约 1.4 MB
  scripts/fonts/Excalifont-subset.woff2   约 43 KB

之后 `node scripts/sync-notes.mjs` 会按每张图用到的字再裁一次（几 KB），
以 data URI 内嵌进生成的 SVG —— 因为站点里 SVG 是 <img> 引的，
属于隔离文档，外部字体/CSS 一律不生效。

**这两个文件不入库**（字体再分发要单独看授权），换机器或删掉了就重跑本脚本。

依赖：pip install fonttools brotli
用法：python scripts/fonts-tools/prepare-fonts.py
"""

import glob
import json
import os
import shutil
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from fontTools.merge import Merger
from fontTools.subset import Options, Subsetter, load_font, save_font
from fontTools.ttLib import TTFont

PKG = "https://unpkg.com/@excalidraw/excalidraw@0.18.1"
FONTS_URL = f"{PKG}/dist/prod/fonts"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.normpath(os.path.join(HERE, "..", "fonts"))
WORK = os.path.join(OUT_DIR, ".work")


def fetch(url, tries=3):
    last = None
    for _ in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            last = e
    raise last


def download_all():
    os.makedirs(WORK, exist_ok=True)
    jobs = []
    for fam in ("Xiaolai", "Excalifont"):
        meta = json.loads(fetch(f"{FONTS_URL}/{fam}/?meta"))
        names = [f["path"] for f in meta["files"] if f["path"].endswith(".woff2")]
        print(f"{fam}: {len(names)} 个分片")
        out = os.path.join(WORK, fam)
        os.makedirs(out, exist_ok=True)
        for n in names:
            dest = os.path.join(out, os.path.basename(n))
            if not os.path.exists(dest):
                jobs.append((n, dest))

    if not jobs:
        print("分片已缓存，跳过下载")
        return

    print(f"下载 {len(jobs)} 个分片…")

    def dl(job):
        n, dest = job
        data = fetch(PKG + "/" + n.lstrip("/"))
        with open(dest, "wb") as f:
            f.write(data)

    with ThreadPoolExecutor(max_workers=12) as ex:
        list(ex.map(dl, jobs))
    print("下载完成")


def build_charset():
    """ASCII + Latin-1 + 常用符号 + GB2312 汉字 + 笔记里实际出现的字符。"""
    chars = set(chr(c) for c in range(0x20, 0x100))
    for lo, hi in (
        (0x2000, 0x206F),  # 引号/破折号/省略号
        (0x2190, 0x21FF),  # 箭头
        (0x2200, 0x22FF),  # 数学符号
        (0x2460, 0x24FF),  # 带圈数字
        (0x25A0, 0x25FF),  # 几何图形
        (0x2600, 0x26FF),  # 杂项符号
        (0x3000, 0x303F),  # 中文标点
        (0xFF00, 0xFFEF),  # 全角字符
    ):
        chars |= set(chr(c) for c in range(lo, hi + 1))

    for cp in range(0x4E00, 0xA000):
        try:
            chr(cp).encode("gb2312")
            chars.add(chr(cp))
        except UnicodeEncodeError:
            continue

    vault = os.environ.get(
        "NOTES_SRC",
        r"E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content\学习笔记",
    )
    for md in glob.glob(os.path.join(vault, "**", "*.excalidraw.md"), recursive=True):
        try:
            with open(md, encoding="utf-8", errors="ignore") as f:
                chars |= set(f.read())
        except OSError:
            pass
    return chars


def build_family(family, out_name, subset_chars):
    files = sorted(glob.glob(os.path.join(WORK, family, "*.woff2")))
    print(f"[{family}] 合并 {len(files)} 个分片…")
    merged = Merger().merge(files)
    cmap = merged.getBestCmap()

    options = Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True

    if subset_chars is not None:
        keep = [ord(c) for c in subset_chars if ord(c) in cmap]
        print(f"  目标字符 {len(subset_chars)}，字体里有 {len(keep)}")
        subsetter = Subsetter(options)
        subsetter.populate(unicodes=keep)
        subsetter.subset(merged)

    out = os.path.join(OUT_DIR, out_name)
    save_font(merged, out, options)
    print(f"  写出 {out_name}: {os.path.getsize(out)/1024:.1f} KB")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    download_all()
    chars = build_charset()
    build_family("Xiaolai", "Xiaolai-subset.woff2", chars)
    build_family("Excalifont", "Excalifont-subset.woff2", None)

    shutil.rmtree(WORK, ignore_errors=True)
    print("\n完成。接着跑：node scripts/sync-notes.mjs")


if __name__ == "__main__":
    main()
