/*
 * @Description: 甘特图
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-02-14 17:54:00
 * @LastEditTime: 2020-09-07 11:47:59
 */

import React, { PureComponent } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_drag_timeline.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_multiselect.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

import './index.less';

export default class Gantt extends PureComponent {

  componentDidMount() {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    const { tasks } = this.props;
    gantt.config.drag_move = false; // 关闭进度条拖动
    gantt.config.drag_progress = false; // 关闭进度条内百分比拖动
    gantt.config.drag_resize = false;
    gantt.config.grid_width = 600;
    gantt.config.scale_unit = "month"; // 设置以日期显示
    gantt.config.step = 1; // 增加步骤为1
    gantt.config.date_scale = "%m 月"; // 显示格式
    const myDate = new Date();
    // 计算当前日期之后45天的日期
    const date1 = new Date();
    const date2 = new Date(date1);
    date2.setDate(date1.getDate() + 45);
    const day = `${date2.getFullYear()}/${date2.getMonth() + 1}/${date2.getDate()}`;
    gantt.config.start_date = new Date(myDate.toLocaleDateString()); // 开始日期
    gantt.config.end_date = new Date(day); // 结束日期

    gantt.config.details_on_dblclick = false;

    // 配置自子表格，月下面显示日
    gantt.config.subscales = [{
      unit: 'day',
      step: 1,
      date: '%d',
    }];
    // gantt.templates.task_cell_class = function（item，date）{
    //   // debugger;
    //   if（date.getDay（）== 0 || date.getDay（）== 6）{
    //     return 'weekend';
    //   }
    // };
    gantt.init(this.ganttContainer);
    gantt.parse(tasks);
    gantt.config.columns = [
      { name: 'workOrderNum', label: '工单号', width: '100' },
      { name: 'materialCode', label: '物料编码', width: '100' },
      { name: 'materialName', label: '物料名称', width: '100' },
      { name: 'workOrderTypeDesc', label: '工单类型', width: '100' },
      { name: 'qty', label: '工单总数', width: '90' },
      { name: 'dueDate', label: '交付时间', width: '100' },
      { name: 'startDate', label: '开始时间', width: '100' },
      { name: 'endDate', label: '结束时间', width: '100' },
    ];
    // gantt.attachEvent("onTaskClick", (id, e) => {
    //   alert(`You've just clicked an item with id=${id}`);
    //   console.log(e)
    // });
  }

  componentWillReceiveProps(nextProps) {
    const { tasks } = nextProps;
    gantt.parse(tasks);
  }

  render() {
    return (
      <>
        <div
          ref={(input) => {
            this.ganttContainer = input;
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </>
    );
  }
}
