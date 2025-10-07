import React from 'react';
import { Typography, Switch } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { ProviderConfig } from '../types';
import { ApiKeySection } from './ApiKeySection';
import { ModelListSection } from './ModelListSection';
import './ProviderConfigPanel.css';

const { Title, Text } = Typography;

interface ProviderConfigPanelProps {
  provider: ProviderConfig | undefined;
  testingApi: boolean;
  onToggle: (enabled: boolean) => void;
  onApiKeyChange: (value: string) => void;
  onApiUrlChange: (value: string) => void;
  onTest: () => void;
  onManageModels: () => void;
  onAddModel: () => void;
  onViewKeyHint?: () => void;
}

export const ProviderConfigPanel: React.FC<ProviderConfigPanelProps> = ({
  provider,
  testingApi,
  onToggle,
  onApiKeyChange,
  onApiUrlChange,
  onTest,
  onManageModels,
  onAddModel,
  onViewKeyHint,
}) => {
  if (!provider) {
    return (
      <div className="model-config-area">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <Text>请选择一个模型服务商</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="model-config-area">
      {/* 配置头部 */}
      <div className="config-header">
        <div className="config-title">
          <div className={`provider-icon ${provider.icon}`}>
            <ApiOutlined />
          </div>
          <div>
            <Title level={4} className="config-title-text">
              {provider.name}
            </Title>
            {provider.description && (
              <Text className="config-subtitle">{provider.description}</Text>
            )}
          </div>
        </div>
        <Switch
          checked={provider.enabled}
          onChange={onToggle}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      </div>

      {/* 配置表单 */}
      <div className="config-form">
        <ApiKeySection
          apiKey={provider.apiKey}
          apiUrl={provider.apiUrl}
          testingApi={testingApi}
          onApiKeyChange={onApiKeyChange}
          onApiUrlChange={onApiUrlChange}
          onTest={onTest}
          onViewKeyHint={onViewKeyHint}
        />

        <ModelListSection
          models={provider.models}
          onManage={onManageModels}
          onAdd={onAddModel}
        />
      </div>
    </div>
  );
};

