/**
 * EventDetailsDrawer 组织关系详细信息抽屉
 * @date: 2019-7-30
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Drawer, Button } from 'hzero-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';
import backArrow from '../../../assets/backArrow.svg';
import AreaBlock from './AreaBlock';
import LocatorBlock from './LocatorBlock';
import WorkCellBlock from './WorkCellBlock';
import ProLineBlock from './ProLineBlock';
import SiteBlock from './SiteBlock';
import EnterpriseBlock from './EnterpriseBlock';
import LocatorGroupBlock from './LocatorGroupBlock';

const modelPrompt = 'tarzan.org.RelationMaintain.model.RelationMaintain';

@connect(({ relationMaintain }) => ({
  relationMaintain,
}))
@formatterCollections({
  code: ['tarzan.org.RelationMaintain'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class CurrencyDrawer extends React.PureComponent {
  state = {
    componentDisabled: true,
    drawerTitle: '',
  };

  componentDidMount() {
    if (this.props.relationMaintain.orgItemId === 'create') {
      this.setState({
        componentDisabled: false,
      });
    }
    this.renderTitle();
  }

  // 获得标题名称
  renderTitle = () => {
    const {
      relationMaintain: { orgItemId, orgItemType, treeOrgTypeList = [] },
    } = this.props;
    let operation = '';
    let type = '';
    let drawerTitle = '';
    treeOrgTypeList.forEach(obj => {
      if (obj.typeCode === orgItemType) {
        type = obj.description;
      }
    });
    if (orgItemId === 'create') {
      operation = intl.get(`${modelPrompt}.assignment`).d('分配');
      drawerTitle = operation + type;
    } else {
      operation = intl.get(`${modelPrompt}.maintain`).d('维护');
      drawerTitle = type + operation;
    }
    this.setState({
      drawerTitle,
    });
  };

  // 切换组件是否可编辑
  changeDisabledFlag = flag => {
    this.setState({
      componentDisabled: flag,
    });
  };

  // 保存
  saveDrawer = () => {
    this.AreaBlock.handleSaveAll();
  };

  // 保存成功后的回调,组件disabled设为true,关闭drawer
  saveSuccessCallBack = () => {
    this.changeDisabledFlag(true);
    // this.props.dispatch({
    //   type: 'relationMaintain/fetchOrgTree',
    // });
    this.props.onCancel();
  };

  onRefAreaBlock = ref => {
    this.AreaBlock = ref;
  };

  render() {
    const { componentDisabled, drawerTitle } = this.state;
    const {
      container,
      relationMaintain: { orgItemDrawerVisible, orgItemId, orgItemType },
    } = this.props;

    const blockProps = {
      itemId: orgItemId,
      componentDisabled,
      saveSuccessCallBack: this.saveSuccessCallBack,
    };

    return (
      <Drawer
        destroyOnClose
        placement="left"
        closable={false}
        visible={orgItemDrawerVisible}
        getContainer={container}
        onCancel={this.saveSuccessCallBack}
        width="100%"
      >
        <div className={styles.currencyDrawer}>
          <div className={styles.title}>
            <div className={styles.imgCircular} onClick={this.saveSuccessCallBack}>
              <img className={styles.availableImg} src={backArrow} alt="" title="" />
            </div>
            <span>{drawerTitle}</span>
            <div className={styles.btnDiv}>
              {componentDisabled ? (
                <Button
                  type="primary"
                  className={styles.returnBtn}
                  icon="edit"
                  onClick={this.changeDisabledFlag.bind(this, false)}
                >
                  {intl.get('tarzan.org.RelationMaintain.button.edit').d('编辑')}
                </Button>
              ) : (
                <Button type="primary" className={styles.returnBtn} onClick={this.saveDrawer}>
                  {intl.get('tarzan.org.RelationMaintain.button.save').d('保存')}
                </Button>
              )}
            </div>
          </div>
          <div className={styles.drawerContent}>
            {(() => {
              switch (orgItemType) {
                case 'AREA':
                  return <AreaBlock {...blockProps} onRef={this.onRefAreaBlock} />;
                case 'LOCATOR':
                  return <LocatorBlock {...blockProps} onRef={this.onRefAreaBlock} />;
                case 'WORKCELL':
                  return <WorkCellBlock {...blockProps} onRef={this.onRefAreaBlock} />;
                case 'PROD_LINE':
                  return <ProLineBlock {...blockProps} onRef={this.onRefAreaBlock} />;
                case 'SITE':
                  return <SiteBlock {...blockProps} onRef={this.onRefAreaBlock} />;
                case 'ENTERPRISE':
                  return <EnterpriseBlock {...blockProps} onRef={this.onRefAreaBlock} />;
                case 'LOCATOR_GROUP':
                  return <LocatorGroupBlock {...blockProps} onRef={this.onRefAreaBlock} />;
                default:
                  return null;
              }
            })()}
          </div>
        </div>
      </Drawer>
    );
  }
}
