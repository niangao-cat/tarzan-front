/**
 * UserGroupManagement 复制抽屉
 * @date: 2020-1-3
 * @author: 许碧婷 <biting.xu@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { Modal } from 'hzero-ui';
import notification from 'utils/notification';
import Sites from './Sites';

const modelPrompt = 'tarzan.process.routes.model.routes';
@connect(({ routes }) => ({
  routes,
}))
export default class SiteDrawer extends Component {
  onOk = () => {
    const {
      canEdit,
      onCancel,
      routes: { sitesList = [] },
    } = this.props;
    const unSaveSitesList = sitesList.filter(item => ['create', 'update'].includes(item._status));
    if (canEdit && unSaveSitesList.length > 0) {
      notification.error({
        message: intl.get(`${modelPrompt}.unSaveSitesList`).d('请保存所有分配站点行'),
      });
      return;
    }
    onCancel();
  };

  render() {
    const { visible, onCancel, routerId, canEdit } = this.props;

    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.product.bom.title.siteDistribution').d('分配站点')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.onOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Sites routerId={routerId} canEdit={canEdit} />
      </Modal>
    );
  }
}
