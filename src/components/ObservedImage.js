import React from 'react';
import cx from 'classnames';

function encodeToBase64(bmp) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.height = bmp.target.height;
  canvas.width = bmp.target.width;
  ctx.drawImage(bmp.target, 0, 0);

  return canvas.toDataURL('image/png');
}

class ObservedImageInner extends React.Component {
  state = {
    downloaded: false,
    styles: {},
  };

  element = React.createRef();

  handler_onLoad = (bmp) => {
    const { padded, base64 } = this.props;

    const ratio = bmp.target.height / bmp.target.width;

    const url = base64 ? encodeToBase64(bmp) : bmp.target.src;

    if (padded) {
      this.setState({
        downloaded: true,
        styles: {
          paddingBottom: ratio * 100 + '%',
          backgroundImage: `url(${url})`,
        },
      });
    } else {
      this.setState({
        downloaded: true,
        styles: {
          backgroundImage: `url(${url})`,
        },
      });
    }

    if (this.observer) {
      this.observer = this.observer.disconnect();
    }
  };

  observe = () => {
    const { src, padded, ratio, noConstraints, base64 } = this.props;

    if (!src) return;

    if (this.state.downloaded) {
      return;
    }

    if (padded && ratio) {
      this.setState({
        styles: {
          paddingBottom: ratio * 100 + '%',
        },
      });
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || noConstraints) {
          this.image = new window.Image();
          this.image.crossOrigin = base64 && 'Anonymous';
          this.image.onload = this.handler_onLoad;

          this.image.src = src;
        }
      });
    });

    this.observer.observe(this.element.current);
  };

  componentDidMount() {
    this.observe();
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.image) {
      this.image.src = '';
    }
  }

  render() {
    const { src, className = 'image', noConstraints, base64, padded, ratio, ...attributes } = this.props;

    return (
      <div
        {...attributes}
        ref={this.element}
        className={cx(className, {
          padded,
          dl: this.state.downloaded,
        })}
        style={this.state.styles}
      />
    );
  }
}

// using key here forces a full component remount when we are given a new
// src, avoiding weirdness where the src changes but the component is still
// downloading the old image
const ObservedImage = (props) => <ObservedImageInner key={props.src} {...props} />;

export default ObservedImage;
