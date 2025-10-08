import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Switch, Space, Typography } from 'antd';
import { ModelInfo } from '../types';

const { Text } = Typography;
const { Option } = Select;

interface AddModelModalProps {
  visible: boolean;
  onConfirm: (model: Partial<ModelInfo>) => void;
  onCancel: () => void;
}

export const AddModelModal: React.FC<AddModelModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const [newModel, setNewModel] = useState<Partial<ModelInfo>>({
    name: '',
    displayName: '',
    status: 'available',
    supportStream: true,
  });

  // 重置表单
  useEffect(() => {
    if (!visible) {
      setNewModel({
        name: '',
        displayName: '',
        status: 'available',
        supportStream: true,
      });
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(newModel);
  };

  return (
    <Modal
      title="添加模型"
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="添加"
      cancelText="取消"
      width={500}
      styles={{
        mask: { backdropFilter: 'blur(8px)' },
      }}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%', marginTop: '1rem' }}
      >
        <div>
          <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
            模型 ID
          </Text>
          <Input
            placeholder="例如: gpt-4"
            value={newModel.name}
            onChange={(e) =>
              setNewModel({ ...newModel, name: e.target.value })
            }
          />
        </div>
        <div>
          <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
            显示名称
          </Text>
          <Input
            placeholder="例如: GPT-4"
            value={newModel.displayName}
            onChange={(e) =>
              setNewModel({ ...newModel, displayName: e.target.value })
            }
          />
        </div>
        <div>
          <Text style={{ display: 'block', marginBottom: '0.5rem' }}>
            状态
          </Text>
          <Select
            value={newModel.status}
            onChange={(value) => setNewModel({ ...newModel, status: value })}
            style={{ width: '100%' }}
          >
            <Option value="available">可用</Option>
            <Option value="unavailable">不可用</Option>
          </Select>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text>支持流式输出</Text>
          <Switch
            checked={newModel.supportStream}
            onChange={(checked) =>
              setNewModel({ ...newModel, supportStream: checked })
            }
          />
        </div>
      </Space>
    </Modal>
  );
};

