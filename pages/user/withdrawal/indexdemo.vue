<template>
  <view>
    <!-- 按钮触发弹出 -->
    <button @click="showPicker = true" style="margin:20px;">选择项</button>

    <!-- 自定义弹出框 -->
    <view v-if="showPicker" class="picker-mask">
      <view class="picker-popup">
        <!-- 顶部取消/确认 -->
        <view class="picker-header">
          <button class="btn-cancel" @click="cancelPicker">{{ cancelText }}</button>
          <button class="btn-confirm" @click="confirmPicker">{{ confirmText }}</button>
        </view>

        <!-- 列表选择 -->
        <scroll-view class="picker-body" scroll-y>
          <view
              v-for="(item, idx) in options"
              :key="item.id"
              @click="selectItem(idx)"
              :class="{active: index === idx}"
              class="picker-item"
          >
            {{ item.name }}
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 显示当前选择 -->
    <view style="margin-top:20px;">当前选择：{{ selectedText }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showPicker: false,          // 控制弹出显示
      cancelText: "Cancelar",     // 取消按钮文字
      confirmText: "Aceptar",     // 确认按钮文字
      options: [                  // 选择列表
        { id: 1, name: "选项1" },
        { id: 2, name: "选项2" },
        { id: 3, name: "选项3" }
      ],
      index: 0,                    // 当前选择索引
      selectedText: "选项1"        // 当前选择显示
    };
  },
  methods: {
    selectItem(idx) {
      this.index = idx;
    },
    cancelPicker() {
      this.showPicker = false;
    },
    confirmPicker() {
      this.selectedText = this.options[this.index].name;
      this.showPicker = false;
    }
  }
};
</script>

<style>
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.picker-popup {
  background: #fff;
  width: 100%;
}
.picker-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.btn-cancel {
  color: red;
}
.btn-confirm {
  color: green;
}
.picker-body {
  max-height: 300px;
  overflow-y: auto;
}
.picker-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.picker-item.active {
  background: #f0f0f0;
}
</style>
