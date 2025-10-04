import React from 'react';
import { Form, Switch, InputNumber, Typography } from 'antd';
import './ChatSettingsTab.css';

const { Text } = Typography;

const ChatSettingsTab: React.FC = () => {
  return (
    <div className="chat-settings-tab">
      <Form
        layout="vertical"
        className="settings-form"
      >
        <Form.Item
          label={<Text className="setting-label">启用上下文记忆</Text>}
        >
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item
          label={<Text className="setting-label">上下文消息数量</Text>}
        >
          <InputNumber
            min={1}
            max={20}
            defaultValue={10}
            className="setting-input-number"
          />
        </Form.Item>

        <Form.Item
          label={<Text className="setting-label">温度参数</Text>}
          help={<Text className="setting-help">控制回答的随机性，值越大越随机</Text>}
        >
          <InputNumber
            min={0}
            max={2}
            step={0.1}
            defaultValue={0.7}
            className="setting-input-number"
          />
        </Form.Item>

        <Form.Item
          label={<Text className="setting-label">最大Token数</Text>}
        >
          <InputNumber
            min={100}
            max={4000}
            step={100}
            defaultValue={2000}
            className="setting-input-number"
          />
        </Form.Item>

        <Form.Item
          label={<Text className="setting-label">启用流式输出</Text>}
        >
          <Switch defaultChecked />
        </Form.Item>

        <Form.Item
          label={<Text className="setting-label">自动保存对话</Text>}
        >
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChatSettingsTab;

