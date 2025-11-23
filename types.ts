import { ReactNode } from 'react';

export enum AppId {
  FINDER = 'finder',
  LAUNCHPAD = 'launchpad',
  CHROME = 'chrome',
  PHOTOS = 'photos',
  CALENDAR = 'calendar',
  NOTES = 'notes',
  APPSTORE = 'appstore',
  SETTINGS = 'settings',
  TRASH = 'trash',
  ABOUT = 'about'
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppConfig {
  id: AppId;
  name: string;
  icon: ReactNode;
  component?: ReactNode; // The content to render inside the window
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface SystemState {
  wallpaper: string;
  isLocked: boolean;
  activeWindowId: AppId | null;
}