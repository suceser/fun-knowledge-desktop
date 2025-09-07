import React from 'react';
import { Card, Switch, Select, Typography, Divider, Button, Space, List, Input, Tag, Progress, Alert } from 'antd';
import { ApiOutlined, CloudServerOutlined, SettingOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface MCPSettingsProps {
  // 可以添加props用于状态管理
}

const MCPSettings: React.FC<MCPSettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default MCPSettings;