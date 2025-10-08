import React, { useMemo } from 'react';
import { Typography, Input } from 'antd';
import { SearchOutlined, ApiOutlined } from '@ant-design/icons';
import { ProviderConfig } from '../types';
import './ProviderList.css';

const { Title, Text } = Typography;

interface ProviderListProps {
  providers: ProviderConfig[];
  selectedProviderId: string;
  searchText: string;
  onSearchChange: (value: string) => void;
  onProviderSelect: (providerId: string) => void;
}

export const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  selectedProviderId,
  searchText,
  onSearchChange,
  onProviderSelect,
}) => {
  // 过滤后的提供商列表
  const filteredProviders = useMemo(
    () =>
      providers.filter((provider) =>
        provider.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [providers, searchText]
  );

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
        {filteredProviders.map((provider) => (
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
};

