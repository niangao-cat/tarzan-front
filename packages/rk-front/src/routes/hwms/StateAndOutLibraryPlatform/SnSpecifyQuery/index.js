/**
 * @Description: 立库出库平台
 * @author: lly
 * @date 2021/07/06 11:11
 * @version 1.0
 */

import React from 'react';
import { Form, Button, Row, Col, Select, Popconfirm } from 'hzero-ui';
import { connect } from 'dva';
// import { Bind } from 'lodash-decorators';
import { uniq, isFunction } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
// import {
//   // addItemToPagination,
//   // getEditTableData,
//   // getCurrentOrganizationId,
// } from 'utils/utils';
// import notification from 'utils/notification';

import intl from 'utils/intl';
import SnTableList from './SnTableList';

// const tenantId = getCurrentOrganizationId();
const snLabelLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const commonModelPrompt = 'hwms.tarzan.state-and-out-library-platform';
@connect(({ stateAndOutLibraryPlatform, loading }) => ({
  stateAndOutLibraryPlatform,
  saveSnSpecifyLoading: loading.effects['stateAndOutLibraryPlatform/fetchSnDelEte'],
}))
@Form.create({ fieldNameProp: null })
export default class SnSpecifyQuery extends React.Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    // 设置当前静态变量
    this.state = {};
  }

  // 直接渲染
  render() {
    // const { snDocNum } = this.state;
    const {
      snDocNum,
      deleteFlag,
      inputEdit,
      enterEdit,
      batchSnData,
      SnSpecifyQueryList,
      fetchSnSpecifyLoading,
      onCreate,
      snSingleEntry,
      deleteLine,
      saveData,
      deleteBatch,
      onChange,
      onBatchInput,
    } = this.props;
    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    const dataSourceSnAll = uniq(batchSnData.concat(SnSpecifyQueryList));

    const SnTableListProps = {
      inputEdit,
      deleteFlag,
      onCreate,
      snSingleEntry,
      deleteLine,
      dataSource: dataSourceSnAll,
      loading: fetchSnSpecifyLoading,
    };

    return (
      <div>
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item
                {...snLabelLayout}
                label={intl.get(`${commonModelPrompt}.snDocNum`).d('SN批量录入')}
              >
                {getFieldDecorator('snDocNum')(
                  <Select
                    disabled={inputEdit || deleteFlag}
                    mode='tags'
                    style={{ width: '100%' }}
                    onBlur={val => onBatchInput(val, 'snDocNum')}
                    onChange={val => onChange(val)}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    maxTagCount={2}
                  >
                    {snDocNum.map(e => (
                      <Select.Option key={e} value={e}>
                        {e}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item>
                <Button
                  style={{ marginRight: '7%', background: '#04B404', color: '#ffffff' }}
                  htmlType='submit'
                  onClick={() => saveData()}
                  disabled={enterEdit}
                >
                  {intl.get(`hzero.common.button.save`).d('保存')}
                </Button>
                {/* <Button
                  style={{ background: '#FE642E', color: '#ffffff' }}
                  onClick={() => deleteBatch()}
                >
                  {intl.get(`${commonModelPrompt}.delete`).d('删除所有SN')}
                </Button>  */}
                <Popconfirm
                  title="是否删除所以已指定的SN？"
                  okText="确定"
                  onConfirm={() => deleteBatch()}
                  cancelText="取消"
                >
                  <Button
                    disabled={enterEdit}
                    style={{ background: '#FE642E', color: '#ffffff' }}
                  >
                    {intl.get(`${commonModelPrompt}.delete`).d('删除所有SN')}
                  </Button>
                </Popconfirm>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <SnTableList {...SnTableListProps} />
      </div>
    );
  }
}
