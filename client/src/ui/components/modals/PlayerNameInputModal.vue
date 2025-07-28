<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>プレイヤー名を入力してください</h2>
      </div>
      
      <div class="modal-body">
        <div class="input-group">
          <label for="playerName">プレイヤー名:</label>
          <input
            id="playerName"
            type="text"
            v-model="playerName"
            @keyup.enter="handleConfirm"
            placeholder="プレイヤー名を入力"
            maxlength="20"
            ref="nameInput"
          />
          <div class="char-count">{{ playerName.length }}/20</div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="handleConfirm" :disabled="!isValid" class="confirm-btn">
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerNameInputModal',
  data() {
    return {
      playerName: ''
    }
  },
  computed: {
    isValid() {
      return this.playerName.trim().length > 0 && this.playerName.trim().length <= 20;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.nameInput?.focus();
    });
  },
  methods: {
    handleConfirm() {
      if (this.isValid) {
        this.$emit('confirm', this.playerName.trim());
        this.playerName = '';
      }
    },
    handleOverlayClick() {
      // オーバーレイクリックでは閉じない（名前入力は必須）
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: 'DotGothic16', monospace;
}

.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.modal-body {
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: bold;
  color: #555;
  font-size: 16px;
}

.input-group input {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'DotGothic16', monospace;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirm-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'DotGothic16', monospace;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn {
  background: #4CAF50;
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background: #45a049;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f44336;
  color: white;
}

.cancel-btn:hover {
  background: #da190b;
}
</style>