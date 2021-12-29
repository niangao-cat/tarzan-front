import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form } from 'hzero-ui';
// import { isEmpty, map } from 'lodash';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import HistoryFilterForm from './HistoryFilterForm';
import HistoryTable from './HistoryTable';
import HistoryItemTable from './HistoryItemTable';

/**
 * 修改历史抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ numberRange, loading }) => ({
  numberRange,
  tenantId: getCurrentOrganizationId(),
  loading: {
    query: loading.effects['numberRange/fetchKafkaTableData'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class HistoryDrawer extends PureComponent {
  queryForm;

  // componentDidMount(){
  //   this.queryForm.fetchQueryList();
  // }
  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    this.queryForm.fetchQueryList(pagination);
  }

  /**
   *
   * @param {object} ref - FilterForm子组件对象
   */
  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
    this.queryForm.fetchQueryList();
  }

  render() {
    const { visible, onCancel, initData } = this.props;
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.mes.numR.title.history').d('修改历史')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <HistoryFilterForm onRef={this.handleBindQueryRef} initData={initData} />
        <HistoryTable handleTableChange={this.fetchQueryList} />
        <HistoryItemTable />
      </Modal>
    );
  }
}
