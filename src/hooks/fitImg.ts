import useSelect from '@/hooks/select';

const { canvasEditor } = useSelect();

export const fitImg = (value) => {
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    if (activeObject) {
      const bgInstance = activeObject.get('bgInstance');
      if (bgInstance) {
        let offsetX = 0, offsetY = 0;
        // 创建一个新的 canvas 元素
        var canvas = document.createElement('canvas');
        if (value === 'fill') {
          canvas.width = activeObject.width; // 新的宽度
          canvas.height = activeObject.height; // 新的高度
        }else if (value === 'contain') {
          if (activeObject.width / activeObject.height > activeObject.get('originScale')) {
            canvas.width = activeObject.height; // 新的宽度
            canvas.height = activeObject.height; // 新的高度
            offsetX = (activeObject.width - activeObject.height) / 2;
          }else {
            canvas.width = activeObject.width; // 新的宽度
            canvas.height = activeObject.width; // 新的高度
            offsetY = (activeObject.height - activeObject.width) / 2;
          }
        }else {
          if (activeObject.width / activeObject.height > activeObject.get('originScale')) {
            canvas.width = activeObject.width; // 新的宽度
            canvas.height = activeObject.width; // 新的高度
          }else {
            canvas.width = activeObject.height; // 新的宽度
            canvas.height = activeObject.height; // 新的高度
          }
        }
  
        // 在 canvas 上绘制图像
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bgInstance.getElement(), 0, 0, canvas.width, canvas.height);
  
        // 将新的图像对象作为背景图案
        activeObject.set('fill', new fabric.Pattern({
          source: canvas,
          repeat: 'no-repeat',
          offsetX: offsetX,
          offsetY: offsetY,
        }));
  
        // 重新渲染 canvas
        canvasEditor.canvas.renderAll();
      }
    }
  }