<script setup lang="ts">
/**
 * 汎用ハイライトコンポーネント
 * Props:
 *  - text:      対象の文字列
 *  - highlights: [{ match, class, once }]
 */
import { computed } from 'vue'

interface HighlightRule {
    match: string         // マッチ対象（文字列 or 正規表現文字列）
    class: string         // 付与する CSS クラス
    once?: boolean        // true なら最初の 1 件のみ
}

const props = defineProps<{
    text: string
    highlights: HighlightRule[]
}>()

/**
 * text を走査して「装飾する区間」を抽出し、
 * ただのテキスト／色付きスパン を交互に並べた配列へ変換
 */
const parts = computed(() => {
    const { text, highlights } = props
    type Range = { start: number; end: number; className: string }
    const ranges: Range[] = []

    highlights.forEach(({ match, class: cls, once }) => {
        // 正規表現フラグ g 付きで全走査
        const re = new RegExp(match, 'g')
        let m: RegExpExecArray | null
        while ((m = re.exec(text))) {
            ranges.push({ start: m.index, end: m.index + m[0].length, className: cls })
            if (once) break
        }
    })

    // 開始位置で昇順ソート & 重複考慮（今回は非対応で OK）
    ranges.sort((a, b) => a.start - b.start)

    const out: { text: string; className?: string }[] = []
    let cursor = 0
    for (const r of ranges) {
        if (cursor < r.start) {
            out.push({ text: text.slice(cursor, r.start) })          // プレーン部分
        }
        out.push({ text: text.slice(r.start, r.end), className: r.className }) // ハイライト
        cursor = r.end
    }
    if (cursor < text.length) {
        out.push({ text: text.slice(cursor) })                      // 残り
    }
    return out
})
</script>

<template>
    <span v-for="(p, i) in parts" :key="i" :class="p.className">{{ p.text }}</span>
</template>
