import React from 'react';
import { Form, Button, Col, Row, Input, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import Lov from 'components/Lov';
import MultipleLov from '../../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../../components/Modal/ModalContainer';

const { Option } = Select;

const modelPrompt = 'tarzan.hmes.purchaseOrder';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
    props.onRef(this);
  }

  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch();
    }
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form, onSearch } = this.props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
  };

  // 设置lov主键值
  @Bind()
  setMaterialCode(val, record) {
    this.props.form.setFieldsValue({ materialId: record.materialId });
  }

  @Bind()
  setSupplierCode(val, record) {
    this.props.form.setFieldsValue({ supplierId: record.supplierId });
  }

  // 渲染
  render() {
    const { form, tenantId, areaLocatorId } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialLotCode`).d('物料编码')}
                >
                  {getFieldDecorator('materialCode')(
                    <Lov
                      code="MT.MATERIAL"
                      queryParams={{ tenantId }}
                      lovOptions={{ valueField: 'materialCode' }}
                      textField="materialCode"
                      isInput
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.docStatus`).d('物料描述')}
                >
                  {getFieldDecorator('materialName')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.locatorCode`).d('货位')}
                >
                  {getFieldDecorator('locatorId')(
                    // <Lov code="WMS.LOCATOR_LOV" queryParams={{ tenantId }} />
                    <MultipleLov
                      isInput
                      code="WMS.STOCKTAKE_LOCATOR"
                      queryParams={{
                        tenantId,
                        warehouseId: areaLocatorId,
                      }}
                    />
                  )}
                </Form.Item>
                <ModalContainer ref={registerContainer} />
              </Col>
            </Row>
            <Row style={{ display: expandForm ? '' : 'none' }}>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.materialLotCode`).d('批次')}
                >
                  {getFieldDecorator('lotCode')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocStatus`).d('初盘是否一致')}
                >
                  {getFieldDecorator('firstcountConsistentFlag')(
                    <Select allowClear>
                      <Option key='Y' value='Y'>
                        是
                      </Option>
                      <Option key='N' value='N'>
                        否
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.instructionDocStatus`).d('复盘是否一致')}
                >
                  {getFieldDecorator('recountConsistentFlag')(
                    <Select allowClear>
                      <Option key='Y' value='Y'>
                        是
                      </Option>
                      <Option key='N' value='N'>
                        否
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
