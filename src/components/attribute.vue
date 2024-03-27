<template>
  <div class="box" v-if="mixinState.mSelectMode === 'one'">
    <!-- 字体属性 -->
    <div v-show="baseAttr.textType">
      <Divider plain orientation="left">{{ $t('attributes.font') }}</Divider>
      <Row :gutter="12">
        <Col flex="1">
          <div class="flex-view">
            <div class="flex-item">{{ $t('attributes.text_color') }}</div>
            <div class="content">
              <ColorPicker
                v-model="fontAttr.textColor"
                @on-change="(value) => changeFont('textColor', value)"
                alpha
              />
            </div>
          </div>
        </Col>
        <Col flex="1">
          <div class="flex-view">
            <InputNumber
              v-model="fontAttr.fontSize"
              @on-change="(value) => changeFont('fontSize', value)"
              append="字号"
              :min="1"
            ></InputNumber>
          </div>
        </Col>
      </Row>

      <div class="flex-view">
        <div class="flex-item">
          <RadioGroup
            class="button-group"
            v-model="fontAttr.textAlign"
            @on-change="(value) => changeFont('textAlign', value)"
            type="button"
          >
            <Radio v-for="(item, i) in textAlignList" :label="item" :key="item">
              <span v-html="textAlignListSvg[i]"></span>
            </Radio>
          </RadioGroup>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <div style="flex: 0.3;">字重</div>
          <div class="left font-selector">
            <Select v-model="fontAttr.fontWeight" @on-change="(value) => changeFont('fontWeight', value)">
              <Option v-for="item in fontWeightList" :value="item" :key="`font-${item}`">
                <div class="font-item">{{ item }}</div>
                
              </Option>
            </Select>
          </div>
          <div class="right">
            <InputNumber
              v-model="fontAttr.lines"
              @on-change="(value) => changeFont('lines', value)"
              append="最大行数"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>

      <Row :gutter="12">
        <Col flex="1">
          <InputNumber
            v-model="fontAttr.lineHeight"
            @on-change="(value) => changeFont('lineHeight', value)"
            :min="0"
            :append="$t('attributes.line_height')"
          ></InputNumber>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="fontAttr.charSpacing"
            @on-change="(value) => changeFont('charSpacing', value)"
            :append="$t('attributes.char_spacing')"
          ></InputNumber>
        </Col>
      </Row>

      <!-- <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('background') }}</span>
          <div class="content">
            <ColorPicker
              v-model="fontAttr.textBackgroundColor"
              @on-change="(value) => changeCommon('textBackgroundColor', value)"
              alpha
            />
          </div>
        </div>
      </div> -->
      <!-- 文本输入框 -->
      <div class="flex-view">
        <div class="flex-item">省略</div>
        <Input
          class="flex-item"
          style="flex: 6"
          :rows="1"
          v-model="fontAttr.ellipsis"
          :clearable="true"
          placeholder="请输入省略文字"
          @on-change="() => changeFont('ellipsis', fontAttr.ellipsis)"
        />
      </div>

      <!-- 文本输入框 -->
      <div class="flex-view">
        <div class="flex-item">{{ $t('attributes.text_input') }}</div>
        <Input
          class="flex-item"
          style="flex: 6"
          v-model="fontAttr.textInput"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 5}"
          placeholder="请输入文本"
          @on-change="() => changeFont('textInput', fontAttr.textInput)"
        />
      </div>
    </div>

    <!-- 通用属性 -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <Divider plain orientation="left">{{ $t('attributes.exterior') }}</Divider>
      <!-- 多边形边数 -->
      <Row v-if="mixinState.mSelectOneType === 'polygon'" :gutter="12">
        <Col flex="0.5">
          <InputNumber
            v-model="baseAttr.points.length"
            :min="3"
            :max="30"
            @on-change="changeEdge"
            append="边数"
          ></InputNumber>
        </Col>
      </Row>
      <!-- 颜色 -->
      <!-- todo: 恢复 -->
      <colorSelector
        v-if="mixinState.mSelectOneType !== 'image' && !baseAttr.imageType && !baseAttr.textType"
        :color="baseAttr.fill"
        @change="(value) => changeCommon('fill', value)"
      ></colorSelector>
      <Row :gutter="12">
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.left"
            @on-change="(value) => changeCommon('left', value)"
            :append="$t('attributes.left')"
          ></InputNumber>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.top"
            @on-change="(value) => changeCommon('top', value)"
            :append="$t('attributes.top')"
          ></InputNumber>
        </Col>
      </Row>
      <Row :gutter="12">
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.width"
            @on-change="(value) => changeCommon('width', value)"
            :min="0"
            :append="$t('attributes.width')"
          ></InputNumber>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.height"
            @on-change="(value) => changeCommon('height', value)"
            :min="0"
            :append="$t('attributes.height')"
          ></InputNumber>
        </Col>
      </Row>
      <Row :gutter="12" v-if="mixinState.mSelectOneType === 'image' || (mixinState.mSelectOneType === 'rect' && !baseAttr.textType)">
        <Col flex="0.5">
          <InputNumber
            v-model="baseAttr.rx"
            @on-change="(value) => {changeCommon('rx', value);changeCommon('ry', value)}"
            :min="0"
            :append="$t('attributes.radius')"
          ></InputNumber>
        </Col>
        <div style="flex: 0.2;display: flex;justify-content: center;align-items: center;" v-if="mixinState.mSelectOneType === 'rect' && baseAttr.imageType">&nbsp;填充</div>
        <Col flex="0.3" v-if="mixinState.mSelectOneType === 'rect' && baseAttr.imageType">
          <Select v-model="baseAttr.imgSize" @on-change="changeImgSize(baseAttr.imgSize)">
              <Option v-for="item in imgSizeList" :value="item" :key="`size-${item}`">
                <div class="font-item">{{ item }}</div>
              </Option>
          </Select>
        </Col>
      </Row>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('attributes.angle') }}</span>
          <div class="content slider-box">
            <Slider
              v-model="baseAttr.angle"
              :max="360"
              @on-input="(value) => changeCommon('angle', value)"
              show-input
            ></Slider>
          </div>
        </div>
      </div>

    <!-- ID属性 -->
    <div>
      <Divider plain orientation="left">{{ $t('attributes.id') }}</Divider>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('attributes.id') }}</span>
          <div class="content slider-box">
            <Input v-model="baseAttr.id" @on-change="changeCommon('id', baseAttr.id)"></Input>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-show="isExist" style="color: red;">* 该id已存在，换一个试试吧</div>
      <div v-show="isEmpty" style="color: red;">* id不能为空，换一个试试吧</div>
    </div>
  </div>
</div>
</template>

<script setup name="AttrBute">
import fontList from '@/assets/fonts/font';
import fontWeights from '@/assets/fonts/fontWeight';
import useSelect from '@/hooks/select';
import FontFaceObserver from 'fontfaceobserver';
import colorSelector from '@/components/colorSelector.vue';
import axios from 'axios';
import { getPolygonVertices } from '@/utils/math';
import InputNumber from '@/components/inputNumber';
import { Spin, Input } from 'view-ui-plus';
import { debounce } from 'lodash-es';
import { PosterRender } from '@bilibili/poster-render';
const isExist = ref(false);
const isEmpty = ref(false);
const event = inject('event');
const update = getCurrentInstance();
const repoSrc = import.meta.env.APP_REPO;
const { fabric, mixinState, canvasEditor } = useSelect();
// 通用元素
const baseType = [
  'text',
  'i-text',
  'textbox',
  'rect',
  'circle',
  'triangle',
  'polygon',
  'image',
  'group',
  'line',
  'arrow',
];
// 文字元素
const textType = ['i-text', 'textbox', 'text'];
// 通用属性
const baseAttr = reactive({
  id: '',
  opacity: 0,
  angle: 0,
  fill: '#fff',
  left: 0,
  top: 0,
  strokeWidth: 0,
  strokeDashArray: [],
  stroke: '#fff',
  shadow: {
    color: '#fff',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
  },
  points: {},
  rx: 0,
  ry: 0,
  imageType: false,
  textType: false,
  width: 0,
  height: 0,
});
// 字体属性
const fontAttr = reactive({
  fontSize: 0,
  fontFamily: '',
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: 0,
  textBackgroundColor: '#fff',
  textAlign: '',
  fontStyle: '',
  lines: 0,
  underline: false,
  linethrough: false,
  overline: false,
  textInput: '',
  textColor: '',
  ellipsis: '',
});
// 字体下拉列表
const imgSizeList = ref(['fill', 'contain', 'cover']);
const fontFamilyList = ref([...fontList]);
const fontWeightList = ref([...fontWeights])
const strokeDashList = [
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [],
      strokeLineCap: 'butt',
    },
    label: 'Stroke',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'butt',
    },
    label: 'Dash-1',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'round',
    },
    label: 'Dash-2',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'square',
    },
    label: 'Dash-3',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'round',
    },
    label: 'Dash-4',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'square',
    },
    label: 'Dash-5',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'round',
    },
    label: 'Dash-6',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'square',
    },
    label: 'Dash-7',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'round',
    },
    label: 'Dash-8',
  },
];
// 字体对齐方式
const textAlignList = ['left', 'center', 'right'];
// 对齐图标
const textAlignListSvg = [
  '<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="18" height="18"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>',
  '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="18" height="18"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>',
  '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="18" height="18"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>',
];

const debouncePreview = debounce(() => {
  canvasEditor.previewPoster()
}, 0);

const getFreeFontList = () => {
  axios.get(`${repoSrc}/font/free-font.json`).then((res) => {
    fontFamilyList.value = [
      ...fontFamilyList.value,
      ...Object.entries(res.data).map(([, value]) => value),
    ];
  });
};

const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject) {
    // base
    baseAttr.id = activeObject.get('id');
    baseAttr.opacity = activeObject.get('opacity') * 100;
    baseAttr.fill = activeObject.get('fill');
    baseAttr.left = activeObject.get('left');
    baseAttr.top = activeObject.get('top');
    baseAttr.stroke = activeObject.get('stroke');
    baseAttr.strokeWidth = activeObject.get('strokeWidth');
    baseAttr.shadow = activeObject.get('shadow') || {};
    baseAttr.angle = activeObject.get('angle') || 0;
    baseAttr.points = activeObject.get('points') || {};
    baseAttr.rx = activeObject.get('rx') || 0;
    baseAttr.ry = activeObject.get('ry') || 0;
    baseAttr.width = activeObject.type === 'image' ? activeObject.get('width') * activeObject.get('scaleX') || 0 : activeObject.get('width') || 0;
    baseAttr.height = activeObject.type === 'image' ? activeObject.get('height') * activeObject.get('scaleY') || 0 : activeObject.get('height') || 0;
    baseAttr.imgSize = activeObject.get('imgSize') || 'fill';
    baseAttr.imageType = activeObject.get('imageType') || false;
    baseAttr.textType = activeObject.get('textType') || false;

    const textTypes = ['i-text', 'text', 'textbox'];
    if (activeObject.textType) {
      fontAttr.fontSize = activeObject.get('textAttr').fontSize;
      // fontAttr.fontFamily = activeObject.get('fontFamily');
      fontAttr.lineHeight = activeObject.get('textAttr').lineHeight;
      fontAttr.textAlign = activeObject.get('textAttr').textAlign;
      // fontAttr.underline = activeObject.get('textAttr').underline;
      // fontAttr.linethrough = activeObject.get('textAttr').linethrough;
      fontAttr.charSpacing = activeObject.get('textAttr').charSpacing;
      // fontAttr.overline = activeObject.get('textAttr').overline;
      // fontAttr.fontStyle = activeObject.get('textAttr').fontStyle;
      // fontAttr.textBackgroundColor = activeObject.get('textAttr').textBackgroundColor;
      fontAttr.fontWeight = activeObject.get('textAttr').fontWeight;
      fontAttr.lines = activeObject.get('textAttr').lines;
      fontAttr.textInput = activeObject.get('textAttr').textInput;
      fontAttr.textColor = activeObject.get('textAttr').textColor;
      fontAttr.ellipsis = activeObject.get('textAttr').ellipsis;
    }
  }
};

const selectCancel = () => {
  baseAttr.fill = '';
  update?.proxy?.$forceUpdate();
};

const init = () => {
  // 获取字体数据
  // getFreeFontList();

  event.on('selectCancel', selectCancel);
  event.on('selectOne', getObjectAttr);
  event.on('object:modified', getObjectAttr) // 用于手动触发属性更新事件
  event.on('image:resized', fitImg);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
};

// 修改字体
const changeFontFamily = (fontName) => {
  if (!fontName) return;
  // 跳过加载的属性;
  const skipFonts = ['arial', 'Microsoft YaHei'];
  if (skipFonts.includes(fontName)) {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    activeObject && activeObject.set('fontFamily', fontName);
    canvasEditor.canvas.renderAll();
    return;
  }
  Spin.show();
  // 字体加载
  const font = new FontFaceObserver(fontName);
  font
    .load(null, 150000)
    .then(() => {
      const activeObject = canvasEditor.canvas.getActiveObjects()[0];
      activeObject && activeObject.set('fontFamily', fontName);
      canvasEditor.canvas.renderAll();
      Spin.hide();
    })
    .catch(() => {
      Spin.hide();
    });
};

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (!activeObject) {
    return
  }
  console.log("activeObject", key, value, activeObject)
  if (key === 'id') {
    if (activeObject.id === value) {
      isExist.value = false;
      isEmpty.value = false;
      return;
    }
    if (value.length === 0) {
      isEmpty.value = true;
      return;
    }
    isEmpty.value = false;
    const objs = canvasEditor.canvas.getObjects();
    isExist.value = objs.some((item) => item.id === value);
    if (isExist.value) {
      return;
    }
    isExist.value = false;
    activeObject.set('id', value);
    activeObject.set('name', value);
    canvasEditor.canvas.renderAll();
  }

  if (key === 'opacity') {
    value = value / 100;
  }
  
  if (key === 'angle') {
    activeObject.rotate(value);
    canvasEditor.canvas.renderAll();
    event.emit('object:modified');
    return;
  }

  if (activeObject.type === 'circle' && (key === 'width' || key === 'height')) {
    if (activeObject) {
      activeObject.set('radius', value / 2);
      activeObject.set('width', value);
      activeObject.set('height', value);
    }
  }

  // console.log(key, value)
  activeObject.set(key, value);
  canvasEditor.canvas.renderAll();
  // canvasEditor.previewPoster();
  debouncePreview();
  getObjectAttr();
};

const changeFont = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    activeObject.set('styles', {})
    activeObject.textAttr[key] = value;
    canvasEditor.canvas.renderAll();
    // canvasEditor.previewPoster();
    debouncePreview();
    getObjectAttr();
  }
}

// 边框设置
const borderSet = (key) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    const stroke = strokeDashList.find((item) => item.label === key);
    activeObject.set(stroke.value);
    canvasEditor.canvas.renderAll();
  }
};

// 阴影设置
const changeShadow = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow));
  canvasEditor.canvas.renderAll();
};

// 加粗
const changeFontWeight = (key, value) => {
  // const nValue = value === 'normal' ? 'bold' : 'normal';
  fontAttr.fontWeight = value;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject.set('styles', {})
  activeObject && activeObject.set(key, value);
  canvasEditor.canvas.renderAll();
};

const fitImg = async () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  const fitType = activeObject.get('imgSize');
  if (activeObject) {
    const bgInstance = activeObject.get('bgInstance');
    if (bgInstance) {
      let offsetX = 0, offsetY = 0;
      // 创建一个新的 canvas 元素
      var canvas = document.createElement('canvas');
      console.log("1:", fitType)
      if (fitType === 'fill') { // 100%
        canvas.width = activeObject.width;
        canvas.height = activeObject.height;
      }else if (fitType === 'contain') { // contain
        if (activeObject.width / activeObject.height > activeObject.get('originScale')) {
          canvas.width = activeObject.height;
          canvas.height = activeObject.height;
          offsetX = (activeObject.width - activeObject.height) / 2;
        }else {
          canvas.width = activeObject.width;
          canvas.height = activeObject.width;
          offsetY = (activeObject.height - activeObject.width) / 2;
        }
      }else { // cover
        if (activeObject.width / activeObject.height > activeObject.get('originScale')) {
          canvas.width = activeObject.width;
          canvas.height = activeObject.width;
          offsetY = (activeObject.height - activeObject.width) / 2;
        }else {
          canvas.width = activeObject.height;
          canvas.height = activeObject.height;
          offsetX = (activeObject.width - activeObject.height) / 2;
        }
      }
      console.log("2:", activeObject)
      var ctx = canvas.getContext('2d');
      if (bgInstance.src) {
        const img = await PosterRender.loadSingleImage(bgInstance.src);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        activeObject.set('fill', new fabric.Pattern({
          source: canvas,
          repeat: 'no-repeat',
          offsetX: offsetX,
          offsetY: offsetY,
        }));
        canvasEditor.canvas.renderAll();
        debouncePreview();
      }else {
        ctx.drawImage(bgInstance.getElement(), 0, 0, canvas.width, canvas.height);
        activeObject.set('fill', new fabric.Pattern({
          source: canvas,
          repeat: 'no-repeat',
          offsetX: offsetX,
          offsetY: offsetY,
        }));
        canvasEditor.canvas.renderAll();
        debouncePreview();
      }
    }
  }
}

const changeImgSize = (value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set('imgSize', value);
  fitImg();
};

// 斜体
const changeFontStyle = (key, value) => {
  const nValue = value === 'normal' ? 'italic' : 'normal';
  fontAttr.fontStyle = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 中划
const changeLineThrough = (key, value) => {
  const nValue = value === false;
  fontAttr.linethrough = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 下划
const changeUnderline = (key, value) => {
  const nValue = value === false;
  fontAttr.underline = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 修改边数
const changeEdge = (value) => {
  const activeObjects = canvasEditor.canvas.getActiveObjects();
  if (!activeObjects || !activeObjects.length) return;
  activeObjects[0].set(
    'points',
    getPolygonVertices(value, Math.min(activeObjects[0].width, activeObjects[0].height) / 2)
  );
  canvasEditor.canvas.requestRenderAll();
};

onMounted(init);

onBeforeUnmount(() => {
  event.off('selectCancel', selectCancel);
  event.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
});
</script>

<style scoped lang="less">
// @import url('vue-color-gradient-picker/dist/index.css');
:deep(.ivu-slider) {
  .ivu-slider-wrap {
    width: 60%;
  }
  .ivu-input-number {
    display: inline-block;
    width: 35%;
  }
}
:deep(.ivu-color-picker) {
  display: block;
}
:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
}
.box {
  width: 100%;
}

.button-group {
  display: flex;
  width: 100%;
  .ivu-btn,
  .ivu-radio-wrapper {
    flex: 1;
  }
}

.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
}
.flex-item {
  display: inline-flex;
  flex: 1;
  align-items: center;
  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    // color: #333333;
  }
  .content {
    width: 60px;
  }
  .slider-box {
    width: calc(100% - 50px);
    margin-left: 10px;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
    margin-left: 10px;
    :deep(.ivu-input-number) {
      display: block;
      width: 100%;
    }
  }
  // :deep(.ivu-slider-wrap) {
  //   margin: 13px 0;
  // }
  :deep(.ivu-radio-group-button) {
    & .ivu-radio-wrapper {
      width: 48px;
      line-height: 40px;
      text-align: center;
      svg {
        vertical-align: baseline;
      }
    }
  }

  :deep(.ivu-btn-group-large) {
    & > .ivu-btn {
      font-size: 24px;
    }
  }

  :deep(.ivu-radio-group-button) {
    &.ivu-radio-group-large .ivu-radio-wrapper {
      font-size: 24px;
    }
  }
}

.ivu-row {
  margin-bottom: 8px;

  .ivu-col {
    position: inherit;
    &__box {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 4px;
      gap: 8px;
    }
  }

  .label {
    padding-left: 8px;
  }

  .content {
    flex: 1;

    :deep(.--input),
    :deep(.ivu-select-selection) {
      background-color: transparent;
      border: none !important;
      box-shadow: none !important;
    }
  }
}

.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    background-color: #000;
    background-size: cover;
    background-position: center center;
    height: 30px;
    width: 100px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: invert(100%);
  }
}
</style>
