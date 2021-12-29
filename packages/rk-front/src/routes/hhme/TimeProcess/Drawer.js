import React, { PureComponent } from 'react';
import { Modal, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { enableRender } from '../../../utils/renderer';

import DrawerFilterForm from './DrawerFilterForm';

const commonModelPrompt = 'tarzan.common.components.model.components';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @param {Boolean} visible - 是否关闭抽屉
 * @param {Boolean} canEdit - 是否可以编辑
 * @param {Array} - attribute List
 * @param {Function} onSave - 保存抽屉数据
 * @param {Function} onCancle - 关闭抽屉
 * @return React.element
 */
export default class AttributeDrawer extends PureComponent {

  @Bind()
  renderData() {
    const {
      type,
      processHistoryList,
      processHistoryPagination,
      itemHistoryList,
      itemHistoryPagination,
      objectHistoryList,
      objectHistoryPagination,
    } = this.props;
    let columns = [];
    let id = '';
    let dataSource = [];
    let pagination = {};
    let title = '';
    switch(type) {
      case 'PROCESS':
        id = 'operationTimeId';
        title = '时效工艺历史';
        dataSource = processHistoryList;
        pagination = processHistoryPagination;
        columns = [
          {
            title: '时效编码',
            width: 100,
            dataIndex: 'timeCode',
          },
          {
            title: '时效描述',
            width: 100,
            dataIndex: 'timeName',
          },
          {
            title: '时效要求',
            width: 120,
            dataIndex: 'standardReqdTimeInProcess',
          },
          {
            title: '工艺',
            width: 120,
            dataIndex: 'operationName',
          },
          {
            title: '工位',
            width: 120,
            dataIndex: 'workcellName',
          },
          {
            title: intl.get(`${commonModelPrompt}.enableFlag`).d('启用状态'),
            width: 80,
            dataIndex: 'enableFlag',
            align: 'center',
            render: enableRender,
          },
          {
            title: intl.get(`${commonModelPrompt}.supplierName`).d('事件人'),
            width: 80,
            dataIndex: 'eventByName',
          },
          {
            title: intl.get(`${commonModelPrompt}.creationDate`).d('事件时间'),
            width: 120,
            dataIndex: 'eventTime',
          },
          {
            title: intl.get(`${commonModelPrompt}.demandTime`).d('事件类型'),
            width: 80,
            dataIndex: 'eventType',
          },
        ];
        break;
      case 'ITEM':
        id = 'operationTimeMaterialId';
        title = '关联物料历史';
        dataSource = itemHistoryList;
        pagination = itemHistoryPagination;
        columns = [
          {
            title: '物料',
            width: 100,
            dataIndex: 'materialCode',
          },
          {
            title: '物料版本',
            width: 100,
            dataIndex: 'productionVersion',
          },
          {
            title: '特定物料时效要求',
            width: 120,
            dataIndex: 'standardReqdTimeInProcess',
          },
          {
            title: intl.get(`${commonModelPrompt}.enableFlag`).d('启用状态'),
            width: 80,
            dataIndex: 'enableFlag',
            align: 'center',
            render: enableRender,
          },
          {
            title: intl.get(`${commonModelPrompt}.supplierName`).d('事件人'),
            width: 80,
            dataIndex: 'eventByName',
          },
          {
            title: intl.get(`${commonModelPrompt}.creationDate`).d('事件时间'),
            width: 120,
            dataIndex: 'eventTime',
          },
          {
            title: intl.get(`${commonModelPrompt}.demandTime`).d('事件类型'),
            width: 80,
            dataIndex: 'eventType',
          },
        ];
        break;
      case 'OBJECT':
        id = 'operationTimeObjectId';
        title = '关联其他对象历史';
        dataSource = objectHistoryList;
        pagination = objectHistoryPagination;
        columns = [
          {
            title: '类型',
            width: 100,
            dataIndex: 'objectTypeMeaning',
          },
          {
            title: '特定对象编码',
            width: 100,
            dataIndex: 'objectCode',
          },
          {
            title: '特定对象时效要求',
            width: 120,
            dataIndex: 'standardReqdTimeInProcess',
          },
          {
            title: intl.get(`${commonModelPrompt}.enableFlag`).d('启用状态'),
            width: 80,
            dataIndex: 'enableFlag',
            align: 'center',
          },
          {
            title: intl.get(`${commonModelPrompt}.supplierName`).d('事件人'),
            width: 80,
            dataIndex: 'eventByName',
          },
          {
            title: intl.get(`${commonModelPrompt}.creationDate`).d('事件时间'),
            width: 120,
            dataIndex: 'eventTime',
          },
          {
            title: intl.get(`${commonModelPrompt}.demandTime`).d('事件类型'),
            width: 80,
            dataIndex: 'eventType',
          },
        ];
        break;
      default:
    }
    return {
      columns,
      id,
      dataSource,
      pagination,
      title,
    };
  }

  render() {
    const { visible = false, onCancel, onSearch, loading, drawerFilterFormProps } = this.props;
    const { columns, id, dataSource, pagination } = this.renderData();
    return (
      <Modal
        destroyOnClose
        width={1000}
        title='明细'
        visible={visible}
        onCancel={onCancel}
        // onOk={this.onOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
        footer={null}
      >
        <DrawerFilterForm {...drawerFilterFormProps} />
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          scroll={{ x: tableScrollWidth(columns) }}
          loading={loading}
          rowKey={id}
        />
      </Modal>
    );
  }
}
