// 强制居中对齐Excel导出工具说明

/**
 * 本工具特点：强制居中对齐、完整样式保留
 * 
 * 三个关键点确保Excel中所有单元格强制居中：
 * 
 * 1. 在提取单元格样式时设置默认居中
 *    所有单元格初始化时都添加水平和垂直居中属性
 * 
 * 2. 在添加全局样式时强制居中
 *    无论从HTML中提取到什么样式，覆盖为居中对齐
 * 
 * 3. 最后进行居中确认
 *    导出前再次检查所有单元格，确保全部居中
 */

// 使用方法示例
import TableExporter from '@/utils/tableExporter';

export default {
  methods: {
    exportWithForceCenter() {
      const exporter = new TableExporter({
        defaultAlignment: 'center',  // 设置默认对齐方式为居中
        borders: true,               // 启用边框
        headerStyle: true            // 启用表头样式
      });
      
      // 导出并强制居中
      exporter.exportTableFromDOM('#myTable', '强制居中表格');
    }
  }
}

/**
 * 关键代码解析：
 * 
 * 1. 初始样式设置:
 * 
 * const style = {
 *   alignment: {
 *     horizontal: 'center', // 强制水平居中 
 *     vertical: 'center',   // 强制垂直居中
 *     wrapText: true        // 自动换行
 *   },
 *   // 其他样式...
 * };
 * 
 * 2. 最终导出前的强制居中:
 * 
 * // 最重要：确保所有单元格居中对齐
 * this._ensureCenterAlignment(ws);
 * 
 * 3. 居中对齐确认函数:
 * 
 * _ensureCenterAlignment(ws) {
 *   // 获取工作表范围
 *   const range = XLSX.utils.decode_range(ws['!ref']);
 *   
 *   // 遍历所有单元格
 *   for (let row = range.s.r; row <= range.e.r; ++row) {
 *     for (let col = range.s.c; col <= range.e.c; ++col) {
 *       const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
 *       const cell = ws[cellAddress];
 *       
 *       if (!cell) continue;
 *       
 *       // 确保有样式对象
 *       if (!cell.s) cell.s = {};
 *       
 *       // 确保有对齐属性
 *       if (!cell.s.alignment) cell.s.alignment = {};
 *       
 *       // 强制水平居中
 *       cell.s.alignment.horizontal = 'center';
 *       
 *       // 强制垂直居中
 *       cell.s.alignment.vertical = 'center';
 *     }
 *   }
 * }
 */

// 这种三重保障确保了无论表格原始HTML样式如何，
// 导出到Excel后所有单元格都会强制居中对齐。
