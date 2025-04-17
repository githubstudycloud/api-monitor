// 示例1: 单个Vue组件中使用
<template>
  <div>
    <table id="data-table" class="my-table">
      <!-- 表格内容 -->
      <thead>
        <tr>
          <th>序号</th>
          <th>姓名</th>
          <th>年龄</th>
          <th>成绩</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.score }}</td>
        </tr>
      </tbody>
    </table>
    
    <button @click="exportTable">导出表格</button>
  </div>
</template>

<script>
import TableExporter from '@/utils/tableExporter';

export default {
  data() {
    return {
      tableData: [
        { name: '张三', age: 18, score: 90 },
        { name: '李四', age: 19, score: 85 },
        { name: '王五', age: 20, score: 92 }
      ]
    };
  },
  methods: {
    exportTable() {
      // 创建导出器实例
      const exporter = new TableExporter({
        defaultAlignment: 'center',  // 强制居中对齐
        defaultFontBold: true,       // 默认字体加粗
        fileName: '导出的表格'        // 默认文件名
      });
      
      // 导出当前Vue组件中的表格
      exporter.exportVueTable(this, '.my-table', '学生成绩表')
        .then(result => {
          console.log('导出成功:', result);
        })
        .catch(error => {
          console.error('导出失败:', error);
        });
    }
  }
};
</script>

// 示例2: 全局注册插件方式
// main.js
import Vue from 'vue';
import App from './App.vue';
import { TableExportPlugin } from '@/utils/tableExporter';

// 全局注册表格导出插件
Vue.use(TableExportPlugin, {
  defaultAlignment: 'center',   // 强制居中对齐
  headerStyle: true,            // 表头加粗
  borders: true,                // 显示边框
  zebra: true,                  // 显示斑马纹
  fileName: '导出表格',          // 默认文件名
  defaultFontColor: '333333'    // 默认字体颜色
});

new Vue({
  render: h => h(App)
}).$mount('#app');

// 然后在任何组件中使用:
<template>
  <div>
    <table class="export-table">
      <!-- 表格内容 -->
    </table>
    
    <div class="button-group">
      <button @click="exportSimpleTable">导出当前表格</button>
      <button @click="exportCustomData">导出自定义数据</button>
      <button @click="autoExportPage">自动导出页面表格</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 导出当前组件中的表格
    exportSimpleTable() {
      this.$exportCurrentTable('.export-table', '导出的表格');
    },
    
    // 导出自定义数据
    exportCustomData() {
      const data = [
        ['产品', '单价', '数量', '金额'],
        ['产品A', 100, 2, 200],
        ['产品B', 85, 3, 255],
        ['产品C', 120, 1, 120],
        ['总计', '', '', 575]
      ];
      
      // 自定义列宽
      const sheetOptions = {
        colWidths: [20, 10, 10, 15]
      };
      
      this.$exportData(data, '销售报表', sheetOptions);
    },
    
    // 自动检测并导出页面上的表格
    autoExportPage() {
      this.$autoExportTables('页面表格');
    }
  }
};
</script>

// 示例3: 嵌套表格和合并单元格
<template>
  <div>
    <div id="nested-table-container">
      <!-- 标题表格 -->
      <table class="header-table">
        <tr>
          <th colspan="4">第一季度销售报表</th>
        </tr>
        <tr>
          <th>产品名称</th>
          <th>一月</th>
          <th>二月</th>
          <th>三月</th>
        </tr>
      </table>
      
      <!-- 数据表格 -->
      <table class="data-table">
        <tr>
          <td rowspan="2">产品A</td>
          <td>100</td>
          <td>120</td>
          <td>150</td>
        </tr>
        <tr>
          <td>90</td>
          <td>110</td>
          <td>130</td>
        </tr>
        <tr>
          <td colspan="1">产品B</td>
          <td>200</td>
          <td>220</td>
          <td>240</td>
        </tr>
        <tr>
          <td>总计</td>
          <td>390</td>
          <td>450</td>
          <td>520</td>
        </tr>
      </table>
    </div>
    
    <button @click="exportNestedTable">导出嵌套表格</button>
  </div>
</template>

<script>
import TableExporter from '@/utils/tableExporter';

export default {
  methods: {
    exportNestedTable() {
      const exporter = new TableExporter({
        debug: true, // 启用调试模式查看处理过程
        borders: true,
        headerStyle: true
      });
      
      exporter.exportTableFromDOM('#nested-table-container', '嵌套表格示例')
        .then(() => {
          console.log('嵌套表格导出成功!');
        })
        .catch(error => {
          console.error('嵌套表格导出失败:', error);
        });
    }
  }
};
</script>
