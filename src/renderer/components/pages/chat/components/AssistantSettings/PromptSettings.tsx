import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Space } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Assistant } from '../../../../../types/assistant';
import './SettingsCommon.css';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface PromptSettingsProps {
  assistant: Assistant;
  onUpdate: (updates: Partial<Assistant>) => void;
}

const PromptSettings: React.FC<PromptSettingsProps> = ({ assistant, onUpdate }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      name: assistant.name,
      systemPrompt: assistant.systemPrompt,
    });
  }, [assistant, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onUpdate({
        name: values.name,
        systemPrompt: values.systemPrompt,
      });
      message.success('保存成功');
      setIsEditing(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({
      name: assistant.name,
      systemPrompt: assistant.systemPrompt,
    });
    setIsEditing(false);
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-title-group">
          <Title level={4} className="section-title">名称</Title>
        </div>
      </div>

      <Form form={form} layout="vertical" className="settings-form">
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input
            prefix={<span style={{ fontSize: '24px' }}>{assistant.icon}</span>}
            placeholder="请输入助手名称"
            className="setting-input"
            disabled={!isEditing}
            size="large"
          />
        </Form.Item>

        <div className="section-header" style={{ marginTop: '32px' }}>
          <div className="section-title-group">
            <Title level={4} className="section-title">提示词</Title>
            <Paragraph className="section-description">
              定义助手的角色和行为特征
            </Paragraph>
          </div>
        </div>

        <Form.Item
          name="systemPrompt"
          rules={[{ required: true, message: '请输入系统提示词' }]}
        >
          <TextArea
            placeholder="你现在是一名策略产品经理..."
            rows={15}
            className="setting-textarea"
            disabled={!isEditing}
            showCount
            maxLength={2000}
          />
        </Form.Item>

        <div className="form-footer">
          <Text className="token-count">Tokens: {assistant.systemPrompt?.length || 0}</Text>

          <Space>
            {isEditing ? (
              <>
                <Button onClick={handleCancel}>
                  取消
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                >
                  保存
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              >
                编辑
              </Button>
            )}
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default PromptSettings;

