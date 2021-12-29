/*
 * @Description: 明细
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-09 22:17:01
 * @LastEditTime: 2021-01-22 10:30:10
 */
import React, { Fragment } from 'react';
import { Content, Header } from 'components/Page';
import {
  DataSet,
} from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';
import uuid from 'uuid/v4';
import { getCurrentOrganizationId, addItemToPagination, getEditTableData, delItemToPagination } from 'utils/utils';
import { connect } from 'dva';
import moment from 'moment';
import notification from 'utils/notification';
import {
  formDS,
  lineTableDS,
} from '../stores/workInstructionsDS';
import ListTableLine from './ListTableLine';
import DataForm from './DataForm';

const organizationId = getCurrentOrganizationId();
@connect(({ workInstructions, loading }) => ({
  workInstructions,
  saveHeadDataLoading: loading.effects['workInstructions/saveHeadData'],
  saveLineDataLoading: loading.effects['workInstructions/saveLineData'],
  fetchLineListLoading: loading.effects['workInstructions/fetchLineList'],
  fetchHeadsDetailLoading: loading.effects['workInstructions/fetchHeadsDetail'],
}))
export default class WorkInstructionsDetail extends React.Component {

  constructor(props) {
    super(props);
    this.lineTableDS = new DataSet(lineTableDS);
    this.state = {
      editFlag: true,
    };
  }

  componentDidMount() {
    this.formDS = new DataSet(formDS);
    const {
      dispatch,
    } = this.props;
    const { headId } = this.props.match.params;
    dispatch({
      type: 'workInstructions/getSiteList',
      payload: {},
    });
    if (headId !== 'create') {
      this.fetchHeadsDetail(headId);
      this.fetchLineData();
    } else {
      this.setState({ editFlag: false });
    }
  }

  componentWillUnmount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'workInstructions/updateState',
      payload: {
        lineData: [],
        headDetail: [],
        fileList: [],
      },
    });
  }

  @Bind()
  fetchHeadsDetail(headId) {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'workInstructions/fetchHeadsDetail',
      payload: {
        insHeadId: headId,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'workInstructions/fetchfileList',
          payload: {
            fileUrl: res.fileUrl,
          },
        });
      }
    });
  }

  // 查询行数据
  @Bind()
  fetchLineData(fields = {}) {
    const { dispatch } = this.props;
    const { headId } = this.props.match.params;
    dispatch({
      type: 'workInstructions/fetchLineList',
      payload: {
        insHeadId: headId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleFetchList() {
    // this.headTableDS.query();
  }

  // 保存数据
  @Bind()
  saveData() {
    const {
      dispatch,
      workInstructions: { lineData = [], defaultSite = {}, headDetail = {} },
      history,
    } = this.props;
    let lineFlag = true;
    const middle = lineData.filter(
      ele => ele._status === 'update' || ele._status === 'create'
    );
    for (const value of middle) {
      // eslint-disable-next-line no-loop-func
      value.$form.validateFields(err => {
        if (err) {
          lineFlag = false;
        }
      });
    }
    this.dataForm.validateFields((err, values) => {
      if (!err && lineFlag) {
        if (values.fileUrl) {
          dispatch({
            type: 'workInstructions/saveHeadData',
            payload: {
              ...headDetail,
              ...values,
              siteId: defaultSite.siteId,
              tenantId: organizationId,
              startDate: isUndefined(values.startDate)
                ? null
                : moment(values.startDate).format('YYYY-MM-DD HH:mm:ss'),
              endDate: isUndefined(values.endDate)
                ? null
                : moment(values.endDate).format('YYYY-MM-DD HH:mm:ss'),
            },
          }).then(res => {
            const params = getEditTableData(lineData, ['operationInsId']);
            history.push(`/hhme/work-instructions/detail/${res.insHeaderId}`);
            this.fetchHeadsDetail(res.insHeaderId);
            const arr = [];
            params.forEach(ele => {
              arr.push({
                ...ele,
                enableFlag: ele.enableFlag ? ele.enableFlag : 'N',
                insHeaderId: res.insHeaderId,
                tenantId: organizationId,
              });
            });
            if (res) {
              if (arr.length > 0) {
                dispatch({
                  type: 'workInstructions/saveLineData',
                  payload: arr,
                }).then(reshead => {
                  if (reshead) {
                    notification.success();
                    this.fetchLineData();
                    this.setState({ editFlag: true });
                  }
                });
              }
              if (arr.length===0) {
                this.setState({ editFlag: true });
              }
            }
          });
        } else {
          notification.error({ message: '请上传文件！' });
        }
      }
    });
  }

  @Bind()
  onUploadSuccess(file) {
    if (file) {
      this.dataForm.setFieldsValue({
        fileUrl: file.response,
      });
    }
  }

  @Bind()
  onCancelSuccess(file) {
    if (file) {
      this.dataForm.setFieldsValue({
        fileUrl: '',
      });
    }
  }

  @Bind()
  handleCreate() {
    const {
      dispatch,
      workInstructions: { lineData = [], lineDataPagination = {} },
    } = this.props;
    dispatch({
      type: 'workInstructions/updateState',
      payload: {
        lineData: [
          {
            operationInsId: uuid(),
            _status: 'create',
          },
          ...lineData,
        ],
        lineDataPagination: addItemToPagination(lineData.length, lineDataPagination),
      },
    });
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      workInstructions: { lineData = [], lineDataPagination = {} },
    } = this.props;
    lineData.splice(index, 1);
    dispatch({
      type: 'workInstructions/updateState',
      payload: {
        lineData,
        lineDataPagination: delItemToPagination(1, lineDataPagination),
      },
    });
  }

  /**
   * 编辑
   * 行数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      workInstructions: { lineData = [] },
    } = this.props;
    const newList = lineData.map(item =>
      item.operationInsId === record.operationInsId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'workInstructions/updateState',
      payload: {
        lineData: [...newList],
      },
    });
  }

  @Bind()
  changeStatus = () => {
    this.setState({
      editFlag: false,
    });
  };

  render() {
    const { headId } = this.props.match.params;
    const { editFlag } = this.state;
    const {
      workInstructions: {
        lineData = [],
        lineDataPagination = {},
        defaultSite = {},
        headDetail = {},
        fileList = [],
      },
      saveHeadDataLoading,
      saveLineDataLoading,
      fetchHeadsDetailLoading,
      fetchLineListLoading,
    } = this.props;
    const dataFormProps = {
      onRef: node => {
        this.dataForm = node.props.form;
      },
      defaultSite,
      headDetail,
      editFlag,
      fileList,
      fetchHeadsDetailLoading,
      onUploadSuccess: this.onUploadSuccess,
      onCancelSuccess: this.onCancelSuccess,
    };
    return (
      <Fragment>
        <Header title='作业指导书' backPath="/hhme/work-instructions">
          {!editFlag ? (
            <Button type="primary" icon="save" loading={saveHeadDataLoading || saveLineDataLoading} onClick={() => this.saveData()}>
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          ) : (
            <Button type="primary" icon="edit" onClick={this.changeStatus}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>
            )}
        </Header>
        <Content>
          <DataForm {...dataFormProps} />
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="工艺与作业指导关系" key="1">
              <ListTableLine
                defaultSite={defaultSite}
                organizationId={organizationId}
                headId={headId}
                dataSource={lineData}
                pagination={lineDataPagination}
                editStatus={editFlag}
                loading={fetchLineListLoading}
                handleCreate={this.handleCreate}
                onSearch={this.fetchLineData}
                handleEditLine={this.handleEditLine}
                deleteData={this.deleteData}
              />
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
