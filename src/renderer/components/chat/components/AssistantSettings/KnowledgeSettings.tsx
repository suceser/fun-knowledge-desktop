import React from 'react';
import { Button, Empty, Typography, Space, Tag } from 'antd';
import { PlusOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Assistant } from 'rservices/ai/model/Assistant';
import './SettingsCommon.css';

const { Title, Paragraph, Text } = Typography;

interface KnowledgeSettingsProps {
  assistant: Assistant;
  onUpdate: (updates: Partial<Assistant>) => void;
}

const KnowledgeSettings: React.FC<KnowledgeSettingsProps> = ({ assistant, onUpdate }) => {
  // 模拟知识库数据
  const mockKnowledgeBases = [
    {
      id: '1',
      name: '产品文档',
      documentCount: 25,
      size: '15MB',
    },
    {
      id: '2',
      name: '技术规范',
      documentCount: 12,
      size: '8MB',
    },
  ];

  return (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-title-group">
          <Title level={4} className="section-title">知识库设置</Title>
          <Paragraph className="section-description">
            配置助手可访问的知识库资源
          </Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          添加知识库
        </Button>
      </div>

      {mockKnowledgeBases.length > 0 ? (
        <div className="settings-card-list">
          {mockKnowledgeBases.map((kb) => (
            <div key={kb.id} className="settings-card-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DatabaseOutlined style={{ fontSize: '24px', color: '#38b2ac' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Text strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {kb.name}
                    </Text>
                    <Tag color="green">已启用</Tag>
                  </div>
                  <Space size="large">
                    <Text className="section-description">
                      {kb.documentCount} 个文档
                    </Text>
                    <Text className="section-description">
                      {kb.size}
                    </Text>
                  </Space>
                </div>
                <Space>
                  <Button type="text" size="small">
                    配置
                  </Button>
                  <Button type="text" size="small" danger>
                    移除
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
            description="暂无知识库"
          />
        </div>
      )}
    </div>
  );
};

export default KnowledgeSettings;

