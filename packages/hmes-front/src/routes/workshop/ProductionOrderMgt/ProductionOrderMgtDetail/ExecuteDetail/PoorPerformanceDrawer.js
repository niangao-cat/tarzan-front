import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button } from 'hzero-ui';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.workshop.execute.model.execute';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ execute, loading }) => ({
  execute,
  loading: loading.effects['execute/fetchPoorPerformanceList'],
}))
export default class PoorPerformanceDrawer extends PureComponent {
  componentDidMount() {
    this.onSearch();
  }

  onSearch = (pagination = {}) => {
    const { dispatch, initData = {} } = this.props;
    const { eoStepActualId } = initData;
    dispatch({
      type: 'execute/fetchPoorPerformanceList',
      payload: {
        eoStepActualId,
        page: {
          ...pagination,
        },
      },
    });
  };

  render() {
    const {
      visible,
      onCancel,
      loading,
      execute: { poorPerformanceList = [], poorPerformancePagination = {} },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.ncIncidentCode`).d('不良事故编码'),
        dataIndex: 'ncIncidentCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.ncIncidentStatusDesc`).d('不良事故状态'),
        dataIndex: 'ncIncidentStatusDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.ncCode`).d('不良代码'),
        dataIndex: 'ncCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.ncCodeDesc`).d('不良代码描述'),
        dataIndex: 'ncCodeDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.ncRecordStatusDesc`).d('不良记录状态'),
        dataIndex: 'ncRecordStatusDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.userName`).d('关闭人'),
        dataIndex: 'userName',
        width: 100,
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.workshop.execute.title.poorPerformance').d('不良实绩')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={[
          <Button onClick={onCancel}>
            {intl.get('tarzan.workshop.execute.button.return').d('返回')}
          </Button>,
        ]}
      >
        <Table
          bordered
          dataSource={poorPerformanceList}
          columns={columns}
          rowKey="ncRecordId"
          pagination={poorPerformancePagination}
          onChange={this.onSearch}
          loading={loading}
        />
      </Modal>
    );
  }
}
