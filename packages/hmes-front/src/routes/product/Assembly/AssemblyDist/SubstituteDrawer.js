import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import SubstituteTable from './SubstituteTable';
import SubstituteItemTable from './SubstituteItemTable';

/**
 * 替代组抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  tenantId: getCurrentOrganizationId(),
  loading: {
    query: loading.effects['assemblyList/fetchKafkaTableData'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class IsssueDrawer extends PureComponent {
  state = {
    selectedId: '',
  };

  @Bind()
  pipeline(id) {
    this.setState({
      selectedId: id,
    });
  }

  onCancel = () => {
    this.setState({
      selectedId: '',
    });
    this.props.onCancel();
  };

  render() {
    const { visible, bomId, currentBomId, canEdit } = this.props;
    const tableProps = {
      bomId,
      canEdit,
      pipeline: this.pipeline,
    };
    const itemTable = {
      bomId,
      canEdit,
      currentBomId,
      tableId: this.state.selectedId,
    };
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.product.bom.title.componentAndSubstitute').d('装配清单行与替代组')}
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <SubstituteTable {...tableProps} />
        <SubstituteItemTable {...itemTable} />
      </Modal>
    );
  }
}
