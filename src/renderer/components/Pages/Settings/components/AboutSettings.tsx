import React from 'react';
import { Card, Typography, Divider, Button, Space, List, Avatar, Tag, Progress, Row, Col } from 'antd';
import { InfoCircleOutlined, GithubOutlined, TwitterOutlined, MailOutlined, HeartOutlined, StarOutlined, BugOutlined, QuestionCircleOutlined, TeamOutlined, RocketOutlined, SafetyCertificateOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import './AboutSettings.css';

const { Title, Text, Paragraph } = Typography;

interface AboutSettingsProps {
  // 可以添加props用于状态管理
}

const AboutSettings: React.FC<AboutSettingsProps> = () => {
  const appInfo = {
    name: '知识趣动',
    subtitle: '让知识流动，让学习有趣。',
    version: 'v1.0.0',
    description: '一款专为创造者设计的智能桌面应用，集成了先进的AI技术，帮助您更高效地管理知识、创作内容和解决问题。'
  };

  const teamMembers = [
    {
      name: '产品负责人',
      role: '产品设计与规划',
      avatar: '🎯',
      description: '负责产品整体规划和用户体验设计'
    },
    {
      name: '技术负责人', 
      role: '架构设计与开发',
      avatar: '⚡',
      description: '负责技术架构设计和核心功能开发'
    },
    {
      name: 'AI 工程师',
      role: 'AI模型集成',
      avatar: '🤖',
      description: '负责AI模型集成和智能功能优化'
    },
    {
      name: 'UI/UX 设计师',
      role: '界面设计',
      avatar: '🎨',
      description: '负责界面设计和交互体验优化'
    }
  ];

  const features = [
    {
      icon: <RocketOutlined style={{ color: '#38b2ac' }} />,
      title: '高性能',
      description: '基于Electron构建，提供原生桌面体验'
    },
    {
      icon: <SafetyCertificateOutlined style={{ color: '#38b2ac' }} />,
      title: '数据安全',
      description: '本地数据存储，保护您的隐私安全'
    },
    {
      icon: <HeartOutlined style={{ color: '#38b2ac' }} />,
      title: '用户至上',
      description: '持续优化用户体验，倾听用户反馈'
    },
    {
      icon: <StarOutlined style={{ color: '#38b2ac' }} />,
      title: '持续更新',
      description: '定期发布新功能和性能优化'
    }
  ];

  const contactInfo = [
    {
      icon: <GithubOutlined />,
      label: '意见反馈',
      action: '反馈',
      description: '在GitHub上提交问题和建议'
    },
    {
      icon: <QuestionCircleOutlined />,
      label: '帮助文档',
      action: '查看',
      description: '查看详细的使用说明和FAQ'
    },
    {
      icon: <CustomerServiceOutlined />,
      label: '更新日志',
      action: '查看',
      description: '了解最新版本的更新内容'
    },
    {
      icon: <MailOutlined />,
      label: '官方网站',
      action: '查看',
      description: '访问官方网站获取更多信息'
    },
    {
      icon: <SafetyCertificateOutlined />,
      label: '许可证',
      action: '查看',
      description: '查看软件许可证信息'
    },
    {
      icon: <MailOutlined />,
      label: '邮件联系',
      action: '邮件',
      description: '通过邮件联系我们的支持团队'
    },
    {
      icon: <BugOutlined />,
      label: '调试面板',
      action: '打开',
      description: '打开开发者调试工具'
    }
  ];

  return (
    <div className="settings-content-section">
      {/* 应用信息卡片 */}
      <Card 
        className="about-app-card"
        bodyStyle={{ padding: '2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="app-icon">
            🍒
          </div>
          <Title level={2} className="app-title">
            {appInfo.name}
          </Title>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '1.1rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            {appInfo.subtitle}
          </Text>
          <Tag 
          className="version-tag">
            {appInfo.version}
          </Tag>
        </div>
        
        <Paragraph className="about-text-description">
          {appInfo.description}
        </Paragraph>

        {/* 功能特色 */}
        <Row gutter={[16, 16]} className="feature-grid">
          {features.map((feature, index) => (
            <Col xs={12} sm={6} key={index}>
              <div className="feature-item">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <Text className="about-text-primary" style={{ display: 'block', marginBottom: '0.25rem' }}>
                  {feature.title}
                </Text>
                {/* <Text className="about-text-muted" style={{ fontSize: '0.85rem' }}>
                  {feature.description}
                </Text> */}
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 开发团队 */}
      {/* <Card 
        title={
          <span className="card-title">
            <TeamOutlined className="card-title-icon" />
            开发团队
          </span>
        }
        style={{
          background: 'rgba(26, 26, 46, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          marginBottom: '1.5rem'
        }}
        headStyle={{
          background: 'transparent',
          border: 'none',
          padding: '1.5rem 1.5rem 0'
        }}
        bodyStyle={{ padding: '1rem 1.5rem 1.5rem' }}
      >
        <Row gutter={[16, 16]}>
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={12} key={index}>
              <div className="team-member-card">
                <div className="member-avatar">
                  {member.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}>
                    {member.name}
                  </Text>
                  <Text className="about-text-secondary" style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                    {member.role}
                  </Text>
                  <Text style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.85rem'
                  }}>
                    {member.description}
                  </Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card> */}

      {/* 联系我们 */}
      <Card 
        // title={
        //   <span className="card-title">
        //     <InfoCircleOutlined className="card-title-icon" />
        //     更多信息
        //   </span>
        // }
        style={{
          background: 'rgba(26, 26, 46, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)'
        }}
        headStyle={{
          background: 'transparent',
          border: 'none',
          padding: '1.5rem 1.5rem 0'
        }}
        bodyStyle={{ padding: '1rem 1.5rem 1.5rem' }}
      >
        <List
          dataSource={contactInfo}
          renderItem={(item, index) => (
            <List.Item
              style={{
                border: 'none',
                padding: '0.75rem 0'
              }}
            >
              <div className="contact-item">
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <span className="contact-icon">
                    {item.icon}
                  </span>
                  <div>
                    <Text className="about-text-primary" style={{ display: 'block', marginBottom: '0.25rem' }}>
                      {item.label}
                    </Text>
                    <Text className="about-text-muted" style={{ fontSize: '0.85rem' }}>
                      {item.description}
                    </Text>
                  </div>
                </div>
                <Button 
                  type="text" 
                  size="small"
                  className="contact-action-btn"
                >
                  {item.action}
                </Button>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AboutSettings;