import React from 'react';
import { Card, Switch, Select, Typography, Divider, Button, Space, Upload, List, Progress, Tag } from 'antd';
import { FileTextOutlined, UploadOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

interface DocumentSettingsProps {
  // 可以添加props用于状态管理
}

const DocumentSettings: React.FC<DocumentSettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default DocumentSettings;