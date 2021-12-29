/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Fragment, Component } from 'react';
import { Modal, Button, Table, Row, Form, Col, Select } from 'hzero-ui';
import { isArray, isEmpty, uniq, isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { filterNullValueObject, tableScrollWidth } from 'utils/utils';

import styles from './index.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};

@Form.create({ fieldNameProp: null })
export default class ComponentDataModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      snNum: [],
    };
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  @Bind()
  handleSearch() {
    const { form: { getFieldsValue }, onSearch } = this.props;
    const fields = getFieldsValue();
    if (onSearch) {
      onSearch({
        ...filterNullValueObject({
          ...fields,
        }),
      });
    }
  }

  @Bind()
  formReset() {
    const { form } = this.props;
    form.resetFields();
  }

  @Bind()
  handleOnSearch(value, dataSource, dataListName) {
    const { form } = this.props;
    const flag = value ? value.every(e => dataSource.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(dataSource.concat(newList));
      this.setState({ [dataListName]: uniqueList });
      form.setFieldsValue({ [dataListName]: uniqueList });
    }
  }


  render() {
    const { dataSource = [], loading, form: { getFieldDecorator }, typeList, initialSnNum, visible, onCancel } = this.props;
    const { snNum } = this.state;
    const { processList: newProcessList } = isEmpty(dataSource) ? {} : dataSource[0];
    let processColumns = [];
    if (isArray(newProcessList) && !isEmpty(newProcessList)) {
      processColumns = newProcessList.map(e => {
        return {
          title: e.processName,
          children: e.tagList.map(i => {
            return {
              title: i.tagDescription,
              dataIndex: `${e.processCode}${i.tagCode}`,
              render: (val, record) => {
                return record[e.processCode][i.tagCode];
              },
            };
          }),
        };
      });
    }
    const newDataSource = dataSource.map(e => {
      const { processList, ...otherParams } = e;
      const obj = {};
      if (!isEmpty(processList)) {
        processList.forEach(i => {
          const { tagList } = i;
          const tagObj = {};
          tagList.forEach(a => {
            tagObj[a.tagCode] = a.result;
          });
          obj[i.processCode] = tagObj;
        });
      }
      return {
        ...otherParams,
        ...obj,
      };
    });
    const columns = [
      {
        title: '序列号',
        width: 150,
        dataIndex: 'materialLotCode',
      },
      {
        title: '序列号物料',
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: '序列号物料描述',
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: '组件sn',
        width: 120,
        dataIndex: 'componentMaterialLotCode',
      },
      {
        title: '组件物料',
        width: 120,
        dataIndex: 'componentMaterialCode',
      },
      {
        title: '组件物料描述',
        width: 120,
        dataIndex: 'componentMaterialName',
      },
    ].concat(processColumns);

    return (
      <Fragment>
        <Modal
          width={1100}
          title='组件数据'
          visible={visible}
          onCancel={onCancel}
          footer={null}
        >
          <Form>
            <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }} className={styles['operationPlatform_search-form']}>
              <Row style={{ flex: 'auto' }}>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label='序列号'
                  >
                    {getFieldDecorator('snNum', {
                      initialValue: initialSnNum,
                    })(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onBlur={val => this.handleOnSearch(val, snNum, 'snNum')}
                        onChange={
                          val => {
                            if (val.length === 0) {
                              this.setState({ snNum: [] });
                            }
                          }
                        }
                        allowClear
                        dropdownMatchSelectWidth={false}
                        maxTagCount={2}
                      >
                        {snNum.map(e => (
                          <Select.Option key={e} value={e}>
                            {e}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                </Col>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label='类型'
                  >
                    {getFieldDecorator('ruleType', {
                      initialValue: 'COMPONENT_DATA',
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '类型',
                          }),
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        allowClear
                      >
                        {typeList.map(e => (
                          <Select.Option key={e.value} value={e.value}>{e.meaning}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <div className="lov-modal-btn-container">
                <Button onClick={() => this.formReset()} style={{ marginRight: 8 }}>
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button type="primary" htmlType="submit" onClick={() => this.handleSearch()}>
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </div>
            </div>
          </Form>
          <Table
            bordered
            dataSource={newDataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: tableScrollWidth(columns) }}
            loading={loading}
            bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
          />
        </Modal>
      </Fragment>
    );
  }

};
