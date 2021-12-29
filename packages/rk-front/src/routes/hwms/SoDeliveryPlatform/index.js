/*
 * @Description: 销售发货平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 10:25:23
 * @LastEditTime: 2020-12-15 20:15:29
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import { DATETIME_MAX, DATETIME_MIN } from 'utils/constants';
import { Header, Content } from 'components/Page';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import FilterForm from './components/FilterForm';
import HeadTableList from './components/HeadTableList';
import LineTableList from './components/LineTableList';
import DetailDrawer from './components/DetailDrawer';

@connect(({ soDeliveryPlatform, loading }) => ({
  soDeliveryPlatform,
  tenantId: getCurrentOrganizationId(),
  fetchHeadDataLoading: loading.effects['soDeliveryPlatform/fetchHeadData'],
  fetchLineDataLoading: loading.effects['soDeliveryPlatform/fetchLineData'],
  handleCancelReleaseLoading: loading.effects['soDeliveryPlatform/handleCancelRelease'],
  handleReleaseLoading: loading.effects['soDeliveryPlatform/handleRelease'],
  fetchDetailLoading: loading.effects['soDeliveryPlatform/fetchDetail'],
  handleHeadCancelLoading: loading.effects['soDeliveryPlatform/handleHeadCancel'],
}))
export default class SoDeliveryPlatform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHeadKeys: [],
      selectedHead: [],
      selectedLineKeys: [],
      selectedLine: [],
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'soDeliveryPlatform/init',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'soDeliveryPlatform/getConfigInfo',
      payload: {
        tenantId,
        profileName: 'WMS_CREATE_NO_SO_DELIVERY',
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'soDeliveryPlatform/getConfigInfoValue',
          payload: {
            tenantId,
            id: res.content.length > 0 ? res.content[0].profileId : '',
          },
        });
      }
    });
    this.fetchHeadData();
  }

  /**
   * @description: 头查询
   * @param {fields} object 分页数据
   * @return {headList} 头数据
   */
  @Bind
  fetchHeadData(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'soDeliveryPlatform/fetchHeadData',
      payload: {
        ...fieldsValue,
        expectDeliveryDateFrom: isUndefined(fieldsValue.expectDeliveryDateFrom)
          ? null
          : moment(fieldsValue.expectDeliveryDateFrom).format(DATETIME_MIN),
        expectDeliveryDateTo: isUndefined(fieldsValue.expectDeliveryDateTo)
          ? null
          : moment(fieldsValue.expectDeliveryDateTo).format(DATETIME_MAX),
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState({
          selectedHeadKeys: [],
          selectedHead: [],
          selectedLineKeys: [],
          selectedLine: [],
        });
        dispatch({
          type: 'soDeliveryPlatform/updateState',
          payload: {
            lineList: [],
            linePagination: {},
          },
        });
      }
    });
  }

  // 行查询
  @Bind
  fetchLineData(fields = {}) {
    const { dispatch } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'soDeliveryPlatform/fetchLineData',
      payload: {
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res=>{
      if (res) {
        this.setState({selectedLine: [], selectedLineKeys: []});
      }
    });
  }

  // 选中头数据
  @Bind()
  handleSelectHead(selectedHeadKeys, selectedHead) {
    this.setState({ selectedHeadKeys, selectedHead }, () => {
      this.fetchLineData();
    });
  }

  @Bind()
  handleSelectLine(selectedLineKeys, selectedLine) {
    this.setState({ selectedLineKeys, selectedLine });
  }

  @Bind()
  handleDetail(flag) {
    this.setState({ visible: flag });
    const { dispatch } = this.props;
    if (flag) {
      this.fetchDetail();
    } else {
      dispatch({
        type: 'soDeliveryPlatform/updateState',
        payload: {
          detailPagination: {},
          detailList: [],
        },
      });
    }
  }

  // 查询明细
  @Bind
  fetchDetail(fields = {}) {
    const { dispatch } = this.props;
    const { selectedLine, selectedHead } = this.state;
    dispatch({
      type: 'soDeliveryPlatform/fetchDetail',
      payload: {
        instructionIdList: selectedLine.length > 0 ? selectedLine.map(ele => ele.instructionId).toString() : '',
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * @description: 新建或编辑
   * @param {val} object 行数据
   */
  @Bind
  handleCreate(val) {
    const { history, dispatch } = this.props;
    // 因为编辑跳转的界面与首页共用modal的headList、headPagination、lineList、linePagination，所以跳转之前先清空下数据，防止有脏数据
    dispatch({
      type: 'soDeliveryPlatform/updateState',
      payload: {
        headList: [],
        headPagination: {},
        lineList: [],
        linePagination: {},
      },
    });
    history.push(`/hwms/so-delivery-platform/create/${val}`);
  }

  // 下达
  @Bind
  handleRelease() {
    const {
      dispatch,
      soDeliveryPlatform: {
        headPagination = {},
      },
    } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'soDeliveryPlatform/handleRelease',
      payload: {
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchHeadData(headPagination);
      }
    });
  }

  // 取消下达
  @Bind
  handleCancelRelease() {
    const {
      dispatch,
      soDeliveryPlatform: {
        headPagination = {},
      },
    } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'soDeliveryPlatform/handleCancelRelease',
      payload: {
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchHeadData(headPagination);
      }
    });
  }

  /**
   * @description: 头table-取消
   * @param {val} object 行数据
   */
  @Bind
  handleHeadCancel(val) {
    const {
      dispatch,
      soDeliveryPlatform: {
        headPagination = {},
      },
    } = this.props;
    dispatch({
      type: 'soDeliveryPlatform/handleHeadCancel',
      payload: {
        instructionDocId: val.instructionDocId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchHeadData(headPagination);
      }
    });
  }

  render() {
    const {
      soDeliveryPlatform: {
        statusMap = [],
        lotStatus = [],
        qualityStatus = [],
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        configInfo = {},
        detailList=[],
        detailPagination={},
      },
      tenantId,
      fetchHeadDataLoading,
      fetchLineDataLoading,
      handleCancelReleaseLoading,
      handleReleaseLoading,
      fetchDetailLoading,
      handleHeadCancelLoading,
    } = this.props;
    const { selectedHeadKeys = [], selectedLineKeys = [], visible, selectedLine, selectedHead } = this.state;
    const filterFormProps = {
      handleSearch: this.fetchHeadData,
      onRef: node => {
        this.filterForm = node.props.form;
      },
      statusMap,
      tenantId,
    };
    const headTableListProps = {
      onSelectHead: this.handleSelectHead,
      onSearch: this.fetchHeadData,
      handleCreate: this.handleCreate,
      handleHeadCancel: this.handleHeadCancel,
      loading: fetchHeadDataLoading || handleHeadCancelLoading,
      selectedHeadKeys,
      dataSource: headList,
      pagination: headPagination,
    };
    const lineTableListProps = {
      onSelectLine: this.handleSelectLine,
      onSearch: this.fetchLineData,
      loading: fetchLineDataLoading,
      selectedLineKeys,
      dataSource: lineList,
      pagination: linePagination,
    };
    const detailDrawerProps = {
      dataSource: detailList,
      pagination: detailPagination,
      visible,
      lotStatus,
      qualityStatus,
      selectedLine,
      selectedHead,
      loading: fetchDetailLoading,
      onCancel: this.handleDetail,
    };
    return (
      <React.Fragment>
        <Header title='销售发货平台'>
          {configInfo.value==='Y'&&<Button type="primary" icon="plus" onClick={() => this.handleCreate('create')}>新建</Button>}
          <Button
            onClick={() => this.handleCancelRelease()}
            loading={handleCancelReleaseLoading}
            disabled={selectedHead.length > 0 ? selectedHead[0].instructionDocStatus !== 'RELEASED' : true}
          >
            取消下达
          </Button>
          <Button
            onClick={() => this.handleRelease()}
            loading={handleReleaseLoading}
            disabled={selectedHead.length > 0 ? selectedHead[0].instructionDocStatus !== 'NEW' : true}
          >
            下达
          </Button>
          <Button type="primary" onClick={() => this.handleDetail(true)}>明细</Button>
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <HeadTableList {...headTableListProps} />
          <LineTableList {...lineTableListProps} />
          {visible && <DetailDrawer {...detailDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
};