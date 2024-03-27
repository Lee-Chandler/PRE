import { fabric } from 'fabric';
import Editor from '../core';
import { includes, debounce } from 'lodash-es';
type IEditor = Editor;

class LayerPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'LayerPlugin';
  static apis = ['up', 'upTop', 'down', 'downTop'];
  debouncePreview: Function;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.debouncePreview = debounce(this.editor.previewPoster, 0);
  }

  _getWorkspace() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace');
  }

  _workspaceSendToBack() {
    const workspace = this._getWorkspace();
    workspace && workspace.sendToBack();
  }

  up() {
    const actives = this.canvas.getActiveObjects();
    const obj = this.canvas.getObjects().filter((item: any) => item.posterType)[0];
    const design = this.canvas.getObjects().filter((item: any) => item.designType)[0];
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringForward();
      obj && obj.bringToFront();
      design && design.bringToFront();
      this.canvas.renderAll();
      this._workspaceSendToBack();
      this.debouncePreview();
    }

  }

  upTop() {
    const actives = this.canvas.getActiveObjects();
    const obj = this.canvas.getObjects().filter((item:any) => item.posterType)[0];
    const design = this.canvas.getObjects().filter((item: any) => item.designType)[0];
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringToFront();
      obj && obj.bringToFront();
      design && design.bringToFront();
      this.canvas.renderAll();
      this._workspaceSendToBack();
      // this.editor.previewPoster();
      this.debouncePreview();
    }
  }

  down() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendBackwards();
      this.canvas.renderAll();
      this._workspaceSendToBack();
      this.debouncePreview();
    }
  }

  downTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendToBack();
      this.canvas.renderAll();
      this._workspaceSendToBack();
      // this.editor.previewPoster();
      this.debouncePreview();
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [
        {
          text: '图层管理',
          hotkey: '❯',
          subitems: [
            {
              text: '上一个',
              hotkey: 'key',
              onclick: () => this.up(),
            },
            {
              text: '下一个',
              hotkey: 'key',
              onclick: () => this.down(),
            },
            {
              text: '置顶',
              hotkey: 'key',
              onclick: () => this.upTop(),
            },
            {
              text: '置底',
              hotkey: 'key',
              onclick: () => this.downTop(),
            },
          ],
        },
      ];
      // return [{ text: '复制', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default LayerPlugin;
