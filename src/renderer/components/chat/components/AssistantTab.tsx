import React, { useState } from 'react';
import { List, Avatar, Button, Typography, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, StarOutlined } from '@ant-design/icons';
import { useChatContext } from '../contexts/ChatContext';
import './AssistantTab.css';
import './ModalStyles.css';

const { Text, TextArea } = Typography;

const AssistantTab: React.FC = () => {
  const { assistants, currentAssistant, addAssistant, setCurrentAssistant } = useChatContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 打开添加助手弹窗
  const handleAddAssistant = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addAssistant({
        name: values.name,
        description: values.description,
        icon: values.icon || '🤖',
        systemPrompt: values.systemPrompt,
      });
      message.success('助手添加成功');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 切换助手
  const handleSelectAssistant = (assistant: any) => {
    setCurrentAssistant(assistant);
  };

  return (
    <div className="assistant-tab">
      <div className="assistant-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-assistant-btn"
          onClick={handleAddAssistant}
          block
        >
          添加助手
        </Button>
      </div>

      <List
        className="assistant-list"
        dataSource={assistants}
        renderItem={(item) => (
          <List.Item
            className={`assistant-item ${item.isDefault ? 'default-assistant' : ''} ${
              currentAssistant?.id === item.id ? 'active' : ''
            }`}
            onClick={() => handleSelectAssistant(item)}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  className="assistant-avatar"
                  size={40}
                >
                  {item.icon}
                </Avatar>
              }
              title={
                <div className="assistant-title">
                  <Text className="assistant-name">{item.name}</Text>
                  {item.isDefault && (
                    <StarOutlined className="default-icon" />
                  )}
                </div>
              }
              description={
                <Text className="assistant-description">{item.description}</Text>
              }
            />
          </List.Item>
        )}
      />

      {/* 添加助手弹窗 */}
      <Modal
        title="添加助手"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        width={600}
        className="add-assistant-modal"
      >
        <Form
          form={form}
          layout="vertical"
          className="add-assistant-form"
        >
          <Form.Item
            name="name"
            label="助手名称"
            rules={[{ required: true, message: '请输入助手名称' }]}
          >
            <Input placeholder="例如：编程助手" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="例如：专业的编程顾问" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标（emoji）"
          >
            <Input placeholder="例如：💻" maxLength={2} />
          </Form.Item>

          <Form.Item
            name="systemPrompt"
            label="系统提示词"
            rules={[{ required: true, message: '请输入系统提示词' }]}
          >
            <Input.TextArea
              placeholder="例如：你是一位经验丰富的编程专家，擅长多种编程语言..."
              rows={6}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssistantTab;

