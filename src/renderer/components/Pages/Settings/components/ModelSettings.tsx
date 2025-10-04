import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, message, Spin } from 'antd';
import {
  SearchOutlined,
  ApiOutlined,
  KeyOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './ModelSettings.css';

const { Title, Text } = Typography;
const { Password } = Input;

interface ModelInfo {
  id: string;
  name: string;
  status: 'available' | 'unavailable';
}


function ModelSettings(): React.ReactElement {
  return (
    <div className="settings-content-section">
      <div className="model-settings-layout">
      </div>
    </div>
  );
}

export default ModelSettings;
