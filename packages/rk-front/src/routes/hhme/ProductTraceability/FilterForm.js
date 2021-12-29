import React, { PureComponent } from 'react';
import { Form, Button, Input, notification } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import CacheComponent from 'components/CacheComponent';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: '/scon/lease-contract-search' })
export default class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * 条件查询
   * @memberof FilterForm
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
          document.getElementById("snInput").focus();
          document.getElementById("snInput").select();
        }
      });
    }
  }

  /**
   * 打印
   */
  @Bind
  printData(){
    const { onPrint, form } = this.props;
    if (onPrint) {
      form.validateFields((err, fieldsValue) => {
        if (!err) {
          onPrint(fieldsValue);
        }else{
          notification.error({message: '请先扫描SN条码'});
          document.getElementById("snInput").focus();
          document.getElementById("snInput").select();
        }
      });
    }
  }

  /**
   * 重置查询表单
   * @memberof FilterForm
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * render
   * @returns
   * @memberof FilterForm
   */
  render() {
    const {
      form: { getFieldDecorator },
      routerParamState = {},
      reverseFormVal={},
    } = this.props;
    const prefix = 'scon.leaseContractSearch.model.leaseContractSearch';
    return (
      <Form layout="inline">
        <Form.Item
          label={intl.get(`${prefix}.contractNumber`).d('SN条码')}
          style={{ marginTop: '8px', marginBottom: '8px' }}
        >
          {getFieldDecorator('eoNum', {
            rules: [
              {
                required: true,
                message: 'SN条码不能为空',
              },
            ],
            initialValue: reverseFormVal.snNum?reverseFormVal.snNum:routerParamState.snNum,
          })(<Input id="snInput" />)}
        </Form.Item>
        <Form.Item
          style={{ marginTop: '8px', marginBottom: '8px' }}
        >
          <Button data-code="reset" onClick={this.handleFormReset}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
          <Button
            data-code="search"
            type="primary"
            htmlType="submit"
            onClick={() => this.handleSearch()}
            style={{marginLeft: '8px'}}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
