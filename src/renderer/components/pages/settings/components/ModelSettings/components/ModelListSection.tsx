import React from 'react';
import { Typography, Button } from 'antd';
import {
  DatabaseOutlined,
  RobotOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ModelInfo } from '../types';
import './ModelListSection.css';

const { Title, Text } = Typography;

interface ModelListSectionProps {
  models: ModelInfo[];
  onManage: () => void;
  onAdd: () => void;
}

export const ModelListSection: React.FC<ModelListSectionProps> = ({
  models,
  onManage,
  onAdd,
}) => {
  return (
    <>
      {/* 模型列表 */}
      <div className="config-section">
        <Title level={5} className="section-title">
          <DatabaseOutlined /> 模型 ({models.length})
        </Title>
        {models.length > 0 ? (
          <div className="models-grid">
            {models.map((model) => (
              <div key={model.id} className="model-item">
                <div className="model-name">
                  <RobotOutlined
                    style={{
                      color: '#38b2ac',
                      fontSize: '0.9rem',
                    }}
                  />
                  {model.displayName}
                </div>
                <div className="model-status">
                  <div
                    className={`status-indicator ${
                      model.status === 'available' ? 'on' : 'off'
                    }`}
                  />
                  <Text
                    className={`status-text ${
                      model.status === 'available' ? 'on' : 'off'
                    }`}
                  >
                    {model.status === 'available' ? '可用' : '不可用'}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'block',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            暂无可用模型
          </Text>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="config-actions">
        <Button
          className="action-btn manage-btn"
          icon={<SettingOutlined />}
          onClick={onManage}
        >
          管理
        </Button>
        <Button
          className="action-btn add-btn"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          添加
        </Button>
      </div>
    </>
  );
};

