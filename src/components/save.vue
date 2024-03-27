<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t('empty') }}
    </Button>
    <Dropdown style="margin-left: 10px" @on-click="saveWith">
      <Button type="primary">
        {{ $t('keep') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="clipboard">{{ $t('copy_to_clipboard') }}</DropdownItem>
          <DropdownItem name="saveImg">{{ $t('save_as_picture') }}</DropdownItem>
          <DropdownItem name="saveSvg">{{ $t('save_as_svg') }}</DropdownItem>
          <DropdownItem name="saveJson">{{ $t('save_as_json') }}</DropdownItem>
          <DropdownItem name="savePosterRender">{{ $t('save_as_poster_render') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';

import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
// import { downloadFile } from '@/utils/utils';

const { t } = useI18n();

const { canvasEditor } = useSelect();
const cbMap = {
  clipboard() {
    canvasEditor.clipboard();
  },

  saveJson() {
    canvasEditor.saveJson();
  },

  savePosterRender() {
    canvasEditor.savePosterRender();
  },

  saveSvg() {
    canvasEditor.saveSvg();
  },

  saveImg() {
    canvasEditor.saveImg();
  },
};

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
}, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  // canvasEditor.clear();
  const res = canvasEditor.canvas.getObjects()
  res.forEach((item, index) => {
    if (index !== 0 && !item.posterType) {
      canvasEditor.canvas.remove(item);
    }
  });
  canvasEditor.canvas.renderAll();
  canvasEditor.previewPoster();
};

const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear(),
  });
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
