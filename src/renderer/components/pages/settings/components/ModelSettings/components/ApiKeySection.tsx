import React from 'react';
import { Typography, Input, Button, Space, Tooltip, message } from 'antd';
import {
  KeyOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import './ApiKeySection.css';

const { Title, Text } = Typography;
const { Password } = Input;

interface ApiKeySectionProps {
  apiKey: string;
  apiUrl: string;
  testingApi: boolean;
  onApiKeyChange: (value: string) => void;
  onApiUrlChange: (value: string) => void;
  onTest: () => void;
  onViewKeyHint?: () => void;
}

export const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  apiUrl,
  testingApi,
  onApiKeyChange,
  onApiUrlChange,
  onTest,
  onViewKeyHint,
}) => {
  const handleCopyApiUrl = () => {
    if (apiUrl) {
      navigator.clipboard.writeText(apiUrl);
      message.success('API 地址已复制到剪贴板');
    }
  };

  return (
    <>
      {/* API 密钥配置 */}
      <div className="config-section">
        <Title level={5} className="section-title">
          <KeyOutlined /> API 密钥
        </Title>
        <div className="form-item">
          <Text className="form-label">API 密钥</Text>
          <Space.Compact style={{ width: '100%' }}>
            <Password
              className="form-input"
              placeholder="请输入 API 密钥"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeOutlined />
              }
            />
            <Button
              className="test-btn"
              onClick={onTest}
              loading={testingApi}
              icon={<CheckCircleOutlined />}
            >
              检测
            </Button>
          </Space.Compact>
          {!apiKey && (
            <Text
              style={{
                color: '#38b2ac',
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                display: 'block',
                cursor: 'pointer',
              }}
              onClick={onViewKeyHint}
            >
              点击这里获取密钥
            </Text>
          )}
        </div>
      </div>

      {/* API 地址配置 */}
      <div className="config-section">
        <Title level={5} className="section-title">
          <LinkOutlined /> API 地址
        </Title>
        <div className="form-item">
          <Text className="form-label">API 地址</Text>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              className="form-input"
              placeholder="请输入 API 地址"
              value={apiUrl}
              onChange={(e) => onApiUrlChange(e.target.value)}
            />
            <Tooltip title="复制 API 地址">
              <Button
                className="test-btn"
                icon={<CopyOutlined />}
                onClick={handleCopyApiUrl}
              />
            </Tooltip>
          </Space.Compact>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem',
              marginTop: '0.5rem',
              display: 'block',
            }}
          >
            / 结尾避免 v1 版本，# 结尾强制使用 v1 版本
          </Text>
        </div>
      </div>
    </>
  );
};

