<template>
  <div style="display: inline-block">
    <Button type="info" @click="insertDesign" ghost>插入设计稿</Button>
    <!-- <Dropdown transfer-class-name="fix" @on-click="insertTypeHand">
      <a href="javascript:void(0)">
        {{ $t('insertFile.insert') }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu> -->
          <!-- 图片 -->
          <!-- <DropdownItem name="insertImg">{{ $t('insertFile.insert_picture') }}</DropdownItem>
          <DropdownItem name="insertDesign">{{ $t('insertFile.insert_design') }}</DropdownItem> -->
          <!-- SVG -->
          <!-- <DropdownItem name="insertSvg">{{ $t('insertFile.insert_SVG') }}</DropdownItem> -->
          <!-- SVG 字符串 -->
          <!-- <DropdownItem name="insertSvgStrModal">{{ $t('insertFile.insert_SVGStr') }}</DropdownItem> -->
        <!-- </DropdownMenu>
      </template>
    </Dropdown> -->
    <!-- 插入字符串svg元素 -->
    <!-- <Modal
      v-model="state.showModal"
      :title="$t('insertFile.modal_tittle')"
      @on-ok="insertTypeHand('insertSvgStr')"
      @on-cancel="showModal = false"
    >
      <Input
        v-model="state.svgStr"
        show-word-limit
        type="textarea"
        :placeholder="$t('insertFile.insert_SVGStr_placeholder')"
      />
    </Modal> -->
  </div>
</template>

<script name="ImportFile" setup>
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { Button, Message } from 'view-ui-plus';
// import { EFitMode, ETextAlign, PImage, PRect, PText, PosterRender } from '@bilibili/poster-render';

const coverState = inject('coverState');

const { fabric, canvasEditor } = useSelect();
const state = reactive({
  showModal: false,
  svgStr: '',
});
const HANDLEMAP = {
  // 插入图片
  insertImg: function () {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertImgFile(file);
        });
      });
    });
  },
  insertDesign: function () {
    const design = canvasEditor.canvas.getObjects().find((item) => item.designType);
    if (design) {
      Message.warning('已经存在设计稿，不可重复插入');
      return;
    }
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertDesignFile(file);
        });
      });
    });
  },
};

const insertTypeHand = (type) => {
  const cb = HANDLEMAP[type];
  cb && typeof cb === 'function' && cb();
};

function insertDesign() {
  const design = canvasEditor.canvas.getObjects().find((item) => item.designType);
    if (design) {
      Message.warning('已经存在设计稿，不可重复插入');
      return;
    }
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertDesignFile(file);
        });
      });
    });
}
// 插入图片文件
function insertImgFile(file) {
  if (!file) throw new Error('file is undefined');
  const imgEl = document.createElement('img');
  imgEl.src = file;
  // 插入页面
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // 创建图片对象
    const imgId = uuid()
    const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
    workspace.eleIndex.image += 1
    const imageId = workspace.eleIndex.image
    const imgInstance = new fabric.Image(imgEl, {
      id: `innerImage-${imgId}`,
      name: `innerImage-${imgId}`,
      left: 100,
      top: 100,
    });
    const container = new fabric.Rect({
      id: `Image-${imageId}`,
      name: `图片-${imageId}`,
      left: 100,
      top: 100,
      width: imgEl.width,
      height: imgEl.height,
      fill: 'transparent',
    });
    container.set('imageType', true);
    container.set('imgSize', 'fill')
    container.set('bgInstance', imgInstance);
    container.set('originScale', imgEl.width / imgEl.height);
    container.set('fill', new fabric.Pattern({
      source: imgEl,
      repeat: 'no-repeat' // 设置背景图片不重复
    }));
    canvasEditor.canvas.add(container);
    const poster = canvasEditor.canvas.getObjects().find((item) => item.posterType);
    const design = canvasEditor.canvas.getObjects().find((item) => item.designType);
    poster && poster.bringToFront();
    design && design.bringToFront();
    canvasEditor.canvas.setActiveObject(container);
    canvasEditor.canvas.renderAll();
    canvasEditor.previewPoster();
    // 删除页面中的图片元素
    imgEl.remove();
  };
}

function insertDesignFile(file) {
  if (!file) throw new Error('file is undefined');
  const imgEl = document.createElement('img');
  imgEl.src = file;
  // 插入页面
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // 创建图片对象
    const design = new fabric.Image(imgEl, {
      id: `Design`,
      name: `Design`,
      left: 0,
      top: 0,
      width: imgEl.width,
      height: imgEl.height,
      opacity: 0.3,
    });
    coverState.designOpacity = 0.3;
    coverState.showDesignSlider = true;
    coverState.designWidth = imgEl.width;
    coverState.designHeight = imgEl.height;
    design.set('designType', true);
    design.set('selectable', false);
    design.set('hasControls', false);
    design.set('hoverCursor', 'default');
    design.set('evented', false);
    canvasEditor.canvas.add(design);
    const poster = canvasEditor.canvas.getObjects().find((item) => item.posterType);
    poster && poster.bringToFront();
    design && design.bringToFront();
    // console.log(design)
    canvasEditor.canvas.renderAll();
    canvasEditor.previewPoster();
    // 删除页面中的图片元素
    imgEl.remove();
  };
}

// 插入文件元素
function insertSvgFile(svgFile) {
  if (!svgFile) throw new Error('file is undefined');
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid(),
    });
    canvasEditor.canvas.add(item).centerObject(item).renderAll();
  });
}

provide('insertImgFile', insertImgFile);
</script>

<style scoped lang="less">
:deep(.ivu-select-dropdown) {
  z-index: 999;
}
</style>
