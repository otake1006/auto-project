// stores/battleStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useBattleStore = defineStore('battle', () => {
  const player = reactive({
    name: 'Hero',
    hp: 100,
    mp: 50,
    shield: 0,
  })

  const monster = reactive({
    name: 'Goblin',
    hp: 100,
    mp: 50,
    shield: 0,
  })

  function updateHp(entity, value) {
    if (entity === 'player') player.hp = Math.max(0, value)
    if (entity === 'monster') monster.hp = Math.max(0, value)
  }

  function updateMp(entity, value) {
    if (entity === 'player') player.mp = Math.max(0, value)
    if (entity === 'monster') monster.mp = Math.max(0, value)
  }

  function attack(entity, value) {
    if (entity === 'player') player.hp = Math.max(0, player.hp - value)
    if (entity === 'monster') monster.hp = Math.max(0, monster.hp - value)
  }

  function consumMp(entity, value) {
    if (entity === 'player') player.mp = Math.max(0, player.mp - value)
    if (entity === 'monster') monster.mp = Math.max(0, monster.mp - value)
  }

  function updateshield(entity, value) {
    if (entity === 'player') player.shield = Math.max(0, value)
    if (entity === 'monster') monster.shield = Math.max(0, value)
  }

  function shieldPlus(entity, value) {
    if (entity === 'player') player.shield = Math.max(0, player.shield + value)
    if (entity === 'monster') monster.shield = Math.max(0, monster.shield + value)
  }

  function shieldAttack(entity, value) {
    if (entity === 'player') player.shield = Math.max(0, player.shield - value)
    if (entity === 'monster') monster.shield = Math.max(0, monster.shield - value)
  }

  return {
    player,
    monster,
    updateHp,
    attack,
    updateMp,
    consumMp,
    updateshield,
    shieldPlus,
    shieldAttack
  }
})
