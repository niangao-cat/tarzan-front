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
import { Button, Modal } from 'hzero-ui';
import { getCurrentOrganizationId, filterNullValueObject, getEditTableData } from 'utils/utils';
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
  handleLineCancelLoading: loading.effects['soDeliveryPlatform/handleLineCancle'],
  handleSaveLoading: loading.effects['soDeliveryPlatform/saveData'],
  handlePostLoading: loading.effects['soDeliveryPlatform/fetchPost'],
}))
export default class shipmentNotificate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHeadKeys: [],
      selectedHead: [],
      selectedLineKeys: [],
      selectedLine: [],
      visible: false,
      detailLineInfo: {},
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集;
    dispatch({
      type: 'soDeliveryPlatform/init',
      payload: {
        tenantId,
      },
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
        creationDateTo: isUndefined(fieldsValue.creationDateTo)
          ? null
          : moment(fieldsValue.creationDateTo).format(DATETIME_MIN),
          creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : moment(fieldsValue.creationDateFrom).format(DATETIME_MAX),
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
    const { callback, ...rest} = fields;
    dispatch({
      type: 'soDeliveryPlatform/fetchLineData',
      payload: {
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
        page: isEmpty(rest) ? {} : rest,
      },
    }).then(res=>{
      if (res) {
        this.setState({selectedLine: [], selectedLineKeys: []});
        if(callback) {
          callback();
        }
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
  handleDetail(flag, rows) {
    this.setState({ visible: flag });
    const { dispatch } = this.props;
    if (flag) {
      this.setState({
        detailLineInfo: [rows],
      }, () => {
        this.fetchDetail({rows: [rows]});
      });
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
    const { selectedHead } = this.state;
    const {rows, ...rest} = fields;
    dispatch({
      type: 'soDeliveryPlatform/fetchDetail',
      payload: {
        instructionIdList: rows.map(ele => ele.instructionId).toString() || '',
        instructionDocId: selectedHead.length > 0 ? selectedHead[0].instructionDocId : '',
        page: isEmpty(rest) ? {} : rest,
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

  // 过账
  handlePost = () => {
    const {
      dispatch,
      soDeliveryPlatform: {
        headPagination = {},
      },
    } = this.props;
    const { selectedHead } = this.state;
    dispatch({
      type: 'soDeliveryPlatform/fetchPost',
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

  handleLineCancel = (val) => {
    const {
      dispatch,
      soDeliveryPlatform: {
        linePagination = {},
      },
    } = this.props;
    dispatch({
      type: 'soDeliveryPlatform/handleLineCancle',
      payload: {
        instructionDocId: val.instructionDocId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchLineData(linePagination);
      }
    });
  }

  // 编辑行
  handleEdit = (record, flag) => {
    const {
      dispatch,
      soDeliveryPlatform: { lineList },
    } = this.props;
    const editContent = lineList.find(item => item._status === 'update');
    const newList = lineList.map(item => {
      if (record.instructionId === item.instructionId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    if(editContent && record.instructionId !== editContent.instructionId) {
      this.handleConfirmSave(editContent, record);
      return;
    }
    dispatch({
      type: 'soDeliveryPlatform/updateState',
      payload: {
        lineList: newList,
      },
    });
  }

  handleConfirmSave = (editContent, record) => {
    Modal.confirm({
      title: '是否保存',
      content: '存在未保存的行， 是否保存？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.handleSave(editContent, () => {
          const {
            dispatch,
            soDeliveryPlatform: { lineList },
          } = this.props;
          const newList = lineList.map(item => {
            if (record.instructionId === item.instructionId) {
              return { ...item, _status: 'update' };
            } else {
              return item;
            }
          });
          dispatch({
            type: 'soDeliveryPlatform/updateState',
            payload: {
              lineList: newList,
            },
          });
        });
      },
      onCancel: () => {
        const {
          dispatch,
          soDeliveryPlatform: { lineList },
        } = this.props;
        const newList = lineList.map(item => {
          if (record.instructionId === item.instructionId) {
            return { ...item, _status: 'update' };
          } else if(editContent.instructionId === item.instructionId) {
            return { ...item, _status: '' };
          } else {
            return item;
          }
        });
        dispatch({
          type: 'soDeliveryPlatform/updateState',
          payload: {
            lineList: newList,
          },
        });
      },
    });
  }

  handleSave = (record, callback) => {
    const {
      dispatch,
      soDeliveryPlatform: { lineList = [] },
    } = this.props;
    const { selectedHead } = this.state;
    const params = getEditTableData(lineList, ['instructionId']);
    const middle = lineList.filter(
      ele => ele._status === 'update' || ele._status === 'create'
    );
    let saveFlag = true;
    for (const value of middle) {
      // eslint-disable-next-line no-loop-func
      value.$form.validateFields(err => {
        if (err) {
          saveFlag = false;
        }
      });
    }
    if (saveFlag) {
      dispatch({
        type: 'soDeliveryPlatform/saveData',
        payload: {
          ...selectedHead.length > 0 ? selectedHead[0] : {},
          lineList: params.filter(item => item.instructionId === record.instructionId),
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchLineData({callback});
        }
      });
    }
  }

  // 行取消
  handleLineCancle = (val) => {
    const {
      dispatch,
      soDeliveryPlatform: {
        lineList = [],
      },
    } = this.props;
    const newStatusList = lineList.filter(ele => ele.instructionStatus === 'NEW');
    if (newStatusList.length === 1) {
      return notification.error({ message: '当前新建状态数量低于标准值不可取消!' });
    }
    dispatch({
      type: 'soDeliveryPlatform/handleLineCancle',
      payload: {
        instructionId: val.instructionId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        // this.fetchHeadData();
        this.fetchLineData();
      }
    });
  }


  render() {
    const {
      soDeliveryPlatform: {
        statusMap = [],
        typeMap = [],
        lotStatus = [],
        qualityStatus = [],
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        detailList=[],
        detailPagination={},
      },
      tenantId,
      fetchHeadDataLoading,
      fetchLineDataLoading,
      fetchDetailLoading,
      handleHeadCancelLoading,
      handleSaveLoading,
      handleLineCancelLoading,
      handlePostLoading,
    } = this.props;
    const { selectedHeadKeys = [], selectedLineKeys = [], visible, selectedLine, selectedHead, detailLineInfo } = this.state;
    const filterFormProps = {
      onSearch: this.fetchHeadData,
      onRef: node => {
        this.filterForm = node.props.form;
      },
      typeMap,
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
      loading: fetchLineDataLoading || handleLineCancelLoading || handleSaveLoading,
      selectedLineKeys,
      dataSource: lineList,
      pagination: linePagination,
      onViewDetail: this.handleDetail,
      onLineCancel: this.handleLineCancle,
      selectedHead,
      onEdit: this.handleEdit,
      onSave: this.handleSave,
      handleSaveLoading,
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
      lineInfo: detailLineInfo,
      onViewDetail: this.handleDetail,
    };
    return (
      <React.Fragment>
        <Header title='发运通知单查询'>
          <Button type="primary" loading={handlePostLoading} disabled={selectedHead.length === 0 || (selectedHead.length > 0 && selectedHead[0].instructionDocStatusMeaning !== '拣配完成')} onClick={() => this.handlePost(true)}>过账</Button>
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