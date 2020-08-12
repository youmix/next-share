import React, { Component, Ref } from 'react';
import {
  CustomWindow,
  getPositionOnWindowCenter,
  getPositionOnScreenCenter,
  isPromise,
} from '../utils';

// import cx from 'classnames';

type NetworkLink<LinkOptions> = (url: string, options: LinkOptions) => string;

type WindowPosition = 'windowCenter' | 'screenCenter';

interface CustomProps<LinkOptions> {
  children: React.ReactNode;
  className?: string;
  /** Disables click action and adds `disabled` class */
  disabled?: boolean;
  /**
   * Style when button is disabled
   * @default { opacity: 0.6 }
   */
  disabledStyle?: React.CSSProperties;
  forwardedRef?: Ref<HTMLButtonElement>;
  networkName: string;
  networkLink: NetworkLink<LinkOptions>;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, link: string) => void;
  openShareDialogOnClick?: boolean;
  opts: LinkOptions;
  /**
   * URL of the shared page
   */
  url: string;
  style?: React.CSSProperties;
  windowWidth?: number;
  windowHeight?: number;
  windowPosition?: WindowPosition;
  /**
   *  Takes a function that returns a Promise to be fulfilled before calling
   * `onClick`. If you do not return promise, `onClick` is called immediately.
   */
  beforeOnClick?: () => Promise<void> | void;
  /**
   * Takes a function to be called after closing share dialog.
   */
  onShareWindowClose?: () => void;
  resetButtonStyle?: boolean;
}

export type Props<LinkOptions> = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof CustomProps<LinkOptions>
> &
  CustomProps<LinkOptions>;

export default class SocialShareButton<LinkOptions> extends Component<Props<LinkOptions>> {
  static defaultProps = {
    disabledStyle: { opacity: 0.6 },
    openShareDialogOnClick: true,
    resetButtonStyle: true,
  };

  openShareDialog = (link: string) => {
    const {
      onShareWindowClose,
      windowHeight = 400,
      windowPosition = 'windowCenter',
      windowWidth = 550,
    } = this.props;

    const windowConfig = {
      height: windowHeight,
      width: windowWidth,
      ...(windowPosition === 'windowCenter'
        ? getPositionOnWindowCenter(windowWidth, windowHeight)
        : getPositionOnScreenCenter(windowWidth, windowHeight)),
    };

    CustomWindow(link, windowConfig, onShareWindowClose);
  };

  handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      beforeOnClick,
      disabled,
      networkLink,
      onClick,
      url,
      openShareDialogOnClick,
      opts,
    } = this.props;

    const link = networkLink(url, opts);

    if (disabled) {
      return;
    }

    event.preventDefault();

    if (beforeOnClick) {
      const returnVal = beforeOnClick();

      if (isPromise(returnVal)) {
        await returnVal;
      }
    }

    if (openShareDialogOnClick) {
      this.openShareDialog(link);
    }

    if (onClick) {
      onClick(event, link);
    }
  };

  render() {
    const {
      beforeOnClick,
      children,
      className,
      disabled,
      disabledStyle,
      forwardedRef,
      networkLink,
      networkName,
      onShareWindowClose,
      openShareDialogOnClick,
      opts,
      resetButtonStyle,
      style,
      url,
      windowHeight,
      windowPosition,
      windowWidth,
      ...rest
    } = this.props;

    // const newClassName = cx(
    //   'react-share__ShareButton',
    //   {
    //     'react-share__ShareButton--disabled': !!disabled,
    //     disabled: !!disabled,
    //   },
    //   className,
    // );

    // const newStyle = resetButtonStyle
    //   ? {
    //       backgroundColor: 'transparent',
    //       border: 'none',
    //       padding: 0,
    //       font: 'inherit',
    //       color: 'inherit',
    //       cursor: 'pointer',
    //       ...style,
    //       ...(disabled && disabledStyle),
    //     }
    //   : {
    //       ...style,
    //       ...(disabled && disabledStyle),
    //     };

    return (
      <button
        {...rest}
        aria-label={rest['aria-label'] || networkName}
        // className={newClassName}
        onClick={this.handleClick}
        ref={forwardedRef}
        // style={newStyle}
      >
        {children}
      </button>
    );
  }
}