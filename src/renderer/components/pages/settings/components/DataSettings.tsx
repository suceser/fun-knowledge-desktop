import React, { useState } from 'react';
import { Card, Button, Typography, Space, message, Modal } from 'antd';
import {
  FolderOpenOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  SettingOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './DataSettings.css';

const { Text } = Typography;
const { confirm } = Modal;

function DataSettings(): React.ReactElement {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // 处理备份操作
  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      // 模拟备份过程
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
      message.success('数据备份完成');
    } catch {
      message.error('备份失败，请重试');
    } finally {
      setIsBackingUp(false);
    }
  };

  // 处理恢复操作
  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      // 模拟恢复过程
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
      message.success('数据恢复完成');
    } catch {
      message.error('恢复失败，请重试');
    } finally {
      setIsRestoring(false);
    }
  };

  // 处理目录修改
  const handleModifyDirectory = (type: string) => {
    message.info(`正在修改${type}目录...`);
    // 这里可以调用electron的文件选择对话框
  };

  // 处理打开目录
  const handleOpenDirectory = (type: string) => {
    message.info(`正在打开${type}目录...`);
    // 这里可以调用electron的shell.openPath
  };

  // 处理清除缓存
  const handleClearCache = () => {
    confirm({
      title: '确认清除缓存？',
      icon: <ExclamationCircleOutlined />,
      content: '清除缓存后，应用可能需要重新加载一些数据。',
      okText: '确认清除',
      cancelText: '取消',
      onOk() {
        message.success('缓存已清除');
      },
    });
  };

  // 处理重置数据
  const handleResetData = () => {
    confirm({
      title: '确认重置数据？',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将删除所有应用数据，包括文档、设置等，且不可恢复！',
      okText: '确认重置',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.success('数据已重置');
      },
    });
  };

  return (
    <div className="settings-content-section data-settings-container">
      {/* <Title level={3} className="data-settings-title">
         <DatabaseOutlined className="data-settings-title-icon" />
         数据设置
       </Title> */}

      {/* 数据备份与恢复 */}
      <Card title="数据备份与恢复" className="data-settings-card">
        <Space
          direction="vertical"
          size="large"
          className="data-settings-space-vertical"
        >
          <div className="data-settings-row">
            <Space>
              <SaveOutlined className="data-settings-icon" />
              <div>
                <Text className="data-settings-text">备份数据到本地文件</Text>
              </div>
            </Space>
            <Button
              type="primary"
              loading={isBackingUp}
              onClick={handleBackup}
              className="data-settings-btn-primary"
            >
              {isBackingUp ? '备份中...' : '备份'}
            </Button>
          </div>

          <div className="data-settings-row">
            <Space>
              <ReloadOutlined className="data-settings-icon" />
              <div>
                <Text className="data-settings-text">从备份文件恢复数据</Text>
              </div>
            </Space>
            <Button
              loading={isRestoring}
              onClick={handleRestore}
              className="data-settings-btn-secondary"
            >
              {isRestoring ? '恢复中...' : '恢复'}
            </Button>
          </div>
        </Space>
      </Card>

      {/* 精简备份 */}
      {/* <Card 
        title="精简备份" 
        className="data-settings-card"
      >
        <div className="data-settings-row">
          <div className="data-settings-row-with-flex">
            <Text className="data-settings-backup-description">
              备份时跳过音频片段，知识库数据文件，仅备份关键设置
            </Text>
            <Text className="data-settings-subtext">
              减少备份文件大小，适合仅备份配置和设置
            </Text>
          </div>
          <Switch 
            checked={smartBackupEnabled}
            onChange={setSmartBackupEnabled}
            style={{
              backgroundColor: smartBackupEnabled ? '#38b2ac' : 'rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>
      </Card> */}

      {/* 数据目录 */}
      <Card title="数据目录" className="data-settings-card">
        <Space
          direction="vertical"
          size="middle"
          className="data-settings-space-middle"
        >
          {/* 应用数据 */}
          <div className="data-settings-directory-item data-settings-row">
            <div className="data-settings-directory-info">
              <Text className="data-settings-text">应用数据</Text>
              <Text className="data-settings-path-text">
                /Users/suce/Library/Application Support/CherryStudio
              </Text>
            </div>
            <Space>
              <Button
                size="small"
                icon={<SettingOutlined />}
                onClick={() => handleModifyDirectory('应用数据')}
                className="data-settings-btn-small"
              >
                修改目录
              </Button>
            </Space>
          </div>

          {/* 应用日志 */}
          <div className="data-settings-directory-item data-settings-row">
            <div className="data-settings-directory-info">
              <Text className="data-settings-text">应用日志</Text>
              <Text className="data-settings-path-text">
                /Users/suce/Library/Application Support/CherryStudio/logs
              </Text>
            </div>
            <Space>
              <Button
                size="small"
                icon={<FolderOpenOutlined />}
                onClick={() => handleOpenDirectory('应用日志')}
                className="data-settings-btn-small"
              >
                打开日志
              </Button>
            </Space>
          </div>

          {/* 知识库文件 */}
          {/* <div className="data-settings-directory-item data-settings-row">
            <Text className="data-settings-text">知识库文件</Text>
            <Button 
              size="small" 
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteFiles('知识库文件')}
              className="data-settings-btn-danger"
            >
              删除文件
            </Button>
          </div> */}

          {/* 清除缓存 */}
          <div className="data-settings-directory-item data-settings-row">
            <div className="data-settings-directory-info">
              <Text className="data-settings-text">清除缓存</Text>
              <Text className="data-settings-cache-size">(1.87MB)</Text>
            </div>
            <Button
              size="small"
              icon={<ClearOutlined />}
              onClick={handleClearCache}
              className="data-settings-btn-small"
            >
              清除缓存
            </Button>
          </div>

          {/* 重置数据 */}
          <div className="data-settings-directory-item data-settings-row">
            <Text className="data-settings-text">重置数据</Text>
            <Button
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleResetData}
              className="data-settings-btn-danger"
              danger
            >
              重置数据
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
}

export default DataSettings;
