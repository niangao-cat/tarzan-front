/**
 * DispatchingScope - 调度范围页面
 * @date: 2019-12-9
 * @author: JRQ <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Button, Select } from 'hzero-ui';
import { Content } from 'components/Page';
import styles from './index.less';

const { Option } = Select;
const modelPrompt = 'tarzan.workshop.dispatchPlatform.model.dispatchPlatform';

@connect(({ dispatchPlatform, loading }) => ({
  dispatchPlatform,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['dispatchPlatform/fetchMaterialList'],
}))
@formatterCollections({ code: 'tarzan.workshop.dispatchPlatform' })
export default class DispatchingScope extends React.Component {
  // 渲染生产线下拉
  renderProLineOptions = options =>
    options.map(item => {
      return <Option value={item.prodLineId}>{item.prodLineName}</Option>;
    });

  // 渲染工艺下拉
  renderOperationOptions = options =>
    options.map(item => {
      return <Option value={item.operationId}>{item.operationName}</Option>;
    });

  // 选择生产线时，查询生产线下工艺下拉列表
  handleChangeProLine = (value, e) => {
    const {
      dispatch,
      dispatchPlatform: { defaultSiteId },
    } = this.props;
    dispatch({
      type: 'dispatchPlatform/updateState',
      payload: {
        selectedProLineId: value,
        selectedProLineName: e ? e.props.children : '',
        selectedOperationId: '',
        selectedOperationName: '',
      },
    });
    dispatch({
      type: 'dispatchPlatform/fetchUsersOperationOptions',
      payload: {
        prodLineId: value,
        defaultSiteId,
      },
    });
  };

  // 选择工艺
  handleChangeOperation = (value, e) => {
    this.props.dispatch({
      type: 'dispatchPlatform/updateState',
      payload: {
        selectedOperationId: value,
        selectedOperationName: e ? e.props.children : '',
      },
    });
  };

  //  切换至调度平台页面，获取父表格数据
  changeShowDispatchScopeFlag = () => {
    const {
      dispatch,
      dispatchPlatform: { defaultSiteId, selectedProLineId, selectedOperationId },
    } = this.props;
    dispatch({
      type: 'dispatchPlatform/fetchTableInfo',
      payload: {
        defaultSiteId,
        prodLineId: selectedProLineId,
        operationId: selectedOperationId,
      },
    });
    dispatch({
      type: 'dispatchPlatform/updateState',
      payload: {
        showDispatchScopeFlag: false,
      },
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      dispatchPlatform: {
        defaultSiteId = '',
        selectedProLineId = '',
        selectedOperationId = '',
        usersProLineOptions = [],
        operationOptions = [],
      },
    } = this.props;
    return (
      <>
        <Content>
          <div className={styles.dispatchingScope}>
            <div className={styles.title}>
              {intl.get(`${modelPrompt}.dispatchingScope`).d('调度范围')}
            </div>
            <Select
              showSearch
              disabled={!defaultSiteId}
              style={{ width: 250, marginBottom: 10, height: 32 }}
              placeholder={intl.get(`${modelPrompt}.proLink`).d('生产线')}
              optionFilterProp="children"
              onChange={this.handleChangeProLine}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear
            >
              {this.renderProLineOptions(usersProLineOptions)}
            </Select>
            <Select
              showSearch
              disabled={!defaultSiteId || !selectedProLineId}
              style={{ width: 250, marginBottom: 20, height: 32 }}
              placeholder={intl.get(`${modelPrompt}.operation`).d('工艺')}
              optionFilterProp="children"
              onChange={this.handleChangeOperation}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear
            >
              {this.renderOperationOptions(operationOptions)}
            </Select>
            <Button
              disabled={!defaultSiteId || !selectedProLineId || !selectedOperationId}
              type="primary"
              style={{ width: 250, marginBottom: 20, height: 28, fontSize: 14 }}
              onClick={this.changeShowDispatchScopeFlag}
            >
              {intl.get('tarzan.workshop.dispatchPlatform.button.sure').d('确认')}
            </Button>
          </div>
        </Content>
      </>
    );
  }
}
