import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;
import { v4 as uuid } from 'uuid';
import { debounce } from 'lodash-es';

const Properties = [
  'id',
  'gradientAngle',
  'selectable',
  'hasControls',
  'textType',
  'textAttr',
  'bgInstance',
  'imageType',
  'imgSize',
  'originScale',
  'posterType',
  'name',
  'eleIndex'
]

class CopyPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'CopyPlugin';
  static apis = ['clone'];
  public hotkeys: string[] = ['ctrl+v', 'ctrl+c'];
  private cache: null | fabric.ActiveSelection | fabric.Object;
  debouncePreview: Function;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.cache = null;
    this.debouncePreview = debounce(() => {
      this.editor.previewPoster();
    }, 0);
    this.init();
  }

  init() {
    fabric.Object.prototype.clone = function(callback, propertiesToInclude) {
      this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
  };
  }

  // 多选对象复制
  _copyActiveSelection(activeObject: fabric.Object) {
    // 间距设置
    const grid = 10;
    const canvas = this.canvas;
    activeObject?.clone((cloned: fabric.Object) => {
      // 再次进行克隆，处理选择多个对象的情况
      cloned.clone((clonedObj: fabric.ActiveSelection) => {
        canvas.discardActiveObject();
        if (clonedObj.left === undefined || clonedObj.top === undefined) return;
        // 将克隆的画布重新赋值
        clonedObj.canvas = canvas;
        // 设置位置信息
        clonedObj.set({
          left: clonedObj.left + grid,
          top: clonedObj.top + grid,
          evented: true,
          id: uuid(),
        });
        clonedObj.forEachObject((obj: fabric.Object) => {
          obj.id = uuid();
          canvas.add(obj);
        });
        // 解决不可选择问题
        clonedObj.setCoords();
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    });
  }

  // 单个对象复制
  _copyObject(activeObject: fabric.Object) {
    const Types = {
      'circle': 'Circle',
      'image': 'Image',
      'text': 'Text',
      'rect': 'Rect',
    }
    const Names = {
      'circle': '圆形',
      'image': '图片',
      'text': '文本',
      'rect': '矩形',
    }
    const type =
      activeObject.type === 'circle'
        ? 'circle'
        : activeObject.imageType
        ? 'image'
        : activeObject.textType
        ? 'text'
        : 'rect';
    const workspace: any = this.canvas.getObjects().find((item) => item.id === 'workspace')
    workspace.eleIndex[type] += 1
    const eleId = workspace.eleIndex[type]
    const grid = 10;
    const canvas = this.canvas;
    activeObject?.clone((cloned: fabric.Object) => {
      if (cloned.left === undefined || cloned.top === undefined) return;
      canvas.discardActiveObject();
      // 设置位置信息
      cloned.set({
        left: cloned.left + grid,
        top: cloned.top + grid,
        evented: true,
        id: `${Types[type]}-${eleId}`,
        name: `${Names[type]}-${eleId}`
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      const poster = this.canvas.getObjects().find((item: any) => item.posterType);
    const design = this.canvas.getObjects().find((item: any) => item.designType);
    poster && poster.bringToFront();
    design && design.bringToFront();
      canvas.requestRenderAll();
      // this.editor.previewPoster();
      this.debouncePreview();
    }, Properties);
  }

  // 复制元素
  clone(paramsActiveObeject: fabric.ActiveSelection | fabric.Object) {
    const activeObject = paramsActiveObeject || this.canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject?.type === 'activeSelection') {
      this._copyActiveSelection(activeObject);
    } else {
      this._copyObject(activeObject);
    }
  }

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: any) {
    if (eventName === 'ctrl+c' && e.type === 'keydown') {
      const activeObject = this.canvas.getActiveObject();
      this.cache = activeObject;
    }
    if (eventName === 'ctrl+v' && e.type === 'keydown') {
      if (this.cache) {
        this.clone(this.cache);
      }
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [{ text: '复制', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default CopyPlugin;
