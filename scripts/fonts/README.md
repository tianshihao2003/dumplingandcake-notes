# 手写体字体（不入库，用脚本生成）
#
# 这两个文件由 `python scripts/fonts-tools/prepare-fonts.py` 生成：
#   Xiaolai-subset.woff2      中文手写体（LXGW Xiaolai SC），合并官方 209 个分片后裁剪
#   Excalifont-subset.woff2   拉丁手写体，合并官方 7 个分片
#
# 为什么放进仓库要慎重：字体再分发涉及授权（Excalifont 的 name 表写的是
# "All rights reserved"），所以只让生成的 SVG 里带裁剪后的字形子集，
# 字体原件留在本地。换机器 / 删掉后重跑上面的脚本即可。
#
# 缺这两个文件时 sync 不会报错，只会退回系统字体（报告里会提示）。
