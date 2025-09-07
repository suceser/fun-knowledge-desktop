import React from 'react';
import { Card, Switch, Select, Slider, Typography, Divider, Button, Space, Progress, List, Tag } from 'antd';
import { HeartOutlined, DeleteOutlined, ExportOutlined, ImportOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface MemorySettingsProps {
  // 可以添加props用于状态管理
}

const MemorySettings: React.FC<MemorySettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default MemorySettings;