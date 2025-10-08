import React from 'react';
import { Button, Empty, Typography, Space, Input } from 'antd';
import { PlusOutlined, MessageOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Assistant } from '../../../../types/assistant';
import './SettingsCommon.css';

const { Title, Paragraph, Text } = Typography;

interface PhraseSettingsProps {
  assistant: Assistant;
  onUpdate: (updates: Partial<Assistant>) => void;
}

const PhraseSettings: React.FC<PhraseSettingsProps> = ({ assistant, onUpdate }) => {
  // 模拟常用短语数据
  const mockPhrases = [
    {
      id: '1',
      title: '产品分析',
      content: '请帮我分析这个产品的核心竞争力和市场定位',
    },
    {
      id: '2',
      title: '用户调研',
      content: '请设计一份用户调研问卷，了解用户的核心需求',
    },
    {
      id: '3',
      title: '竞品对比',
      content: '请对比分析主要竞品的优劣势',
    },
  ];

  return (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-title-group">
          <Title level={4} className="section-title">常用短语</Title>
          <Paragraph className="section-description">
            创建常用的对话模板，快速发起提问
          </Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          添加短语
        </Button>
      </div>

      {mockPhrases.length > 0 ? (
        <div className="settings-card-list">
          {mockPhrases.map((phrase) => (
            <div key={phrase.id} className="settings-card-item">
              <div style={{ display: 'flex', gap: '12px' }}>
                <MessageOutlined style={{ fontSize: '20px', color: '#38b2ac', marginTop: '4px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                      {phrase.title}
                    </Text>
                  </div>
                  <Text className="section-description" style={{ display: 'block' }}>
                    {phrase.content}
                  </Text>
                </div>
                <Space>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                  >
                    编辑
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                  >
                    删除
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
            description="暂无常用短语"
          />
        </div>
      )}
    </div>
  );
};

export default PhraseSettings;

