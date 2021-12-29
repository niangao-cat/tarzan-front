/**
 * ywj
 */

import React, { Component } from 'react';
import { Modal, Form, Table } from 'hzero-ui';
import {
} from 'utils/constants';
@Form.create({ fieldNameProp: null })
export default class UpdateCodeDrawer extends Component {

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      visible,
      onClose,
      loading,
      dataSource,
      pagination,
      onSearch,
    } = this.props;
    // 获取表单的字段属性
    let columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        render: (val, record, index) => index + 1,
      },
      {
        title: '处理时间',
        dataIndex: 'processDate',
        width: 90,
      },
      {
        title: '处理状态',
        dataIndex: 'processStatus',
        width: 90,
      },
      {
        title: '处理消息',
        dataIndex: 'processMessage',
        width: 90,
      },
      {
        title: '导入类型',
        dataIndex: 'importTypeMeaning',
        width: 90,
      },
      {
        title: 'SN',
        dataIndex: 'materialLotCode',
        width: 90,
      },
      {
        title: '物料',
        dataIndex: 'materialCode',
        width: 90,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 90,
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        width: 90,
      },
      {
        title: '产品型号',
        dataIndex: 'test1',
        width: 90,
      },
      {
        title: '生产厂家',
        dataIndex: 'test2',
        width: 90,
      },
      {
        title: '组装时间',
        dataIndex: 'test3',
        width: 90,
      },
      {
        title: '调试时间',
        dataIndex: 'test4',
        width: 90,
      },
      {
        title: 'AC/DC电源-A',
        dataIndex: 'test5',
        width: 90,
      },
      {
        title: 'AC/DC电源-B',
        dataIndex: 'test6',
        width: 90,
      },
      {
        title: '恒流驱动源A1',
        dataIndex: 'test7',
        width: 90,
      },
      {
        title: '恒流驱动源A2',
        dataIndex: 'test8',
        width: 90,
      },
      {
        title: '恒流驱动源A3',
        dataIndex: 'test9',
        width: 90,
      },
      {
        title: '恒流驱动源A4',
        dataIndex: 'test10',
        width: 90,
      },
      {
        title: '恒流驱动源A5',
        dataIndex: 'test11',
        width: 90,
      },
      {
        title: '恒流驱动源A6',
        dataIndex: 'test12',
        width: 90,
      },
      {
        title: '恒流驱动源B1',
        dataIndex: 'test13',
        width: 90,
      },
      {
        title: '恒流驱动源B2',
        dataIndex: 'test14',
        width: 90,
      },
      {
        title: '恒流驱动源B3',
        dataIndex: 'test15',
        width: 90,
      },
      {
        title: '恒流驱动源B4',
        dataIndex: 'test16',
        width: 90,
      },
      {
        title: '恒流驱动源B5',
        dataIndex: 'test17',
        width: 90,
      },
      {
        title: '恒流驱动源B6',
        dataIndex: 'test18',
        width: 90,
      },
      {
        title: '恒流驱动板A1',
        dataIndex: 'test19',
        width: 90,
      },
      {
        title: '恒流驱动板A2',
        dataIndex: 'test20',
        width: 90,
      },
      {
        title: '恒流驱动板A3',
        dataIndex: 'test21',
        width: 90,
      },
      {
        title: '恒流驱动板A4',
        dataIndex: 'test22',
        width: 90,
      },
      {
        title: '恒流驱动板A5',
        dataIndex: 'test23',
        width: 90,
      },
      {
        title: '恒流驱动板A6',
        dataIndex: 'test24',
        width: 90,
      },
      {
        title: '恒流驱动板B1',
        dataIndex: 'test25',
        width: 90,
      },
      {
        title: '恒流驱动板B2',
        dataIndex: 'test26',
        width: 90,
      },
      {
        title: '恒流驱动板B3',
        dataIndex: 'test27',
        width: 90,
      },
      {
        title: '恒流驱动板B4',
        dataIndex: 'test28',
        width: 90,
      },
      {
        title: '恒流驱动板B5',
        dataIndex: 'test29',
        width: 90,
      },
      {
        title: '恒流驱动板B6',
        dataIndex: 'test30',
        width: 90,
      },
      {
        title: '控制板1',
        dataIndex: 'test31',
        width: 90,
      },
      {
        title: '控制板2',
        dataIndex: 'test32',
        width: 90,
      },
      {
        title: '控制板3',
        dataIndex: 'test33',
        width: 90,
      },
      {
        title: '控制板4',
        dataIndex: 'test34',
        width: 90,
      },
      {
        title: '控制板5',
        dataIndex: 'test35',
        width: 90,
      },
      {
        title: '控制板6',
        dataIndex: 'test36',
        width: 90,
      },
      {
        title: '辅助电源板1',
        dataIndex: 'test37',
        width: 90,
      },
      {
        title: '辅助电源板2',
        dataIndex: 'test38',
        width: 90,
      },
      {
        title: 'Boost模块',
        dataIndex: 'test39',
        width: 90,
      },
      {
        title: 'Interface板',
        dataIndex: 'test40',
        width: 90,
      },
      {
        title: '灯板',
        dataIndex: 'test41',
        width: 90,
      },
      {
        title: '单片机程序版本',
        dataIndex: 'test42',
        width: 90,
      },
      {
        title: 'CPLD程序版本',
        dataIndex: 'test43',
        width: 90,
      },
      {
        title: '上位机程序版本',
        dataIndex: 'test44',
        width: 90,
      },
      {
        title: '纽扣电池电压',
        dataIndex: 'test45',
        width: 90,
      },
      {
        title: 'AC/DC电源_A输出电压',
        dataIndex: 'test46',
        width: 90,
      },
      {
        title: 'AC/DC电源_B输出电压',
        dataIndex: 'test47',
        width: 90,
      },
      {
        title: 'DC模块A1满载电流值',
        dataIndex: 'test48',
        width: 90,
      },
      {
        title: 'DC模块A2满载电流值',
        dataIndex: 'test49',
        width: 90,
      },
      {
        title: 'DC模块A3满载电流值',
        dataIndex: 'test50',
        width: 90,
      },
      {
        title: 'DC模块A4满载电流值',
        dataIndex: 'test51',
        width: 90,
      },
      {
        title: 'DC模块A5满载电流值',
        dataIndex: 'test52',
        width: 90,
      },
      {
        title: 'DC模块A6满载电流值',
        dataIndex: 'test53',
        width: 90,
      },
      {
        title: 'DC模块A7满载电流值',
        dataIndex: 'test54',
        width: 90,
      },
      {
        title: 'DC模块A8满载电流值',
        dataIndex: 'test55',
        width: 90,
      },
      {
        title: 'DC模块A9满载电流值',
        dataIndex: 'test56',
        width: 90,
      },
      {
        title: 'DC模块A10满载电流值',
        dataIndex: 'test57',
        width: 90,
      },
      {
        title: 'DC模块B1满载电流值',
        dataIndex: 'test58',
        width: 90,
      },
      {
        title: 'DC模块B2满载电流值',
        dataIndex: 'test59',
        width: 90,
      },
      {
        title: 'DC模块B3满载电流值',
        dataIndex: 'test60',
        width: 90,
      },
      {
        title: 'DC模块B4满载电流值',
        dataIndex: 'test61',
        width: 90,
      },
      {
        title: 'DC模块B5满载电流值',
        dataIndex: 'test62',
        width: 90,
      },
      {
        title: 'DC模块B6满载电流值',
        dataIndex: 'test63',
        width: 90,
      },
      {
        title: 'DC模块B7满载电流值',
        dataIndex: 'test64',
        width: 90,
      },
      {
        title: 'DC模块B8满载电流值',
        dataIndex: 'test65',
        width: 90,
      },
      {
        title: 'DC模块B9满载电流值',
        dataIndex: 'test66',
        width: 90,
      },
      {
        title: 'DC模块B10满载电流值',
        dataIndex: 'test67',
        width: 90,
      },
      {
        title: '上位机满功率DA电压值',
        dataIndex: 'test68',
        width: 90,
      },
      {
        title: '电路板实测DA电压值',
        dataIndex: 'test69',
        width: 90,
      },
      {
        title: '上位机预置DA值',
        dataIndex: 'test70',
        width: 90,
      },
      {
        title: '横流版给定电压系数',
        dataIndex: 'test71',
        width: 90,
      },
      {
        title: 'QCW连续模式电流',
        dataIndex: 'test72',
        width: 90,
      },
      {
        title: 'QCW调制模式电流',
        dataIndex: 'test73',
        width: 90,
      },
      {
        title: 'AD修正系数',
        dataIndex: 'test74',
        width: 90,
      },
      {
        title: 'ERR电压',
        dataIndex: 'test75',
        width: 90,
      },
      {
        title: 'DC模块电流上升时间',
        dataIndex: 'test76',
        width: 90,
      },
      {
        title: 'DC模块电流下降时间',
        dataIndex: 'test77',
        width: 90,
      },
      {
        title: '功能测试',
        dataIndex: 'test78',
        width: 90,
      },
    ];
    let colAttr = [];
    for(let i=1; i<=72; i++){
      colAttr = [...colAttr, {
        title: `备用${i}`,
        dataIndex: `test${(i+78)}`,
        width: 90,
      }];
    }
    columns = [...columns, ...colAttr];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={1500}
        onCancel={() => onClose()}
        visible={visible}
        footer={null}
        title="电学质量文件"
      >
        <Table
          rowKey="materialLotId"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onSearch(page)}
          bordered
        />
      </Modal>
    );
  }
}
