/*
 * @Description: 设备台账明细
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 09:53:44
 */

import React from 'react';
import { Form, Card, Icon, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import { Button as ButtonPermission } from 'components/Permission';
import notification from 'utils/notification';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { connect } from 'dva';
import { getCurrentOrganizationId } from 'utils/utils';
import AssetInfoForm from './AssetInfoForm';
import ExtendedInfoForm from './ExtendedInfoForm';
import RunInfoForm from './RunInfoForm';

@connect(({ equipmentLedgerManagement }) => ({
  equipmentLedgerManagement,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    const { equipmentId } = this.props.match.params;
    this.state = {
      editFlag: true,
      assetInfor: 'UP',
      financeInfo: 'UP',
      runInfo: 'UP',
      equipmentId,
      loading: false,
    };
  }

  form;

  componentDidMount() {
    const { equipmentId } = this.state;
    const { dispatch, tenantId } = this.props;
    if (equipmentId !== 'create') {
      this.fetchDeviceDetail();
    }
    if (equipmentId === 'create') {
      this.setState({ editFlag: false });
    }
    dispatch({
      type: 'equipmentLedgerManagement/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'equipmentLedgerManagement/getSiteList',
      payload: {},
    });
  }

  // 设备台账列表
  @Bind()
  fetchDeviceDetail(value) {
    const { dispatch } = this.props;
    const { equipmentId } = this.props.match.params;
    this.setState({ loading: true });
    dispatch({
      type: 'equipmentLedgerManagement/fetchDeviceDetail',
      payload: {
        equipmentId: equipmentId || value,
      },
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  @Bind()
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  onBaseRef(ref = {}) {
    this.baseForm = (ref.props || {}).form;
  }

  @Bind()
  onFinanceRef(ref = {}) {
    this.financeForm = (ref.props || {}).form;
  }

  @Bind()
  onRunRef(ref = {}) {
    this.onRunRefForm = (ref.props || {}).form;
  }

  // 保存数据
  @Bind()
  handleSave() {
    const { dispatch, equipmentLedgerManagement } = this.props;
    const { deviceDetail = {} } = equipmentLedgerManagement;
    const fieldsValue = (this.form && this.form.getFieldsValue()) || {};
    // const baseForm = (this.baseForm && this.baseForm.getFieldsValue()) || {};
    const financeForm = (this.financeForm && this.financeForm.getFieldsValue()) || {};
    const onRunRefForm = (this.onRunRefForm && this.onRunRefForm.getFieldsValue()) || {};
    this.setState({ loading: true });
    dispatch({
      type: 'equipmentLedgerManagement/handleSave',
      payload: {
        ...deviceDetail,
        ...fieldsValue,
        // ...baseForm,
        ...financeForm,
        ...onRunRefForm,
        postingDate:
          financeForm.postingDate && financeForm.postingDate.format('YYYY-MM-DD HH:mm:ss'),
        warrantyDate:
          financeForm.warrantyDate && financeForm.warrantyDate.format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(res => {
      this.setState({ loading: false });
      if (res) {
        this.setState({ editFlag: true });
        notification.success({ message: '操作成功！' });
        this.fetchDeviceDetail(res.equipmentId);
      }
    });
  }

  @Bind()
  changeStatus = () => {
    this.setState({
      editFlag: false,
    });
  };

  // 展开或者关闭
  @Bind()
  formFlage(type, value) {
    switch (type) {
      case 'ASSET':
        this.setState({ assetInfor: value });
        break;
      case 'BASE':
        // eslint-disable-next-line react/no-unused-state
        this.setState({ baseInfo: value });
        break;
      case 'FINANCE':
        this.setState({ financeInfo: value });
        break;
      case 'RUN':
        this.setState({ runInfo: value });
        break;
      default:
        break;
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { editFlag, assetInfor, financeInfo, runInfo } = this.state;
    const { equipmentLedgerManagement, tenantId } = this.props;
    const {
      deviceDetail = {},
      assetClass = [],
      equipmentStatus = [],
      useFrequency = [],
      currency = [],
      equipmentType = [],
      defaultSite = {},
      applyType = [],
      ledgerType = [],
      equipmentManageModel = [],
    } = equipmentLedgerManagement;
    return (
      <React.Fragment>
        <Header title="设备台账管理" backPath="/hhme/equipment-LedgerManagement">
          <React.Fragment>
            {!editFlag ? (
              <ButtonPermission
                onClick={() => this.handleSave()}
                icon="save"
                permissionList={[
                  {
                    code: `hwms.equipment.ledger.management.save`,
                    type: 'button',
                    meaning: '保存',
                  },
                ]}
              >
                保存
              </ButtonPermission>
            ) : (
              <ButtonPermission
                onClick={this.changeStatus}
                icon="edit"
                permissionList={[
                  {
                    code: `hwms.equipment.ledger.management.edit`,
                    type: 'button',
                    meaning: '编辑',
                  },
                ]}
              >
                编辑
              </ButtonPermission>
            )}
          </React.Fragment>
        </Header>
        <Content>
          <Spin spinning={this.state.loading}>
            <Card
              key="code-rule-header"
              title={
                <span>
                  资产信息
                  {assetInfor === 'UP' ? (
                    <a
                      onClick={() => this.formFlage('ASSET', 'DOWN')}
                      style={{ height: '28px', padding: '4px 3px' }}
                    >
                      收起
                      <Icon type="up" />
                    </a>
                  ) : (
                    <a
                      onClick={() => this.formFlage('ASSET', 'UP')}
                      style={{ height: '28px', padding: '4px 6px' }}
                    >
                      展开
                      <Icon type="down" />
                    </a>
                  )}
                </span>
              }
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              size="small"
            >
              {assetInfor === 'UP' && (
                <AssetInfoForm
                  onRef={this.onRef}
                  editFlag={this.state.editFlag}
                  deviceDetail={deviceDetail}
                  assetClass={assetClass}
                  siteName={defaultSite.siteName}
                  siteId={defaultSite.siteName}
                  equipmentType={equipmentType}
                />
              )}
            </Card>
            <Card
              key="code-rule-header"
              title={
                <span>
                  执行信息
                  {runInfo === 'UP' ? (
                    <a
                      onClick={() => this.formFlage('RUN', 'DOWN')}
                      style={{ height: '28px', padding: '4px 3px' }}
                    >
                      收起
                      <Icon type="up" />
                    </a>
                  ) : (
                    <a
                      onClick={() => this.formFlage('RUN', 'UP')}
                      style={{ height: '28px', padding: '4px 6px' }}
                    >
                      展开
                      <Icon type="down" />
                    </a>
                  )}
                </span>
              }
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              size="small"
            >
              {runInfo === 'UP' && (
                <RunInfoForm
                  onRef={this.onRunRef}
                  editFlag={this.state.editFlag}
                  deviceDetail={deviceDetail}
                  equipmentStatus={equipmentStatus}
                  ledgerType={ledgerType}
                  tenantId={tenantId}
                  siteName={defaultSite.siteName}
                  siteId={defaultSite.siteName}
                  applyType={applyType}
                  equipmentManageModel={equipmentManageModel}
                />
              )}
            </Card>
            {/* <Card
              key="code-rule-header"
              title={
                <span>
                  基础信息
                  {baseInfo === 'UP' ?
                    (
                      <a onClick={() => this.formFlage('BASE', 'DOWN')} style={{ height: '28px', padding: '4px 3px' }}>
                        收起
                        <Icon type="up" />
                      </a>
                    ) : (
                      <a onClick={() => this.formFlage('BASE', 'UP')} style={{ height: '28px', padding: '4px 6px' }}>
                        展开
                        <Icon type="down" />
                      </a>
                    )
                  }
                </span>
              }
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              size="small"
            >
              {baseInfo === 'UP' && (
                <BaseInfoForm
                  onRef={this.onBaseRef}
                  editFlag={this.state.editFlag}
                  deviceDetail={deviceDetail}
                  equipemntCategqry={equipemntCategqry}
                  applyType={applyType}
                  belongTo={belongTo}
                  useFrequency={useFrequency}
                  equipmentType={equipmentType}
                  tenantId={tenantId}
                />
              )}
            </Card> */}
            <Card
              key="code-rule-header"
              title={
                <span>
                  扩展信息
                  {financeInfo === 'UP' ? (
                    <a
                      onClick={() => this.formFlage('FINANCE', 'DOWN')}
                      style={{ height: '28px', padding: '4px 3px' }}
                    >
                      收起
                      <Icon type="up" />
                    </a>
                  ) : (
                    <a
                      onClick={() => this.formFlage('FINANCE', 'UP')}
                      style={{ height: '28px', padding: '4px 6px' }}
                    >
                      展开
                      <Icon type="down" />
                    </a>
                  )}
                </span>
              }
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              size="small"
            >
              {financeInfo === 'UP' && (
                <ExtendedInfoForm
                  onRef={this.onFinanceRef}
                  editFlag={this.state.editFlag}
                  deviceDetail={deviceDetail}
                  useFrequency={useFrequency}
                  currency={currency}
                  tenantId={tenantId}
                />
              )}
            </Card>
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
