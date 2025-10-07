import React from 'react';
import { Modal, Space, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ProviderConfig } from '../types';

const { Text } = Typography;

interface ManageModelsModalProps {
  visible: boolean;
  provider: ProviderConfig | undefined;
  onDelete: (modelId: string) => void;
  onCancel: () => void;
}

export const ManageModelsModal: React.FC<ManageModelsModalProps> = ({
  visible,
  provider,
  onDelete,
  onCancel,
}) => {
  const handleDelete = (modelId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模型吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => onDelete(modelId),
    });
  };

  return (
    <Modal
      title={`管理模型 - ${provider?.name || ''}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      styles={{
        mask: { backdropFilter: 'blur(8px)' },
      }}
    >
      <div style={{ marginTop: '1rem' }}>
        {provider && provider.models.length > 0 ? (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {provider.models.map((model) => (
              <div
                key={model.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(26, 26, 46, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontWeight: 500,
                      display: 'block',
                    }}
                  >
                    {model.displayName}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {model.name}
                  </Text>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
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
                  {model.isCustom && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(model.id)}
                    >
                      删除
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </Space>
        ) : (
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            暂无可用模型
          </Text>
        )}
      </div>
    </Modal>
  );
};

