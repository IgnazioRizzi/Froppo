import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface StandardDialogProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maximizable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  blockScroll?: boolean;
  dismissableMask?: boolean;
  closable?: boolean;
  modal?: boolean;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  breakpoints?: { [key: string]: string };
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const StandardDialog: React.FC<StandardDialogProps> = ({
  visible,
  onHide,
  title,
  children,
  footer,
  className = '',
  style,
  maximizable = false,
  resizable = false,
  draggable = false,
  blockScroll = true,
  dismissableMask = true,
  closable = true,
  modal = true,
  position = 'center',
  breakpoints = { '960px': '75vw', '641px': '90vw' },
  headerStyle,
  contentStyle
}) => {
  const defaultFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Annulla"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
        size="small"
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      footer={footer || defaultFooter}
      className={`standard-dialog ${className}`}
      style={style}
      maximizable={maximizable}
      resizable={resizable}
      draggable={draggable}
      blockScroll={blockScroll}
      dismissableMask={dismissableMask}
      closable={closable}
      modal={modal}
      position={position}
      breakpoints={breakpoints}
      headerStyle={headerStyle}
      contentStyle={contentStyle}
    >
      {children}
    </Dialog>
  );
};

export default StandardDialog;
