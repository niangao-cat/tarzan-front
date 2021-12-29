/*
 * @Description: 执行信息
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 18:48:28
 */

import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, DatePicker } from 'hzero-ui';
import {
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import Upload from 'components/Upload/UploadButton';
import moment from 'moment';

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';

@Form.create({ fieldNameProp: null })
export default class RunInfoForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
    };
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      headDetail = {},
      defaultSite,
      onUploadSuccess,
      onCancelSuccess,
      editFlag,
      fileList,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteName`).d('站点')}
              >
                {getFieldDecorator('siteName', {
                  initialValue: defaultSite.siteName,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '站点',
                      }),
                    },
                  ],
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label='工艺文件编码'
              >
                {getFieldDecorator('attachmentCode', {
                  initialValue: headDetail.attachmentCode,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '工艺文件编码',
                      }),
                    },
                  ],
                })(
                  <Input disabled={editFlag} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label='工艺文件名称'
              >
                {getFieldDecorator('attachmentName', {
                  initialValue: headDetail.attachmentName,
                })(
                  <Input disabled={editFlag} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label='生效时间从'
              >
                {getFieldDecorator('startDate', {
                  initialValue: headDetail.startDate ? moment(headDetail.startDate) : '',
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '生效时间从',
                      }),
                    },
                  ],
                })(
                  <DatePicker
                    showTime
                    placeholder=""
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={currentDate =>
                      getFieldValue('endDate') &&
                      moment(getFieldValue('endDate')).isBefore(currentDate, 'second')
                    }
                    disabled={editFlag}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label='生效时间至'
              >
                {getFieldDecorator('endDate', {
                  initialValue: headDetail.endDate ? moment(headDetail.endDate) : '',
                })(
                  <DatePicker
                    showTime
                    placeholder=""
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={currentDate =>
                      getFieldValue('startDate') &&
                      moment(getFieldValue('startDate')).isAfter(currentDate, 'second')
                    }
                    disabled={editFlag}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label='备注'
              >
                {getFieldDecorator('remark', {
                  initialValue: headDetail.remark,
                })(
                  <Input disabled={editFlag} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label='文件上传'
                required
              >
                <Upload
                  single
                  bucketName="file-mes"
                  onUploadSuccess={onUploadSuccess}
                  onRemove={onCancelSuccess}
                  disabled={editFlag}
                  fileList={fileList}
                />
              </Form.Item>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                style={{ display: 'none' }}
              >
                {getFieldDecorator('fileUrl', {
                  initialValue: headDetail.fileUrl,
                })(
                  <Input disabled={editFlag} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
