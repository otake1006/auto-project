<template>
    <div class="fixed inset-0 flex items-center justify-center" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
            <div
                class="mx-auto w-full max-w-md bg-[url('https://cdn.discordapp.com/attachments/1331433261716475925/1400388960618024969/UntitledArtwork10.png?ex=688c755a&is=688b23da&hm=f1860ba27ca1aed8349f05236a4ac7b80abba34127aa84b46012d4929076553b&')] bg-contain bg-center bg-no-repeat"
            >
                <!-- カスタム背景画像を使用したカード -->

                <!-- コンテンツ -->
                <div class="relative z-10">
                    <!-- 入力フィールド -->
                    <div class="relative">
                        <input
                            ref="nameInput"
                            v-model="playerName"
                            type="text"
                            placeholder="プレイヤー名を入力..."
                            maxlength="20"
                            @keyup.enter="handleConfirm"
                            @input="handleInput"
                            class="w-full px-5 py-4 text-center text-lg text-white outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue';
    import { usePlayerStore } from '@/ui/stores/playerStore';

    // Props
    const props = defineProps({
        currentName: {
            type: String,
            default: '',
        },
    });

    // Emits
    const emit = defineEmits(['confirm', 'cancel']);

    // Store
    const playerStore = usePlayerStore();

    // Reactive data
    const playerName = ref('');
    const nameInput = ref(null);

    // Methods
    const handleInput = () => {
        const trimmedName = playerName.value.trim();
        if (trimmedName.length > 0 && trimmedName.length <= 20) {
            playerStore.setPlayerName(trimmedName);
        }
    };

    const handleConfirm = () => {
        const trimmedName = playerName.value.trim();
        if (trimmedName.length > 0 && trimmedName.length <= 20) {
            playerStore.setPlayerName(trimmedName);
            emit('confirm', trimmedName);
        }
    };

    // Lifecycle
    onMounted(() => {
        // propsからcurrentNameを受け取るか、ストアから既存名を取得
        if (props.currentName) {
            playerName.value = props.currentName;
        } else {
            const existing = playerStore.getPlayerName();
            if (existing && existing !== 'プレイヤー') {
                playerName.value = existing;
            }
        }

        // 入力フィールドにフォーカス
        nextTick(() => {
            nameInput.value?.focus();
            if (playerName.value) {
                nameInput.value?.select();
            }
        });
    });
</script>

<style scoped></style>
