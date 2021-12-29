import editorStyle from '../util/defaultStyle';
import createAnchor from '../item/anchor';
/* eslint-disable */
const dashArray = [
  [0, 1],
  [0, 2],
  [1, 2],
  [0, 1, 1, 2],
  [0, 2, 1, 2],
  [1, 2, 1, 2],
  [2, 2, 1, 2],
  [3, 2, 1, 2],
  [4, 2, 1, 2],
];
const interval = 9;
const lineDash = [4, 2, 1, 2];
export default function(G6) {
  G6.registerNode(
    'base-node',
    {
      options: {
        icon: null,
        icon1: null,
        icon2: null,
        icon3: null,
        icon4: null,
        iconStyle: {
          width: 14,
          height: 14,
          left: 0,
          top: 0,
        },
        iconStyle1: {
          width: 14,
          height: 14,
          left: 0,
          top: 0,
        },
        iconStyle2: {
          width: 14,
          height: 14,
          left: 0,
          top: 0,
        },
        iconStyle3: {
          width: 14,
          height: 14,
          left: 0,
          top: 0,
        },
        iconStyle4: {
          width: 14,
          height: 14,
          left: 0,
          top: 0,
        },
        style: {
          fill: '#f9f9f9',
          stroke: '#bbb',
          cursor: 'default',
        },
        stateStyles: {
          selected: {
            fill: '#eee',
          },
          hover: {
            cursor: editorStyle.cursor.hoverNode,
          },
        },
      },
      drawAnchor(group) {
        const bbox = group.get('children')[0].getBBox();
        this.getAnchorPoints().forEach((p, i) => {
          const anchor = createAnchor(
            i,
            {
              x: bbox.minX + bbox.width * p[0],
              y: bbox.minY + bbox.height * p[1],
            },
            group
          );
          group.anchorShapes.push(anchor);
          group.getAllAnchors = () => {
            return group.anchorShapes.map(c => {
              c.filter(a => a.isAnchor);
            });
          };
          group.getAnchor = i => {
            return group.anchorShapes.filter(a => a.get('index') === i);
          };
        });
      },
      drawIcon(cfg, group) {
        const style = this.getShapeStyle(cfg);
        // 绘制主图标
        if (this.options.icon) {
          let attrs = {
            x: style.x + this.options.iconStyle.left,
            y: style.y + this.options.iconStyle.top,
            width: this.options.iconStyle.width,
            height: this.options.iconStyle.height,
          };
          group.icon1 = group.addShape('image', {
            attrs: {
              img: this.options.icon,
              ...attrs,
            },
          });
        }
        // 绘制图标1
        if (this.options.icon1) {
          let attrs = {
            x: style.x + this.options.iconStyle1.left,
            y: style.y + this.options.iconStyle1.top,
            width: this.options.iconStyle1.width,
            height: this.options.iconStyle1.height,
          };
          group.icon1 = group.addShape('image', {
            attrs: {
              img: this.options.icon1,
              ...attrs,
            },
          });
          if (cfg.hideIcon1) {
            group.icon1.hide();
          }
        }
        // 绘制图表2
        if (this.options.icon2) {
          let attrs = {
            x: style.x + this.options.iconStyle2.left,
            y: style.y + this.options.iconStyle2.top,
            width: this.options.iconStyle2.width,
            height: this.options.iconStyle2.height,
          };
          group.icon2 = group.addShape('image', {
            attrs: {
              img: this.options.icon2,
              ...attrs,
            },
          });
          if (cfg.hideIcon2) {
            group.icon2.hide();
          }
        }
        // 绘制图表3
        if (this.options.icon3) {
          let attrs = {
            x: style.x + this.options.iconStyle3.left,
            y: style.y + this.options.iconStyle3.top,
            width: this.options.iconStyle3.width,
            height: this.options.iconStyle3.height,
          };
          group.icon3 = group.addShape('image', {
            attrs: {
              img: this.options.icon3,
              ...attrs,
            },
          });
          if (cfg.hideIcon3) {
            group.icon3.hide();
          }
        }
        // 绘制图表4
        if (this.options.icon4) {
          let attrs = {
            x: style.x + this.options.iconStyle4.left,
            y: style.y + this.options.iconStyle4.top,
            width: this.options.iconStyle4.width,
            height: this.options.iconStyle4.height,
          };
          group.icon4 = group.addShape('image', {
            attrs: {
              img: this.options.icon4,
              ...attrs,
            },
          });
          if (cfg.hideIcon4) {
            group.icon4.hide();
          }
        }
      },
      initAnchor(group) {
        group.anchorShapes = [];
        group.showAnchor = group => {
          this.drawAnchor(group);
        };
        group.clearAnchor = group => {
          group.anchorShapes && group.anchorShapes.forEach(a => a.remove());
          group.anchorShapes = [];
        };
        group.clearHotpotActived = group => {
          group.anchorShapes &&
            group.anchorShapes.forEach(a => {
              if (a.isAnchor) {
                a.setHotspotActived(false);
              }
            });
        };
      },
      drawShape(cfg, group) {
        const shapeType = this.shapeType;
        const style = this.getShapeStyle(cfg);
        const shape = group.addShape(shapeType, {
          attrs: {
            ...style,
          },
        });
        this.drawIcon(cfg, group);
        this.initAnchor(group);
        return shape;
      },
      setState(name, value, item) {
        const group = item.getContainer();
        if (name === 'show-anchor') {
          if (value) {
            group.showAnchor(group);
          } else {
            group.clearAnchor(group);
          }
        } else if (name === 'selected') {
          const rect = group.getChildByIndex(0);
          if (value) {
            rect.attr('fill', this.options.stateStyles.selected.fill);
          } else {
            rect.attr('fill', this.options.style.fill);
          }
        } else if (name === 'hover') {
          const rect = group.getChildByIndex(0);
          const text = group.getChildByIndex(1);
          if (value) {
            rect.attr('cursor', this.options.stateStyles.hover.cursor);
            if (text) {
              text.attr('cursor', this.options.stateStyles.hover.cursor);
            }
          } else {
            rect.attr('cursor', this.options.style.cursor);
            if (text) {
              text.attr('cursor', this.options.style.cursor);
            }
          }
        }
        this.setCustomState(name, value, item);
      },
      setCustomState(name, value, item) {},
      getAnchorPoints() {
        return [
          [0.5, 0], // top
          [1, 0.5], // right
          [0.5, 1], // bottom
          [0, 0.5], // left
        ];
      },
      runAnimate(cfg, group) {
        if (cfg.active) {
          let totalArray = [];
          let index = 0;
          const shape = group.getFirst();
          shape.animate(
            {
              onFrame(ratio) {
                for (let i = 0; i < 9; i += interval) {
                  totalArray = totalArray.concat(lineDash);
                }
                const cfg = {
                  lineDash: dashArray[index].concat(totalArray),
                };
                index = (index + 1) % interval;
                return cfg;
              },
              repeat: true,
            },
            5000
          );
        }
      },
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      },
      afterUpdate(cfg, group) {
        const icon1 = group.get('group').icon1;
        const icon2 = group.get('group').icon2;
        const icon3 = group.get('group').icon3;
        const icon4 = group.get('group').icon4;
        if (cfg.hideIcon1 && icon1 && icon1.get('visible')) {
          icon1.hide();
        } else if (!cfg.hideIcon1 && icon1 && !icon1.get('visible')) {
          icon1.show();
        }
        if (cfg.hideIcon2 && icon2 && icon2.get('visible')) {
          icon2.hide();
        } else if (!cfg.hideIcon2 && icon2 && !icon2.get('visible')) {
          icon2.show();
        }
        if (cfg.hideIcon3 && icon3 && icon3.get('visible')) {
          icon3.hide();
        } else if (!cfg.hideIcon3 && icon3 && !icon3.get('visible')) {
          icon3.show();
        }
        if (cfg.hideIcon4 && icon4 && icon4.get('visible')) {
          icon4.hide();
        } else if (!cfg.hideIcon4 && icon4 && !icon4.get('visible')) {
          icon4.show();
        }
      },
    },
    'single-shape'
  );
}
/* eslint-disable */
