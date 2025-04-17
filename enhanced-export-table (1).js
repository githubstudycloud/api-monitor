/**
 * 处理复杂嵌套表格并导出为真正的XLSX格式
 * 
 * 此代码首先加载SheetJS库，然后提供函数处理嵌套表格、合并单元格等复杂情况，
 * 并生成真正的Excel XLSX文件，而不是简单的CSV文件。
 * 
 * 增强功能：
 * 1. 支持文本对齐方式（居中、左对齐、右对齐）
 * 2. 解析并应用HTML元素的内联样式
 */

// 第一步：加载SheetJS库（如果页面还没有加载）
function loadSheetJS() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) {
      resolve(window.XLSX);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error('无法加载SheetJS库'));
    document.head.appendChild(script);
  });
}

/**
 * 处理表格内容，包括嵌套表格和合并单元格
 * @param {HTMLElement} container - 包含表格的容器元素
 * @param {Object} options - 配置选项
 * @returns {Array} 处理后的数据
 */
function processTableData(container, options = {}) {
  const defaults = {
    includeHeaders: true,      // 是否包含标题
    processNestedTables: true, // 是否处理嵌套表格
    detectMergedCells: true,   // 是否检测合并单元格
    parseStyles: true,         // 是否解析内联样式
    debug: false               // 是否输出调试信息
  };
  
  const settings = { ...defaults, ...options };
  const tables = container.querySelectorAll('table');
  
  if (settings.debug) {
    console.log(`找到 ${tables.length} 个表格`);
  }
  
  // 如果只有一个表格，直接处理它
  if (tables.length === 1) {
    return processTableWithCorrectStructure(tables[0], settings);
  }
  
  // 处理多个表格的情况，假设第一个是标题，第二个是数据
  const headerTable = tables[0];
  const dataTable = tables[1];
  
  // 分析表格获取正确的列数
  const maxColumns = determineMaxColumns([headerTable, dataTable]);
  
  if (settings.debug) {
    console.log(`检测到最大列数: ${maxColumns}`);
  }
  
  // 从标题表格提取标题数据（保持正确的列对齐）
  const headerData = extractTableData(headerTable, maxColumns, settings);
  
  // 从数据表格提取数据（保持正确的列对齐）
  const bodyData = extractTableData(dataTable, maxColumns, settings);
  
  // 合并标题和数据
  const combinedData = [...headerData.rows, ...bodyData.rows];
  
  // 合并合并单元格信息，注意调整行索引
  const merges = [
    ...headerData.merges,
    ...bodyData.merges.map(merge => ({
      s: { r: merge.s.r + headerData.rows.length, c: merge.s.c },
      e: { r: merge.e.r + headerData.rows.length, c: merge.e.c }
    }))
  ];
  
  return { 
    data: combinedData, 
    merges,
    styles: [...headerData.styles, ...bodyData.styles.map(style => ({
      ...style,
      row: style.row + headerData.rows.length
    }))]
  };
}

/**
 * 确定表格的最大列数
 * @param {Array<HTMLTableElement>} tables - 表格元素数组
 * @returns {number} 最大列数
 */
function determineMaxColumns(tables) {
  let maxCols = 0;
  
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      let colCount = 0;
      const cells = row.querySelectorAll('th, td');
      cells.forEach(cell => {
        colCount += parseInt(cell.colSpan || 1, 10);
      });
      maxCols = Math.max(maxCols, colCount);
    });
  });
  
  return maxCols;
}

/**
 * 从表格提取数据，正确处理合并单元格和保持列对齐
 * @param {HTMLTableElement} table - 表格元素
 * @param {number} maxColumns - 最大列数
 * @param {Object} settings - 配置设置
 * @returns {Object} 处理后的行数据、合并单元格信息和样式信息
 */
function extractTableData(table, maxColumns, settings) {
  const rows = table.querySelectorAll('tr');
  const resultRows = [];
  const merges = [];
  const styles = []; // 新增：存储样式信息
  
  // 创建跟踪矩阵，记录哪些单元格被跨行单元格占用
  // 矩阵索引为：[行][列]
  const spanMatrix = Array(rows.length).fill().map(() => Array(maxColumns).fill(false));
  
  // 第一遍：收集所有合并单元格信息
  const spanInfo = [];
  let rowIndex = 0;
  rows.forEach(row => {
    let colIndex = 0;
    const cells = row.querySelectorAll('th, td');
    
    cells.forEach(cell => {
      // 跳过被跨行单元格占用的位置
      while (colIndex < maxColumns && spanMatrix[rowIndex][colIndex]) {
        colIndex++;
      }
      
      if (colIndex >= maxColumns) return; // 超出最大列数，忽略此单元格
      
      const rowSpan = parseInt(cell.rowSpan || 1, 10);
      const colSpan = parseInt(cell.colSpan || 1, 10);
      
      // 提取单元格样式信息
      const styleInfo = settings.parseStyles ? extractCellStyle(cell) : {};
      
      // 记录此单元格跨行跨列的信息
      spanInfo.push({
        row: rowIndex,
        col: colIndex,
        rowSpan,
        colSpan,
        value: cell.textContent.trim(),
        style: styleInfo
      });
      
      // 在占用矩阵中标记被此单元格占用的位置
      for (let r = 0; r < rowSpan; r++) {
        for (let c = 0; c < colSpan; c++) {
          if (rowIndex + r < rows.length && colIndex + c < maxColumns) {
            spanMatrix[rowIndex + r][colIndex + c] = true;
          }
        }
      }
      
      colIndex += colSpan;
    });
    
    rowIndex++;
  });
  
  // 第二遍：构建结果行，正确处理合并单元格
  // 初始化空结果数组
  for (let i = 0; i < rows.length; i++) {
    resultRows.push(Array(maxColumns).fill({ value: '' }));
  }
  
  // 填充单元格值，包括合并单元格的值
  spanInfo.forEach(info => {
    // 添加单元格值到结果数组
    resultRows[info.row][info.col] = { 
      value: info.value,
      style: info.style
    };
    
    // 保存样式信息（用于后续应用到Excel）
    if (Object.keys(info.style).length > 0) {
      styles.push({
        row: info.row,
        col: info.col,
        style: info.style
      });
    }
    
    // 记录合并单元格信息
    if (info.rowSpan > 1 || info.colSpan > 1) {
      merges.push({
        s: { r: info.row, c: info.col },
        e: { r: info.row + info.rowSpan - 1, c: info.col + info.colSpan - 1 }
      });
      
      if (settings.debug) {
        console.log(`检测到合并单元格: (${info.row},${info.col}) 跨 ${info.rowSpan} 行 ${info.colSpan} 列, 值: "${info.value}"`);
      }
    }
  });
  
  return { rows: resultRows, merges, styles };
}

/**
 * 提取单元格的样式信息
 * @param {HTMLElement} cell - 单元格元素
 * @returns {Object} 样式信息对象
 */
function extractCellStyle(cell) {
  const style = {
    // 默认样式设置
    alignment: {
      horizontal: 'center', // 默认水平居中
      vertical: 'center',   // 默认垂直居中
      wrapText: true        // 默认自动换行
    },
    font: {
      name: 'Arial',  // 默认字体
      sz: 11,         // 默认字号（点）
      color: { rgb: '000000' } // 默认黑色
    }
  };
  
  // 获取计算后的样式
  const computedStyle = window.getComputedStyle(cell);
  
  // 提取文本对齐方式
  const textAlign = cell.style.textAlign || computedStyle.textAlign;
  if (textAlign && textAlign !== '') {
    // 处理水平对齐方式
    switch (textAlign) {
      case 'center':
        style.alignment.horizontal = 'center';
        break;
      case 'right':
        style.alignment.horizontal = 'right';
        break;
      case 'left':
        style.alignment.horizontal = 'left';
        break;
      // 保持默认居中
    }
  }
  
  // 提取垂直对齐方式
  const verticalAlign = cell.style.verticalAlign || computedStyle.verticalAlign;
  if (verticalAlign && verticalAlign !== '') {
    // 处理垂直对齐方式
    switch (verticalAlign) {
      case 'middle':
        style.alignment.vertical = 'center';
        break;
      case 'top':
        style.alignment.vertical = 'top';
        break;
      case 'bottom':
        style.alignment.vertical = 'bottom';
        break;
      // 保持默认居中
    }
  }
  
  // 提取字体粗细
  const fontWeight = cell.style.fontWeight || computedStyle.fontWeight;
  if (fontWeight === 'bold' || parseInt(fontWeight, 10) >= 700) {
    style.font.bold = true;
  } else if (fontWeight && fontWeight !== 'normal' && parseInt(fontWeight, 10) >= 600) {
    // 600及以上视为粗体
    style.font.bold = true;
  }
  
  // 检查元素是否有<b>或<strong>标签的子元素
  if (cell.querySelector('b, strong')) {
    style.font.bold = true;
  }
  
  // 提取字体样式（斜体）
  const fontStyle = cell.style.fontStyle || computedStyle.fontStyle;
  if (fontStyle === 'italic') {
    style.font.italic = true;
  }
  
  // 检查元素是否有<i>或<em>标签的子元素
  if (cell.querySelector('i, em')) {
    style.font.italic = true;
  }
  
  // 提取字体大小
  const fontSize = cell.style.fontSize || computedStyle.fontSize;
  if (fontSize && fontSize !== '') {
    // 转换为磅（pt）单位
    const sizeInPx = parseFloat(fontSize);
    if (!isNaN(sizeInPx)) {
      // 大致转换：1px ≈ 0.75pt
      style.font.sz = Math.round(sizeInPx * 0.75);
    }
  }
  
  // 提取背景颜色
  const backgroundColor = cell.style.backgroundColor || computedStyle.backgroundColor;
  if (backgroundColor && 
      backgroundColor !== 'transparent' && 
      backgroundColor !== 'rgba(0, 0, 0, 0)' &&
      backgroundColor !== 'rgb(0, 0, 0, 0)') {
    style.fill = {
      fgColor: { rgb: convertColorToHex(backgroundColor) }
    };
  }
  
  // 提取文本颜色
  const color = cell.style.color || computedStyle.color;
  if (color && color !== '' && 
      color !== 'rgba(0, 0, 0, 0)' && 
      color !== 'rgb(0, 0, 0)') {
    style.font.color = { rgb: convertColorToHex(color) };
  }
  
  // 检查是否有带有color属性的span标签
  const colorSpans = cell.querySelectorAll('span[style*="color"]');
  if (colorSpans.length > 0) {
    // 使用第一个有颜色的span（简化处理）
    const spanColor = colorSpans[0].style.color || 
                      window.getComputedStyle(colorSpans[0]).color;
    if (spanColor && spanColor !== '') {
      style.font.color = { rgb: convertColorToHex(spanColor) };
    }
  }
  
  return style;
}

/**
 * 将CSS颜色值转换为十六进制格式
 * @param {String} color - CSS颜色值
 * @returns {String} 十六进制颜色值（不带#号）
 */
function convertColorToHex(color) {
  // 创建一个临时元素用于颜色转换
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  document.body.appendChild(tempElement);
  
  // 获取计算后的颜色
  const computedColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);
  
  // 解析RGB值
  const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    
    // 转换为十六进制并去掉#号
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }
  
  return '000000'; // 默认黑色
}

/**
 * 处理单个表格的数据，确保正确处理合并单元格
 * @param {HTMLTableElement} table - 表格元素
 * @param {Object} settings - 配置设置
 * @returns {Object} 处理后的数据和合并单元格信息
 */
function processTableWithCorrectStructure(table, settings) {
  // 确定最大列数
  const maxColumns = determineMaxColumns([table]);
  
  // 提取表格数据，保持正确的列对齐
  const processedData = extractTableData(table, maxColumns, settings);
  
  return { 
    data: processedData.rows, 
    merges: processedData.merges,
    styles: processedData.styles
  };
}

/**
 * 将处理好的数据导出为Excel文件，并自动调整列宽和行高
 * @param {Array} data - 表格数据
 * @param {Array} merges - 合并单元格信息
 * @param {Array} styles - 样式信息
 * @param {String} fileName - 文件名
 * @param {Object} options - 其他选项
 */
async function exportToExcel(data, merges, styles = [], fileName = 'table-export', options = {}) {
  try {
    // 处理样式选项
    const styleOptions = processStyleOptions(options);
    
    // 加载SheetJS库
    const XLSX = await loadSheetJS();
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 将复杂数据转换为简单数组格式（仅包含值）
    const flatData = (data.data || data).map(row => 
      row.map(cell => (cell && typeof cell === 'object') ? cell.value : cell)
    );
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(flatData);
    
    // 如果有合并单元格，添加到工作表
    if (merges && merges.length > 0) {
      ws['!merges'] = merges;
    }
    
    // 自动调整列宽
    autoAdjustColumnWidths(ws, flatData);
    
    // 自动调整行高
    autoAdjustRowHeights(ws, flatData);
    
    // 添加样式信息（通用样式）
    addStylesInfo(ws, flatData, styleOptions);
    
    // 应用单元格样式（从HTML获取的特定样式）
    applyCellStyles(ws, data.data || data, styles);

    // 最后再一次确保所有单元格都有居中设置
    ensureCenterAlignment(ws, styleOptions);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // 在浏览器中导出为Excel文件
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
    // 将二进制字符串转换为ArrayBuffer
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }
    
    // 创建Blob对象
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    
    // 添加到文档并触发点击
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    console.log(`成功导出为 ${fileName}.xlsx`);
  } catch (error) {
    console.error('导出Excel时出错:', error);
  }
}

/**
 * 确保所有单元格都有居中对齐设置
 * @param {Object} ws - 工作表对象
 * @param {Object} options - 样式选项
 */
function ensureCenterAlignment(ws, options = {}) {
  // 默认水平居中
  const horizontalAlign = options.defaultAlignment || 'center';
  
  // 获取工作表范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  
  // 遍历所有单元格
  for (let row = range.s.r; row <= range.e.r; ++row) {
    for (let col = range.s.c; col <= range.e.c; ++col) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];
      
      if (!cell) continue;
      
      // 确保有样式对象
      if (!cell.s) {
        cell.s = {};
      }
      
      // 确保有对齐属性
      if (!cell.s.alignment) {
        cell.s.alignment = {};
      }
      
      // 设置水平对齐（如果未设置）
      if (!cell.s.alignment.horizontal) {
        cell.s.alignment.horizontal = horizontalAlign;
      }
      
      // 设置垂直对齐（如果未设置）
      if (!cell.s.alignment.vertical) {
        cell.s.alignment.vertical = 'center';
      }
      
      // 设置自动换行（如果未设置）
      if (cell.s.alignment.wrapText === undefined) {
        cell.s.alignment.wrapText = true;
      }
    }
  }
}

/**
 * 应用单元格样式到工作表
 * @param {Object} ws - 工作表对象
 * @param {Array} data - 表格数据
 * @param {Array} styles - 样式信息数组
 */
function applyCellStyles(ws, data, styles) {
  // 如果没有样式信息，直接返回
  if (!styles || styles.length === 0) return;
  
  // 遍历样式信息
  styles.forEach(styleInfo => {
    const { row, col, style } = styleInfo;
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    
    // 确保单元格对象存在
    if (!ws[cellAddress]) {
      // 创建单元格如果不存在（可能是空单元格）
      const cellValue = getValueAt(data, row, col);
      ws[cellAddress] = { v: cellValue || '', t: 's' };
    }
    
    // 初始化样式对象如果不存在
    if (!ws[cellAddress].s) {
      ws[cellAddress].s = {};
    }
    
    // 深度合并样式对象，确保不丢失信息
    ws[cellAddress].s = deepMergeStyles(ws[cellAddress].s, style);
  });
}

/**
 * 深度合并样式对象
 * @param {Object} target - 目标样式对象
 * @param {Object} source - 源样式对象
 * @returns {Object} 合并后的样式对象
 */
function deepMergeStyles(target, source) {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMergeStyles(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * 检查是否是对象
 * @param {*} item - 检查的项目
 * @returns {Boolean} 是否是对象
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * 从数据数组中获取指定位置的值
 * @param {Array} data - 数据数组
 * @param {Number} row - 行索引
 * @param {Number} col - 列索引
 * @returns {*} 单元格值
 */
function getValueAt(data, row, col) {
  if (row >= 0 && row < data.length && col >= 0 && col < data[row].length) {
    const cell = data[row][col];
    return (cell && typeof cell === 'object') ? cell.value : cell;
  }
  return '';
}

/**
 * 自动调整工作表的列宽以适应内容
 * @param {Object} ws - 工作表对象
 * @param {Array} data - 表格数据
 */
function autoAdjustColumnWidths(ws, data) {
  // 初始化列宽数组
  const colWidths = [];
  
  // 计算每列的最大宽度，基于字符数量
  data.forEach(row => {
    row.forEach((cell, colIndex) => {
      const content = cell ? String(cell) : '';
      
      // 根据内容类型和长度估算合适的宽度
      let width = estimateTextWidth(content);
      
      // 更新列的最大宽度
      colWidths[colIndex] = Math.max(colWidths[colIndex] || 0, width);
    });
  });
  
  // 应用列宽到工作表
  const cols = [];
  colWidths.forEach((width, i) => {
    // 设置最小宽度，确保不会太窄
    const adjustedWidth = Math.max(width, 6);
    
    // 列宽不能超过最大值，Excel中列宽的最大值为255
    const finalWidth = Math.min(adjustedWidth, 100);
    
    cols.push({ wch: finalWidth });
  });
  
  ws['!cols'] = cols;
}

/**
 * 估算文本在Excel中的宽度
 * @param {String} text - 文本内容
 * @returns {Number} - 估算的宽度值
 */
function estimateTextWidth(text) {
  if (!text) return 0;
  
  const str = String(text);
  
  // 中文字符和特殊符号一般占用更多宽度
  const wideChars = str.replace(/[\x00-\xff]/g, '').length; // 非ASCII字符
  const narrowChars = str.length - wideChars; // ASCII字符
  
  // 根据字符类型估算宽度
  // 中文等宽字符占用约2个单位宽度
  return narrowChars + (wideChars * 2) + 1; // 加1作为缓冲
}

/**
 * 自动调整工作表的行高以适应内容
 * @param {Object} ws - 工作表对象
 * @param {Array} data - 表格数据
 */
function autoAdjustRowHeights(ws, data) {
  // 创建行高数组
  const rowHeights = [];
  
  // 计算每行的适当高度，基于内容行数和文本长度
  data.forEach((row, rowIndex) => {
    let maxLinesInRow = 1;
    
    row.forEach(cell => {
      if (!cell) return;
      
      const content = String(cell);
      
      // 检测文本中的换行符，估算行数
      const lines = content.split(/\r\n|\r|\n/).length;
      
      // 检测长文本，可能需要自动换行
      const textLength = content.length;
      const estimatedLines = Math.ceil(textLength / 50); // 假设每50个字符可能需要换行
      
      // 取行数和估算行数的较大值
      const totalLines = Math.max(lines, estimatedLines);
      
      // 更新当前行的最大行数
      maxLinesInRow = Math.max(maxLinesInRow, totalLines);
    });
    
    // 根据行数计算行高
    // Excel中行高以磅为单位，一般默认行高约为15磅
    // 我们根据行数来设置合适的高度
    const rowHeight = maxLinesInRow * 15; // 每行15磅
    
    rowHeights[rowIndex] = { hpt: rowHeight };
  });
  
  // 应用行高到工作表
  ws['!rows'] = rowHeights;
}

/**
 * 添加样式信息到工作表
 * @param {Object} ws - 工作表对象
 * @param {Array} data - 表格数据
 * @param {Object} options - 样式选项
 */
function addStylesInfo(ws, data, options = {}) {
  // 默认样式选项
  const defaultOptions = {
    headerStyle: true,     // 是否应用表头样式
    zebra: false,          // 是否应用斑马纹
    borders: true,         // 是否应用边框
    wrapText: true,        // 是否启用自动换行
    defaultAlignment: 'center', // 默认文本对齐方式：'center', 'left', 'right'
    defaultFontBold: false,  // 默认字体是否加粗
    defaultFontSize: 11,     // 默认字体大小（磅）
    defaultFontColor: '000000' // 默认字体颜色（黑色）
  };
  
  const styleOptions = { ...defaultOptions, ...options };
  
  // 为每个单元格设置通用属性
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let row = range.s.r; row <= range.e.r; ++row) {
    for (let col = range.s.c; col <= range.e.c; ++col) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];
      
      if (!cell) continue;
      
      // 初始化样式对象
      if (!cell.s) cell.s = {};
      
      // 设置默认字体属性
      cell.s.font = cell.s.font || {};
      if (styleOptions.defaultFontBold && !('bold' in cell.s.font)) {
        cell.s.font.bold = true;
      }
      if (!cell.s.font.sz) {
        cell.s.font.sz = styleOptions.defaultFontSize;
      }
      if (!cell.s.font.color) {
        cell.s.font.color = { rgb: styleOptions.defaultFontColor };
      }
      
      // 设置默认对齐方式
      cell.s.alignment = cell.s.alignment || {};
      
      // 启用自动换行
      if (styleOptions.wrapText) {
        cell.s.alignment.wrapText = true;
      }
      
      // 设置默认水平对齐方式
      if (styleOptions.defaultAlignment && !cell.s.alignment.horizontal) {
        cell.s.alignment.horizontal = styleOptions.defaultAlignment;
      }
      
      // 设置默认垂直对齐方式（如果未指定）
      if (!cell.s.alignment.vertical) {
        cell.s.alignment.vertical = 'center';
      }
      
      // 如果是表头行，应用表头样式
      if (styleOptions.headerStyle && row === range.s.r) {
        cell.s.font = cell.s.font || {};
        cell.s.font.bold = true;
        // 表头使用稍大的字体
        cell.s.font.sz = (cell.s.font.sz || styleOptions.defaultFontSize) + 1;
      }
      
      // 应用斑马纹（隔行背景色）
      if (styleOptions.zebra && row % 2 === 1) {
        cell.s.fill = cell.s.fill || {};
        cell.s.fill.fgColor = { rgb: 'F2F2F2' }; // 浅灰色
      }
      
      // 应用边框
      if (styleOptions.borders) {
        const borderStyle = { style: 'thin', color: { rgb: 'D3D3D3' } }; // 浅灰色细边框
        cell.s.border = {
          top: borderStyle,
          bottom: borderStyle,
          left: borderStyle,
          right: borderStyle
        };
      }
    }
  }
}

/**
 * 导出包含嵌套表格的容器为Excel
 * @param {HTMLElement|String} container - 容器元素或选择器
 * @param {String} fileName - 导出的文件名
 * @param {Object} options - 配置选项
 */
async function exportNestedTablesToExcel(container, fileName = 'nested-tables-export', options = {}) {
  // 如果传入的是选择器，获取对应的元素
  const containerElement = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!containerElement) {
    console.error('无法找到指定的容器元素');
    return;
  }
  
  // 处理表格数据
  const processedData = processTableData(containerElement, options);
  
  // 导出为Excel
  await exportToExcel(
    processedData.data, 
    processedData.merges, 
    processedData.styles, 
    fileName, 
    options
  );
}

/**
 * 自动识别页面上的表格结构并导出
 * 此函数会尝试智能识别页面上的表格结构，包括嵌套表格和独立表格
 * @param {Object} options - 导出选项
 */
async function autoDetectAndExportTables(options = {}) {
  // 默认选项
  const defaultOptions = {
    debug: false,
    parseStyles: true,
    defaultAlignment: 'center', // 默认居中对齐
    fileName: '导出表格'
  };
  
  const exportOptions = { ...defaultOptions, ...options };
  
  // 获取页面上所有表格
  const allTables = document.querySelectorAll('table');
  
  if (exportOptions.debug) {
    console.log(`页面上共有 ${allTables.length} 个表格`);
  }
  
  // 如果没有表格，直接返回
  if (allTables.length === 0) {
    console.error('页面上没有找到表格');
    return;
  }
  
  // 检查是否存在嵌套表格
  const nestedTableContainers = [];
  
  // 遍历所有表格，寻找包含其他表格的容器
  allTables.forEach(table => {
    const nestedTables = table.querySelectorAll('table');
    if (nestedTables.length > 0) {
      nestedTableContainers.push(table);
    }
  });
  
  // 如果找到嵌套表格，逐个导出
  if (nestedTableContainers.length > 0) {
    if (exportOptions.debug) {
      console.log(`找到 ${nestedTableContainers.length} 个嵌套表格容器`);
    }
    
    // 遍历每个容器并导出
    for (let i = 0; i < nestedTableContainers.length; i++) {
      await exportNestedTablesToExcel(
        nestedTableContainers[i], 
        `${exportOptions.fileName}-嵌套表格-${i+1}`, 
        exportOptions
      );
    }
    return;
  }
  
  // 如果没有嵌套表格，检查是否有多个表格共同组成一个数据集
  // 这种情况通常是标题表格和数据表格分开
  if (allTables.length > 1) {
    // 查找彼此靠近的表格
    const tableGroups = [];
    let currentGroup = [allTables[0]];
    
    for (let i = 1; i < allTables.length; i++) {
      const prevTable = allTables[i-1];
      const currTable = allTables[i];
      
      // 计算两个表格之间的距离
      const prevRect = prevTable.getBoundingClientRect();
      const currRect = currTable.getBoundingClientRect();
      const distance = currRect.top - (prevRect.top + prevRect.height);
      
      // 如果距离小于阈值，认为它们是同一组
      if (distance < 50) { // 50像素作为阈值
        currentGroup.push(currTable);
      } else {
        tableGroups.push([...currentGroup]);
        currentGroup = [currTable];
      }
    }
    
    // 添加最后一组
    if (currentGroup.length > 0) {
      tableGroups.push(currentGroup);
    }
    
    if (exportOptions.debug) {
      console.log(`将表格分组为 ${tableGroups.length} 组`);
    }
    
    // 为每组创建一个包裹元素并导出
    for (let i = 0; i < tableGroups.length; i++) {
      const group = tableGroups[i];
      
      // 创建一个临时容器
      const container = document.createElement('div');
      
      // 将组中的表格复制到容器中
      group.forEach(table => {
        container.appendChild(table.cloneNode(true));
      });
      
      // 导出这个容器
      await exportNestedTablesToExcel(
        container, 
        `${exportOptions.fileName}-表格组-${i+1}`, 
        exportOptions
      );
    }
    return;
  }
  
  // 如果只有一个表格，直接导出
  if (allTables.length === 1) {
    const table = allTables[0];
    const processedData = processTableWithCorrectStructure(table, exportOptions);
    
    await exportToExcel(
      processedData.data, 
      processedData.merges, 
      processedData.styles,
      exportOptions.fileName, 
      exportOptions
    );
  }
}

/**
 * 使用此函数处理导出表格时的样式参数
 * @param {Object} options - 用户提供的样式选项
 * @returns {Object} 处理后的样式选项
 */
function processStyleOptions(options = {}) {
  // 默认选项
  const defaultOptions = {
    includeHeaders: true,       // 是否包含表头
    parseStyles: true,          // 是否解析内联样式
    defaultAlignment: 'center', // 默认文本对齐方式
    headerStyle: true,          // 是否应用表头样式
    zebra: false,               // 是否应用斑马纹
    borders: true,              // 是否应用边框
    wrapText: true,             // 是否启用自动换行
    debug: false                // 是否输出调试信息
  };
  
  return { ...defaultOptions, ...options };
}

/**
 * 为页面添加导出表格按钮
 * @param {Object} options - 按钮和导出选项
 */
function addExportButton(options = {}) {
  // 默认选项
  const defaultOptions = {
    buttonText: '导出表格到Excel',
    buttonPosition: 'top-right',
    buttonStyle: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      fontSize: '14px'
    },
    fileName: '导出表格',
    exportOptions: {}
  };
  
  const settings = { ...defaultOptions, ...options };
  
  // 创建按钮元素
  const button = document.createElement('button');
  button.textContent = settings.buttonText;
  button.id = 'export-table-button';
  
  // 应用按钮样式
  Object.assign(button.style, settings.buttonStyle);
  
  // 设置按钮位置
  button.style.position = 'fixed';
  switch (settings.buttonPosition) {
    case 'top-right':
      button.style.top = '20px';
      button.style.right = '20px';
      break;
    case 'top-left':
      button.style.top = '20px';
      button.style.left = '20px';
      break;
    case 'bottom-right':
      button.style.bottom = '20px';
      button.style.right = '20px';
      break;
    case 'bottom-left':
      button.style.bottom = '20px';
      button.style.left = '20px';
      break;
    default:
      button.style.top = '20px';
      button.style.right = '20px';
  }
  
  // 设置z-index确保按钮在最上层
  button.style.zIndex = '9999';
  
  // 添加点击事件
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = '导出中...';
    
    try {
      // 合并导出选项
      const exportOptions = processStyleOptions({
        ...settings.exportOptions,
        fileName: settings.fileName
      });
      
      // 执行导出
      await autoDetectAndExportTables(exportOptions);
      
      // 导出成功提示
      button.textContent = '导出成功!';
      setTimeout(() => {
        button.textContent = settings.buttonText;
        button.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('导出失败:', error);
      button.textContent = '导出失败!';
      setTimeout(() => {
        button.textContent = settings.buttonText;
        button.disabled = false;
      }, 2000);
    }
  });
  
  // 添加按钮到页面
  document.body.appendChild(button);
  
  return button;
}

// 示例使用方法:
// 1. 导出特定容器内的嵌套表格
// exportNestedTablesToExcel('#tableContainer', '我的嵌套表格', { defaultAlignment: 'center' });

// 2. 自动检测页面上的表格结构并导出（默认居中对齐）
// autoDetectAndExportTables({ defaultAlignment: 'center' });

// 3. 添加一个导出按钮到页面
// addExportButton({
//   buttonText: '导出表格',
//   fileName: '我的表格数据',
//   exportOptions: { defaultAlignment: 'center' }
// });
