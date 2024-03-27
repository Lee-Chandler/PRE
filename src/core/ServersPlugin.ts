import { v4 as uuid } from 'uuid';
import { selectFiles, clipboardText } from '@/utils/utils';
// import { clipboardText } from '@/utils/utils.ts';
import { fabric } from 'fabric';
import Editor from '../core';
import { EFitMode, ETextAlign, PImage, PRect, PText, PosterRender } from '@bilibili/poster-render';
import useSelect from '@/hooks/select';
import { globalEventEmitter } from '@/utils/event/notifier'
import { debounce } from 'lodash-es';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

function downFile(fileStr: string, fileType: string) {
  const anchorEl = document.createElement('a');
  anchorEl.href = fileStr;
  anchorEl.download = `${uuid()}.${fileType}`;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}

function transformText(objects) {
  if (!objects) return;
  objects.forEach((item) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === 'text' && (item.type = 'textbox');
    }
  });
}

class ServersPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'ServersPlugin';
  static apis = [
    'insert',
    'insertSvgFile',
    'getJson',
    'dragAddItem',
    'clipboard',
    'saveJson',
    'savePosterRender',
    'previewPoster',
    // 'add2Workspace',
    'renderPoster',
    'saveSvg',
    'saveImg',
    'clear',
    'preview',
  ];
  // public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  insert() {
    selectFiles({ accept: '.json' }).then((files) => {
      const [file] = files;
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        this.insertSvgFile(reader.result);
      };
    });
  }

  insertSvgFile(jsonFile) {
    // 加载前钩子
    this.editor.hooksEntity.hookImportBefore.callAsync(jsonFile, () => {
      this.canvas.loadFromJSON(jsonFile, () => {
        // this.canvas.renderAll();
        // 加载后钩子
        this.editor.hooksEntity.hookImportAfter.callAsync(jsonFile, () => {
          const workspace = this.canvas.getObjects().find((item: any) => item.id === 'workspace');
          if (workspace) {
            // workspace.set('selectable', false);
            // workspace.set('hasControls', false);
            // workspace.set('evented', false);
            workspace.set('hoverCursor', 'default');
            // workspace.set('lockMovementX', true);
            // workspace.set('lockMovementY', true);
            // workspace.set('lockScalingX', true);
            // workspace.set('lockScalingY', true);
          }
          const poster = new fabric.Rect({
            fill: 'rgba(255,255,255,0)',
            left: 0,
            top: 0,
            width: workspace?.width,
            height: workspace?.height,
            id: `poster`,
            name: `poster`,
            evented: false,
            opacity: 0.2
          });
          const lockAttrs = [
            'lockMovementX',
            'lockMovementY',
            'lockRotation',
            'lockScalingX',
            'lockScalingY',
          ];
          poster.hasControls = false;
        // 修改默认属性
          lockAttrs.forEach((key) => {
            poster[key] = true;
          });
          poster.selectable = false;
          poster.hoverCursor = 'default';
          poster.set('posterType', true)
          this.canvas.add(poster);
          poster.bringToFront();
          this.canvas.renderAll();
          this.previewPoster();
          // this.editor.getPlugin('HistoryPlugin').history.clear();
        });
      });
    });
  }

  getJson() {
    return this.canvas.toJSON([
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
      'designType',
      'name',
      'eleIndex'
    ]);
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: fabric.Object) {
    const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }

  clipboard() {
    const jsonStr = this.getJson();
    console.log(jsonStr)
    console.log(this.canvas.getObjects())
    clipboardText(JSON.stringify(jsonStr, null, '\t'));
  }

  async saveJson() {
    // TODO: 在这里获取了json
    const dataUrl = this.getJson();
    dataUrl.objects = dataUrl.objects.filter((item: any) => !item.posterType && !item.designType);
    // 把文本text转为textgroup，让导入可以编辑
    await transformText(dataUrl.objects);
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downFile(fileStr, 'json');
  }

  async savePosterRender() {
    const { objects } = this.getJson();
    const objs: any[] = this.canvas.getObjects().filter((item: any) => !item.posterType && !item.designType);
    // console.log(objs, objects)
    const elList = objs.map((item: any)=> {
      const { id, aCoords, clipPath, angle = 0, fill = '', height = 0, scaleX = 1, scaleY = 1, width = 0, type = 'rect'} = item
      const centroidX = (aCoords.tl.x + aCoords.br.x) / 2;
      const centroidY = (aCoords.tl.y + aCoords.br.y) / 2;
      switch (type) {
        case 'rect':
          if (item.imageType) {
            return {
              name: id,
              type: 'image',
              x: centroidX - width / 2,
              y: centroidY - height / 2,
              rotate: angle,
              h: height,
              w: width,
              borderRadius: item.rx,
              fitMode: item.imgSize === 'fill' ? EFitMode.Full : item.imgSize === 'contain' ? EFitMode.Contain : EFitMode.Cover,
            }
          }else if (item.textType) {
            return {
              name: id,
              type: 'text',
              x: centroidX - width / 2,
              y: centroidY - height / 2,
              rotate: angle,
              w: width,
              text: item.textAttr.textInput || '',
              fontSize: item.textAttr.fontSize,
              lineHeight: item.textAttr.lineHeight,
              fontWeight: item.textAttr.fontWeight,
              lines: item.textAttr.lines,
              align: item.textAttr.textAlign,
              letterSpacing: item.textAttr.charSpacing,
              color: item.textAttr.textColor,
              textEllipsis: item.textAttr.ellipsis
            }
          }else {
            return {
              name: id,
              type: type,
              x: centroidX - width / 2,
              y: centroidY - height / 2,
              rotate: angle,
              style: fill,
              h: height,
              w: width,
              borderRadius: item.rx
            }
          }
        case 'circle':
          return {
            name: id,
            type: type,
            x: centroidX - width / 2,
            y: centroidY - height / 2,
            rotate: angle,
            style: fill,
            h: height,
            w: width,
            borderRadius: type === 'circle' ? item.radius : item.rx
          }
        default:
          return {
            name: id,
            type: type,
            x: centroidX - width / 2,
            y: centroidY - height / 2,
            rotate: angle,
            style: fill,
            h: height,
            w: width,
            borderRadius: type === 'circle' ? item.radius : item.rx
          }
      }
    })
    // console.log(elList)
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      `const cfg = ${JSON.stringify(elList, null, '\t')};\nexport default cfg;`
    )}`;
    downFile(fileStr, 'js');
  }

  async previewPoster () {
    const obj: any = this.canvas.getObjects().filter((item: any) => item.get('posterType'))[0];
    const design = this.canvas.getObjects().filter((item: any) => item.get('designType'))[0];
    // console.log("obj:", obj)
    // obj && obj.bringToFront();
    // design && design.bringToFront();
    const poster = await this.renderPoster(obj.width, obj.height);
    poster.render()
    obj.set('fill', new fabric.Pattern({
      source: poster.canvas,
      repeat: 'no-repeat' // 设置背景图片不重复
    }));
    this.canvas.renderAll();
  }

  async renderPoster(w: number, h: number) {
    let needRender = false;
    const p = new PosterRender({
      width: w,
      height: h,
    })
    const { objects } = this.getJson();
    const activeObjects = this.canvas.getActiveObjects();
    let groupIds: any[] = []
    let groupCenterX = 0, groupCenterY = 0
    if (activeObjects.length > 1) {
      groupIds = activeObjects.map((item) => item.id)
      const group: any = this.canvas.getActiveObject()
      groupCenterX = (group?.aCoords?.tl.x + group?.aCoords?.tr.x) / 2
      groupCenterY = (group?.aCoords?.tl.y + group?.aCoords?.bl.y) / 2
    }
    // console.log(this.canvas.getActiveObject())
    const objs = this.canvas.getObjects()
    for (const item of objs as any[]) {
      if (item.posterType || item.designType) continue;
      const matrix = item.calcTransformMatrix()
      // console.log(item)
      const { id, aCoords, clipPath, angle = 0, fill = '', height = 0, scaleX = 1, scaleY = 1, width = 0, type = 'rect'} = item
      let centroidX, centroidY
      if (groupIds.includes(item.id)) {
        centroidX = (aCoords.tl.x + aCoords.br.x) / 2 + groupCenterX;
        centroidY = (aCoords.tl.y + aCoords.br.y) / 2 + groupCenterY;
      }else {
        centroidX = (aCoords.tl.x + aCoords.br.x) / 2;
        centroidY = (aCoords.tl.y + aCoords.br.y) / 2;
      }
      switch (type) {
        case 'circle':
          p.add(new PRect({
            x: centroidX - width / 2,
            y: centroidY - height / 2,
            rotate: angle,
            style: fill,
            h: height,
            w: width,
            borderRadius: type === 'circle' ? item.radius : item.rx
          }))
          break;
        case 'rect':
          if (item.imageType) {
            p.add(new PImage({
              x: centroidX - width / 2,
              y: centroidY - height / 2,
              rotate: angle,
              h: height,
              w: width,
              borderRadius: item.rx,
              // src: item.bgInstance.getElement(),
              src: item.fill.source,
              fitMode: item.imgSize === 'fill' ? EFitMode.Full : item.imgSize === 'contain' ? EFitMode.Contain : EFitMode.Cover
            }))
          }else if (item.textType) {
            // console.log(item)
            const textItem = new PText({
              x: centroidX - width / 2,
              y: centroidY - height / 2,
              rotate: angle,
              w: width,
              text: item.textAttr.textInput || '',
              fontSize: item.textAttr.fontSize,
              lineHeight: item.textAttr.lineHeight,
              fontWeight: item.textAttr.fontWeight,
              lines: item.textAttr.lines,
              align: item.textAttr.textAlign,
              letterSpacing: item.textAttr.charSpacing,
              color: item.textAttr.textColor,
              textEllipsis: item.textAttr.ellipsis
            })
            p.add(textItem)
            const measure = p.measure(textItem)
            item.width = measure.width
            item.height = measure.height
            item.setCoords();
            item.set({ strokeWidth: 0 })
            item.set({ strokeWidth: 2 })
            needRender = true;
          }else {
            p.add(new PRect({
              x: centroidX - width / 2,
              y: centroidY - height / 2,
              rotate: angle,
              style: fill,
              h: height,
              w: width,
              borderRadius: type === 'circle' ? item.radius : item.rx
            }))
          }
          break;
        case 'textbox':
        case 'i-text':
          p.add(new PText({
            x: centroidX - width / 2,
            y: centroidY - height / 2,
            rotate: angle,
            w: width,
            text: item.text || '',
            fontSize: item.fontSize,
            lineHeight: item.lineHeight * item.fontSize,
            fontWeight: item.fontWeight,
            lines: item.lines,
            align: item.textAlign,
            letterSpacing: item.charSpacing / 1000 * item.fontSize,
            color: fill
          }))
          break;
        default:
          p.add(new PRect({
            x: centroidX - width / 2,
            y: centroidY - height / 2,
            rotate: angle,
            style: fill,
            h: height,
            w: width,
            borderRadius: type === 'circle' ? item.radius : item.rx
          }))
      }
    }
    if (needRender) {
      this.canvas.renderAll();
    }
    return p
  }

  saveSvg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      const option = this._getSaveSvgOption();
      const dataUrl = this.canvas.toSVG(option);
      const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`;
      this.editor.hooksEntity.hookSaveAfter.callAsync(fileStr, () => {
        downFile(fileStr, 'svg');
      });
    });
  }

  saveImg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      const option = this._getSaveOption();
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = this.canvas.toDataURL(option);
      this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
        downFile(dataUrl, 'png');
      });
    });
  }

  preview() {
    return new Promise((resolve, reject) => {
      this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
        const option = this._getSaveOption();
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.canvas.renderAll();
        const dataUrl = this.canvas.toDataURL(option);
        const img = new Image()
        img.src = dataUrl
        img.onload = async () => {
          const w = img.width
          const h = img.height
          const p = await this.renderPoster(w, h)
          // p.add(new PImage({
          //   x: 0,
          //   y: 0,
          //   w: w,
          //   h: h,
          //   src: img
          // }))
          // p.add(new PRect({
          //   x: w,
          //   y: 0,
          //   w: 20,
          //   h: h,
          //   style: '#000'
          // }))
          p.render()
          const hoverId = uuid()
          const hover = new fabric.Image(p.canvas, {
            left: 0,
            top: 0,
            width: w,
            height: h,
            id: `poster-${hoverId}`,
            name: `poster-${hoverId}`
          })
          this.editor.canvas.add(hover)
          globalEventEmitter.emit('lock', hover)
            // this.editor.canvas.renderAll();
          // console.log(p.canvas, p.ctx, this.editor)
          const poster = p.toBase64()
          this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
            resolve([poster]);
          });
        }
        // this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
        //   resolve([dataUrl, poster]);
        // });
      });
    });
  }

  _getSaveSvgOption() {
    const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
    const { left, top, width, height } = workspace;
    return {
      width,
      height,
      viewBox: {
        x: left,
        y: top,
        width,
        height,
      },
    };
  }

  _getSaveOption() {
    const workspace = this.canvas
      .getObjects()
      .find((item: fabric.Object) => item.id === 'workspace');
    const { left, top, width, height } = workspace as fabric.Object;
    const option = {
      name: 'New Image',
      format: 'png',
      quality: 1,
      width,
      height,
      left,
      top,
    };
    return option;
  }

  clear() {
    this.canvas.getObjects().forEach((obj) => {
      if (obj.id !== 'workspace') {
        this.canvas.remove(obj);
      }
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default ServersPlugin;
