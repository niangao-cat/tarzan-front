import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isEmpty, isArray, isUndefined } from 'lodash';
import { connect } from 'dva';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

@connect(({ repairPermitJudge, loading }) => ({
  repairPermitJudge,
  tenantId: getCurrentOrganizationId(),
  loading: loading.effects['repairPermitJudge/fetchList'],
}))
export default class RepairPermitJudge extends Component {

  filterForm;

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'repairPermitJudge/fetchLovData',
      payload: {
        tenantId,
      },
    });
    // 查询事业部
    dispatch({
      type: 'repairPermitJudge/fetchDepartment',
      payload: {
        tenantId,
      },
    }).then(res => {
      if(this.filterForm) {
        this.filterForm.setFieldsValue({
          departmentId: (res.find(e => e.defaultOrganizationFlag === 'Y') || {}).areaId,
        });
      }
    });
  }

  // 查询返修记录
  @Bind
  handleFetchList(page = {}) {
    const {dispatch} = this.props;
    let value = this.filterForm ? this.filterForm.getFieldsValue() : {};
    const {snNumList} = value;
    value = {
      ...value,
      snNumList: isArray(snNumList) ? snNumList.join(",") : null,
    };

    const filterValue = isUndefined(this.filterForm) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'repairPermitJudge/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  // 继续返修
  @Bind
  handleContinueRepair(record, index) {
    const {dispatch} = this.props;
    const permitCount = record.$form.getFieldValue("permitCount");
    dispatch({
      type: 'repairPermitJudge/handleContinueRepair',
      payload: {
        ...record,
        permitCount,
      },
    }).then(res => {
      if(res){
        notification.success();
        document.getElementById(`${index}`).style.backgroundColor="white";
        this.handleFetchList();
      }
    });
  }

  // 停止返修
  @Bind
  handleStopRepair(record, index) {
    // const permitCount = record.$form.getFieldValue("permitCount");
    const {dispatch} = this.props;
    dispatch({
      type: 'repairPermitJudge/handleStopRepair',
      payload: {
        ...record,
        // permitCount,
      },
    }).then(res => {
      if(res){
        notification.success();
        document.getElementById(`${index}`).style.backgroundColor="white";
        this.handleFetchList();
      }
    });
  }

  // 回车保存
  /*
  @Bind
  handleEnterDown(e, record, index){
    const {
      dispatch,
      repairPermitJudge: {
        list
      }
    } = this.props;
    if (e.keyCode === 13) {
      dispatch({
        type: 'repairPermitJudge/handleSavePermitCount',
        payload: {
          index,
          list,
          ...record,
          newPermitCount: this.formDom.getFieldValue(`permitCount-${index}`),
        },
      }).then(res => {
        if (res) {
          const barcode = document.getElementById(`${index}`);
          barcode.focus();
          if (barcode) {
            barcode.focus();
          } else {
            const barcodeNow = document.getElementById(`${index}`);
            barcodeNow.focus();
          }
        }
      });
    }
  }
  */

  // 渲染
  @Bind
  renderPermitCount(record, index) {
    const permitCount = record.$form.getFieldValue("permitCount");
    if(permitCount !== record.permitCount) {
      document.getElementById(`${index}`).style.backgroundColor="#72a0a8";
    }
    if(permitCount === record.permitCount) {
      document.getElementById(`${index}`).style.backgroundColor="white";
    }
  }

  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  render() {
    const {
      tenantId,
      repairPermitJudge: {
        list = [],
        pagination = {},
        statusList = [],
        departmentList = [],
      },
      loading,
    } = this.props;

    const filterProps ={
      tenantId,
      statusList,
      departmentList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
    };

    const listProps = {
      dataSource: list,
      pagination,
      loading,
      // onRef:node => {
      //   this.formDom = node.props.form;
      // },
      renderPermitCount: this.renderPermitCount,
      onEnterDown: this.handleEnterDown,
      onContinue: this.handleContinueRepair,
      onStop: this.handleStopRepair,
      onSearch: this.handleFetchList,
    };

    return (
      <Fragment>
        <Header
          title="返修放行判定"
        />

        <Content>
          <FilterForm {...filterProps} onRef={this.handleBindRef} />
          <ListTable {...listProps} />
          {/* <ListTable/> */}
        </Content>
      </Fragment>
    );
  }
}
