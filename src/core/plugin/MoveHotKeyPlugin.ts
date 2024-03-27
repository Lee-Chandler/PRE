import { fabric } from 'fabric';
import Editor from '../core';
import { debounce } from 'lodash-es';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class MoveHotKeyPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'MoveHotKeyPlugin';
  public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  debouncePreview: Function;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.debouncePreview = debounce(this.editor.previewPoster, 0);
  }

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: any) {
    if (e.type === 'keydown') {
      const { canvas, editor } = this;
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      switch (eventName) {
        case 'left':
          if (activeObject.left === undefined) return;
          activeObject.set('left', activeObject.left - 1);
          break;
        case 'right':
          if (activeObject.left === undefined) return;
          activeObject.set('left', activeObject.left + 1);
          break;
        case 'down':
          if (activeObject.top === undefined) return;
          activeObject.set('top', activeObject.top + 1);
          break;
        case 'up':
          if (activeObject.top === undefined) return;
          activeObject.set('top', activeObject.top - 1);
          break;
        default:
      }
      this.debouncePreview();
      canvas.renderAll();
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default MoveHotKeyPlugin;
