import React from 'react';
import { Modal, Select, Typography } from 'antd';
import { ModelInfo } from '../types';

const { Text } = Typography;
const { Option } = Select;

interface SelectModelModalProps {
  visible: boolean;
  models: ModelInfo[];
  selectedModelId: string;
  onSelect: (modelId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SelectModelModal: React.FC<SelectModelModalProps> = ({
  visible,
  models,
  selectedModelId,
  onSelect,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="选择测试模型"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="开始检测"
      cancelText="取消"
      width={500}
      styles={{
        mask: { backdropFilter: 'blur(8px)' },
      }}
    >
      <div style={{ marginTop: '1rem' }}>
        <Text
          style={{
            display: 'block',
            marginBottom: '1rem',
            color: 'rgba(0, 0, 0, 0.65)',
          }}
        >
          请选择一个模型来测试 API 密钥是否有效。测试将发送一条简单的消息。
        </Text>
        <div>
          <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
            选择模型
          </Text>
          <Select
            value={selectedModelId}
            onChange={onSelect}
            style={{ width: '100%' }}
            placeholder="请选择模型"
          >
            {models.map((model) => (
              <Option key={model.id} value={model.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{model.displayName}</span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'rgba(0, 0, 0, 0.45)',
                    }}
                  >
                    {model.status === 'available' ? '可用' : '不可用'}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(24, 144, 255, 0.05)',
            border: '1px solid rgba(24, 144, 255, 0.2)',
            borderRadius: '6px',
          }}
        >
          <Text style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.65)' }}>
            💡 提示：测试将消耗少量 tokens（约 10-20 tokens）
          </Text>
        </div>
      </div>
    </Modal>
  );
};

