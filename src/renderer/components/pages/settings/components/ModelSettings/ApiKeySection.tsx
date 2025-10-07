import React from 'react';
import { Typography, Input, Button, Space } from 'antd';
import { KeyOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Password } = Input;

interface ApiKeySectionProps {
  apiKey: string;
  testingApi: boolean;
  onApiKeyChange: (value: string) => void;
  onTest: () => void;
  onGetKeyHint: () => void;
}

function ApiKeySection({
  apiKey,
  testingApi,
  onApiKeyChange,
  onTest,
  onGetKeyHint,
}: ApiKeySectionProps): React.ReactElement {
  return (
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
            onClick={onGetKeyHint}
          >
            点击这里获取密钥
          </Text>
        )}
      </div>
    </div>
  );
}

export default ApiKeySection;

