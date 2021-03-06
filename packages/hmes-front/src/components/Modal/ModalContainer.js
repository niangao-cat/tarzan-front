import React, { Component } from 'react';
// import { render } from 'react-dom';
import { Modal } from 'hzero-ui';

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

const KeyGen = (function*(id) {
  while (true) {
    // eslint-disable-next-line
    yield `modal-${id++}`;
  }
})(1);

// let modalContainer;
let containerInstanse;

export function registerContainer(container) {
  containerInstanse = container;
}

export default class ModalContainer extends Component {
  state = {
    modals: [],
  };

  open(modal) {
    const { modals } = this.state;
    const props = modal;

    // props.key = KeyGen.next().value;
    props.visible = true;
    modals.push(props);
    this.setState({
      modals,
    });
  }

  confirmLoading(key) {
    this.setModalProp(key, {
      confirmLoading: true,
    });
  }

  isLoading(key) {
    const { modals } = this.state;
    const result = modals.filter(item => {
      return item.key === key;
    });
    const modal = result[0];
    return modal && modal.confirmLoading === true;
  }

  setModalProp(key, props) {
    const { modals } = this.state;
    const result = modals.filter(item => {
      return item.key === key;
    });
    const modal = result[0];
    if (modal) {
      const prop = {
        ...modal,
        ...props,
      };
      modals.splice(modals.indexOf(modal), 1, prop);
      this.setState({
        modals,
      });
    }
  }

  close(key) {
    this.setModalProp(key, {
      visible: false,
    });
  }

  handleAfterClose(p) {
    const items = this.state.modals.filter(modal => {
      return modal.key !== p.key;
    });
    this.setState({
      modals: items,
    });
    if (p.afterClose) {
      p.afterClose();
    }
  }

  render() {
    const { modals } = this.state;

    // let maskKey;
    // modals.forEach((m,i)=>{
    //   if(i === modals.length - 1 || m.visible){
    //     maskKey = m.key;
    //   }
    // })

    const items = modals.map((props, index) => {
      const { side, children, ...other } = props;
      let otherProps = other;
      if (side) {
        otherProps = {
          wrapClassName: `ant-modal-sidebar-${side}`,
          transitionName: `move-${side}`,
          ...other,
        };
      }
      return (
        // maskTransitionName={false}
        // maskAnimation={false}
        <Modal
          key={props.key || index}
          {...otherProps}
          afterClose={this.handleAfterClose.bind(this, props)}
          mask
          destroyOnClose
        >
          {children}
        </Modal>
      );
    });
    return <React.Fragment>{items}</React.Fragment>;
  }
}

export function getContainer() {
  // if (!modalContainer || !modalContainer.offsetParent) {
  //   const doc = window.document;
  //   modalContainer = doc.getElementById('modal-container');
  //   // const root = doc.getElementById('root');
  //   // modalContainer = doc.createElement('div');
  //   // modalContainer.id = 'modal-container';
  //   // root.appendChild(modalContainer);
  //   containerInstanse = render(<ModalContainer />, modalContainer);
  // }
  return containerInstanse;
}

const noop = () => {};

export function open(prop) {
  let props = prop;
  const container = getContainer();
  const key = KeyGen.next().value;

  const { onOk = noop, onCancel = noop, ...otherProps } = prop;

  function close() {
    container.close(key);
  }

  const okFn = function(fn) {
    return async function() {
      const v = fn();
      if (isPromise(v)) {
        try {
          container.setModalProp(key, {
            confirmLoading: true,
          });
          if ((await v) !== false) {
            close();
          }
        } finally {
          container.setModalProp(key, {
            confirmLoading: false,
          });
        }
      } else if (v !== false) {
        close();
      }
    };
  };

  const cancelFn = function(fn) {
    return function() {
      if (fn() !== false && !container.isLoading(key)) {
        close();
      }
    };
  };

  props = {
    key,
    onCancel: cancelFn(onCancel),
    onOk: okFn(onOk),
    ...otherProps,
    close,
  };
  container.open(props);

  return {
    close,
    props,
  };
}
