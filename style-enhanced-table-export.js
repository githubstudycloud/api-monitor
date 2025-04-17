/**
 * 增强版表格导出工具 - 支持字体居中和内联样式解析
 * 在原有功能基础上，增加了:
 * 1. 字体居中对齐功能
 * 2. 解析和应用网页表格的内联样式
 * 3. 更精确的样式映射到Excel
 */

// 保留原有的SheetJS加载函数
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
 * 增强版表格数据处理函数，增加了样式提取逻辑
 * @param {HTMLElement} container - 包含表格的容器元素
 * @param {Object} options - 配置选项
 * @returns {Object} 处理后的数据和样式信息
 */
function processTableData(container, options = {}) {
  const defaults = {
    includeHeaders: true,      // 是否包含标题
    processNestedTables: true, // 是否处理嵌套表格
    detectMergedCells: true,   // 是否检测合并单元格
    extractStyles: true,       // 是否提取内联样式 - 新增选项
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
  
  // 从标题表格提取标题数据（保持正确的列对齐，同时提取样式）
  const headerData = extractTableDataWithStyles(headerTable, maxColumns, settings);
  
  // 从数据表格提取数据（保持正确的列对齐，同时提取样式）
  const bodyData = extractTableDataWithStyles(dataTable, maxColumns, settings);
  
  // 合并标题和数据
  const combinedRows = [...headerData.rows, ...bodyData.rows];
  
  // 合并合并单元格信息，注意调整行索引
  const merges = [
    ...headerData.merges,
    ...bodyData.merges.map(merge => ({
      s: { r: merge.s.r + headerData.rows.length, c: merge.s.c },
      e: { r: merge.e.r + headerData.rows.length, c: merge.e.c }
    }))
  ];
  
  // 合并样式信息，注意调整行索引
  const styles = [
    ...headerData.styles,
    ...bodyData.styles.map(style => ({
      row: style.row + headerData.rows.length,
      col: style.col,
      style: style.style
    }))
  ];
  
  // 转换为普通数组（只含值）
  const flatData = combinedRows.map(row => row.map(cell => cell.value));
  
  return { data: flatData, merges, styles };
}

/**
 * 从表格提取数据和样式信息，增强版
 * @param {HTMLTableElement} table - 表格元素
 * @param {number} maxColumns - 最大列数
 * @param {Object} settings - 配置设置
 * @returns {Object} 处理后的行数据、合并单元格信息和样式信息
 */
function extractTableDataWithStyles(table, maxColumns, settings) {
  const rows = table.querySelectorAll('tr');
  const resultRows = [];
  const merges = [];
  const styles = []; // 用于存储样式信息
  
  // 创建跟踪矩阵，记录哪些单元格被跨行单元格占用
  const spanMatrix = Array(rows.length).fill().map(() => Array(maxColumns).fill(false));
  
  // 第一遍：收集所有单元格信息（包括合并单元格和样式）
  const cellsInfo = [];
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
      const cellStyle = settings.extractStyles ? extractCellStyle(cell) : {};
      
      // 记录此单元格信息
      cellsInfo.push({
        row: rowIndex,
        col: colIndex,
        rowSpan,
        colSpan,
        value: cell.textContent.trim(),
        style: cellStyle
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
  
  // 第二遍：构建结果行，正确处理合并单元格和样式
  // 初始化空结果数组
  for (let i = 0; i < rows.length; i++) {
    resultRows.push(Array(maxColumns).fill({ value: '' }));
  }
  
  // 填充单元格值和样式信息
  cellsInfo.forEach(info => {
    // 添加单元格值到结果数组
    resultRows[info.row][info.col] = { value: info.value };
    
    // 记录样式信息
    if (settings.extractStyles && Object.keys(info.style).length > 0) {
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
 * 从HTML单元格提取内联样式和计算样式
 * @param {HTMLTableCellElement} cell - 表格单元格元素
 * @returns {Object} 提取的样式信息
 */
function extractCellStyle(cell) {
  // 获取计算样式
  const computedStyle = window.getComputedStyle(cell);
  const style = {};
  
  // 提取文本对齐方式
  const textAlign = computedStyle.textAlign || cell.style.textAlign;
  if (textAlign) {
    style.alignment = style.alignment || {};
    style.alignment.horizontal = mapTextAlign(textAlign);
  }
  
  // 提取垂直对齐方式
  const verticalAlign = computedStyle.verticalAlign || cell.style.verticalAlign;
  if (verticalAlign) {
    style.alignment = style.alignment || {};
    style.alignment.vertical = mapVerticalAlign(verticalAlign);
  }
  
  // 提取字体粗细
  const fontWeight = computedStyle.fontWeight || cell.style.fontWeight;
  if (fontWeight && (fontWeight === 'bold' || parseInt(fontWeight) >= 600)) {
    style.font = style.font || {};
    style.font.bold = true;
  }
  
  // 提取字体样式（斜体）
  const fontStyle = computedStyle.fontStyle || cell.style.fontStyle;
  if (fontStyle === 'italic') {
    style.font = style.font || {};
    style.font.italic = true;
  }
  
  // 提取字体颜色
  const color = computedStyle.color || cell.style.color;
  if (color && color !== 'rgb(0, 0, 0)' && color !== '#000000') {
    style.font = style.font || {};
    style.font.color = { rgb: rgbToHex(color) };
  }
  
  // 提取背景色
  const bgColor = computedStyle.backgroundColor || cell.style.backgroundColor;
  if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
    style.fill = { patternType: 'solid', fgColor: { rgb: rgbToHex(bgColor) } };
  }
  
  // 检查是否为表头或带强调样式的单元格
  const isHeader = cell.tagName.toLowerCase() === 'th';
  if (isHeader) {
    style.font = style.font || {};
    style.font.bold = true;
    
    // 如果没有明确指定文本对齐，表头默认居中
    if (!style.alignment || !style.alignment.horizontal) {
      style.alignment = style.alignment || {};
      style.alignment.horizontal = 'center';
    }
  }
  
  return style;
}

/**
 * 将CSS文本对齐方式映射到Excel格式
 * @param {String} cssTextAlign - CSS文本对齐值
 * @returns {String} Excel对齐方式
 */
function mapTextAlign(cssTextAlign) {
  switch (cssTextAlign.toLowerCase()) {
    case 'center': return 'center';
    case 'right': return 'right';
    case 'justify': return 'justify';
    case 'left':
    default: return 'left';
  }
}

/**
 * 将CSS垂直对齐方式映射到Excel格式
 * @param {String} cssVerticalAlign - CSS垂直对齐值
 * @returns {String} Excel垂直对齐方式
 */
function mapVerticalAlign(cssVerticalAlign) {
  switch (cssVerticalAlign.toLowerCase()) {
    case 'top': return 'top';
    case 'bottom': return 'bottom';
    case 'middle':
    default: return 'center';
  }
}

/**
 * 将RGB颜色转换为HEX格式
 * @param {String} rgb - RGB颜色字符串，如 'rgb(255, 0, 0)' 或 '#FF0000'
 * @returns {String} HEX颜色字符串，不带#前缀
 */
function rgbToHex(rgb) {
  // 如果已经是HEX格式，直接返回（去掉#前缀）
  if (rgb.startsWith('#')) {
    return rgb.slice(1);
  }
  
  // 提取RGB值
  const rgbMatch = rgb.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    
    // 转换为HEX
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }
  
  // 无法解析的颜色，返回默认黑色
  return '000000';
}

/**
 * 处理单个表格的数据，确保正确处理合并单元格和样式
 * @param {HTMLTableElement} table - 表格元素
 * @param {Object} settings - 配置设置
 * @returns {Object} 处理后的数据、合并单元格信息和样式信息
 */
function processTableWithCorrectStructure(table, settings) {
  // 确定最大列数
  const maxColumns = determineMaxColumns([table]);
  
  // 提取表格数据，保持正确的列对齐，同时提取样式
  const processedData = extractTableDataWithStyles(table, maxColumns, settings);
  
  // 转换为简单数组格式
  const flatData = processedData.rows.map(row => row.map(cell => cell.value));
  
  return { 
    data: flatData, 
    merges: processedData.merges,
    styles: processedData.styles
  };
}

/**
 * 将处理好的数据导出为Excel文件，支持文本对齐和内联样式
 * @param {Array} data - 表格数据
 * @param {Array} merges - 合并单元格信息
 * @param {Array} styles - 单元格样式信息（可选）
 * @param {String} fileName - 文件名
 * @param {Object} options - 其他选项
 */
async function exportToExcel(data, merges, styles, fileName = 'table-export', options = {}) {
  try {
    // 处理参数重载，支持旧版API
    if (typeof styles === 'string') {
      options = fileName || {};
      fileName = styles;
      styles = [];
    }
    
    // 加载SheetJS库
    const XLSX = await loadSheetJS();
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(data.data || data);
    
    // 如果有合并单元格，添加到工作表
    if (merges && merges.length > 0) {
      ws['!merges'] = merges;
    }
    
    // 自动调整列宽
    autoAdjustColumnWidths(ws, data.data || data);
    
    // 自动调整行高
    autoAdjustRowHeights(ws, data.data || data);
    
    // 应用提取的单元格样式（如果有）
    if (styles && styles.length > 0) {
      applyCellStyles(ws, styles);
    }
    
    // 添加基础样式信息
    addStylesInfo(ws, data.data || data, options);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Sheet1');
    
    // 在浏览器中导出为Excel文件
    // 将工作簿转换为二进制数据
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
 * 将提取的样式应用到Excel工作表
 * @param {Object} ws - 工作表对象
 * @param {Array} styles - 样式信息数组
 */
function applyCellStyles(ws, styles) {
  styles.forEach(styleInfo => {
    const { row, col, style } = styleInfo;
    
    // 生成单元格地址
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    
    // 确保单元格存在
    if (!ws[cellAddress]) return;
    
    // 应用样式
    ws[cellAddress].s = ws[cellAddress].s || {};
    
    // 合并各种样式属性
    if (style.alignment) {
      ws[cellAddress].s.alignment = { ...ws[cellAddress].s.alignment, ...style.alignment };
    }
    
    if (style.font) {
      ws[cellAddress].s.font = { ...ws[cellAddress].s.font, ...style.font };
    }
    
    if (style.fill) {
      ws[cellAddress].s.fill = style.fill;
    }
    
    if (style.border) {
      ws[cellAddress].s.border = { ...ws[cellAddress].s.border, ...style.border };
    }
  });
}

/**
 * 增强版的基础样式设置函数
 * @param {Object} ws - 工作表对象
 * @param {Array} data - 表格数据
 * @param {Object} options - 样式选项
 */
function addStylesInfo(ws, data, options = {}) {
  // 默认样式选项
  const defaultOptions = {
    headerStyle: true,     // 是否应用表头样式
    headerRows: 1,         // 表头行数
    zebra: false,          // 是否应用斑马纹
    borders: true,         // 是否应用边框
    wrapText: true,        // 是否启用自动换行
    centerHeaders: true,   // 是否居中表头 - 新增选项
    autoTextAlign: true    // 是否自动应用文本对齐 - 新增选项
  };
  
  const styleOptions = { ...defaultOptions, ...options };
  
  // 为每个单元格设置通用属性
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let row = range.s.r; row <= range.e.r; ++row) {
    for (let col = range.s.c; col <= range.e.c; ++col) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];
      
      if (!cell) continue;
      
      // 确保cell.s对象存在
      if (!cell.s) cell.s = {};
      
      // 启用自动换行
      if (styleOptions.wrapText) {
        cell.s.alignment = cell.s.alignment || {};
        cell.s.alignment.wrapText = true;
        
        // 如果没有指定垂直对齐，设置为顶部对齐
        if (cell.s.alignment.vertical === undefined) {
          cell.s.alignment.vertical = 'top';
        }
      }
      
      // 如果是表头，应用表头样式
      if (styleOptions.headerStyle && row < styleOptions.headerRows) {
        // 添加粗体
        cell.s.font = cell.s.font || {};
        cell.s.font.bold = true;
        
        // 居中表头
        if (styleOptions.centerHeaders) {
          cell.s.alignment = cell.s.alignment || {};
          // 只有在没有明确设置水平对齐时才应用居中
          if (!cell.s.alignment.horizontal) {
            cell.s.alignment.horizontal = 'center';
          }
        }
        
        // 添加浅灰背景
        if (!cell.s.fill) {
          cell.s.fill = {
            patternType: 'solid',
            fgColor: { rgb: "F2F2F2" }
          };
        }
      }
      
      // 应用斑马纹样式
      if (styleOptions.zebra && row >= styleOptions.headerRows && row % 2 === 1) {
        // 只有在没有明确设置背景色时才应用斑马纹
        if (!cell.s.fill) {
          cell.s.fill = {
            patternType: 'solid',
            fgColor: { rgb: "FAFAFA" }
          };
        }
      }
      
      // 应用边框
      if (styleOptions.borders && !cell.s.border) {
        cell.s.border = {
          top: { style: 'thin', color: { rgb: "D0D0D0" } },
          left: { style: 'thin', color: { rgb: "D0D0D0" } },
          bottom: { style: 'thin', color: { rgb: "D0D0D0" } },
          right: { style: 'thin', color: { rgb: "D0D0D0" } }
        };
        
        // 表头底部加粗边框
        if (row === styleOptions.headerRows - 1) {
          cell.s.border.bottom = { style: 'medium', color: { rgb: "AAAAAA" } };
        }
      }
    }
  }
}

/**
 * 导出包含嵌套表格的容器为Excel，支持样式继承
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
  
  // 处理表格数据，默认提取样式
  const processedData = processTableData(containerElement, {
    ...options,
    extractStyles: options.extractStyles !== false // 默认为true
  });
  
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
 * 自动识别页面上的表格结构并导出，支持样式保留
 * @param {Object} options - 导出选项
 */
async function autoDetectAndExportTables(options = {}) {
  // 获取页面上所有表格
  const allTables = document.querySelectorAll('table');
  console.log(`页面上共有 ${allTables.length} 个表格`);
  
  // 如果没有表格，直接返回
  if (allTables.length === 0) {
    console.error('页面上没有找到表格');
    return;
  }
  
  const exportOptions = {
    extractStyles: true, // 默认提取样式
    centerHeaders: true, // 默认表头居中
    ...options
  };
  
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
    console.log(`找到 ${nestedTableContainers.length} 个嵌套表格容器`);
    
    // 遍历每个容器并导出
    for (let i = 0; i < nestedTableContainers.length; i++) {
      await exportNestedTablesToExcel(
        nestedTableContainers[i], 
        `嵌套表格-${i+1}`, 
        { ...exportOptions, debug: true }
      );
    }
    return;
  }
  
  // 如果没有嵌套表格，检查是否有多个表格共同组成一个数据集
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
    
    console.log(`将表格分组为 ${tableGroups.length} 组`);
    
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
        `表格组-${i+1}`, 
        { ...exportOptions, debug: true }
      );
    }
    return;
  }
  
  // 如果只有一个表格，直接导出
  if (allTables.length === 1) {
    const table = allTables[0];
    const processedData = processTableWithCorrectStructure(table, { 
      ...exportOptions, 
      detectMergedCells: true 
    });
    
    await exportToExcel(
      processedData.data, 
      processedData.merges, 
      processedData.styles, 
      '表格导出', 
      exportOptions
    );
  }
}

// 保留原有功能但不覆盖
const originalFunctions = {
  loadSheetJS,
  processTableData,
  exportToExcel,
  exportNestedTablesToExcel,
  autoDetectAndExportTables
};

// 示例使用
// 1. 导出特定容器内的嵌套表格，保留样式
// exportNestedTablesToExcel('#tableContainer', '我的嵌套表格', { extractStyles: true, centerHeaders: true });

// 2. 自动检测页面上的表格结构并导出，保留样式
// autoDetectAndExportTables({ extractStyles: true, centerHeaders: true });

// 暴露主要函数，便于在控制台直接调用
window.exportTableWithStyles = exportNestedTablesToExcel;
window.autoDetectAndExportTablesWithStyles = autoDetectAndExportTables;
