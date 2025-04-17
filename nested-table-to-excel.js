/**
 * 允许用户自定义列宽和行高
 * @param {HTMLElement} container - 包含自定义设置的容器
 * @param {Array} columns - 列信息数组
 */
function addCustomWidthHeightControls(container, columns) {
  // 创建表格来显示列宽设置
  const table = document.createElement('table');
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    font-size: 14px;
  `;
  
  // 创建表头
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  // 列索引
  const indexHeader = document.createElement('th');
  indexHeader.textContent = '列';
  indexHeader.style.cssText = `
    padding: 8px;
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    text-align: left;
  `;
  headerRow.appendChild(indexHeader);
  
  // 预览
  const previewHeader = document.createElement('th');
  previewHeader.textContent = '预览';
  previewHeader.style.cssText = `
    padding: 8px;
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    text-align: left;
  `;
  headerRow.appendChild(previewHeader);
  
  // 宽度
  const widthHeader = document.createElement('th');
  widthHeader.textContent = '宽度';
  widthHeader.style.cssText = `
    padding: 8px;
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    text-align: left;
  `;
  headerRow.appendChild(widthHeader);
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // 创建表体
  const tbody = document.createElement('tbody');
  
  // 为每列创建一行
  columns.forEach((column, index) => {
    const row = document.createElement('tr');
    
    // 列索引
    const indexCell = document.createElement('td');
    indexCell.textContent = `${index + 1}`;
    indexCell.style.cssText = `
      padding: 8px;
      border: 1px solid #ddd;
      text-align: center;
    `;
    row.appendChild(indexCell);
    
    // 列内容预览
    const previewCell = document.createElement('td');
    previewCell.textContent = column.sample || '';
    previewCell.style.cssText = `
      padding: 8px;
      border: 1px solid #ddd;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;
    row.appendChild(previewCell);
    
    // 宽度设置
    const widthCell = document.createElement('td');
    widthCell.style.cssText = `
      padding: 8px;
      border: 1px solid #ddd;
    `;
    
    // 宽度输入
    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.value = column.width || 10;
    widthInput.min = 1;
    widthInput.max = 100;
    widthInput.id = `col-width-${index}`;
    widthInput.style.cssText = `
      width: 60px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    `;
    
    widthCell.appendChild(widthInput);
    row.appendChild(widthCell);
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
  
  // 添加批量设置按钮
  const bulkContainer = document.createElement('div');
  bulkContainer.style.cssText = `
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  const bulkLabel = document.createElement('span');
  bulkLabel.textContent = '批量设置列宽：';
  bulkLabel.style.cssText = `
    font-size: 14px;
  `;
  
  const bulkInput = document.createElement('input');
  bulkInput.type = 'number';
  bulkInput.value = 10;
  bulkInput.min = 1;
  bulkInput.max = 100;
  bulkInput.style.cssText = `
    width: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  `;
  
  const bulkButton = document.createElement('button');
  bulkButton.textContent = '应用到所有列';
  bulkButton.style.cssText = `
    background-color: #f1f1f1;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
  `;
  bulkButton.onclick = () => {
    const value = bulkInput.value;
    columns.forEach((_, index) => {
      const input = document.getElementById(`col-width-${index}`);
      if (input) {
        input.value = value;
      }
    });
  };
  
  bulkContainer.appendChild(bulkLabel);
  bulkContainer.appendChild(bulkInput);
  bulkContainer.appendChild(bulkButton);
  
  container.appendChild(bulkContainer);
  
  // 返回一个函数，用于获取用户设置的列宽
  return function() {
    const widths = [];
    columns.forEach((_, index) => {
      const input = document.getElementById(`col-width-${index}`);
      if (input) {
        widths.push(parseInt(input.value) || 10);
      } else {
        widths.push(10); // 默认宽度
      }
    });
    return widths;
  };
}

/**
 * 在Excel中添加数据筛选功能
 * @param {Object} ws - 工作表对象
 * @param {Number} headerRows - 表头行数
 */
function addFilterToWorksheet(ws, headerRows) {
  if (!ws || !headerRows) return;
  
  // 获取工作表范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  
  // 设置筛选范围（从表头最后一行到数据最后一行）
  const filterRange = {
    s: { r: headerRows - 1, c: range.s.c },
    e: { r: range.e.r, c: range.e.c }
  };
  
  // 将范围转换为Excel格式的引用
  const filterRef = XLSX.utils.encode_range(filterRange);
  
  // 添加筛选器
  ws['!autofilter'] = { ref: filterRef };
}

/**
 * 向Excel工作表添加冻结窗格
 * @param {Object} ws - 工作表对象
 * @param {Number} headerRows - 表头行数
 */
function addFreezePane(ws, headerRows) {
  if (!ws || !headerRows) return;
  
  // 设置冻结窗格（冻结表头行）
  ws['!freeze'] = {
    xSplit: 0,           // 从左侧冻结的列数
    ySplit: headerRows,  // 从顶部冻结的行数
    topLeftCell: XLSX.utils.encode_cell({ r: headerRows, c: 0 }),
    activePane: 'bottomRight'
  };
}

/**
 * 分析表格并提取列信息
 * @param {Array} data - 表格数据
 * @returns {Array} 列信息数组
 */
function analyzeColumns(data) {
  if (!data || !data.length) return [];
  
  const headerRowCount = detectHeaderRows(data);
  const headerRows = data.slice(0, headerRowCount);
  const dataRows = data.slice(headerRowCount);
  
  // 获取最大列数
  const maxColumns = data.reduce((max, row) => Math.max(max, row.length), 0);
  
  // 为每列创建信息对象
  const columns = [];
  for (let i = 0; i < maxColumns; i++) {
    // 尝试从最后一行表头获取列名
    let columnName = '';
    if (headerRows.length > 0) {
      const lastHeaderRow = headerRows[headerRows.length - 1];
      if (i < lastHeaderRow.length) {
        columnName = lastHeaderRow[i] || `列 ${i + 1}`;
      }
    }
    
    if (!columnName) {
      columnName = `列 ${i + 1}`;
    }
    
    // 获取列数据的样本
    let sample = '';
    if (dataRows.length > 0) {
      // 尝试获取第一个非空数据
      for (let j = 0; j < Math.min(5, dataRows.length); j++) {
        if (i < dataRows[j].length && dataRows[j][i]) {
          sample = String(dataRows[j][i]);
          break;
        }
      }
    }
    
    // 估算列宽
    const estimatedWidth = sample ? estimateTextWidth(sample) : 10;
    const headerWidth = columnName ? estimateTextWidth(columnName) : 10;
    
    columns.push({
      index: i,
      name: columnName,
      sample: sample,
      width: Math.max(estimatedWidth, headerWidth, 10)
    });
  }
  
  return columns;
}

/**
 * 显示高级导出选项对话框
 * @param {HTMLElement} container - 表格容器
 * @param {Function} callback - 完成后的回调函数
 */
function showAdvancedExportOptions(container, callback) {
  // 处理表格数据
  const processedData = processTableData(container, { debug: true });
  const data = processedData.data || [];
  
  if (!data || data.length === 0) {
    showErrorMessage('无法获取表格数据');
    if (callback) callback(null);
    return;
  }
  
  // 分析列信息
  const columns = analyzeColumns(data);
  
  // 创建对话框
  const dialogId = 'advanced-export-dialog-' + Date.now();
  
  // 创建对话框容器
  const dialogContainer = document.createElement('div');
  dialogContainer.id = dialogId;
  dialogContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: Arial, sans-serif;
  `;
  
  // 创建对话框面板
  const panel = document.createElement('div');
  panel.style.cssText = `
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    width: 700px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  `;
  
  // 创建标题
  const title = document.createElement('h2');
  title.textContent = '高级导出选项';
  title.style.cssText = `
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 20px;
    color: #333;
  `;
  panel.appendChild(title);
  
  // 创建选项卡
  const tabContainer = document.createElement('div');
  tabContainer.style.cssText = `
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
  `;
  
  const tabStyle = `
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    border-bottom: 3px solid transparent;
    margin-bottom: -1px;
  `;
  
  const activeTabStyle = `
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    border-bottom: 3px solid #4CAF50;
    color: #4CAF50;
    font-weight: bold;
    margin-bottom: -1px;
  `;
  
  const tabs = [
    { id: 'tab-general', label: '基本设置' },
    { id: 'tab-columns', label: '列设置' },
    { id: 'tab-style', label: '样式设置' },
    { id: 'tab-format', label: '格式设置' }
  ];
  
  const tabElements = {};
  const contentElements = {};
  
  // 创建选项卡按钮
  tabs.forEach(tab => {
    const tabElement = document.createElement('div');
    tabElement.id = tab.id;
    tabElement.textContent = tab.label;
    tabElement.style.cssText = tab.id === 'tab-general' ? activeTabStyle : tabStyle;
    
    tabElement.onclick = () => {
      // 更新选项卡样式
      Object.values(tabElements).forEach(el => {
        el.style.cssText = tabStyle;
      });
      tabElement.style.cssText = activeTabStyle;
      
      // 更新内容可见性
      Object.values(contentElements).forEach(el => {
        el.style.display = 'none';
      });
      contentElements[tab.id].style.display = 'block';
    };
    
    tabElements[tab.id] = tabElement;
    tabContainer.appendChild(tabElement);
  });
  
  panel.appendChild(tabContainer);
  
  // 创建内容区域
  tabs.forEach(tab => {
    const content = document.createElement('div');
    content.id = `content-${tab.id}`;
    content.style.cssText = tab.id === 'tab-general' ? '' : 'display: none;';
    contentElements[tab.id] = content;
    panel.appendChild(content);
  });
  
  // 填充基本设置选项卡
  const generalContent = contentElements['tab-general'];
  
  // 文件名和工作表名
  const filenameContainer = document.createElement('div');
  filenameContainer.style.cssText = `margin-bottom: 15px;`;
  
  const filenameLabel = document.createElement('label');
  filenameLabel.htmlFor = 'advanced-filename';
  filenameLabel.textContent = '文件名：';
  filenameLabel.style.cssText = `
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  `;
  
  const filenameInput = document.createElement('input');
  filenameInput.type = 'text';
  filenameInput.id = 'advanced-filename';
  filenameInput.value = '表格导出';
  filenameInput.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  `;
  
  filenameContainer.appendChild(filenameLabel);
  filenameContainer.appendChild(filenameInput);
  generalContent.appendChild(filenameContainer);
  
  const sheetNameContainer = document.createElement('div');
  sheetNameContainer.style.cssText = `margin-bottom: 15px;`;
  
  const sheetNameLabel = document.createElement('label');
  sheetNameLabel.htmlFor = 'advanced-sheetname';
  sheetNameLabel.textContent = '工作表名：';
  sheetNameLabel.style.cssText = `
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  `;
  
  const sheetNameInput = document.createElement('input');
  sheetNameInput.type = 'text';
  sheetNameInput.id = 'advanced-sheetname';
  sheetNameInput.value = '导出数据';
  sheetNameInput.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  `;
  
  sheetNameContainer.appendChild(sheetNameLabel);
  sheetNameContainer.appendChild(sheetNameInput);
  generalContent.appendChild(sheetNameContainer);
  
  // 基本选项
  const optionsContainer = document.createElement('div');
  optionsContainer.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  `;
  
  const generalOptions = [
    { id: 'include-title', label: '包含页面标题', checked: true },
    { id: 'include-timestamp', label: '包含导出时间戳', checked: true },
    { id: 'include-filter', label: '添加数据筛选功能', checked: true },
    { id: 'freeze-header', label: '冻结表头行', checked: true },
    { id: 'auto-width', label: '自动调整列宽', checked: true },
    { id: 'auto-height', label: '自动调整行高', checked: true }
  ];
  
  generalOptions.forEach(option => {
    const optionContainer = document.createElement('div');
    optionContainer.style.cssText = `
      display: flex;
      align-items: center;
    `;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = option.id;
    checkbox.checked = option.checked;
    checkbox.style.cssText = `
      margin-right: 8px;
    `;
    
    const label = document.createElement('label');
    label.htmlFor = option.id;
    label.textContent = option.label;
    label.style.cssText = `
      font-size: 14px;
    `;
    
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    optionsContainer.appendChild(optionContainer);
  });
  
  generalContent.appendChild(optionsContainer);
  
  // 填充列设置选项卡
  const columnsContent = contentElements['tab-columns'];
  const getColumnWidths = addCustomWidthHeightControls(columnsContent, columns);
  
  // 填充样式设置选项卡
  const styleContent = contentElements['tab-style'];
  
  const styleOptionsContainer = document.createElement('div');
  styleOptionsContainer.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  `;
  
  const styleOptions = [
    { id: 'header-style', label: '表头样式', checked: true },
    { id: 'zebra-style', label: '斑马纹样式', checked: true },
    { id: 'border-style', label: '边框样式', checked: true },
    { id: 'wrap-text', label: '文本自动换行', checked: true },
    { id: 'auto-detect-headers', label: '自动检测表头行数', checked: true }
  ];
  
  styleOptions.forEach(option => {
    const optionContainer = document.createElement('div');
    optionContainer.style.cssText = `
      display: flex;
      align-items: center;
    `;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = option.id;
    checkbox.checked = option.checked;
    checkbox.style.cssText = `
      margin-right: 8px;
    `;
    
    const label = document.createElement('label');
    label.htmlFor = option.id;
    label.textContent = option.label;
    label.style.cssText = `
      font-size: 14px;
    `;
    
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    styleOptionsContainer.appendChild(optionContainer);
  });
  
  styleContent.appendChild(styleOptionsContainer);
  
  // 表头行数设置
  const headerRowsContainer = document.createElement('div');
  headerRowsContainer.style.cssText = `
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  const headerRowsLabel = document.createElement('label');
  headerRowsLabel.htmlFor = 'header-rows';
  headerRowsLabel.textContent = '表头行数：';
  headerRowsLabel.style.cssText = `
    font-size: 14px;
  `;
  
  const headerRowsInput = document.createElement('input');
  headerRowsInput.type = 'number';
  headerRowsInput.id = 'header-rows';
  headerRowsInput.value = detectHeaderRows(data);
  headerRowsInput.min = 1;
  headerRowsInput.max = 10;
  headerRowsInput.style.cssText = `
    width: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  `;
  
  headerRowsContainer.appendChild(headerRowsLabel);
  headerRowsContainer.appendChild(headerRowsInput);
  styleContent.appendChild(headerRowsContainer);
  
  // 颜色选择器
  const colorPickerContainer = document.createElement('div');
  colorPickerContainer.style.cssText = `
    margin-bottom: 15px;
  `;
  
  const colorPickerTitle = document.createElement('h4');
  colorPickerTitle.textContent = '颜色设置';
  colorPickerTitle.style.cssText = `
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 16px;
  `;
  colorPickerContainer.appendChild(colorPickerTitle);
  
  const colorOptions = [
    { id: 'header-bg-color', label: '表头背景色', value: '#EEEEEE' },
    { id: 'zebra-bg-color', label: '斑马纹背景色', value: '#F9F9F9' },
    { id: 'border-color', label: '边框颜色', value: '#D0D0D0' }
  ];
  
  colorOptions.forEach(option => {
    const colorRow = document.createElement('div');
    colorRow.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    `;
    
    const colorLabel = document.createElement('label');
    colorLabel.htmlFor = option.id;
    colorLabel.textContent = option.label;
    colorLabel.style.cssText = `
      font-size: 14px;
      width: 120px;
      margin-right: 10px;
    `;
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = option.id;
    colorInput.value = option.value;
    colorInput.style.cssText = `
      width: 40px;
      height: 24px;
      border: none;
      padding: 0;
      background: none;
    `;
    
    colorRow.appendChild(colorLabel);
    colorRow.appendChild(colorInput);
    colorPickerContainer.appendChild(colorRow);
  });
  
  styleContent.appendChild(colorPickerContainer);
  
  // 填充格式设置选项卡
  const formatContent = contentElements['tab-format'];
  
  const formatOptionsContainer = document.createElement('div');
  formatOptionsContainer.style.cssText = `
    margin-bottom: 15px;
  `;
  
  const formatOptions = [
    { id: 'detect-data-types', label: '自动检测数据类型', checked: true },
    { id: 'format-numbers', label: '格式化数字', checked: true },
    { id: 'format-dates', label: '格式化日期', checked: true },
    { id: 'format-currency', label: '格式化货币', checked: true },
    { id: 'format-percent', label: '格式化百分比', checked: true }
  ];
  
  formatOptions.forEach(option => {
    const optionContainer = document.createElement('div');
    optionContainer.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    `;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = option.id;
    checkbox.checked = option.checked;
    checkbox.style.cssText = `
      margin-right: 8px;
    `;
    
    const label = document.createElement('label');
    label.htmlFor = option.id;
    label.textContent = option.label;
    label.style.cssText = `
      font-size: 14px;
    `;
    
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    formatOptionsContainer.appendChild(optionContainer);
  });
  
  formatContent.appendChild(formatOptionsContainer);
  
  // 数字格式设置
  const numberFormatContainer = document.createElement('div');
  numberFormatContainer.style.cssText = `
    margin-bottom: 15px;
  `;
  
  const numberFormatTitle = document.createElement('h4');
  numberFormatTitle.textContent = '数字格式设置';
  numberFormatTitle.style.cssText = `
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 16px;
  `;
  numberFormatContainer.appendChild(numberFormatTitle);
  
  const decimalPlacesContainer = document.createElement('div');
  decimalPlacesContainer.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  `;
  
  const decimalPlacesLabel = document.createElement('label');
  decimalPlacesLabel.htmlFor = 'decimal-places';
  decimalPlacesLabel.textContent = '小数位数：';
  decimalPlacesLabel.style.cssText = `
    font-size: 14px;
    width: 120px;
    margin-right: 10px;
  `;
  
  const decimalPlacesInput = document.createElement('input');
  decimalPlacesInput.type = 'number';
  decimalPlacesInput.id = 'decimal-places';
  decimalPlacesInput.value = 2;
  decimalPlacesInput.min = 0;
  decimalPlacesInput.max = 10;
  decimalPlacesInput.style.cssText = `
    width: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  `;
  
  decimalPlacesContainer.appendChild(decimalPlacesLabel);
  decimalPlacesContainer.appendChild(decimalPlacesInput);
  numberFormatContainer.appendChild(decimalPlacesContainer);
  
  const thousandSeparatorContainer = document.createElement('div');
  thousandSeparatorContainer.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  `;
  
  const thousandSeparatorCheckbox = document.createElement('input');
  thousandSeparatorCheckbox.type = 'checkbox';
  thousandSeparatorCheckbox.id = 'thousand-separator';
  thousandSeparatorCheckbox.checked = true;
  thousandSeparatorCheckbox.style.cssText = `
    margin-right: 8px;
  `;
  
  const thousandSeparatorLabel = document.createElement('label');
  thousandSeparatorLabel.htmlFor = 'thousand-separator';
  thousandSeparatorLabel.textContent = '使用千位分隔符';
  thousandSeparatorLabel.style.cssText = `
    font-size: 14px;
  `;
  
  thousandSeparatorContainer.appendChild(thousandSeparatorCheckbox);
  thousandSeparatorContainer.appendChild(thousandSeparatorLabel);
  numberFormatContainer.appendChild(thousandSeparatorContainer);
  
  formatContent.appendChild(numberFormatContainer);
  
  // 日期格式设置
  const dateFormatContainer = document.createElement('div');
  dateFormatContainer.style.cssText = `
    margin-bottom: 15px;
  `;
  
  const dateFormatTitle = document.createElement('h4');
  dateFormatTitle.textContent = '日期格式设置';
  dateFormatTitle.style.cssText = `
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 16px;
  `;
  dateFormatContainer.appendChild(dateFormatTitle);
  
  const dateFormatSelectContainer = document.createElement('div');
  dateFormatSelectContainer.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  `;
  
  const dateFormatLabel = document.createElement('label');
  dateFormatLabel.htmlFor = 'date-format';
  dateFormatLabel.textContent = '日期格式：';
  dateFormatLabel.style.cssText = `
    font-size: 14px;
    width: 120px;
    margin-right: 10px;
  `;
  
  const dateFormatSelect = document.createElement('select');
  dateFormatSelect.id = 'date-format';
  dateFormatSelect.style.cssText = `
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 150px;
  `;
  
  const dateFormats = [
    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
    { value: 'yyyy/mm/dd', label: 'YYYY/MM/DD' },
    { value: 'dd-mm-yyyy', label: 'DD-MM-YYYY' },
    { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
    { value: 'mm-dd-yyyy', label: 'MM-DD-YYYY' },
    { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' }
  ];
  
  dateFormats.forEach(format => {
    const option = document.createElement('option');
    option.value = format.value;
    option.textContent = format.label;
    dateFormatSelect.appendChild(option);
  });
  
  dateFormatSelectContainer.appendChild(dateFormatLabel);
  dateFormatSelectContainer.appendChild(dateFormatSelect);
  dateFormatContainer.appendChild(dateFormatSelectContainer);
  
  formatContent.appendChild(dateFormatContainer);
  
  // 按钮容器
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  `;
  
  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '取消';
  cancelButton.style.cssText = `
    background-color: #f1f1f1;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;
  cancelButton.onclick = () => {
    document.body.removeChild(dialogContainer);
    if (callback) callback(null);
  };
  
  // 确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.textContent = '导出';
  confirmButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
  `;
  confirmButton.onclick = () => {
    // 收集所有设置
    const settings = {
      // 基本设置
      fileName: document.getElementById('advanced-filename').value || '表格导出',
      sheetName: document.getElementById('advanced-sheetname').value || '导出数据',
      includeTitle: document.getElementById('include-title').checked,
      includeTimestamp: document.getElementById('include-timestamp').checked,
      includeFilter: document.getElementById('include-filter').checked,
      freezeHeader: document.getElementById('freeze-header').checked,
      autoWidth: document.getElementById('auto-width').checked,
      autoHeight: document.getElementById('auto-height').checked,
      
      // 列设置
      columnWidths: getColumnWidths(),
      
      // 样式设置
      headerStyle: document.getElementById('header-style').checked,
      zebraStyle: document.getElementById('zebra-style').checked,
      borderStyle: document.getElementById('border-style').checked,
      wrapText: document.getElementById('wrap-text').checked,
      autoDetectHeaders: document.getElementById('auto-detect-headers').checked,
      headerRows: parseInt(document.getElementById('header-rows').value) || 1,
      headerBgColor: document.getElementById('header-bg-color').value,
      zebraBgColor: document.getElementById('zebra-bg-color').value,
      borderColor: document.getElementById('border-color').value,
      
      // 格式设置
      detectDataTypes: document.getElementById('detect-data-types').checked,
      formatNumbers: document.getElementById('format-numbers').checked,
      formatDates: document.getElementById('format-dates').checked,
      formatCurrency: document.getElementById('format-currency').checked,
      formatPercent: document.getElementById('format-percent').checked,
      decimalPlaces: parseInt(document.getElementById('decimal-places').value) || 2,
      thousandSeparator: document.getElementById('thousand-separator').checked,
      dateFormat: document.getElementById('date-format').value
    };
    
    // 移除对话框
    document.body.removeChild(dialogContainer);
    
    // 调用回调函数
    if (callback) callback(settings);
  };
  
  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(confirmButton);
  panel.appendChild(buttonsContainer);
  
  // 添加对话框到页面
  dialogContainer.appendChild(panel);
  document.body.appendChild(dialogContainer);
}

/**
 * 更新exportToExcel函数，支持新的高级选项
 */
async function exportToExcelWithAdvancedOptions(data, merges, fileName = 'table-export', options = {}) {
  try {
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
    
    // 根据选项调整列宽
    if (options.autoWidth || options.columnWidths) {
      const cols = [];
      
      if (options.columnWidths && Array.isArray(options.columnWidths)) {
        // 使用用户指定的列宽
        options.columnWidths.forEach((width, i) => {
          cols.push({ wch: width });
        });
      } else {
        // 自动计算列宽
        autoAdjustColumnWidths(ws, data.data || data);
      }
      
      ws['!cols'] = cols;
    }
    
    // 根据选项调整行高
    if (options.autoHeight) {
      autoAdjustRowHeights(ws, data.data || data);
    }
    
    // 添加数据筛选
    if (options.includeFilter) {
      addFilterToWorksheet(ws, options.headerRows || 1);
    }
    
    // 添加冻结窗格
    if (options.freezeHeader) {
      addFreezePane(ws, options.headerRows || 1);
    }
    
    // 添加样式信息
    addStylesInfo(ws, data.data || data, {
      headerStyle: options.headerStyle,
      headerRows: options.headerRows,
      zebra: options.zebraStyle,
      borders: options.borderStyle,
      wrapText: options.wrapText,
      detectHeaderRows: options.autoDetectHeaders,
      headerBgColor: options.headerBgColor,
      zebraBgColor: options.zebraBgColor,
      borderColor: options.borderColor
    });
    
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
 * 更新控制面板，添加高级导出按钮
 */
function updateExportButton() {
  // 查找已有的导出按钮
  const existingButton = document.getElementById('excel-export-floating-button');
  
  if (existingButton) {
    // 查找菜单容器
    const menuContainer = existingButton.querySelector('div');
    
    if (menuContainer) {
      // 检查高级导出按钮是否已存在
      if (!document.getElementById('advanced-export-button')) {
        // 创建高级导出按钮
        const advancedExportButton = document.createElement('button');
        advancedExportButton.id = 'advanced-export-button';
        advancedExportButton.innerHTML = '高级导出设置';
        advancedExportButton.style.cssText = `
          background-color: #f1f1f1;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background-color 0.2s;
        `;
        
        advancedExportButton.onmouseover = () => {
          advancedExportButton.style.backgroundColor = '#e8e8e8';
        };
        
        advancedExportButton.onmouseout = () => {
          advancedExportButton.style.backgroundColor = '#f1f1f1';
        };
        
        advancedExportButton.onclick = () => {
          menuContainer.style.display = 'none';
          
          // 获取当前可见的表格
          const tables = Array.from(document.querySelectorAll('table')).filter(table => {
            const rect = table.getBoundingClientRect();
            return (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
          });
          
          if (tables.length === 0) {
            showErrorMessage('当前视图中没有可见的表格');
            return;
          }
          
          if (tables.length === 1) {
            showAdvancedExportOptions(tables[0], (settings) => {
              if (settings) {
                const loadingId = showLoadingOverlay('正在使用高级设置导出表格...');
                
                try {
                  // 处理表格数据
                  const processedData = processTableData(tables[0], { debug: true });
                  
                  // 使用高级设置导出
                  exportToExcelWithAdvancedOptions(
                    processedData,
                    processedData.merges,
                    settings.fileName,
                    settings
                  );
                  
                  showSuccessMessage(`表格已使用高级设置成功导出为 ${settings.fileName}.xlsx`);
                } catch (error) {
                  console.error('导出表格时发生错误:', error);
                  showErrorMessage('导出表格时发生错误，请查看控制台以获取详细信息');
                } finally {
                  hideLoadingOverlay(loadingId);
                }
              }
            });
          } else {
            showTableSelector(tables, '选择要高级导出的表格：', true);
          }
        };
        
        // 将按钮添加到菜单
        menuContainer.appendChild(advancedExportButton);
      }
    }
  } else {
    // 如果不存在导出按钮，先添加
    addExportButton();
    // 然后递归调用以添加高级导出按钮
    setTimeout(updateExportButton, 100);
  }
}

/**
 * 更新表格选择器，支持高级导出
 * @param {Array} tables - 表格元素数组
 * @param {String} title - 选择器标题
 * @param {Boolean} advancedMode - 是否使用高级模式
 */
function showTableSelector(tables, title, advancedMode = false) {
  const selectorId = 'table-export-selector-' + Date.now();
  
  // 创建选择器容器
  const container = document.createElement('div');
  container.id = selectorId;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  // 创建选择器面板
  const panel = document.createElement('div');
  panel.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    font-family: Arial, sans-serif;
  `;
  
  // 创建标题
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.style.marginTop = '0';
  panel.appendChild(titleElement);
  
  // 创建表格列表
  const list = document.createElement('div');
  list.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin: 15px 0;
  `;
  
  // 为每个表格创建一个预览项
  tables.forEach((table, index) => {
    const item = document.createElement('div');
    item.style.cssText = `
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    // 鼠标悬停效果
    item.onmouseover = () => {
      item.style.backgroundColor = '#f5f5f5';
    };
    item.onmouseout = () => {
      item.style.backgroundColor = 'white';
    };
    
    // 点击事件
    item.onclick = async () => {
      // 移除选择器
      document.body.removeChild(container);
      
      if (advancedMode) {
        // 显示高级导出选项
        showAdvancedExportOptions(table, (settings) => {
          if (settings) {
            const loadingId = showLoadingOverlay('正在使用高级设置导出表格...');
            
            try {
              // 处理表格数据
              const processedData = processTableData(table, { debug: true });
              
              // 使用高级设置导出
              exportToExcelWithAdvancedOptions(
                processedData,
                processedData.merges,
                settings.fileName,
                settings
              );
              
              showSuccessMessage(`表格已使用高级设置成功导出为 ${settings.fileName}.xlsx`);
            } catch (error) {
              console.error('导出表格时发生错误:', error);
              showErrorMessage('导出表格时发生错误，请查看控制台以获取详细信息');
            } finally {
              hideLoadingOverlay(loadingId);
            }
          }
        });
      } else {
        // 常规导出
        const loadingId = showLoadingOverlay(`正在导出选中的表格...`);
        
        try {
          // 导出选中的表格
          await preProcessAndExport(
            table, 
            `表格-${index + 1}`, 
            { debug: true }
          );
          showSuccessMessage(`表格 ${index + 1} 已成功导出`);
        } catch (error) {
          console.error('导出表格时发生错误:', error);
          showErrorMessage('导出表格时发生错误，请查看控制台以获取详细信息');
        } finally {
          hideLoadingOverlay(loadingId);
        }
      }
    };
    
    // 创建表格标题和预览
    const itemTitle = document.createElement('div');
    itemTitle.textContent = `表格 ${index + 1}`;
    itemTitle.style.fontWeight = 'bold';
    itemTitle.style.marginBottom = '10px';
    item.appendChild(itemTitle);
    
    // 添加表格简要信息
    const rows = table.querySelectorAll('tr');
    const rowCount = rows.length;
    let colCount = 0;
    if (rows.length > 0) {
      colCount = rows[0].querySelectorAll('th, td').length;
    }
    
    const info = document.createElement('div');
    info.textContent = `${rowCount} 行 × ${colCount} 列`;
    info.style.color = '#666';
    info.style.fontSize = '12px';
    item.appendChild(info);
    
    // 创建预览
    const preview = document.createElement('div');
    preview.style.cssText = `
      margin-top: 10px;
      font-size: 12px;
      color: #333;
      max-height: 100px;
      overflow: hidden;
      position: relative;
    `;
    
    // 获取表格的前几行作为预览
    let previewHTML = '';
    const maxRows = Math.min(3, rowCount);
    for (let i = 0; i < maxRows; i++) {
      const row = rows[i];
      const cells = row.querySelectorAll('th, td');
      let rowHTML = '';
      const maxCells = Math.min(3, cells.length);
      for (let j = 0; j < maxCells; j++) {
        rowHTML += cells[j].textContent.slice(0, 15) + (cells[j].textContent.length > 15 ? '...' : '') + ' | ';
      }
      if (cells.length > 3) {
        rowHTML += '... ';
      }
      previewHTML += rowHTML + '<br>';
    }
    if (rowCount > 3) {
      previewHTML += '...';
    }
    
    preview.innerHTML = previewHTML;
    
    // 添加渐变遮罩
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30px;
      background: linear-gradient(transparent, white);
    `;
    preview.appendChild(fadeOverlay);
    
    item.appendChild(preview);
    list.appendChild(item);
  });
  
  panel.appendChild(list);
  
  // 创建取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '取消';
  cancelButton.style.cssText = `
    background-color: #f1f1f1;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  `;
  cancelButton.onclick = () => {
    document.body.removeChild(container);
  };
  panel.appendChild(cancelButton);
  
  container.appendChild(panel);
  document.body.appendChild(container);
}

// 更新导出按钮，添加高级导出功能
if (document.readyState === 'complete') {
  updateExportButton();
} else {
  window.addEventListener('load', updateExportButton);
}/**
 * 添加一个用户友好的浮动导出按钮到页面
 */
function addExportButton() {
  // 检查是否已经存在导出按钮
  if (document.getElementById('excel-export-floating-button')) {
    return;
  }
  
  // 创建浮动按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'excel-export-floating-button';
  buttonContainer.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  `;
  
  // 创建主按钮
  const mainButton = document.createElement('button');
  mainButton.innerHTML = '<span style="font-size: 16px;">📊</span> 导出Excel';
  mainButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Arial, sans-serif;
    transition: all 0.3s ease;
  `;
  
  // 鼠标悬停效果
  mainButton.onmouseover = () => {
    mainButton.style.backgroundColor = '#45a049';
    mainButton.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
  };
  mainButton.onmouseout = () => {
    mainButton.style.backgroundColor = '#4CAF50';
    mainButton.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
  };
  
  // 创建菜单容器（初始隐藏）
  const menuContainer = document.createElement('div');
  menuContainer.style.cssText = `
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    display: none;
    flex-direction: column;
    gap: 8px;
    font-family: Arial, sans-serif;
    transition: all 0.3s ease;
  `;
  
  // 菜单按钮样式
  const menuButtonStyle = `
    background-color: #f1f1f1;
    color: #333;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: background-color 0.2s;
  `;
  
  // 创建自动检测按钮
  const autoDetectButton = document.createElement('button');
  autoDetectButton.innerHTML = '自动检测并导出表格';
  autoDetectButton.style.cssText = menuButtonStyle;
  autoDetectButton.onmouseover = () => {
    autoDetectButton.style.backgroundColor = '#e8e8e8';
  };
  autoDetectButton.onmouseout = () => {
    autoDetectButton.style.backgroundColor = '#f1f1f1';
  };
  autoDetectButton.onclick = () => {
    menuContainer.style.display = 'none';
    autoDetectAndExportTables();
  };
  
  // 创建选择表格按钮
  const selectTableButton = document.createElement('button');
  selectTableButton.innerHTML = '选择表格导出';
  selectTableButton.style.cssText = menuButtonStyle;
  selectTableButton.onmouseover = () => {
    selectTableButton.style.backgroundColor = '#e8e8e8';
  };
  selectTableButton.onmouseout = () => {
    selectTableButton.style.backgroundColor = '#f1f1f1';
  };
  selectTableButton.onclick = () => {
    menuContainer.style.display = 'none';
    
    // 获取所有表格
    const allTables = document.querySelectorAll('table');
    if (allTables.length === 0) {
      showErrorMessage('页面上没有找到表格');
      return;
    }
    
    // 显示表格选择器
    showTableSelector(Array.from(allTables), '选择要导出的表格：');
  };
  
  // 创建导出当前视图按钮
  const exportVisibleButton = document.createElement('button');
  exportVisibleButton.innerHTML = '导出当前可见表格';
  exportVisibleButton.style.cssText = menuButtonStyle;
  exportVisibleButton.onmouseover = () => {
    exportVisibleButton.style.backgroundColor = '#e8e8e8';
  };
  exportVisibleButton.onmouseout = () => {
    exportVisibleButton.style.backgroundColor = '#f1f1f1';
  };
  exportVisibleButton.onclick = () => {
    menuContainer.style.display = 'none';
    
    // 获取当前视窗中可见的表格
    const tables = Array.from(document.querySelectorAll('table')).filter(table => {
      const rect = table.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });
    
    if (tables.length === 0) {
      showErrorMessage('当前视图中没有可见的表格');
      return;
    }
    
    if (tables.length === 1) {
      exportNestedTablesToExcel(tables[0], '当前表格导出');
    } else {
      showTableSelector(tables, '选择当前视图中的表格：');
    }
  };
  
  // 创建设置按钮
  const settingsButton = document.createElement('button');
  settingsButton.innerHTML = '导出设置';
  settingsButton.style.cssText = menuButtonStyle;
  settingsButton.onmouseover = () => {
    settingsButton.style.backgroundColor = '#e8e8e8';
  };
  settingsButton.onmouseout = () => {
    settingsButton.style.backgroundColor = '#f1f1f1';
  };
  settingsButton.onclick = () => {
    menuContainer.style.display = 'none';
    showExportSettings();
  };
  
  // 将按钮添加到菜单
  menuContainer.appendChild(autoDetectButton);
  menuContainer.appendChild(selectTableButton);
  menuContainer.appendChild(exportVisibleButton);
  menuContainer.appendChild(settingsButton);
  
  // 点击主按钮显示/隐藏菜单
  mainButton.onclick = () => {
    if (menuContainer.style.display === 'none') {
      menuContainer.style.display = 'flex';
    } else {
      menuContainer.style.display = 'none';
    }
  };
  
  // 组装和添加到页面
  buttonContainer.appendChild(menuContainer);
  buttonContainer.appendChild(mainButton);
  document.body.appendChild(buttonContainer);
  
  // 点击其他地方关闭菜单
  document.addEventListener('click', (event) => {
    if (!buttonContainer.contains(event.target) && menuContainer.style.display !== 'none') {
      menuContainer.style.display = 'none';
    }
  });
}

/**
 * 显示导出设置对话框
 */
function showExportSettings() {
  const settingsId = 'excel-export-settings-' + Date.now();
  
  // 创建设置对话框容器
  const container = document.createElement('div');
  container.id = settingsId;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: Arial, sans-serif;
  `;
  
  // 创建设置面板
  const panel = document.createElement('div');
  panel.style.cssText = `
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    width: 500px;
    max-width: 90%;
  `;
  
  // 创建标题
  const title = document.createElement('h2');
  title.textContent = 'Excel导出设置';
  title.style.cssText = `
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 20px;
    color: #333;
  `;
  panel.appendChild(title);
  
  // 创建设置选项
  const options = [
    { id: 'includeTitle', label: '包含页面标题', default: true },
    { id: 'includeTimestamp', label: '包含导出时间戳', default: true },
    { id: 'smartDataDetection', label: '智能数据类型检测', default: true },
    { id: 'formatDetection', label: '检测并应用格式', default: true },
    { id: 'headerStyle', label: '应用表头样式', default: true },
    { id: 'zebra', label: '应用斑马纹样式', default: true },
    { id: 'borders', label: '应用表格边框', default: true },
    { id: 'wrapText', label: '自动换行文本', default: true },
    { id: 'detectHeaderRows', label: '自动检测表头行数', default: true }
  ];
  
  // 创建设置项目组
  const optionsContainer = document.createElement('div');
  optionsContainer.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 25px;
  `;
  
  // 添加每个设置选项
  options.forEach(option => {
    const optionContainer = document.createElement('div');
    optionContainer.style.cssText = `
      display: flex;
      align-items: center;
    `;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = option.id;
    checkbox.checked = option.default;
    checkbox.style.cssText = `
      margin-right: 8px;
    `;
    
    const label = document.createElement('label');
    label.htmlFor = option.id;
    label.textContent = option.label;
    label.style.cssText = `
      font-size: 14px;
      color: #333;
    `;
    
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    optionsContainer.appendChild(optionContainer);
  });
  
  panel.appendChild(optionsContainer);
  
  // 创建文件名输入框
  const filenameContainer = document.createElement('div');
  filenameContainer.style.cssText = `
    margin-bottom: 25px;
  `;
  
  const filenameLabel = document.createElement('label');
  filenameLabel.htmlFor = 'export-filename';
  filenameLabel.textContent = '导出文件名：';
  filenameLabel.style.cssText = `
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
  `;
  
  const filenameInput = document.createElement('input');
  filenameInput.type = 'text';
  filenameInput.id = 'export-filename';
  filenameInput.value = '表格导出';
  filenameInput.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  `;
  
  filenameContainer.appendChild(filenameLabel);
  filenameContainer.appendChild(filenameInput);
  panel.appendChild(filenameContainer);
  
  // 创建工作表名称输入框
  const sheetNameContainer = document.createElement('div');
  sheetNameContainer.style.cssText = `
    margin-bottom: 25px;
  `;
  
  const sheetNameLabel = document.createElement('label');
  sheetNameLabel.htmlFor = 'sheet-name';
  sheetNameLabel.textContent = '工作表名称：';
  sheetNameLabel.style.cssText = `
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
  `;
  
  const sheetNameInput = document.createElement('input');
  sheetNameInput.type = 'text';
  sheetNameInput.id = 'sheet-name';
  sheetNameInput.value = '导出数据';
  sheetNameInput.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  `;
  
  sheetNameContainer.appendChild(sheetNameLabel);
  sheetNameContainer.appendChild(sheetNameInput);
  panel.appendChild(sheetNameContainer);
  
  // 创建按钮容器
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  `;
  
  // 创建取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '取消';
  cancelButton.style.cssText = `
    background-color: #f1f1f1;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;
  cancelButton.onclick = () => {
    document.body.removeChild(container);
  };
  
  // 创建保存按钮
  const saveButton = document.createElement('button');
  saveButton.textContent = '应用设置';
  saveButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;
  saveButton.onclick = () => {
    // 收集设置
    const settings = {};
    options.forEach(option => {
      settings[option.id] = document.getElementById(option.id).checked;
    });
    
    settings.fileName = document.getElementById('export-filename').value || '表格导出';
    settings.sheetName = document.getElementById('sheet-name').value || '导出数据';
    
    // 保存设置到localStorage
    localStorage.setItem('excelExportSettings', JSON.stringify(settings));
    
    // 关闭设置面板
    document.body.removeChild(container);
    
    // 显示成功消息
    showSuccessMessage('导出设置已保存');
    
    // 可选：立即使用这些设置进行导出
    if (confirm('是否立即使用这些设置导出表格？')) {
      autoDetectAndExportTables(settings);
    }
  };
  
  // 添加按钮到按钮容器
  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(saveButton);
  
  // 添加按钮容器到面板
  panel.appendChild(buttonsContainer);
  
  // 添加面板到容器
  container.appendChild(panel);
  
  // 添加容器到文档
  document.body.appendChild(container);
  
  // 如果有保存的设置，加载它们
  const savedSettings = localStorage.getItem('excelExportSettings');
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings);
    
    // 应用保存的设置到UI
    options.forEach(option => {
      if (typeof parsedSettings[option.id] !== 'undefined') {
        document.getElementById(option.id).checked = parsedSettings[option.id];
      }
    });
    
    if (parsedSettings.fileName) {
      document.getElementById('export-filename').value = parsedSettings.fileName;
    }
    
    if (parsedSettings.sheetName) {
      document.getElementById('sheet-name').value = parsedSettings.sheetName;
    }
  }
}

// 获取导出设置（合并默认值和用户设置）
function getExportSettings() {
  // 默认设置
  const defaultSettings = {
    includeTitle: true,
    includeTimestamp: true,
    smartDataDetection: true,
    formatDetection: true,
    headerStyle: true,
    zebra: true,
    borders: true,
    wrapText: true,
    detectHeaderRows: true,
    fileName: '表格导出',
    sheetName: '导出数据'
  };
  
  // 尝试从localStorage获取用户设置
  const savedSettings = localStorage.getItem('excelExportSettings');
  if (savedSettings) {
    try {
      const userSettings = JSON.parse(savedSettings);
      return { ...defaultSettings, ...userSettings };
    } catch (e) {
      console.error('解析保存的设置时出错:', e);
    }
  }
  
  return defaultSettings;
}

// 自动调用添加导出按钮
// 等待页面加载完成后添加按钮
if (document.readyState === 'complete') {
  addExportButton();
} else {
  window.addEventListener('load', addExportButton);
}

// 暴露主要函数，使其可以在控制台中调用
window.exportTableToExcel = exportNestedTablesToExcel;
window.autoDetectAndExportTables = autoDetectAndExportTables;      }
    } else if (allTables.length === 1) {
      // 如果只有一个表格，直接导出
      updateLoadingMessage(loadingId, '正在导出单个表格...');
      const table = allTables[0];
      await preProcessAndExport(table, '表格导出', { debug: true });
      showSuccessMessage('表格已成功导出');
    }
  } catch (error) {
    console.error('导出表格时发生错误:', error);
    showErrorMessage('导出表格时发生错误，请查看控制台以获取详细信息');
  } finally {
    if (loadingId) {
      hideLoadingOverlay(loadingId);
    }
  }
}

/**
 * 将相邻的表格分组
 * @param {NodeList} tables - 表格元素列表
 * @returns {Array} 表格分组数组
 */
function groupNearbyTables(tables) {
  const tableGroups = [];
  let currentGroup = [tables[0]];
  
  for (let i = 1; i < tables.length; i++) {
    const prevTable = tables[i-1];
    const currTable = tables[i];
    
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
  
  return tableGroups;
}

/**
 * 显示加载覆盖层
 * @param {String} message - 显示的消息
 * @returns {String} 覆盖层ID
 */
function showLoadingOverlay(message = '正在处理...') {
  const overlayId = 'table-export-loading-overlay-' + Date.now();
  
  // 创建覆盖层元素
  const overlay = document.createElement('div');
  overlay.id = overlayId;
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;
  
  // 创建加载框
  const loadingBox = document.createElement('div');
  loadingBox.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 80%;
  `;
  
  // 创建加载图标
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
    margin: 0 auto 15px;
  `;
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // 创建消息元素
  const messageElement = document.createElement('div');
  messageElement.id = `${overlayId}-message`;
  messageElement.textContent = message;
  messageElement.style.cssText = `
    margin-top: 10px;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  
  // 组装加载框
  loadingBox.appendChild(spinner);
  loadingBox.appendChild(messageElement);
  overlay.appendChild(loadingBox);
  
  // 添加到文档
  document.body.appendChild(overlay);
  
  return overlayId;
}

/**
 * 更新加载覆盖层消息
 * @param {String} overlayId - 覆盖层ID
 * @param {String} message - 新消息
 */
function updateLoadingMessage(overlayId, message) {
  const messageElement = document.getElementById(`${overlayId}-message`);
  if (messageElement) {
    messageElement.textContent = message;
  }
}

/**
 * 隐藏加载覆盖层
 * @param {String} overlayId - 覆盖层ID
 */
function hideLoadingOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

/**
 * 显示成功消息
 * @param {String} message - 消息内容
 */
function showSuccessMessage(message) {
  const messageId = 'table-export-message-' + Date.now();
  
  // 创建消息元素
  const messageElement = document.createElement('div');
  messageElement.id = messageId;
  messageElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    transform: translateX(50px);
    transition: opacity 0.3s, transform 0.3s;
  `;
  
  messageElement.textContent = message;
  
  // 添加到文档
  document.body.appendChild(messageElement);
  
  // 触发动画
  setTimeout(() => {
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateX(0)';
  }, 10);
  
  // 自动消失
  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(50px)';
    
    // 移除元素
    setTimeout(() => {
      if (document.body.contains(messageElement)) {
        document.body.removeChild(messageElement);
      }
    }, 300);
  }, 3000);
}

/**
 * 显示错误消息
 * @param {String} message - 消息内容
 */
function showErrorMessage(message) {
  const messageId = 'table-export-error-' + Date.now();
  
  // 创建消息元素
  const messageElement = document.createElement('div');
  messageElement.id = messageId;
  messageElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f44336;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    transform: translateX(50px);
    transition: opacity 0.3s, transform 0.3s;
  `;
  
  messageElement.textContent = message;
  
  // 添加到文档
  document.body.appendChild(messageElement);
  
  // 触发动画
  setTimeout(() => {
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateX(0)';
  }, 10);
  
  // 自动消失
  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(50px)';
    
    // 移除元素
    setTimeout(() => {
      if (document.body.contains(messageElement)) {
        document.body.removeChild(messageElement);
      }
    }, 300);
  }, 5000);
}

/**
 * 显示表格选择器
 * @param {Array} tables - 表格元素数组
 * @param {String} title - 选择器标题
 */
function showTableSelector(tables, title) {
  const selectorId = 'table-export-selector-' + Date.now();
  
  // 创建选择器容器
  const container = document.createElement('div');
  container.id = selectorId;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  // 创建选择器面板
  const panel = document.createElement('div');
  panel.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    font-family: Arial, sans-serif;
  `;
  
  // 创建标题
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.style.marginTop = '0';
  panel.appendChild(titleElement);
  
  // 创建表格列表
  const list = document.createElement('div');
  list.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin: 15px 0;
  `;
  
  // 为每个表格创建一个预览项
  tables.forEach((table, index) => {
    const item = document.createElement('div');
    item.style.cssText = `
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    // 鼠标悬停效果
    item.onmouseover = () => {
      item.style.backgroundColor = '#f5f5f5';
    };
    item.onmouseout = () => {
      item.style.backgroundColor = 'white';
    };
    
    // 点击事件
    item.onclick = async () => {
      // 移除选择器
      document.body.removeChild(container);
      
      // 显示加载状态
      const loadingId = showLoadingOverlay(`正在导出选中的表格...`);
      
      try {
        // 导出选中的表格
        await preProcessAndExport(
          table, 
          `表格-${index + 1}`, 
          { debug: true }
        );
        showSuccessMessage(`表格 ${index + 1} 已成功导出`);
      } catch (error) {
        console.error('导出表格时发生错误:', error);
        showErrorMessage('导出表格时发生错误，请查看控制台以获取详细信息');
      } finally {
        hideLoadingOverlay(loadingId);
      }
    };
    
    // 创建表格标题和预览
    const itemTitle = document.createElement('div');
    itemTitle.textContent = `表格 ${index + 1}`;
    itemTitle.style.fontWeight = 'bold';
    itemTitle.style.marginBottom = '10px';
    item.appendChild(itemTitle);
    
    // 添加表格简要信息
    const rows = table.querySelectorAll('tr');
    const rowCount = rows.length;
    let colCount = 0;
    if (rows.length > 0) {
      colCount = rows[0].querySelectorAll('th, td').length;
    }
    
    const info = document.createElement('div');
    info.textContent = `${rowCount} 行 × ${colCount} 列`;
    info.style.color = '#666';
    info.style.fontSize = '12px';
    item.appendChild(info);
    
    // 创建预览
    const preview = document.createElement('div');
    preview.style.cssText = `
      margin-top: 10px;
      font-size: 12px;
      color: #333;
      max-height: 100px;
      overflow: hidden;
      position: relative;
    `;
    
    // 获取表格的前几行作为预览
    let previewHTML = '';
    const maxRows = Math.min(3, rowCount);
    for (let i = 0; i < maxRows; i++) {
      const row = rows[i];
      const cells = row.querySelectorAll('th, td');
      let rowHTML = '';
      const maxCells = Math.min(3, cells.length);
      for (let j = 0; j < maxCells; j++) {
        rowHTML += cells[j].textContent.slice(0, 15) + (cells[j].textContent.length > 15 ? '...' : '') + ' | ';
      }
      if (cells.length > 3) {
        rowHTML += '... ';
      }
      previewHTML += rowHTML + '<br>';
    }
    if (rowCount > 3) {
      previewHTML += '...';
    }
    
    preview.innerHTML = previewHTML;
    
    // 添加渐变遮罩
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30px;
      background: linear-gradient(transparent, white);
    `;
    preview.appendChild(fadeOverlay);
    
    item.appendChild(preview);
    list.appendChild(item);
  });
  
  panel.appendChild(list);
  
  // 创建取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '取消';
  cancelButton.style.cssText = `
    background-color: #f1f1f1;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  `;
  cancelButton.onclick = () => {
    document.body.removeChild(container);
  };
  panel.appendChild(cancelButton);
  
  // 创建全部导出按钮
  const exportAllButton = document.createElement('button');
  exportAllButton.textContent = '导出全部';
  exportAllButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;
  exportAllButton.onclick = async () => {
    // 移除选择器
    document.body.removeChild(container);
    
    // 显示加载状态
    const loadingId = showLoadingOverlay(`正在导出所有表格...`);
    
    try {
      // 逐个导出所有表格
      for (let i = 0; i < tables.length; i++) {
        updateLoadingMessage(loadingId, `正在导出表格 ${i + 1}/${tables.length}...`);
        await preProcessAndExport(
          tables[i], 
          `表格-${i + 1}`, 
          { debug: true }
        );
      }
      showSuccessMessage(`所有 ${tables.length} 个表格已成功导出`);
    } catch (error) {
      console.error('导出表格时发生错误:', error);
      showErrorMessage('导出表格时发生错误，请查看控制台以获取详细信息');
    } finally {
      hideLoadingOverlay(loadingId);
    }
  };
  panel.appendChild(exportAllButton);
  
  container.appendChild(panel);
  document.body.appendChild(container);
}

/**
 * 显示表格组选择器
 * @param {Array} tableGroups - 表格组数组
 * @param {String} title - 选择器标题
 */
function showTableGroupSelector(tableGroups, title) {
  const selectorId = 'table-group-selector-' + Date.now();
  
  // 创建选择器容器
  const container = document.createElement('div');
  container.id = selectorId;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  // 创建选择器面板
  const panel = document.createElement('div');
  panel.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    font-family: Arial, sans-serif;
  `;
  
  // 创建标题
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.style.marginTop = '0';
  panel.appendChild(titleElement);
  
  // 创建表格组列表
  const list = document.createElement('div');
  list.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin: 15px 0;
  `;
  
  // 为每个表格组创建一个预览项
  tableGroups.forEach((group, index) => {
    const item = document.createElement('div');
    item.style.cssText = `
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    // 鼠标悬停效果
    item.onmouseover = () => {
      item.style.backgroundColor = '#f5f5f5';
    };
    item.onmouseout = () => {
      item.style.backgroundColor = 'white';
    };
    
    // 点击事件
    item.onclick = async () => {
      // 移除选择器
      document.body.removeChild(container);
      
      // 显示加载状态
      const loadingId = showLoadingOverlay(`正在导出选中的表格组...`);
      
      try {
        // 创建一个临时容器
        const tempContainer = document.createElement('div');
        
        // 将组中的表格复制到容器中
        group.forEach(table => {
          tempContainer.appendChild(table.cloneNode(true));
        });
        
        // 导出这个容器
        await preProcessAndExport(
          tempContainer, 
          `表格组-${index + 1}`, 
          { debug: true }
        );
        showSuccessMessage(`表格组 ${index + 1} 已成功导出`);
      } catch (error) {
        console.error('导出表格组时发生错误:', error);
        showErrorMessage('导出表格组时发生错误，请查看控制台以获取详细信息');
      } finally {
        hideLoadingOverlay(loadingId);
      }
    };
    
    // 创建组标题和预览
    const itemTitle = document.createElement('div');
    itemTitle.textContent = `表格组 ${index + 1} (${group.length}个表格)`;
    itemTitle.style.fontWeight = 'bold';
    itemTitle.style.marginBottom = '10px';
    item.appendChild(itemTitle);
    
    // 添加组简要信息
    let totalRows = 0;
    let maxCols = 0;
    
    group.forEach(table => {
      const rows = table.querySelectorAll('tr');
      totalRows += rows.length;
      if (rows.length > 0) {
        const colCount = rows[0].querySelectorAll('th, td').length;
        maxCols = Math.max(maxCols, colCount);
      }
    });
    
    const info = document.createElement('div');
    info.textContent = `总计 ${totalRows} 行，最大 ${maxCols} 列`;
    info.style.color = '#666';
    info.style.fontSize = '12px';
    item.appendChild(info);
    
    // 创建预览
    const preview = document.createElement('div');
    preview.style.cssText = `
      margin-top: 10px;
      font-size: 12px;
      color: #333;
      max-height: 100px;
      overflow: hidden;
      position: relative;
    `;
    
    // 获取第一个表格的前几行作为预览
    let previewHTML = '';
    
    if (group.length > 0) {
      const firstTable = group[0];
      const rows = firstTable.querySelectorAll('tr');
      const maxRows = Math.min(3, rows.length);
      
      for (let i = 0; i < maxRows; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('th, td');
        let rowHTML = '';
        const maxCells = Math.min(3, cells.length);
        
        for (let j = 0; j < maxCells; j++) {
          rowHTML += cells[j].textContent.slice(0, 15) + (cells[j].textContent.length > 15 ? '...' : '') + ' | ';
        }
        
        if (cells.length > 3) {
          rowHTML += '... ';
        }
        
        previewHTML += rowHTML + '<br>';
      }
      
      if (rows.length > 3) {
        previewHTML += '...';
      }
      
      if (group.length > 1) {
        previewHTML += `<br>(还有 ${group.length - 1} 个表格)`;
      }
    }
    
    preview.innerHTML = previewHTML;
    
    // 添加渐变遮罩
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30px;
      background: linear-gradient(transparent, white);
    `;
    preview.appendChild(fadeOverlay);
    
    item.appendChild(preview);
    list.appendChild(item);
  });
  
  panel.appendChild(list);
  
  // 创建取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '取消';
  cancelButton.style.cssText = `
    background-color: #f1f1f1;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  `;
  cancelButton.onclick = () => {
    document.body.removeChild(container);
  };
  panel.appendChild(cancelButton);
  
  // 创建全部导出按钮
  const exportAllButton = document.createElement('button');
  exportAllButton.textContent = '导出全部组';
  exportAllButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;
  exportAllButton.onclick = async () => {
    // 移除选择器
    document.body.removeChild(container);
    
    // 显示加载状态
    const loadingId = showLoadingOverlay(`正在导出所有表格组...`);
    
    try {
      // 逐个导出所有表格组
      for (let i = 0; i < tableGroups.length; i++) {
        updateLoadingMessage(loadingId, `正在导出表格组 ${i + 1}/${tableGroups.length}...`);
        
        // 创建一个临时容器
        const tempContainer = document.createElement('div');
        
        // 将组中的表格复制到容器中
        tableGroups[i].forEach(table => {
          tempContainer.appendChild(table.cloneNode(true));
        });
        
        // 导出这个容器
        await preProcessAndExport(
          tempContainer, 
          `表格组-${i + 1}`, 
          { debug: true }
        );
      }
      
      showSuccessMessage(`所有 ${tableGroups.length} 个表格组已成功导出`);
    } catch (error) {
      console.error('导出表格组时发生错误:', error);
      showErrorMessage('导出表格组时发生错误，请查看控制台以获取详细信息');
    } finally {
      hideLoadingOverlay(loadingId);
    }
  };
  panel.appendChild(exportAllButton);
  
  container.appendChild(panel);
  document.body.appendChild(container);
}/**
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
  
  // 显示加载状态
  const loadingId = showLoadingOverlay('正在准备导出表格...');
  
  try {
    // 使用增强的预处理和导出功能
    await preProcessAndExport(containerElement, fileName, options);
    
    // 导出成功，显示提示
    showSuccessMessage(`表格已成功导出为 ${fileName}.xlsx`);
  } catch (error) {
    console.error('导出表格时发生错误:', error);
    showErrorMessage('导出表格时发生错误，请查看控制台以获取详细信息');
  } finally {
    // 移除加载状态
    hideLoadingOverlay(loadingId);
  }
}

/**
 * 自动识别页面上的表格结构并导出
 * 此函数会尝试智能识别页面上的表格结构，包括嵌套表格和独立表格
 */
async function autoDetectAndExportTables() {
  // 显示加载状态
  const loadingId = showLoadingOverlay('正在分析页面表格结构...');
  
  try {
    // 获取页面上所有表格
    const allTables = document.querySelectorAll('table');
    console.log(`页面上共有 ${allTables.length} 个表格`);
    
    // 如果没有表格，直接返回
    if (allTables.length === 0) {
      showErrorMessage('页面上没有找到表格');
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
    
    // 如果找到嵌套表格，逐个导出或询问用户选择
    if (nestedTableContainers.length > 0) {
      console.log(`找到 ${nestedTableContainers.length} 个嵌套表格容器`);
      
      if (nestedTableContainers.length === 1) {
        // 只有一个嵌套表格，直接导出
        updateLoadingMessage(loadingId, '正在导出嵌套表格...');
        await preProcessAndExport(
          nestedTableContainers[0], 
          '嵌套表格导出', 
          { debug: true }
        );
        showSuccessMessage('嵌套表格已成功导出');
      } else {
        // 多个嵌套表格，询问用户选择
        hideLoadingOverlay(loadingId);
        showTableSelector(nestedTableContainers, '选择要导出的嵌套表格：');
        return;
      }
    } else if (allTables.length > 1) {
      // 如果没有嵌套表格，检查是否有多个表格共同组成一个数据集
      // 查找彼此靠近的表格
      updateLoadingMessage(loadingId, '分析多表格结构...');
      const tableGroups = groupNearbyTables(allTables);
      
      console.log(`将表格分组为 ${tableGroups.length} 组`);
      
      if (tableGroups.length === 1) {
        // 只有一组表格，直接导出
        updateLoadingMessage(loadingId, '正在导出表格组...');
        const group = tableGroups[0];
        
        // 创建一个临时容器
        const container = document.createElement('div');
        
        // 将组中的表格复制到容器中
        group.forEach(table => {
          container.appendChild(table.cloneNode(true));
        });
        
        // 导出这个容器
        await preProcessAndExport(
          container, 
          '表格组导出', 
          { debug: true }
        );
        showSuccessMessage('表格组已成功导出');
      } else {
        // 多组表格，询问用户选择
        hideLoadingOverlay(loadingId);
        showTableGroupSelector(tableGroups, '选择要导出的表格组：');
        return;
        /**
 * 导出嵌套表格前进行前置处理
 * @param {HTMLElement} container - 容器元素
 * @param {String} fileName - 导出的文件名
 * @param {Object} options - 扩展选项
 */
async function preProcessAndExport(container, fileName, options = {}) {
  // 默认选项
  const defaultOptions = {
    includeOriginalStyles: true,   // 尝试保留原始表格样式
    smartDataDetection: true,      // 智能数据类型检测
    formatDetection: true,         // 检测并应用格式
    includeTitle: true,            // 在Excel中包含标题
    includeTimestamp: true,        // 在Excel中包含导出时间戳
    sheetName: '导出数据',          // 工作表名称
    debug: false                   // 调试模式
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // 如果启用了智能数据检测
  if (mergedOptions.smartDataDetection) {
    // 尝试提取页面标题
    let pageTitle = '';
    if (mergedOptions.includeTitle) {
      pageTitle = extractPageTitle();
    }
    
    // 提取时间戳
    let timestamp = '';
    if (mergedOptions.includeTimestamp) {
      timestamp = new Date().toLocaleString();
    }
    
    // 处理表格数据
    const processedData = processTableData(container, mergedOptions);
    
    // 如果有标题或时间戳，添加到表格数据的顶部
    if (pageTitle || timestamp) {
      let dataArray = processedData.data || [];
      const metadataRows = [];
      
      if (pageTitle) {
        metadataRows.push([pageTitle]);
      }
      
      if (timestamp) {
        metadataRows.push([`导出时间: ${timestamp}`]);
      }
      
      // 如果有元数据，添加一个空行作为分隔
      if (metadataRows.length > 0) {
        metadataRows.push([]);
      }
      
      // 合并元数据和表格数据
      dataArray = [...metadataRows, ...dataArray];
      
      // 调整合并单元格信息以适应新添加的行
      if (processedData.merges && processedData.merges.length > 0) {
        const rowOffset = metadataRows.length;
        processedData.merges = processedData.merges.map(merge => ({
          s: { r: merge.s.r + rowOffset, c: merge.s.c },
          e: { r: merge.e.r + rowOffset, c: merge.e.c }
        }));
      }
      
      // 如果标题需要跨所有列
      if (pageTitle && dataArray[0] && dataArray[0].length > 1) {
        // 获取数据最大列数
        const maxColumns = dataArray.reduce((max, row) => Math.max(max, row.length), 0);
        
        // 添加标题行的合并单元格信息
        if (!processedData.merges) {
          processedData.merges = [];
        }
        
        // 合并标题和时间戳行
        if (pageTitle) {
          processedData.merges.push({
            s: { r: 0, c: 0 },
            e: { r: 0, c: maxColumns - 1 }
          });
        }
        
        if (timestamp) {
          processedData.merges.push({
            s: { r: pageTitle ? 1 : 0, c: 0 },
            e: { r: pageTitle ? 1 : 0, c: maxColumns - 1 }
          });
        }
        
        // 填充标题行其余单元格为空字符串
        for (let i = 0; i < metadataRows.length; i++) {
          if (metadataRows[i].length < maxColumns) {
            dataArray[i] = dataArray[i].concat(
              Array(maxColumns - dataArray[i].length).fill('')
            );
          }
        }
      }
      
      processedData.data = dataArray;
    }
    
    // 导出增强的数据
    await exportToExcel(
      processedData, 
      processedData.merges, 
      fileName, 
      { 
        ...mergedOptions,
        // 如果有元数据行，调整表头行数
        headerRows: mergedOptions.includeTitle || mergedOptions.includeTimestamp 
                   ? 3 + detectHeaderRows(processedData.data)
                   : undefined,
        sheetName: mergedOptions.sheetName
      }
    );
    
  } else {
    // 不使用智能数据检测，直接处理和导出
    const processedData = processTableData(container, mergedOptions);
    await exportToExcel(processedData, processedData.merges, fileName, mergedOptions);
  }
}

/**
 * 从页面提取标题
 * @returns {String} 页面标题
 */
function extractPageTitle() {
  // 尝试从不同来源获取页面标题
  
  // 优先从H1标签获取
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length > 0) {
    return h1Elements[0].textContent.trim();
  }
  
  // 其次尝试document.title
  if (document.title) {
    return document.title.trim();
  }
  
  // 最后尝试从meta标签获取
  const metaTitle = document.querySelector('meta[name="title"]') || 
                    document.querySelector('meta[property="og:title"]');
  if (metaTitle) {
    return metaTitle.getAttribute('content').trim();
  }
  
  // 如果都找不到，返回一个默认标题
  return '表格数据导出';
}

/**
 * 分析数据类型并应用合适的格式化
 * @param {Array} data - 表格数据数组
 * @returns {Array} 处理后的表格数据
 */
function analyzeAndFormatData(data) {
  if (!data || !data.length) return data;
  
  // 克隆数据以避免修改原始数据
  const processedData = JSON.parse(JSON.stringify(data));
  
  // 获取数据列数
  const columnCount = data[0].length;
  
  // 为每一列分析数据类型
  const columnTypes = Array(columnCount).fill('unknown');
  
  // 跳过元数据行和表头行，只分析数据行
  const headerRowCount = detectHeaderRows(data);
  const dataRows = data.slice(headerRowCount);
  
  // 获取每列的数据样本
  for (let col = 0; col < columnCount; col++) {
    const samples = dataRows.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
    
    if (samples.length === 0) continue;
    
    // 检查数字类型
    const numberCount = samples.filter(val => typeof val === 'number' || /^-?\d+(\.\d+)?$/.test(String(val))).length;
    
    // 检查日期类型
    const dateCount = samples.filter(val => 
      /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(String(val)) || // YYYY-MM-DD
      /^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(String(val))    // DD-MM-YYYY
    ).length;
    
    // 检查货币类型
    const currencyCount = samples.filter(val => 
      /^[¥$€]?\s*\d+(\.\d+)?$/.test(String(val)) || // 以货币符号开头
      /^\d+(\.\d+)?\s*[¥$€]$/.test(String(val))     // 以货币符号结尾
    ).length;
    
    // 检查百分比
    const percentCount = samples.filter(val => 
      /^-?\d+(\.\d+)?%$/.test(String(val))
    ).length;
    
    // 确定列的主要数据类型
    const sampleCount = samples.length;
    
    if (numberCount / sampleCount > 0.7) {
      columnTypes[col] = 'number';
    } else if (dateCount / sampleCount > 0.7) {
      columnTypes[col] = 'date';
    } else if (currencyCount / sampleCount > 0.7) {
      columnTypes[col] = 'currency';
    } else if (percentCount / sampleCount > 0.7) {
      columnTypes[col] = 'percent';
    } else {
      columnTypes[col] = 'text';
    }
  }
  
  // 根据检测到的列类型格式化数据
  for (let row = headerRowCount; row < processedData.length; row++) {
    for (let col = 0; col < columnCount; col++) {
      const value = processedData[row][col];
      if (value === null || value === undefined || value === '') continue;
      
      const strValue = String(value);
      
      switch (columnTypes[col]) {
        case 'number':
          if (/^-?\d+(\.\d+)?$/.test(strValue)) {
            processedData[row][col] = parseFloat(strValue);
          }
          break;
          
        case 'date':
          try {
            if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(strValue)) {
              // 尝试解析YYYY-MM-DD格式
              const date = new Date(strValue);
              if (!isNaN(date.getTime())) {
                processedData[row][col] = date;
              }
            } else if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(strValue)) {
              // 尝试解析DD-MM-YYYY格式
              const parts = strValue.split(/[-/.]/);
              const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
              if (!isNaN(date.getTime())) {
                processedData[row][col] = date;
              }
            }
          } catch (e) {
            // 如果日期解析失败，保持原样
          }
          break;
          
        case 'currency':
          // 提取数字部分
          const numericValue = strValue.replace(/[^\d.-]/g, '');
          if (/^-?\d+(\.\d+)?$/.test(numericValue)) {
            processedData[row][col] = {
              value: parseFloat(numericValue),
              type: 'currency',
              format: /[¥]/.test(strValue) ? 'CNY' : 
                     /[$]/.test(strValue) ? 'USD' : 
                     /[€]/.test(strValue) ? 'EUR' : 'CNY'
            };
          }
          break;
          
        case 'percent':
          if (/^-?\d+(\.\d+)?%$/.test(strValue)) {
            processedData[row][col] = {
              value: parseFloat(strValue) / 100,
              type: 'percent'
            };
          }
          break;
      }
    }
  }
  
  return { data: processedData, columnTypes };
}/**
 * 处理复杂嵌套表格并导出为真正的XLSX格式
 * 
 * 此代码首先加载SheetJS库，然后提供函数处理嵌套表格、合并单元格等复杂情况，
 * 并生成真正的Excel XLSX文件，而不是简单的CSV文件。
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
  
  // 转换为普通数组（只含值）
  const flatData = combinedData.map(row => row.map(cell => cell.value));
  
  return { data: flatData, merges };
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
 * @returns {Object} 处理后的行数据和合并单元格信息
 */
function extractTableData(table, maxColumns, settings) {
  const rows = table.querySelectorAll('tr');
  const resultRows = [];
  const merges = [];
  
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
      
      // 记录此单元格跨行跨列的信息
      spanInfo.push({
        row: rowIndex,
        col: colIndex,
        rowSpan,
        colSpan,
        value: cell.textContent.trim()
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
    resultRows[info.row][info.col] = { value: info.value };
    
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
  
  return { rows: resultRows, merges };
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
  
  // 转换为简单数组格式
  const flatData = processedData.rows.map(row => row.map(cell => cell.value));
  
  return { data: flatData, merges: processedData.merges };
}

/**
 * 将处理好的数据导出为Excel文件，并自动调整列宽和行高
 * @param {Array} data - 表格数据
 * @param {Array} merges - 合并单元格信息
 * @param {String} fileName - 文件名
 * @param {Object} options - 其他选项
 */
async function exportToExcel(data, merges, fileName = 'table-export', options = {}) {
  try {
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
    
    // 自动调整行高（通过设置wch属性）
    autoAdjustRowHeights(ws, data.data || data);
    
    // 添加样式信息
    addStylesInfo(ws, data.data || data, options);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // 在浏览器中导出为Excel文件（使用浏览器兼容的方法）
    // 将工作簿转换为二进制数据（使用binary字符串而不是array）
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
    headerRows: 1,         // 表头行数（自动检测多级表头）
    zebra: true,           // 是否应用斑马纹
    borders: true,         // 是否应用边框
    wrapText: true,        // 是否启用自动换行
    detectHeaderRows: true // 是否自动检测表头行数
  };
  
  const styleOptions = { ...defaultOptions, ...options };
  
  // 如果需要自动检测表头行数
  if (styleOptions.detectHeaderRows && styleOptions.headerStyle) {
    styleOptions.headerRows = detectHeaderRows(data);
    console.log(`自动检测到 ${styleOptions.headerRows} 个表头行`);
  }
  
  // SheetJS不直接支持完整的样式设置，但我们可以创建一些基本设置
  
  // 准备单元格样式属性
  ws.Styles = ws.Styles || {};
  ws.Styles.Fills = ws.Styles.Fills || [];
  ws.Styles.Fonts = ws.Styles.Fonts || [];
  ws.Styles.Borders = ws.Styles.Borders || [];
  
  // 为每个单元格设置格式和样式信息
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let row = range.s.r; row <= range.e.r; ++row) {
    for (let col = range.s.c; col <= range.e.c; ++col) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      
      // 如果单元格不存在，创建一个空单元格
      if (!ws[cellAddress]) {
        ws[cellAddress] = { t: 's', v: '' };
      }
      
      const cell = ws[cellAddress];
      
      // 确保cell.s（样式）对象存在
      if (!cell.s) cell.s = {};
      
      // 设置自动换行
      if (styleOptions.wrapText) {
        cell.s.alignment = cell.s.alignment || {};
        cell.s.alignment.wrapText = true;
        cell.s.alignment.vertical = 'top';
      }
      
      // 处理特殊格式化（检测数字和日期）
      applySpecialFormatting(cell);
      
      // 设置表头样式
      if (styleOptions.headerStyle && row < styleOptions.headerRows) {
        // 表头使用粗体
        cell.s.font = cell.s.font || {};
        cell.s.font.bold = true;
        
        // 设置对齐方式
        cell.s.alignment = cell.s.alignment || {};
        cell.s.alignment.horizontal = 'center';
        
        // 设置背景色 (浅灰色)
        cell.s.fill = cell.s.fill || {};
        cell.s.fill.patternType = 'solid';
        cell.s.fill.fgColor = { rgb: "EEEEEE" };
      }
      
      // 设置斑马纹样式（交替行背景色）
      if (styleOptions.zebra && row >= styleOptions.headerRows && row % 2 === 1) {
        cell.s.fill = cell.s.fill || {};
        cell.s.fill.patternType = 'solid';
        cell.s.fill.fgColor = { rgb: "F9F9F9" };
      }
      
      // 设置边框
      if (styleOptions.borders) {
        cell.s.border = cell.s.border || {};
        
        // 表头底部有加粗边框
        if (row === styleOptions.headerRows - 1) {
          cell.s.border.bottom = { style: 'medium', color: { rgb: "000000" } };
        } else {
          cell.s.border.bottom = { style: 'thin', color: { rgb: "D0D0D0" } };
        }
        
        cell.s.border.top = { style: 'thin', color: { rgb: "D0D0D0" } };
        cell.s.border.left = { style: 'thin', color: { rgb: "D0D0D0" } };
        cell.s.border.right = { style: 'thin', color: { rgb: "D0D0D0" } };
      }
    }
  }
  
  // 注意：由于SheetJS社区版的限制，这些样式在某些情况下可能不会完全生效
  // 如果需要完整的样式支持，可以考虑使用SheetJS Pro或其他工具
}

/**
 * 自动检测表头行数
 * @param {Array} data - 表格数据
 * @returns {Number} - 检测到的表头行数
 */
function detectHeaderRows(data) {
  if (!data || data.length <= 1) return 1;
  
  // 检测策略：查找连续的"不像数据"的行
  // 表头行通常有以下特征：
  // 1. 包含空单元格
  // 2. 文本格式（非数字或日期）
  // 3. 可能合并了单元格
  
  let headerRows = 1; // 默认至少有一行表头
  
  for (let i = 1; i < Math.min(data.length, 10); i++) { // 最多检查前10行
    const row = data[i];
    
    // 检查是否看起来像数据行
    let isDataRow = false;
    let numbersCount = 0;
    
    row.forEach(cell => {
      if (cell !== null && cell !== undefined && cell !== '') {
        const cellStr = String(cell);
        // 如果至少有一个单元格像数字或日期，增加计数
        if (/^\s*\d+([.,]\d+)?\s*$/.test(cellStr) || // 数字
            /^\s*\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}\s*$/.test(cellStr)) { // 日期
          numbersCount++;
        }
      }
    });
    
    // 如果一行中超过30%的单元格看起来像数字或日期，则可能是数据行
    if (numbersCount > row.length * 0.3) {
      isDataRow = true;
    }
    
    if (isDataRow) {
      break;
    } else {
      headerRows++;
    }
  }
  
  return headerRows;
}

/**
 * 为单元格应用特殊格式化（数字、日期等）
 * @param {Object} cell - 单元格对象
 */
function applySpecialFormatting(cell) {
  if (!cell || cell.t !== 's' || !cell.v) return;
  
  const value = String(cell.v).trim();
  
  // 检测并格式化日期
  if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(value)) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        cell.t = 'd'; // 设置为日期类型
        cell.v = date;
        cell.z = 'yyyy-mm-dd'; // 设置日期格式
      }
    } catch (e) {
      // 如果日期解析失败，保持原样
    }
  }
  // 检测并格式化数字
  else if (/^-?\d+(\.\d+)?$/.test(value)) {
    cell.t = 'n'; // 设置为数字类型
    cell.v = parseFloat(value);
    
    // 如果是整数
    if (Number.isInteger(cell.v)) {
      cell.z = '#,##0'; // 使用千位分隔符
    } 
    // 如果是小数
    else {
      // 确定小数位数（最多保留4位）
      const decimalPlaces = Math.min(
        (value.split('.')[1] || '').length,
        4
      );
      cell.z = `#,##0.${'0'.repeat(decimalPlaces)}`; // 如 #,##0.00
    }
  }
  // 检测并格式化百分比
  else if (/^-?\d+(\.\d+)?%$/.test(value)) {
    cell.t = 'n'; // 设置为数字类型
    cell.v = parseFloat(value) / 100; // 将百分比转换为小数
    cell.z = '0.00%'; // 设置百分比格式
  }
  // 检测并格式化货币
  else if (/^¥\s*\d+(\.\d+)?$/.test(value) || // 人民币
           /^\$\s*\d+(\.\d+)?$/.test(value) || // 美元
           /^€\s*\d+(\.\d+)?$/.test(value)) {  // 欧元
    cell.t = 'n'; // 设置为数字类型
    // 提取数字部分
    cell.v = parseFloat(value.replace(/[^\d.-]/g, ''));
    
    // 根据货币符号设置不同格式
    if (value.includes('¥')) {
      cell.z = '"¥"#,##0.00'; // 人民币格式
    } else if (value.includes('

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
  await exportToExcel(processedData, processedData.merges, fileName, options);
}

/**
 * 自动识别页面上的表格结构并导出
 * 此函数会尝试智能识别页面上的表格结构，包括嵌套表格和独立表格
 */
async function autoDetectAndExportTables() {
  // 获取页面上所有表格
  const allTables = document.querySelectorAll('table');
  console.log(`页面上共有 ${allTables.length} 个表格`);
  
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
    console.log(`找到 ${nestedTableContainers.length} 个嵌套表格容器`);
    
    // 遍历每个容器并导出
    for (let i = 0; i < nestedTableContainers.length; i++) {
      await exportNestedTablesToExcel(
        nestedTableContainers[i], 
        `嵌套表格-${i+1}`, 
        { debug: true }
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
        { debug: true }
      );
    }
    return;
  }
  
  // 如果只有一个表格，直接导出
  if (allTables.length === 1) {
    const table = allTables[0];
    const { data, merges } = processSingleTable(table, { detectMergedCells: true });
    await exportToExcel(data, merges, '单表格导出');
  }
}

// 示例使用
// 1. 导出特定容器内的嵌套表格
// exportNestedTablesToExcel('#tableContainer', '我的嵌套表格');

// 2. 自动检测页面上的表格结构并导出
// autoDetectAndExportTables();
)) {
      cell.z = '"$"#,##0.00'; // 美元格式
    } else if (value.includes('€')) {
      cell.z = '"€"#,##0.00'; // 欧元格式
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
  await exportToExcel(processedData, processedData.merges, fileName, options);
}

/**
 * 自动识别页面上的表格结构并导出
 * 此函数会尝试智能识别页面上的表格结构，包括嵌套表格和独立表格
 */
async function autoDetectAndExportTables() {
  // 获取页面上所有表格
  const allTables = document.querySelectorAll('table');
  console.log(`页面上共有 ${allTables.length} 个表格`);
  
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
    console.log(`找到 ${nestedTableContainers.length} 个嵌套表格容器`);
    
    // 遍历每个容器并导出
    for (let i = 0; i < nestedTableContainers.length; i++) {
      await exportNestedTablesToExcel(
        nestedTableContainers[i], 
        `嵌套表格-${i+1}`, 
        { debug: true }
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
        { debug: true }
      );
    }
    return;
  }
  
  // 如果只有一个表格，直接导出
  if (allTables.length === 1) {
    const table = allTables[0];
    const { data, merges } = processSingleTable(table, { detectMergedCells: true });
    await exportToExcel(data, merges, '单表格导出');
  }
}

// 示例使用
// 1. 导出特定容器内的嵌套表格
// exportNestedTablesToExcel('#tableContainer', '我的嵌套表格');

// 2. 自动检测页面上的表格结构并导出
// autoDetectAndExportTables();
