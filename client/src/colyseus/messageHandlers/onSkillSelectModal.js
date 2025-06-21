import { useModalStore } from '@/stores/modalStore';

export async function onSkillSelectModal(room, cards) {
    const modalStore = useModalStore();
    const selected = await modalStore.open('skillSelect', { cards });

    if (selected) {
        room.send('selectSkill', { id: selected });
    }
}
