/*
 * @Description 工序不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import React, { Component } from 'react';
import { Form, Input, Button, Radio, Row, Col, Tooltip, Modal, Checkbox } from 'hzero-ui';
import UploadModal from 'components/Upload/index';
import { Bind } from 'lodash-decorators';
import { isFunction, isEmpty } from 'lodash';
import { connect } from 'dva';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import notification from 'utils/notification';
import SecondTitle from './SecondTitle';
import MultipleLov from './MultipleLov/index';
import styles from './index.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
@connect(({ badHandling }) => ({
  badHandling,
}))
@Form.create({ fieldNameProp: null })
export default class Process extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
    };
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'badHandling/updateState',
      payload: {
        processBadTypeData: {
          ncCodeId: -1,
        },
      },
    });
  }

  /**
   * @description: 提交工序不良
   * @param {type} params
   */
  @Bind()
  commitProcess() {
    const { processBadCommit, form } = this.props;
    if (processBadCommit) {
      form.validateFields((err, values) => {
        if (!err) {
          if (values.flag === "1") {
            if (isEmpty(values.ncCodeIdList)) {
              notification.warning({ message: '请选择不良代码' });
              return;
            }
            Modal.confirm({
              title: `直接报废后当前条码将直接失效，无法使用，确认继续`,
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                processBadCommit(values);
              },
              onCancel: () => { },
            });
          } else {
            // 如果验证成功,则执行onSearch
            processBadCommit(values);
          }

        }
      });
    }
  }

  /**
   * @description: 其他工序
   * @param {type} params
   */
  @Bind()
  otherProcess() {
    const { otherProcess } = this.props;
    otherProcess(true);
  }

  // 不良类型-更多
  @Bind()
  moreProcessBad() {
    const { moreBadType } = this.props;
    moreBadType(true, 'PROCESS');
  }

  onChangeRadioGroup = (e) => {
    if (e.target.value === '3' || e.target.value === '1') {
      this.setState({ editor: true });
    } else {
      this.setState({ editor: false });
    }
  }

  render() {
    const {
      otherProcessData = {},
      processBadTypeData,
      form: { getFieldDecorator, getFieldValue },
      workcellId,
      badType = {},
      clickOtherStation,
      clearMoreBadType,
      comments = {},
    } = this.props;
    const { hmeNcDisposePlatformDTO8List = [] } = badType;
    // eslint-disable-next-line no-unused-vars
    const { editor } = this.state;
    return (
      <Form>
        <SecondTitle titleValue="不良代码组" />
        <div style={{ marginTop: '5px' }}>
          <Form.Item>{getFieldDecorator('ncGroupId', {
            rules: [
              {
                required: true,
                message: '不良代码组不能为空',
              },
            ],
            initialValue: processBadTypeData.ncCodeId ? (processBadTypeData.ncCodeId === -1 ? null : processBadTypeData.ncCodeId) : null,
          })(
            <Radio.Group buttonStyle="solid">
              {hmeNcDisposePlatformDTO8List.map((item) => {
                return (
                  <Radio.Button onClick={() => clearMoreBadType('PROCESS')} style={{ margin: '0px 5px 5px 0px' }} value={item.ncCodeId}>
                    <div className={styles['bad-type-radio']}>
                      <Tooltip title={item.description}>{item.description}</Tooltip>
                    </div>
                  </Radio.Button>
                );
              })}
              <Radio.Button onClick={() => this.moreProcessBad()} style={{ margin: '0px 5px 5px 0px' }} value={processBadTypeData.ncCodeId}>
                <div className={styles['bad-type-radio']}>更多</div>
              </Radio.Button>
            </Radio.Group>
          )}
          </Form.Item>
        </div>
        <SecondTitle titleValue="不良代码" />
        <div style={{ marginTop: '5px' }}>
          <Form.Item>{getFieldDecorator('ncCodeIdList', {
            rules: [
              {
                required: true,
                message: '不良代码不能为空',
              },
            ],
          })(
            <MultipleLov
              code="HME.NC_RECORD_LOV"
              disabled={!getFieldValue('ncGroupId')}
              queryParams={{
                tenantId: getCurrentOrganizationId(),
                ncObjectId: getFieldValue('ncGroupId'),
              }}
            />
          )}
          </Form.Item>
        </div>
        <SecondTitle titleValue="责任工位" />
        <div style={{ marginTop: '5px' }}>
          <Form.Item>{getFieldDecorator('currentwWorkcellId', {
            rules: [
              {
                required: true,
                message: '责任工位不能为空',
              },
            ],
          })(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={workcellId || '-1'} onClick={val => clickOtherStation(val)} style={{ margin: '0px 5px 5px 0px' }}>本工位</Radio.Button>
              <Radio.Button
                value={otherProcessData.workcellId || '-2'}
                style={{ margin: '0px 5px 5px 0px' }}
                onClick={() => this.otherProcess()}
              >
                其他工位
              </Radio.Button>
            </Radio.Group>
          )}
          </Form.Item>
        </div>
        <SecondTitle titleValue="备注" />
        <Form.Item>{getFieldDecorator('comments', { initialValue: comments })(<TextArea />)}</Form.Item>
        <SecondTitle titleValue="附件" />
        <div className={styles['attachment-button']}>
          <Form.Item>{getFieldDecorator('uuid')(
            <UploadModal
              bucketName="file-mes"
            />
          )}
          </Form.Item>
        </div>
        <Row>
          <Col span={16}>
            <Form.Item>{getFieldDecorator('flag')(
              <RadioGroup onChange={this.onChangeRadioGroup}>
                <Radio value='3'>直接返修</Radio>
                <Radio value='2'>通知工艺判定</Radio>
                {/* <Radio value='1'>直接报废</Radio> */}
              </RadioGroup>
            )}
            </Form.Item>
          </Col>
          <Col span={8}>
            {getFieldValue('flag') === '3' && (
              <Form.Item>{getFieldDecorator('reworkRecordFlag')(
                <Checkbox
                  checkedValue='Y'
                  unCheckedValue='N'
                >
                  返修记录
                </Checkbox>
              )}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'end' }}>
            <Form.Item>
              <Button
                style={{ marginRight: '5px' }}
                onClick={() => this.handleFormReset()}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => this.commitProcess()}
              >
                提交
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
