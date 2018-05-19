import * as ReactDOM from 'react-dom';

const body = global.document.body;

export default () => {
  return ReactDOM.createPortal(
    <div className="preview-tip">
      此页面处于预览状态，所示信息以正式发布为准！
      <style jsx>{`
        @import "client/assets/stylus/utils.styl"

        .preview-tip {
          position: fixed;
          top: 0;
          left: 0;
          z-index: $z-index-preview-tip;
          background: rgba(245, 166, 35, .8);
          width: 100%;
          height: 44px;
          line-height: 44px;
          font-size: 28px;
          text-align: center;
          color: #fff;
          pointer-events: none;
        }
      `}</style>
    </div>,
    body,
  );
};
