import React from 'react';
import { Typography } from 'antd';
import { DatabaseOutlined, RobotOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Model {
  id: string;
  name: string;
  displayName: string;
  status: 'available' | 'unavailable';
}

interface ModelListProps {
  models: Model[];
}

function ModelList({ models }: ModelListProps): React.ReactElement {
  return (
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
  );
}

export default ModelList;

