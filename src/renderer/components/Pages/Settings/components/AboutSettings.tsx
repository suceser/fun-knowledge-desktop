import React from 'react';
import { Card, Typography, Divider, Button, Space, List, Avatar, Tag, Progress } from 'antd';
import { InfoCircleOutlined, GithubOutlined, TwitterOutlined, MailOutlined, HeartOutlined, StarOutlined, BugOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface AboutSettingsProps {
  // 可以添加props用于状态管理
}

const AboutSettings: React.FC<AboutSettingsProps> = () => {
  return (
    <div className="settings-content-section">
    </div>
  );
};

export default AboutSettings;