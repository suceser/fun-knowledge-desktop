import React from 'react';
import { Button, Empty, Typography, Space, Tag, Switch } from 'antd';
import { PlusOutlined, CloudServerOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Assistant } from '../../../../../types/assistant';
import './SettingsCommon.css';

const { Title, Paragraph, Text } = Typography;

interface MCPSettingsProps {
  assistant: Assistant;
  onUpdate: (updates: Partial<Assistant>) => void;
}

const MCPSettings: React.FC<MCPSettingsProps> = ({ assistant, onUpdate }) => {
  // 模拟MCP服务器数据
  const mockServers = [
    {
      id: '1',
      name: '文件系统服务',
      description: '提供文件读写和管理功能',
      status: 'running',
      enabled: true,
    },
    {
      id: '2',
      name: '数据库服务',
      description: '数据库查询和操作',
      status: 'running',
      enabled: true,
    },
  ];

  return (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-title-group">
          <Title level={4} className="section-title">MCP 服务器</Title>
          <Paragraph className="section-description">
            Model Context Protocol 服务器配置
          </Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          添加服务器
        </Button>
      </div>

      {mockServers.length > 0 ? (
        <div className="settings-card-list">
          {mockServers.map((server) => (
            <div key={server.id} className="settings-card-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CloudServerOutlined style={{ fontSize: '24px', color: '#38b2ac' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Text strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {server.name}
                    </Text>
                    {server.status === 'running' && (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        运行中
                      </Tag>
                    )}
                  </div>
                  <Text className="section-description">
                    {server.description}
                  </Text>
                </div>
                <Space>
                  <Switch defaultChecked={server.enabled} />
                  <Button type="text" size="small">
                    配置
                  </Button>
                </Space>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-wrapper">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无MCP服务器"
          />
        </div>
      )}
    </div>
  );
};

export default MCPSettings;

