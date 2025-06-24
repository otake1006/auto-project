// src/colyseus/messageHandlers/onRandomSkill.js
import { useSkillStore } from '@/stores/skillStore';

export function onRandomSkill(_room, skills) {
    const skillStore = useSkillStore();
    skillStore.addSkills(skills);
}
