import React, { Fragment, forwardRef, useState } from 'react';
import { Form, Table, Button, Row, Col, Select } from 'hzero-ui';
import { uniq } from 'lodash';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';



const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const LineTable = (props) => {

  const [materialLotCode, setMaterialLotCode] = useState([]);

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const handleAdd = () => {
    const { onAddLine, form: { getFieldValue } } = props;
    if (onAddLine) {
      onAddLine(getFieldValue('materialLotCode'));
    }
  };

  const handlePass = () => {
    const { onPass } = props;
    if (onPass) {
      onPass();
    }
  };

  const handleOnSearch = (value) => {
    const { form: { setFieldsValue } } = props;
    const flag = value ? value.every(e => materialLotCode.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(materialLotCode.concat(newList));
      setMaterialLotCode(uniqueList);
      setFieldsValue({ materialLotCode: uniqueList });
    }
  };

  const { loading, dataSource, pagination, rowSelection, form: { getFieldDecorator }, isEdit } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.materialLotCode`).d('盒子号'),
      width: 120,
      dataIndex: 'materialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialLotStatusMeaning`).d('盒子状态'),
      width: 120,
      dataIndex: 'materialLotStatusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.lineCheckStatusMeaning`).d('审核状态'),
      width: 120,
      dataIndex: 'lineCheckStatusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.passDate`).d('放行时间'),
      width: 120,
      dataIndex: 'passDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.passByName`).d('放行人'),
      width: 120,
      dataIndex: 'passByName',
    },
  ];

  return (
    <Fragment>
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='扫描盒子号'
            >
              {getFieldDecorator('materialLotCode')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => handleOnSearch(val)}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        setMaterialLotCode([]);
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                  disabled={!isEdit}
                >
                  {materialLotCode.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button type="default" disabled={!isEdit} onClick={handleAdd}>
                添加
              </Button>
              <Button type="primary" htmlType="submit" onClick={handlePass}>
                放行
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        rowSelection={rowSelection}
        onChange={handleSearch}
        loading={loading}
        rowKey="cosMonitorLineId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    </Fragment>

  );
};

export default Form.create({ fieldNameProp: null })(forwardRef(LineTable));
