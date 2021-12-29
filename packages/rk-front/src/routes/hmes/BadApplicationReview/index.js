/*
 * @Description: 不良申请单审核
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-06 20:43:47
 * @LastEditTime: 2021-02-07 16:23:48
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Card, Row, Spin } from 'hzero-ui';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { isEmpty, isUndefined, get as chainGet } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import TableList from './Component/TableList';
import BadHandling from './Component/BadHandling';
import styles from './index.less';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

@connect(({ badApplicationReview, loading }) => ({
  badApplicationReview,
  tenantId: getCurrentOrganizationId(),
  fetchBabApplocationListLoading: loading.effects['badApplicationReview/fetchBabApplocationList'],
}))
export default class BadApplicationReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      spinning: false,
      ncRecordStatusList: [],
      lineRecord: {},
    };
  }

  filterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'badApplicationReview/getSiteList',
      payload: {},
    });
    dispatch({
      type: 'badApplicationReview/batchLovData',
      payload: {
        tenantId,
      },
    });

    this.getSelectOption('NC_RECORD_STATUS', 'ncRecordStatusList');
  }

  // 获取状态下拉
  @Bind()
  getSelectOption = (type, option) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'badApplicationReview/fetchStatueSelectList',
      payload: {
        module: 'NC_RECORD',
        statusGroup: type,
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          [option]: chainGet(res, 'rows', []),
        });
      }
    });
  };

  @Bind()
  fetchBabApplocationList(fields = {}) {
    const { dispatch, badApplicationReview: { defaultSite = {} } } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'badApplicationReview/fetchBabApplocationList',
      payload: {
        ...fieldsValue,
        dateTimeFrom: isUndefined(fieldsValue.dateTimeFrom)
          ? null
          : moment(fieldsValue.dateTimeFrom).format(DEFAULT_DATETIME_FORMAT),
        dateTimeTo: isUndefined(fieldsValue.dateTimeTo)
          ? null
          : moment(fieldsValue.dateTimeTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      if (res) {
        this.setState({ selectedRows: [], selectedRowKeys: [], lineRecord: {} });
      }
    });
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind()
  handleBindFormRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  handleBindBadFormRef(ref = {}) {
    this.badForm = (ref.props || {}).form;
  }

  @Bind()
  onSelectRows(selectedRowKeys, selectedRows) {
    this.badForm.resetFields();
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 提交数据
  @Bind()
  submit(values) {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    this.setState({ spinning: true });
    const array = values.ncCodeIdList && values.ncCodeIdList.split(",").map(String);
    if (!array) {
      this.setState({ spinning: false });
      notification.error({ message: '不良代码不可为空' });
    } else {
      dispatch({
        type: 'badApplicationReview/submit',
        payload: {
          ncGroupId: values.ncGroupId,
          ncCodeIdList: array,
          comment: values.comment,
          routerId: values.routerId,
          reworkRecordFlag: values.reworkRecordFlag,
          dispositionFunctionId: values.dispositionFunctionId,
          barcode: values.barcode && values.barcode,
          processMethod: values.processMethod,
          transitionMaterialId: values.transitionMaterialId,
          ncRecordIdList: selectedRowKeys,
        },
      }).then(res => {
        this.setState({ spinning: false });
        if (res) {
          notification.success();
          this.fetchBabApplocationList({});
          this.badForm.resetFields();
          this.setState({ selectedRows: [], selectedRowKeys: [] });
        }
      });
    }
  }

  // 单击行
  @Bind()
  handleOnLine(val) {
    this.setState({ lineRecord: val });
  }

  @Bind()
  handleOnSelect(_record, selected) {
    if (!selected) {
      this.setState({lineRecord: {}});
    }
  }

  render() {
    const {
      badApplicationReview: {
        badApplicationList = [],
        pagination = {},
        defaultSite = {},
        lovData = {},
        businessdList = [],
        defaultOrganizationVal,
      },
      fetchBabApplocationListLoading,
      tenantId,
    } = this.props;
    const { processMethod = [], ncTypeList = [] } = lovData;
    const {
      selectedRowKeys = [],
      selectedRows = [],
      spinning,
      ncRecordStatusList = [],
      lineRecord = {},
    } = this.state;
    const listProps = {
      onRow: this.handleOnRow,
      badApplicationList,
      pagination,
      loading: fetchBabApplocationListLoading,
      selectedRowKeys,
      selectedRows,
      onSearch: this.fetchBabApplocationList,
      onSelectRows: this.onSelectRows,
      handleOnLine: this.handleOnLine,
      handleOnSelect: this.handleOnSelect,
    };
    const filterProps = {
      tenantId,
      defaultSite,
      processMethod,
      ncRecordStatusList,
      ncTypeList,
      businessdList,
      defaultOrganizationVal,
      onSearch: this.fetchBabApplocationList,
      onRef: this.handleBindFormRef,
    };
    return (
      <Fragment>
        <Header title="不良申请单审核" />
        <Content style={{ backgroundColor: 'transparent', padding: '0px' }}>
          <Row style={{ backgroundColor: '#fff', padding: '15px' }}>
            <FilterForm {...filterProps} />
            <div className={styles['bad-review-table-list']}>
              <TableList {...listProps} />
            </div>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Card
              title="不良单处理"
            >
              <Spin spinning={spinning}>
                <BadHandling
                  tenantId={tenantId}
                  record={lineRecord}
                  submit={this.submit}
                  onRef={this.handleBindBadFormRef}
                />
              </Spin>
            </Card>
          </Row>
          <ModalContainer ref={registerContainer} />
        </Content>
      </Fragment>
    );
  }
}
