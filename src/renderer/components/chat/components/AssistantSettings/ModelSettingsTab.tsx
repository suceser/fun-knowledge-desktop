import React from 'react';
import { Form, Select, InputNumber, Switch, Typography, Space } from 'antd';
import { Assistant } from 'rservices/ai/model/Assistant';
import './SettingsCommon.css';

const { Title, Paragraph, Text } = Typography;

interface ModelSettingsTabProps {
  assistant: Assistant;
  onUpdate: (updates: Partial<Assistant>) => void;
}

const ModelSettingsTab: React.FC<ModelSettingsTabProps> = ({ assistant, onUpdate }) => {
  return (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-title-group">
          <Title level={4} className="section-title">模型配置</Title>
          <Paragraph className="section-description">
            配置AI模型和参数设置
          </Paragraph>
        </div>
      </div>

      <Form layout="vertical" className="settings-form">
        <Form.Item label="选择模型">
          <Select
            defaultValue="qwen"
            className="setting-select"
            size="large"
            options={[
              { label: 'Qwen/Qwen2.5-72B-Instruct', value: 'qwen' },
              { label: 'GPT-4', value: 'gpt4' },
              { label: 'Claude 3.5', value: 'claude' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="温度参数"
          help={<Text className="section-description">控制输出的随机性，值越大越随机</Text>}
        >
          <InputNumber
            min={0}
            max={2}
            step={0.1}
            defaultValue={0.7}
            className="setting-input-number"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="最大Token数"
          help={<Text className="section-description">控制单次回复的最大长度</Text>}
        >
          <InputNumber
            min={100}
            max={4000}
            step={100}
            defaultValue={2000}
            className="setting-input-number"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Top P">
          <InputNumber
            min={0}
            max={1}
            step={0.1}
            defaultValue={0.9}
            className="setting-input-number"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="流式输出">
          <Space>
            <Switch defaultChecked />
            <Text className="section-description">启用后将实时显示生成的内容</Text>
          </Space>
        </Form.Item>

        <Form.Item label="上下文记忆">
          <Space>
            <Switch defaultChecked />
            <Text className="section-description">保留对话历史用于上下文理解</Text>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ModelSettingsTab;

