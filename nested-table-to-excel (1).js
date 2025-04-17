/**
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
    text-      }
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
