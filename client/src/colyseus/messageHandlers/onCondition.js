import { useSkillStore } from '@/stores/skillStore';

export function onCondition(conditions) {
    const skillStore = useSkillStore();
    skillStore.loadConditionFromColyseus(conditions);
}
