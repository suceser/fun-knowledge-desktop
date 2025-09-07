import React from 'react';
import { Card, Switch, Select, Slider, Typography, Divider, Radio } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface DisplaySettingsProps {
  // 可以添加props用于状态管理
}

const DisplaySettings: React.FC<DisplaySettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default DisplaySettings;