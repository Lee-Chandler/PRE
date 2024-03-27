<template>
  <div>
    <Divider plain orientation="left">{{ $t('common_elements') }}</Divider>
    <div class="tool-box">
      <div class="tool-item" @click="() => addImage()" :draggable="true" @dragend="onDragend('image')">
        <svg t="1650855321307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2701" width="52" height="52">
          <path
            d="M813.752 223.168H209.584a25.168 25.168 0 0 0-25.168 25.176v528.648a25.16 25.16 0 0 0 25.168 25.168h604.168a25.152 25.152 0 0 0 25.168-25.168V248.344a25.168 25.168 0 0 0-25.168-25.176z m-8.08 544.168H217.664V258h588.008v509.336z"
            p-id="2702"></path>
          <path
            d="M406.752 454.168a44.24 44.24 0 1 0-0.008-88.48 44.24 44.24 0 0 0 0.008 88.48zM474.72 611.368l-67.968-94.376-110.584 158.336h442.328L605.8 426.52z"
            p-id="2703"></path>
        </svg>
        <div class="tool-desc">图片</div>
      </div>
      <div class="tool-item" @click="() => addTextBox()" :draggable="true" @dragend="onDragend('textBox')">
        <svg t="1650854954008" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="14038" width="52" height="52">
          <path
            d="M720.832 692.352h-12.64L530.208 260.448a19.968 19.968 0 0 0-36.416 0L316.608 692.352h-13.44c-7.904 0-15.04 3.968-17.408 11.072a19.872 19.872 0 0 0 18.208 27.68h56.96c9.504 0 18.208-6.336 19.776-15.808a18.752 18.752 0 0 0-15.808-21.344l36.384-87.808h159.776l34.816 87.808a18.88 18.88 0 0 0-15.808 21.344c1.568 9.504 10.272 15.808 19.776 15.808h121.024c7.904 0 15.04-3.968 17.408-11.072a19.2 19.2 0 0 0-17.408-27.68z m-306.112-125.76l64.864-158.208 64.864 158.208H414.72z m-246.816-80.704c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m0-75.936c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m0 151.872c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m11.872-216.736a12.16 12.16 0 0 0 11.872-11.872v-23.744c-0.8-6.336-5.536-11.072-11.872-11.072s-11.872 5.536-11.872 11.872v23.744c0 6.336 4.736 11.072 11.872 11.072z m-11.872 292.672c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m0 75.936c0 7.104 4.736 11.872 11.872 11.872a12.16 12.16 0 0 0 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m665.248-227.808c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m0-75.936c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m0 151.872c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m11.072-216.736a12.16 12.16 0 0 0 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744c0.8 7.104 5.536 11.872 11.872 11.872z m-11.072 292.672c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m0 75.936c0 6.336 5.536 11.872 11.872 11.872s11.872-5.536 11.872-11.872v-23.744c0-6.336-5.536-11.872-11.872-11.872s-11.872 5.536-11.872 11.872v23.744z m-347.264 119.456h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872z m-75.936 0h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872z m151.872 0h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872z m-228.608 0h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872h23.744c6.336 0 11.872-5.536 11.872-11.872s-4.736-11.872-11.872-11.872z m-75.136-7.904H222.496v-11.072a12.48 12.48 0 0 0-12.672-12.64h-18.976v-37.984c0-7.104-5.536-12.64-11.872-12.64s-11.872 5.536-11.872 12.64v37.984h-10.272a12.512 12.512 0 0 0-12.672 12.64v52.992a12.48 12.48 0 0 0 12.672 12.64h52.992a12.512 12.512 0 0 0 12.672-12.64v-11.072h35.584c7.104-1.568 12.672-7.904 12.672-14.24 0-7.104-12.672-16.608-12.672-16.608z m379.68 7.904h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872z m75.936 0h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872h23.744c6.336 0 11.872-5.536 11.872-11.872s-4.736-11.872-11.872-11.872z m-251.52-642.304h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872z m-75.936 0h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872z m151.872 0h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872z m-227.808 0h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872h-23.744c-7.104 0.8-11.872 5.536-11.872 12.672s4.736 11.072 11.872 11.072zM257.28 167.904H221.696v-11.072a12.512 12.512 0 0 0-12.672-12.672H156.832a12.512 12.512 0 0 0-12.672 12.672v52.992c0 7.104 5.536 12.672 12.672 12.672h11.072v35.584c1.568 7.104 7.904 12.672 14.24 12.672s16.608-12.672 16.608-12.672V222.496h11.072a12.512 12.512 0 0 0 12.672-12.672v-18.976h35.584a12.16 12.16 0 0 0 11.872-11.872 12.224 12.224 0 0 0-12.672-11.072z m356.768 22.944h23.744c6.336 0 11.872-5.536 11.872-11.872s-5.536-11.872-11.872-11.872h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872z m76.736 0h23.744c6.336 0 11.072-4.736 11.072-11.072s-5.536-11.872-11.872-11.872h-23.744c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.072 12.64 11.072z m176.384-46.656h-52.992a12.48 12.48 0 0 0-12.64 12.672v11.072h-35.584c-7.104 1.568-12.64 7.904-12.64 14.24s12.64 16.608 12.64 16.608h35.584v11.072c0 7.104 5.536 12.672 12.64 12.672h18.976v37.984c0 7.104 5.536 12.672 11.872 12.672s11.872-5.536 11.872-12.672V222.528h11.072a12.48 12.48 0 0 0 12.64-12.672V156.864a13.76 13.76 0 0 0-13.44-12.672z m0 657.312h-11.072v-35.584c-1.568-7.104-7.904-12.64-14.24-12.64-7.104 0-16.608 12.64-16.608 12.64v35.584h-11.072a12.48 12.48 0 0 0-12.64 12.64v18.976h-35.584c-6.336 0-11.872 5.536-11.872 11.872s5.536 11.872 11.872 11.872h35.584v11.072a12.48 12.48 0 0 0 12.64 12.64h52.992a12.48 12.48 0 0 0 12.64-12.64v-52.992c0-7.904-5.536-13.44-12.64-13.44z"
            p-id="14039"></path>
        </svg>
        <div class="tool-desc">文本</div>
      </div>
      <div class="tool-item" @click="() => addRect()" :draggable="true" @dragend="onDragend('rect')">
        <svg t="1650855811131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="18499" width="52" height="52">
          <path
            d="M864 896H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h704a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32zM192 832h640V192H192v640z"
            p-id="18500"></path>
        </svg>
        <div class="tool-desc">矩形</div>
      </div>
      <div class="tool-item" @click="() => addCircle()" :draggable="true" @dragend="onDragend('circle')">
        <svg t="1650855860236" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="19440" width="52" height="52">
          <path
            d="M512 928C282.624 928 96 741.376 96 512S282.624 96 512 96s416 186.624 416 416-186.624 416-416 416z m0-768C317.92 160 160 317.92 160 512s157.92 352 352 352 352-157.92 352-352S706.08 160 512 160z"
            p-id="19441"></path>
        </svg>
        <div class="tool-desc">圆形</div>
      </div>
    </div>
  </div>
</template>

<script setup name="Tools">
import { v4 as uuid } from 'uuid';
// import initializeLineDrawing from '@/core/remove/initializeLineDrawing';
import { getPolygonVertices } from '@/utils/math';
import useSelect from '@/hooks/select';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash-es';
import { getImgStr, selectFiles } from '@/utils/utils';

// 默认属性
const defaultPosition = { shadow: '', fontFamily: 'arial' };
// 拖拽属性
const dragOption = {
  left: 0,
  top: 0,
};
const fontOption = {
  fontSize: 80,
  fontFamily: '',
  lineHeight: 80,
  charSpacing: 0,
  fontWeight: 500,
  textBackgroundColor: '#fff',
  ellipsis: '...',
  textAlign: 'left',
  fontStyle: '',
  lines: 1,
  underline: false,
  linethrough: false,
  overline: false,
  textInput: '示例文本',
  textColor: 'rgba(0, 0, 0, 1)',
}
const { t } = useI18n();
const { fabric, canvasEditor } = useSelect();
const state = reactive({
  isDrawingLineMode: false,
  isArrow: false,
});
// let drawHandler = null;

const debouncePreview = debounce(() => {
  canvasEditor.previewPoster();
}, 0);

const addImage = () => {
  selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
    Array.from(fileList).forEach((item) => {
      getImgStr(item).then((file) => {
        insertImgFile(file);
      });
    });
  });
}

const insertImgFile = (file) => {
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

const addTextBox = (option) => {
  const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
  workspace.eleIndex.text += 1
  const textId = workspace.eleIndex.text
  const rect = new fabric.Rect({
    ...defaultPosition,
    ...option,
    fill: 'transparent',
    textAttr: {
      ...fontOption,
    },
    width: 400,
    height: 100,
    id: `Text-${textId}`,
    name: `文本-${textId}`,
    stroke: '#000',
    strokeWidth: 1,
    textType: true
    // lockUniScaling: false,
  });
  canvasEditor.canvas.add(rect);
  const poster = canvasEditor.canvas.getObjects().find((item) => item.posterType)
  const design = canvasEditor.canvas.getObjects().find((item) => item.designType)
  poster && poster.bringToFront()
  design && design.bringToFront()
  if (!option) {
    rect.center();
  }
  canvasEditor.canvas.setActiveObject(rect);
  debouncePreview();
};

const addCircle = (option) => {
  const poster = canvasEditor.canvas.getObjects().find((item) => item.posterType)
  const design = canvasEditor.canvas.getObjects().find((item) => item.designType)
  const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
  workspace.eleIndex.circle += 1
  const circleId = workspace.eleIndex.circle
  const circle = new fabric.Circle({
    ...defaultPosition,
    ...option,
    radius: 150,
    fill: '#57606B',
    id: `Circle-${circleId}`,
    name: `圆形-${circleId}`,
  });
  canvasEditor.canvas.add(circle);
  poster && poster.bringToFront()
  design && design.bringToFront()
  if (!option) {
    circle.center();
  }
  canvasEditor.canvas.setActiveObject(circle);
  debouncePreview();
};

const addRect = (option) => {
  const poster = canvasEditor.canvas.getObjects().find((item) => item.posterType)
  const design = canvasEditor.canvas.getObjects().find((item) => item.designType)
  const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
  workspace.eleIndex.rect += 1
  const rectId = workspace.eleIndex.rect
  const rect = new fabric.Rect({
    ...defaultPosition,
    ...option,
    fill: '#F57274',
    width: 400,
    height: 400,
    id: `Rect-${rectId}`,
    name: `矩形-${rectId}`,
    strokeWidth: 0
    // lockUniScaling: false,
  });
  canvasEditor.canvas.add(rect);
  poster && poster.bringToFront()
  design && design.bringToFront()
  if (!option) {
    rect.center();
  }
  canvasEditor.canvas.setActiveObject(rect);
  debouncePreview();
};

// 拖拽开始时就记录当前打算创建的元素类型
const onDragend = (type) => {
  // todo 拖拽优化 this.canvas.editor.dragAddItem(event, item);
  switch (type) {
    case 'text':
      addText(dragOption);
      break;
    case 'textBox':
      addTextBox(dragOption);
      break;
    case 'rect':
      addRect(dragOption);
      break;
    case 'circle':
      addCircle(dragOption);
      break;
    case 'triangle':
      addTriangle(dragOption);
      break;
    case 'polygon':
      addPolygon(dragOption);
      break;
    case 'image':
      addImage();
      break;
    default:
  }
};

onMounted(() => {
  nextTick(() => {
    // 线条绘制
    // drawHandler = initializeLineDrawing(canvasEditor.canvas, defaultPosition);

    canvasEditor.canvas.on('drop', (opt) => {
      // 画布元素距离浏览器左侧和顶部的距离
      const offset = {
        left: canvasEditor.canvas.getSelectionElement().getBoundingClientRect().left,
        top: canvasEditor.canvas.getSelectionElement().getBoundingClientRect().top,
      };

      // 鼠标坐标转换成画布的坐标（未经过缩放和平移的坐标）
      const point = {
        x: opt.e.x - offset.left,
        y: opt.e.y - offset.top,
      };

      // 转换后的坐标，restorePointerVpt 不受视窗变换的影响
      const pointerVpt = canvasEditor.canvas.restorePointerVpt(point);
      dragOption.left = pointerVpt.x;
      dragOption.top = pointerVpt.y;
    });
  });
});
</script>

<style scoped lang="less">
.tool-box {
  display: flex;
  justify-content: space-around;
  align-content: flex-start;
  flex-wrap: wrap;
  height: calc(100vh - 400px);;
  .tool-item {
    // flex: 1;
    width: 45%;
    height: 100px;
    border-radius: 10px;
    margin-bottom: 10px;
    text-align: center;
    background: #f6f6f6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #edf9ff;
      color: #2d8cf0;
      svg {
        fill: #2d8cf0;
      }
    }

    .tool-desc {
      margin-left: 10px;
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 4px;
    }
  }
  .bg {
    background: #d8d8d8;

    &:hover {
      svg {
        fill: #2d8cf0;
      }
    }
  }
}
.img {
  width: 20px;
}
</style>
