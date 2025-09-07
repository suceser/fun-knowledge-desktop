import React from 'react';
import { Card, Switch, Select, Typography, Divider, Button, Space, List, Input, Slider, Tag, Rate } from 'antd';
import { SearchOutlined, GlobalOutlined, SettingOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface SearchSettingsProps {
  // 可以添加props用于状态管理
}

const SearchSettings: React.FC<SearchSettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default SearchSettings;