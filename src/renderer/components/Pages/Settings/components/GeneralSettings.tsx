import React from 'react';
import { Card, Switch, Select, Typography, Divider, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface GeneralSettingsProps {
  // 可以添加props用于状态管理
}

const GeneralSettings: React.FC<GeneralSettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default GeneralSettings;