/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（创建进入）
 */

// 引入必要的依赖包
import React from 'react';
import { Modal, Table } from 'hzero-ui';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.selectionRuleMaintenance';

// 默认导出 视图
export default class CreateForm extends React.Component {
  // 加载时调用的方法
  componentDidMount() {}

  // 渲染
  render() {
    const {
      expandColseData,
      dataSource,
      expandDrawer,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.name`).d('序号'),
        dataIndex: 'a',
        align: 'center',
        width: 60,
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.name`).d('虚拟号'),
        dataIndex: 'virtualNum',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.name`).d('新盒位置'),
        dataIndex: 'newLoad',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.name`).d('旧盒位置'),
        dataIndex: 'oldLoad',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('芯片类型'),
        dataIndex: 'cosType',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('功率/W(单点)'),
        dataIndex: 'power',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('规则1'),
        dataIndex: 'rule1',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('规则2'),
        dataIndex: 'rule2',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('规则3'),
        dataIndex: 'rule3',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('规则4'),
        dataIndex: 'rule4',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('规则5'),
        dataIndex: 'rule5',
        width: 80,
        align: 'center',
      },
    ];
    return (
      <Modal
        confirmLoading={false}
        width={1200}
        onCancel={expandColseData}
        visible={expandDrawer}
        title="取片盒子明细"
        footer={null}
      >
        <div className="tableClass">
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
          />
        </div>
      </Modal>
    );
  }
}
