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
        title: '类型',
        dataIndex: 'testOneMeaning',
        width: 90,
      },
      {
        title: '批号(预制棒号)',
        dataIndex: 'test2',
        width: 90,
      },
      {
        title: '纤芯NA',
        dataIndex: 'test3',
        width: 90,
      },
      {
        title: '包层NA',
        dataIndex: 'test4',
        width: 90,
      },
      {
        title: '包层泵浦吸收(db/m)',
        dataIndex: 'test5',
        width: 90,
      },
      {
        title: '纤芯光损耗(db/km)',
        dataIndex: 'test6',
        width: 90,
      },
      {
        title: '包层光损耗(db/km)',
        dataIndex: 'test7',
        width: 90,
      },
      {
        title: '纤芯直径(mm)',
        dataIndex: 'test8',
        width: 90,
      },
      {
        title: '包层直径(mm)',
        dataIndex: 'test9',
        width: 90,
      },
      {
        title: '涂覆层直径(mm)',
        dataIndex: 'test10',
        width: 90,
      },
      {
        title: '纤芯包层同心度(mm)',
        dataIndex: 'test11',
        width: 90,
      },
      {
        title: '筛选测试(Kpsi)',
        dataIndex: 'test12',
        width: 90,
      },
      {
        title: '斜效率',
        dataIndex: 'test13',
        width: 90,
      },
      {
        title: '双向11A功率',
        dataIndex: 'test14',
        width: 90,
      },
      {
        title: '光栅类型',
        dataIndex: 'test15',
        width: 90,
      },
      {
        title: '中心波长',
        dataIndex: 'test16',
        width: 90,
      },
      {
        title: '带宽',
        dataIndex: 'test17',
        width: 90,
      },
      {
        title: '反射率',
        dataIndex: 'test18',
        width: 90,
      },
      {
        title: 'SLSR',
        dataIndex: 'test19',
        width: 90,
      },
      {
        title: '通泵浦光光纤温度',
        dataIndex: 'test20',
        width: 90,
      },
      {
        title: '光纤类型',
        dataIndex: 'test21',
        width: 90,
      },
      {
        title: '光纤lot号',
        dataIndex: 'test22',
        width: 90,
      },
      {
        title: '红光损耗',
        dataIndex: 'test23',
        width: 90,
      },
      {
        title: '纤芯损耗',
        dataIndex: 'test24',
        width: 90,
      },
      {
        title: '耦合效率',
        dataIndex: 'test25',
        width: 90,
      },
      {
        title: '信号纤型号',
        dataIndex: 'test26',
        width: 90,
      },
      {
        title: '信号光纤lot号',
        dataIndex: 'test27',
        width: 90,
      },
      {
        title: '信号纤芯直径',
        dataIndex: 'test28',
        width: 90,
      },
      {
        title: '信号包层直径',
        dataIndex: 'test29',
        width: 90,
      },
      {
        title: '信号光纤NA',
        dataIndex: 'test30',
        width: 90,
      },
      {
        title: '信号芯包同心度',
        dataIndex: 'test31',
        width: 90,
      },
      {
        title: '输出纤型号',
        dataIndex: 'test32',
        width: 90,
      },
      {
        title: '输出光纤lot号',
        dataIndex: 'test33',
        width: 90,
      },
      {
        title: '输出纤芯直径',
        dataIndex: 'test34',
        width: 90,
      },
      {
        title: '输出包层直径',
        dataIndex: 'test35',
        width: 90,
      },
      {
        title: '输出光纤NA',
        dataIndex: 'test36',
        width: 90,
      },
      {
        title: '输出芯包同心度',
        dataIndex: 'test37',
        width: 90,
      },
      {
        title: '单模损耗',
        dataIndex: 'test38',
        width: 90,
      },
      {
        title: 'M2',
        dataIndex: 'test39',
        width: 90,
      },
    ];
    let colAttr = [];
    for(let i=1; i<=61; i++){
      colAttr = [...colAttr, {
        title: `备用${i}`,
        dataIndex: `test${(i+39)}`,
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
        title="光学质量文件"
      >
        <Table
          rowKey="materialLotId"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          onChange={page => onSearch(page)}
          pagination={pagination}
          bordered
        />
      </Modal>
    );
  }
}
