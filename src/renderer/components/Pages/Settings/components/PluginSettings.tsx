import React from 'react';
import { Card, Switch, Select, Typography, Divider, Button, Space, List, Avatar, Tag, Input, Rate, Progress } from 'antd';
import { AppstoreOutlined, DownloadOutlined, SettingOutlined, DeleteOutlined, SearchOutlined, StarOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface PluginSettingsProps {
  // 可以添加props用于状态管理
}

const PluginSettings: React.FC<PluginSettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default PluginSettings;