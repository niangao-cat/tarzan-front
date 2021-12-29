/**
 *销售托货单查询
 *@date：2019/11/11
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Modal } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';

import FilterForm from './DetailFilterForm';
import DetailList from './DetailListTable';

/**
 * 将models中的state绑定到组件的props中,connect 方法传入的第一个参数是 mapStateToProps 函数，
 * mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系
 *
 * 如果有connect连接，moble里面变量就不需要从父组件中传值值，直接在当前用this.props获得值
 */
@connect(({ salesReturnDocQuery, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  salesReturnDocQuery,
  detailLoading: loading.effects['salesReturnDocQuery/salesReturnDocDetailList'],
}))
class SalesReturnDocDetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRow: props.selectedRow,
    };
  }

  componentDidMount() {
    // 组件挂载初始化调用，就是页面刚进入时候需要调用的方法
    this.handleDetailSearch();
  }

  /**
   * 送货单明细查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleDetailSearch(fields = {}) {
    const { dispatch } = this.props;
    const { selectedRow } = this.state;
    // 接下来处理selectedHead和selectedRow 得到想要的数据
    // const dispatch= this.props.dispatch;
    const instructionIds = selectedRow.map(item => {
      return item.instructionId;
    });
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    // action对象：type 属性指明具体的行为，其它字段可以自定义
    dispatch({
      type: 'salesReturnDocQuery/salesReturnDocDetailList', // [model的命名空间]/[effects中对应的函数名称] 调用model
      payload: {
        organizationId: getCurrentOrganizationId(),
        instructionIds,
        ...filterValues,
        salesReturnDateFrom: isEmpty(filterValues.salesReturnDateFrom)
          ? undefined
          : moment(filterValues.salesReturnDateFrom).format(DEFAULT_DATE_FORMAT),
        salesReturnDateTo: isEmpty(filterValues.salesReturnDateTo)
          ? undefined
          : moment(filterValues.salesReturnDateTo).format(DEFAULT_DATE_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      salesReturnDocQuery: {
        detailPagination = {},
        detailList = [],
        barCodestatusMap = [],
        qualityStatusMap = [],
      },
      tenantId,
      detailLoading,
    } = this.props;
    const detailFilterProps = {
      tenantId,
      barCodestatusMap,
      qualityStatusMap,
      onSearch: this.handleDetailSearch, // 手动触发
      onRef: this.handleBindRef, // 默认触发
    };
    const detailListProps = {
      pagination: detailPagination,
      loading: detailLoading,
      dataSource: detailList,
    };
    const { showCreateDrawer, onCancel } = this.props;
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('hwms.deliverQuery.view.message.lineDetail').d('销售退货单行明细')}
        visible={showCreateDrawer}
        onCancel={() => onCancel(false)}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <FilterForm {...detailFilterProps} />
        <DetailList {...detailListProps} />
      </Modal>
    );
  }
}
export default SalesReturnDocDetailDrawer;
