import React from 'react';
import { Form, Switch, InputNumber, Typography, Space, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './SettingsCommon.css';
import {Assistant} from "../../../../services/ai/model/Assistant";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface MemorySettingsProps {
  assistant: Assistant;
  onUpdate: (updates: Partial<Assistant>) => void;
}

const MemorySettings: React.FC<MemorySettingsProps> = ({ assistant, onUpdate }) => {
  return (
    <div className="settings-section">
      <div className="section-header">
        <div className="section-title-group">
          <Title level={4} className="section-title">全局记忆</Title>
          <Paragraph className="section-description">
            配置助手的长期记忆能力，记住重要的上下文信息
          </Paragraph>
        </div>
      </div>

      <Form layout="vertical" className="settings-form">
        <Form.Item label="启用全局记忆">
          <Space>
            <Switch defaultChecked />
            <Text className="section-description">
              允许助手记住跨对话的重要信息
            </Text>
          </Space>
        </Form.Item>

        <Form.Item
          label="记忆容量"
          help={<Text className="section-description">最多保存的记忆条目数量</Text>}
        >
          <InputNumber
            min={10}
            max={1000}
            step={10}
            defaultValue={100}
            className="setting-input-number"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="记忆保留时间（天）"
          help={<Text className="section-description">超过此时间的记忆将被自动清理</Text>}
        >
          <InputNumber
            min={1}
            max={365}
            defaultValue={30}
            className="setting-input-number"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="自动摘要">
          <Space>
            <Switch defaultChecked />
            <Text className="section-description">
              自动提取对话中的关键信息作为记忆
            </Text>
          </Space>
        </Form.Item>

        <div className="section-header" style={{ marginTop: '32px' }}>
          <div className="section-title-group">
            <Title level={4} className="section-title">记忆笔记</Title>
            <Paragraph className="section-description">
              手动添加重要的背景信息
            </Paragraph>
          </div>
          <Button type="primary" icon={<PlusOutlined />} size="small">
            添加笔记
          </Button>
        </div>

        <Form.Item>
          <TextArea
            placeholder="例如：用户的公司名称、行业特点、重要偏好等..."
            rows={6}
            className="setting-textarea"
          />
        </Form.Item>

        <div className="form-footer">
          <Text className="section-description">
            已保存 0 条记忆
          </Text>
          <Space>
            <Button>清空记忆</Button>
            <Button type="primary">保存</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default MemorySettings;

