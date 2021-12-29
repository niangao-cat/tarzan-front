/**
 * 异常信息维护 - AbnormalInfo
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';
import { isUndefined, isEmpty } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import {
  getEditTableData,
  addItemToPagination,
  delItemToPagination,
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';

import FilterForm from './FilterForm';
import HeadTable from './HeadTable';
import AbnormalResponse from './AbnormalResponse';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.abnormalInfo';

@connect(({ abnormalInfo, loading }) => ({
  abnormalInfo,
  fetchHeadListLoading: loading.effects['abnormalInfo/fetchHeadList'],
  fetchLineListLoading: loading.effects['abnormalInfo/fetchLineList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class PurchaseOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseKeys: ['abnormalResponse'],
      isEdit: false,
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormalInfo/updateState',
      payload: {
        selectedRecord: {},
        lineList: [],
        linePagination: {},
      },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormalInfo/init',
    });
    this.handleFetchHeadList();
    this.handleFetchSelectList();
  }

  @Bind()
  handleFetchHeadList(page = {}) {
    const { dispatch } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'abnormalInfo/fetchHeadList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleFetchLineList(page = {}, record = {}) {
    const {
      dispatch,
      abnormalInfo: { selectedRecord = {} },
    } = this.props;
    const newRecord = isEmpty(record) ? selectedRecord : record;
    dispatch({
      type: 'abnormalInfo/fetchLineList',
      payload: {
        selectedRecord: newRecord,
        page,
      },
    });
  }

  @Bind()
  handleFetchSelectList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormalInfo/fetchExceptionTypeList',
      payload: {
        module: 'HME',
        typeGroup: 'EXCEPTION_TYPE',
      },
    });
  }

  @Bind()
  handleCreate(listName, paginationName, idName) {
    const { dispatch, abnormalInfo } = this.props;
    const dataSource = abnormalInfo[listName];
    const pagination = abnormalInfo[paginationName];
    dispatch({
      type: 'abnormalInfo/updateState',
      payload: {
        [listName]: [
          {
            [idName]: uuid(),
            _status: 'create',
          },
          ...dataSource,
        ],
        [pagination]: addItemToPagination(dataSource.length, pagination),
      },
    });
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSource 数据源在model里的名称
   * @param {string} id 数据源的id名称
   * @param {object} current 当前行
   * @param {boolean} flag
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleEditLine(dataSource, id, current, flag) {
    const { dispatch, abnormalInfo } = this.props;
    const list = abnormalInfo[dataSource];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'abnormalInfo/updateState',
      payload: {
        [dataSource]: newList,
      },
    });
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleCleanLine(dataSource, paginationName, id, current) {
    const { dispatch, abnormalInfo } = this.props;
    const list = abnormalInfo[dataSource];
    const pagination = abnormalInfo[paginationName];
    const newList = list.filter(item => item[id] !== current[id]);
    dispatch({
      type: 'abnormalInfo/updateState',
      payload: {
        [dataSource]: newList,
        [paginationName]: delItemToPagination(pagination.length, pagination),
      },
    });
  }

  /**
   * 校验行编辑
   *
   * @param {array} [dataSource=[]] 数组
   * @param {array} [excludeKeys=[]]
   * @param {object} [property={}]
   * @returns
   * @memberof ContractBaseInfo
   */
  @Bind()
  validateEditTable(dataSource = [], excludeKeys = [], property = {}) {
    const editTableData = dataSource.filter(e => e._status);
    if (editTableData.length === 0) {
      return Promise.resolve(dataSource);
    }
    return new Promise((resolve, reject) => {
      const validateDataSource = getEditTableData(dataSource, excludeKeys, property);
      if (validateDataSource.length === 0) {
        reject(
          notification.error({
            description: intl
              .get('ssrm.leaseContractCreate.view.message.error')
              .d('请完整页面上的必填信息'),
          })
        );
      } else {
        resolve(validateDataSource);
      }
    });
  }

  @Bind()
  handleSaveHeadList(record) {
    const { dispatch, abnormalInfo: { pagination } } = this.props;
    const { $form, exceptionId, ...headLineInfo } = record;
    record.$form.validateFields((err, value) => {
      if (!err) {
        const payload = record._status === 'create' ? {
          ...headLineInfo,
          ...value,
          enableFlag: value.enableFlag ? 'Y' : 'N',
        } : {
          ...headLineInfo,
          ...value,
          exceptionId,
          enableFlag: value.enableFlag ? 'Y' : 'N',
        };
        dispatch({
          type: 'abnormalInfo/saveHeadList',
          payload,
        }).then(res => {
          if (res) {
            notification.success();
            this.handleFetchHeadList(pagination);
          }
        });
      }
    });
  }

  @Bind()
  handleSaveLineList() {
    const {
      dispatch,
      abnormalInfo: { lineList = [], selectedRecord },
    } = this.props;
    Promise.all([this.validateEditTable(lineList, ['exceptionRouterId'])]).then(res => {
      const [newLineList] = res;
      const newList = newLineList.map(e => ({
        ...e,
        exceptionId: selectedRecord.exceptionId,
        isTop: e.isTop ? 'Y' : 'N',
      }));
      const noUpdateList = lineList.filter(e => !['create', 'update'].includes(e._status));
      const topList = noUpdateList.concat(newList).filter(e => e.isTop === 'Y');
      if (topList.length > 0) {
        dispatch({
          type: 'abnormalInfo/saveLineList',
          payload: {
            data: newList,
          },
        }).then(result => {
          if (result) {
            notification.success();
            this.handleFetchLineList();
          }
        });
      } else {
        notification.warning({
          description: '保存时必须存在一行勾选【是否最高级异常】',
        });
      }
    });
  }

  /**
   * 删除操作
   *
   * @param {array} selectedRows 勾选项
   * @param {string} dataSourceName 数据源模板
   * @param {string} idName 主键id名称
   * @param {string} effects
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleDelete(record) {
    const { dispatch } = this.props;
    if (!isEmpty(record)) {
      const { exceptionId, exceptionRouterId } = record;
      dispatch({
        type: `abnormalInfo/deleteLineList`,
        payload: {
          data: {
            exceptionId,
            exceptionRouterId,
          },
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleFetchLineList();
        }
      });
    }
  }

  @Bind()
  handleCanEdit() {
    const { isEdit } = this.state;
    this.setState({ isEdit: !isEdit });
  }

  @Bind()
  handleChangeKey(key) {
    this.setState({ collapseKeys: key });
  }

  // 渲染 界面布局
  render() {
    const {
      fetchHeadListLoading,
      fetchLineListLoading,
      tenantId,
      abnormalInfo: {
        headList = [],
        pagination = {},
        lineList = [],
        linePagination = {},
        selectedRecord = {},
        exceptionTypeList = [],
      },
    } = this.props;
    const { collapseKeys = [], isEdit } = this.state;
    const filterProps = {
      tenantId,
      exceptionTypeList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchHeadList,
    };
    const headListProps = {
      tenantId,
      exceptionTypeList,
      loading: fetchHeadListLoading,
      pagination,
      dataSource: headList,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchHeadList,
      onCreate: this.handleCreate,
      onSave: this.handleSaveHeadList,
      onFetchLineList: this.handleFetchLineList,
    };
    const abnormalResponseProps = {
      tenantId,
      isEdit,
      dataSource: lineList,
      pagination: linePagination,
      loading: fetchLineListLoading,
      onCreate: this.handleCreate,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchLineList,
      onDelete: this.handleDelete,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('异常信息维护')} />
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <HeadTable {...headListProps} />
          </div>
          <div className="ued-detail-wrapper">
            <Collapse
              className="form-collapse"
              defaultActiveKey={['abnormalResponse']}
              onChange={this.handleChangeKey}
            >
              <Collapse.Panel
                showArrow={false}
                key="abnormalResponse"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.abnormalResponse`).d('异常响应设置')}</h3>
                    <a>
                      {collapseKeys.includes('abnormalResponse')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('abnormalResponse') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <Button
                  type="default"
                  style={{ marginRight: '12px', marginBottom: '12px' }}
                  onClick={() => this.handleCanEdit()}
                  disabled={isEmpty(selectedRecord)}
                >
                  {isEdit
                    ? intl.get(`${modelPrompt}.button.maintain`).d('取消维护响应岗位')
                    : intl.get(`${modelPrompt}.button.maintain`).d('维护响应岗位')}
                </Button>
                {isEdit && (
                  <Button
                    style={{ marginBottom: '12px' }}
                    icon="save"
                    type="default"
                    onClick={() => this.handleSaveLineList()}
                    disabled={isEmpty(selectedRecord) || !isEdit}
                  >
                    {intl.get(`${modelPrompt}.button.save`).d('保存')}
                  </Button>
                )}
                <div className={styles['head-table']}>
                  <AbnormalResponse {...abnormalResponseProps} />
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
