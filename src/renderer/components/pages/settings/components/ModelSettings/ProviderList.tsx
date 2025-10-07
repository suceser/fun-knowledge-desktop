import React from 'react';
import { Typography, Input } from 'antd';
import { SearchOutlined, ApiOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Model {
  id: string;
  name: string;
  displayName: string;
  status: 'available' | 'unavailable';
}

interface Provider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  models: Model[];
}

interface ProviderListProps {
  providers: Provider[];
  selectedProviderId: string;
  searchText: string;
  onSearchChange: (text: string) => void;
  onProviderSelect: (id: string) => void;
}

function ProviderList({
  providers,
  selectedProviderId,
  searchText,
  onSearchChange,
  onProviderSelect,
}: ProviderListProps): React.ReactElement {
  return (
    <div className="model-providers-sidebar">
      <Title level={5} className="providers-title">
        模型服务商
      </Title>

      {/* 搜索框 */}
      <div className="provider-search">
        <Input
          placeholder="搜索模型 ID 或名称"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
        />
      </div>

      {/* 提供商列表 */}
      <div className="providers-list">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`provider-item ${
              selectedProviderId === provider.id ? 'active' : ''
            }`}
            onClick={() => onProviderSelect(provider.id)}
          >
            <div className={`provider-icon ${provider.icon}`}>
              <ApiOutlined />
            </div>
            <div className="provider-info">
              <Text className="provider-name">{provider.name}</Text>
            </div>
            <div className="provider-status">
              <div
                className={`status-indicator ${
                  provider.enabled ? 'on' : 'off'
                }`}
              />
              <Text className={`status-text ${provider.enabled ? 'on' : 'off'}`}>
                {provider.enabled ? 'ON' : ''}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProviderList;

