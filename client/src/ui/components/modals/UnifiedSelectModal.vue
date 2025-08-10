<template>
    <div
        class="flex items-center justify-center bg-[url('assets/images/select-skill.png')] bg-contain bg-center bg-no-repeat"
    >
        <div class="p-25">
            <!-- Tab Navigation -->
            <div class="mb-6 flex justify-end p-1">
                <button
                    v-for="tab in allTabs"
                    :key="tab.key"
                    @click="!tab.disabled && (currentTab = tab.key)"
                    :disabled="tab.disabled"
                    :class="[
                        'px-3 py-1 text-sm transition-all duration-200',
                        tab.disabled
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : currentTab === tab.key
                              ? `${tab.theme.active} font-semibold text-white`
                              : 'text-white',
                    ]"
                >
                    {{ tab.label }}
                </button>
            </div>

            <!-- Card Selection -->
            <div>
                <div
                    v-for="card in currentCards"
                    :key="card.id"
                    class="w-full max-w-4xl cursor-pointer rounded p-4 transition-all duration-200 hover:border"
                    :class="getCardClasses(card)"
                    @click="selectCard(card)"
                >
                    <Card :card="card" />
                </div>
            </div>

            <!-- Control Buttons -->
            <div class="mt-6 flex justify-center gap-4">
                <button
                    @click="confirmSelection"
                    :disabled="!selected"
                    class="rounded-md px-6 py-2 font-semibold transition-all duration-200"
                    :class="
                        selected
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'cursor-not-allowed bg-gray-300 text-gray-500'
                    "
                >
                    確定
                </button>
                <button
                    @click="cancel"
                    class="rounded-md bg-gray-500 px-6 py-2 font-semibold text-white transition-all duration-200 hover:bg-gray-600"
                >
                    キャンセル
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import Card from '@/ui/components/CardItem.vue';

    const props = defineProps({
        skillCards: { type: Array, default: () => [] },
        relicCards: { type: Array, default: () => [] },
    });
    const emit = defineEmits(['confirm', 'cancel']);

    const selected = ref(null);
    const selectedCards = ref({ skill: [], relic: [] }); // 選択済みカード追跡

    // カードがあるタブを自動選択
    const getInitialTab = () => {
        if (props.skillCards.length > 0) return 'skill';
        if (props.relicCards.length > 0) return 'relic';
        return 'skill'; // fallback
    };

    const currentTab = ref(getInitialTab());

    const tabConfig = {
        skill: {
            key: 'skill',
            label: 'スキル',
            theme: {
                color: 'blue',
                active: 'bg-blue-500',
            },
        },
        relic: {
            key: 'relic',
            label: 'レリック',
            theme: {
                color: 'green',
                active: 'bg-green-500',
            },
        },
    };

    const allTabs = computed(() => {
        return [
            {
                ...tabConfig.skill,
                disabled: props.skillCards.length === 0,
            },
            {
                ...tabConfig.relic,
                disabled: props.relicCards.length === 0,
            },
        ];
    });

    const currentCards = computed(() => {
        switch (currentTab.value) {
            case 'skill':
                // 選択済みのスキルカードを除外
                return props.skillCards.filter(
                    (card) =>
                        !selectedCards.value.skill.some((selected) => selected.id === card.id),
                );
            case 'relic':
                // 選択済みのレリックカードを除外
                return props.relicCards.filter(
                    (card) =>
                        !selectedCards.value.relic.some((selected) => selected.id === card.id),
                );
            default:
                return [];
        }
    });

    // 両方のカードタイプがあるかどうか
    const hasBothTypes = computed(() => {
        return props.skillCards.length > 0 && props.relicCards.length > 0;
    });

    function getCardClasses(card) {
        const baseClasses = [];

        if (currentTab.value === 'skill') {
            baseClasses.push('hover:border-blue-300');
            if (selected.value?.id === card.id) {
                baseClasses.push('bg-blue-200');
            }
        } else if (currentTab.value === 'relic') {
            baseClasses.push('hover:border-green-300');
            if (selected.value?.id === card.id) {
                baseClasses.push('bg-green-200');
            }
        }

        return baseClasses;
    }

    function selectCard(card) {
        selected.value = card;
    }

    function confirmSelection() {
        if (selected.value) {
            // 選択済みカードに追加
            selectedCards.value[currentTab.value].push(selected.value);
            const selectedCard = selected.value;
            const selectedType = currentTab.value;

            // 選択をリセット
            selected.value = null;

            // 両方のタイプがあるかチェック
            if (hasBothTypes.value) {
                // まだ選択していない方のタブがあるかチェック
                const skillNotSelected =
                    props.skillCards.length > 0 && selectedCards.value.skill.length === 0;
                const relicNotSelected =
                    props.relicCards.length > 0 && selectedCards.value.relic.length === 0;

                if (skillNotSelected || relicNotSelected) {
                    // 次に選択すべきタブに切り替え
                    if (skillNotSelected) {
                        currentTab.value = 'skill';
                    } else if (relicNotSelected) {
                        currentTab.value = 'relic';
                    }

                    // サーバーに通知（モーダルは開いたまま）
                    emit('confirm', {
                        card: selectedCard,
                        type: selectedType,
                        keepOpen: true,
                    });
                    return;
                }
            }

            // 全て選択完了、モーダルを閉じる
            emit('confirm', { card: selectedCard, type: selectedType, keepOpen: false });
        }
    }

    function cancel() {
        emit('cancel');
    }
</script>
