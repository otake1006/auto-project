import { useModalStore } from '@/stores/modalStore';
import { useSkillStore } from '@/stores/skillStore';

export async function onSkillSelectModal(room, cards) {
    const modalStore = useModalStore();
    const skillStore = useSkillStore();
    skillStore.setSelectCards(cards);

    const selected = await modalStore.open('skillSelect', { cards });

    if (selected) {
        room.send('selectSkill', selected.id);
        skillStore.addSkills([selected]);
        skillStore.clearSelectCards();
    }
}
