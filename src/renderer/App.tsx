import React from 'react';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/MainLayout';
import './styles/theme.css';
import './App.css';

const { darkAlgorithm } = theme;

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: '#38b2ac',
          colorBgBase: '#0f0f23',
          colorBgContainer: '#1a1a2e',
          colorBgElevated: '#16213e',
          colorText: '#ffffff',
          colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
          colorTextTertiary: 'rgba(255, 255, 255, 0.6)',
          colorBorder: 'rgba(255, 255, 255, 0.08)',
          colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        },
        components: {
          Layout: {
            bodyBg: 'transparent',
            siderBg: 'transparent',
            headerBg: 'transparent',
          },
          Button: {
            colorBgContainer: 'rgba(26, 26, 46, 0.3)',
            colorBgContainerDisabled: 'rgba(26, 26, 46, 0.1)',
          },
          Card: {
            colorBgContainer: 'rgba(26, 26, 46, 0.6)',
            colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',
          },
          Typography: {
            colorText: '#ffffff',
            colorTextHeading: '#ffffff',
            colorTextDescription: 'rgba(255, 255, 255, 0.8)',
          },
          Spin: {
            colorPrimary: '#38b2ac',
          },
        },
      }}
    >
      <AntApp>
        <MainLayout />
      </AntApp>
    </ConfigProvider>
  );
}
