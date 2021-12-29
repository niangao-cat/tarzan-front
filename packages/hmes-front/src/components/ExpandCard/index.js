import React from 'react';
import { Card, Icon } from 'hzero-ui';
import { isUndefined } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import intl from 'utils/intl';

/**
 * 可收起展开的card ExpandCard
 *
 * @author huangdeying <deying.huang@hand-china.com>
 * @extends {Component} - React.PureComponent
 * @reactProps {!title} [title=''] - card的标题
 * @returns React.element
 */
export default class ExpandCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: isUndefined(this.props.expandForm) ? true : this.props.expandForm,
    };
  }

  // 表单展开/收起
  toggleForm = () => {
    const { expandForm } = this.state;
    const { onExpand = e => e } = this.props;
    if (!expandForm && !isUndefined(onExpand)) {
      onExpand();
    }
    this.setState({ expandForm: !expandForm });
  };

  render() {
    const { title = '', children } = this.props;
    const { expandForm } = this.state;
    const expandTitle = (
      <span>
        {title}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={this.toggleForm}>
          {expandForm
            ? intl.get(`hzero.common.button.up`).d('收起')
            : intl.get('hzero.common.button.expand').d('展开')}
          <Icon type={expandForm ? 'up' : 'down'} />
        </a>
      </span>
    );

    return (
      <>
        <Card
          key="code-rule-header"
          title={expandTitle}
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
          size="small"
        />
        <div style={expandForm ? null : { display: 'none' }}>{children}</div>
      </>
    );
  }
}
