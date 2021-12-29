/**
 * @description  处置组功能维护
 * @param null
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/25
 * @time 13:52
 * @version 0.0.1
 */
import React from 'react';
import { Button, Form, Card, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { connect } from 'dva';
import {
  delItemToPagination,
  addItemToPagination,
  getCurrentOrganizationId,
  getEditTableData,
} from 'utils/utils';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import DisplayForm from './DisplayForm';
import ListTable from './ListTable';

@connect(({ disposalGroupMaintenance, loading }) => ({
  disposalGroupMaintenance,
  tenantId: getCurrentOrganizationId(),
  loading: loading.effects['disposalGroupMaintenance/fetchDetailList'] || loading.effects['disposalGroupMaintenance/fetchList'],
  saveloading: loading.effects['disposalGroupMaintenance/handleSave'],
  fetchHeadDetailLoading: loading.effects['disposalGroupMaintenance/fetchHeadDetail'],
  fetchDetailListLoading: loading.effects['disposalGroupMaintenance/fetchDetailList'],
  deleteRelationRecordLoading: loading.effects['disposalGroupMaintenance/deleteRelationRecord'],
}))
@Form.create({ fieldNameProp: null })
export default class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id, // 主键ID
      loading: false,
      canEdit: false,
    };
  }

  form;

  componentDidMount() {
    const { id } = this.state;
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'disposalGroupMaintenance/getSiteList',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'disposalGroupMaintenance/fetchFunctionTypeList',
      payload: {
        tenantId,
      },
    });
    // 判断是新增还是更新
    if (id === 'create') {
      this.setState({
        canEdit: true,
      });
    } else {
      this.handleSearch();
      dispatch({
        type: 'disposalGroupMaintenance/fetchHeadDetail',
        payload: {
          tenantId,
          dispositionGroupId: id,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'disposalGroupMaintenance/updateState',
      payload: {
        relationList: [],
        relationListPagination: {},
        detailHead: {},
      },
    });
  }

  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'disposalGroupMaintenance/fetchDetailList',
      payload: {
        dispositionGroupId: id,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * @description: 修改编辑状态
   */
  changEditStatus = () => {
    this.setState({
      canEdit: true,
    });
  };

  /**
   * @description: 新增处置组与处置方法关系
   * @param {type} params
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      disposalGroupMaintenance: { relationList = [], relationListPagination = {} },
    } = this.props;
    dispatch({
      type: 'disposalGroupMaintenance/updateState',
      payload: {
        relationList: [
          {
            dispositionGroupMemberId: new Date().getTime(),
            sequence: relationList.length > 0 ? Number(relationList[relationList.length - 1].sequence) + 10 : 10,
            _status: 'create',
            flag: true,
          },
          ...relationList,
        ],
        lineDataPagination: addItemToPagination(relationList.length, relationListPagination),
      },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      disposalGroupMaintenance: { relationList = [] },
    } = this.props;
    const newList = relationList.filter(
      (item) => item.dispositionGroupMemberId !== record.dispositionGroupMemberId
    );
    dispatch({
      type: 'disposalGroupMaintenance/updateState',
      payload: {
        relationList: newList,
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
      disposalGroupMaintenance: { relationList = [] },
    } = this.props;
    const newList = relationList.map(item =>
      item.dispositionGroupMemberId === record.dispositionGroupMemberId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'disposalGroupMaintenance/updateState',
      payload: {
        relationList: [...newList],
      },
    });
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      disposalGroupMaintenance: { relationList = [], relationListPagination = {} },
      tenantId,
    } = this.props;
    if (record._status) {
      relationList.splice(index, 1);
      dispatch({
        type: 'disposalGroupMaintenance/updateState',
        payload: {
          relationList,
          relationListPagination: delItemToPagination(1, relationListPagination),
        },
      });
    } else {
      const hmeDispositionFunctionDTO = record;
      dispatch({
        type: 'disposalGroupMaintenance/deleteRelationRecord',
        payload: {
          hmeDispositionFunctionDTO,
        },
      }).then(res => {
        if (res.success) {
          notification.success();
          const { id } = this.state;
          dispatch({
            type: 'disposalGroupMaintenance/fetchHeadDetail',
            payload: {
              tenantId,
              dispositionGroupId: id,
            },
          });
          this.handleSearch();
        }
      });
    }
  }


  @Bind
  handleSave() {
    const { dispatch, disposalGroupMaintenance: { relationList = [], detailHead = {} }, tenantId, history } = this.props;
    this.form.validateFields((err, fieldsValue) => {
      const params = getEditTableData(relationList, ['dispositionGroupMemberId']);
      if (!err) {
        dispatch({
          type: 'disposalGroupMaintenance/handleSave',
          payload: {
            ...detailHead,
            ...fieldsValue,
            hmeDispositionFunctionDtoList: params,
          },
        }).then(res => {
          if (res.success) {
            notification.success();
            history.push(`/hhme/disposal-group-maintenance/detail/${res.rows}`);
            dispatch({
              type: 'disposalGroupMaintenance/fetchHeadDetail',
              payload: {
                tenantId,
                dispositionGroupId: res.rows,
              },
            });
            this.setState({ id: res.rows }, () => { this.handleSearch(); });
          }
        });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      disposalGroupMaintenance: {
        relationList = [],
        relationListPagination = {},
        defaultSite = {},
        detailHead = {},
        funcTypeList = [],
      },
      tenantId,
      saveloading,
      fetchHeadDetailLoading,
      fetchDetailListLoading,
      deleteRelationRecordLoading,
    } = this.props;
    const { canEdit } = this.state;
    return (
      <React.Fragment>
        <Header
          title='处置组功能维护'
          backPath="/hhme/disposal-group-maintenance"
        >
          <React.Fragment>
            <Button
              type="primary"
              icon="save"
              onClick={() => this.handleSave()}
              loading={saveloading}
            >
              {intl.get('tarzan.common.button.save').d('保存')}
            </Button>
          </React.Fragment>
        </Header>
        <Content>
          <Spin spinning={this.state.loading}>
            <Spin spinning={fetchHeadDetailLoading || false}>
              <DisplayForm
                onRef={this.onRef}
                canEdit={canEdit}
                detailHead={detailHead}
                defaultSite={defaultSite}
              />
            </Spin>
            <Card
              key="code-rule-header"
              title="处置组与处置方法"
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              size="small"
            >
              <ListTable
                handleCreate={this.handleCreate}
                handleCleanLine={this.handleCleanLine}
                handleEditLine={this.handleEditLine}
                deleteData={this.deleteData}
                onSearch={this.handleSearch}
                loading={fetchDetailListLoading || deleteRelationRecordLoading}
                dataSource={relationList}
                pagination={relationListPagination}
                canEdit={canEdit}
                tenantId={tenantId}
                funcTypeList={funcTypeList}
              />
            </Card>
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
