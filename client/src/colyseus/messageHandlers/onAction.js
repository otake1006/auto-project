// src/colyseus/messageHandlers/onAction.js
import { useSkillStore } from '@/stores/skillStore';

export function onAction(_room, skills) {
    const skillStore = useSkillStore();
    skillStore.setSkills(skills);
}
