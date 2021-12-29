/**
 * SiteSwitch - 站点切换
 * @date: 2019-12-16
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Select, Input, Button, Form } from 'hzero-ui';
import { isUndefined } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import Cookies from 'universal-cookie';
import styles from './index.less';

const cookies = new Cookies();
const FormItem = Form.Item;
const modelPrompt = 'tarzan.hmes.siteSwitch.model.siteSwitch';

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 用户权限维护
 * @extends {Component} - React.Component
 * @reactProps {Object} siteSwitch - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ siteSwitch, loading }) => ({
  siteSwitch,
  fetchLoading: loading.effects['siteSwitch/fetchUserRightsList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'tarzan.mes.siteSwitch' })
export default class SiteSwitch extends React.Component {
  state = {
    siteId: undefined,
    siteCode: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (cookies.get('defaultSiteId') === 'undefined' || isUndefined(cookies.get('defaultSiteId'))) {
      dispatch({
        type: 'siteSwitch/fetchDefaultSite',
      });
    }
    dispatch({
      type: 'siteSwitch/fetchSiteOptions',
    });
  }

  componentWillUnmount() {
    this.setState({
      siteId: undefined,
      siteCode: undefined,
    });
  }

  setSite = () => {
    const { dispatch } = this.props;
    const { siteId, siteCode } = this.state;
    dispatch({
      type: 'siteSwitch/updateState',
      payload: {
        defaultSiteId: siteId,
        defaultSiteCode: siteCode,
      },
    });
    cookies.set('defaultSiteId', siteId);
    cookies.set('defaultSiteCode', siteCode);
    notification.success();
  };

  // 切换站点
  changeSite = val => {
    const {
      siteSwitch: { siteOptions = [] },
    } = this.props;
    const newList = siteOptions.filter(item => item.siteId === val);
    this.setState({
      siteId: val,
      siteCode: (newList[0] || {}).siteCode,
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      siteSwitch: { siteOptions = [] },
      form,
    } = this.props;
    const defaultSiteCode = cookies.get('defaultSiteCode');
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.mes.siteSwitch.title.list').d('站点切换')} />
        <Content>
          <div className={styles.contentWrapper}>
            <Form labelAlign="left">
              <FormItem {...layout} label={intl.get(`${modelPrompt}.currentSite`).d('当前站点')}>
                {getFieldDecorator('currentSite', {
                  initialValue: defaultSiteCode,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...layout} label={intl.get(`${modelPrompt}.changeSite`).d('切换站点')}>
                {getFieldDecorator('changeSite', {})(
                  <Select style={{ width: '100%' }} allowClear onChange={this.changeSite}>
                    {siteOptions.map(item => {
                      return (
                        <Select.Option value={item.siteId} key={item.siteId}>
                          {item.siteCode}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Form>
            <Button
              disabled={!this.state.siteId || this.state.siteCode === defaultSiteCode}
              type="primary"
              style={{ width: '100%', marginBottom: 20, height: 28 }}
              onClick={this.setSite}
            >
              {intl.get(`${modelPrompt}.sure`).d('确认')}
            </Button>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
