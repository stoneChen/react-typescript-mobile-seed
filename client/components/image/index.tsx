import * as React from 'react';
import * as classnames from 'classnames';

interface ISize {
  width?: number | string;
  height?: number | string;
}

/**
 * 此组件已删除所有逻辑，只为占坑
 */
export interface IProps {
  // 生成的DOM的tagName
  type?: string;
  // 图片的地址
  src?: string;
  /**
   * 又拍云额外参数
   * 注：仅当this.props.upyun === true是有用，用于添加额外的参数
   */
  upyunArgs?: string;
  // 图片大小,形如--{with: xxx, height: xxxx}的格式，没有添加的自动扩展100%
  size?: ISize;
  // 当图片地址为空时，是否启用默认图
  default?: string | number;
}

interface IState {
  src: string;
  size: ISize;
  loading: boolean;
}

class IMG extends React.Component <IProps, IState> {
  static defaultProps = {
    type: 'img',
    upyunArgs: '',
  };

  constructor(props: any) {
    super(props);
    this.state = {
      src: '',
      size: {},
      loading: false,
    };
  }

  render() {
    return (
      <img src={this.props.src}/>
    );
  }
}

export default IMG;
