/**
 *锁定对象解锁
 *@date：2019/9/22
 *@author：xinyu.wang <xinyu.wang02@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { notification, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty} from 'lodash';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import ListTableHead from './ListTableHead';
import FilterForm from './FilterForm';

/**
 * 将models中的state绑定到组件的props中,connect 方法传入的第一个参数是 mapStateToProps 函数，
 * mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系
 */
@connect(({ lockObjectUnlock, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  lockObjectUnlock,
  fetchLoading: loading.effects['lockObjectUnlock/recordLocksQuery'],
  releaseLockLoading: loading.effects['lockObjectUnlock/releaseLock'],
}))
// fetchLoading和saveLoadding实现加载效果,自定义写法
class LockObjectUnlock extends Component {
  form;

  filterForm;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 组件挂载初始化调用，就是页面刚进入时候需要调用的方法
    this.handleSearch();
    this.queryLovs();
  }

  // 获取值集
  queryLovs = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'lockObjectUnlock/querySelect',
      payload: {
        lockObjectType: 'HME.LOCK_OBJECT_TYPE',
      },
    });
  };

    /**
   * 锁定对象数据查询
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    // action对象：type 属性指明具体的行为，其它字段可以自定义
    dispatch({
      type: 'lockObjectUnlock/recordLocksQuery',
      payload: {
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 解锁
  @Bind()
  releaseLock(record, /* index */) {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'lockObjectUnlock/releaseLock',
      payload: {
        ...record,
      },
    }).then(res => {
      if (res) {
        if (res.failed) {
          notification.error({ message: res.exception });
        } else {
          notification.success({message: "解锁成功"});
          this.handleSearch();
        }
      }
    });
  }

  render() {
    const {
      lockObjectUnlock: {
        headPagination = {},
        headList = [],
        lockObjectTypeList = [],
      },
      fetchLoading,
      releaseLockLoading,
      tenantId,
    } = this.props;
    const filterProps = {
      tenantId,
      onSearch: this.handleSearch, // 手动触发
      onRef: this.handleBindRef, // 默认触发
      lockObjectTypeList,
    };
    const listHeadProps = {
      pagination: headPagination,
      loading: fetchLoading,
      dataSource: headList,
      onSearch: this.handleSearch,
      releaseLock: this.releaseLock,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.lockObjectUnlock.view.message.lockObjectUnlockTitle').d('锁定对象解锁')} />
        <Content>
          <FilterForm {...filterProps} />
          <Spin spinning={releaseLockLoading ||false}>
            <ListTableHead {...listHeadProps} />
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}

export default LockObjectUnlock;
