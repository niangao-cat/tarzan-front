/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 员工产量汇总报表
 */

 import React, { Component } from 'react';
 import { Table } from 'hzero-ui';
 import { Bind } from 'lodash-decorators';

 import intl from 'utils/intl';

 const commonModelPrompt = 'tarzan.hwms.employeeOutputSummaryReport';

 export default class ProcessDefectReport extends Component {

   // 明细数据
   @Bind()
   handleMakeNumDetail(record, type){
     const { onMakeNumDetail } = this.props;
     if(onMakeNumDetail) {
       onMakeNumDetail(record, type);
     }
   }

   // 不良数据
   @Bind()
   handleDefectsNumbDetail(record){
     const { onDefectsNumbDetail } = this.props;
     if(onDefectsNumbDetail) {
       onDefectsNumbDetail(record);
     }
   }

   // 渲染 界面布局
   render() {
     // 获取默认数据
     const { loading, dataSource, pagination, onSearch } = this.props;
     // 设置显示数据
     const columns = [
       {
         title: '序号',
         dataIndex: 'orderSeq',
         render: (val, record, index) => index + 1,
       },
       {
         title: intl.get(`${commonModelPrompt}.userName`).d('员工'),
         dataIndex: 'userName',
         align: 'center',
       },
       {
         title: intl.get(`${commonModelPrompt}.userNum`).d('工号'),
         dataIndex: 'userNum',
         align: 'center',
       },
       {
         title: intl.get(`${commonModelPrompt}.prodLineName`).d('产线'),
         dataIndex: 'prodLineName',
         align: 'center',
       },
       {
         title: intl.get(`${commonModelPrompt}.lineWorkcerllName`).d('工段'),
         dataIndex: 'lineWorkcerllName',
         align: 'center',
       },
       {
         title: intl.get(`${commonModelPrompt}.processName`).d('工序'),
         dataIndex: 'processName',
         align: 'center',
       },
       {
         title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
         dataIndex: 'materialCode',
         align: 'center',
       },
       {
         title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
         dataIndex: 'materialName',
         align: 'left',
       },
       {
         title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本'),
         dataIndex: 'materialVersion',
         align: 'center',
       },
       {
         title: '实际产出',
         dataIndex: 'actualOutputNumber',
         align: 'center',
         render: (val, record) => {
           return (<a onClick={() => this.handleMakeNumDetail(record, "ACTUALOUTPUT")}>{val}</a>);
         },
       },
       {
         title: intl.get(`${commonModelPrompt}.countNumber`).d('产量'),
         dataIndex: 'countNumber',
         align: 'center',
         render: (val, record) => {
           return (<a onClick={() => this.handleMakeNumDetail(record, "COUNTNUMBER")}>{val}</a>);
         },
       },
       {
         title: '在制数',
         dataIndex: 'inMakeNum',
         align: 'center',
         render: (val, record) => {
           return (<a onClick={() => this.handleMakeNumDetail(record, "INMAKENUM")}>{val}</a>);
         },
       },
       {
         title: intl.get(`${commonModelPrompt}.defectsNumber`).d('不良数'),
         dataIndex: 'defectsNumber',
         align: 'center',
         render: (val, record) => {
           return (<a onClick={() => this.handleMakeNumDetail(record, 'NCNUM')}>{val}</a>);
         },
       },
       {
         title: '返修数',
         dataIndex: 'repairNum',
         align: 'center',
         render: (val, record) => {
           return (<a onClick={() => this.handleMakeNumDetail(record, "REPAIRNUM")}>{val}</a>);
         },
       },
       {
         title: '一次合格率',
         dataIndex: 'firstPassRate',
         width: 100,
       },
       {
         title: '生产总时长',
         dataIndex: 'totalProductionTime',
         width: 100,
       },
     ];

     //  返回默认界面数据
     return (
       <Table
         bordered
         dataSource={dataSource}
         columns={columns}
         pagination={pagination}
         onChange={onSearch}
         loading={loading}
       />
     );
   }
 }
