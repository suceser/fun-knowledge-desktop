import React from 'react';
import { Card, Typography } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import './LibraryPage.css';

const { Title, Paragraph } = Typography;

function LibraryPage() {
  return (
    <div className="library-page">
      <div className="page-header">
        <div className="page-title">
          <BookOutlined className="page-icon" />
          <Title level={2} className="title-text">
            知识库
          </Title>
        </div>
        <Paragraph className="page-description">
          管理您的数字图书收藏，随时随地阅读学习
        </Paragraph>
      </div>

      <div className="page-content">
        <Card className="placeholder-card glass-card">
          <div className="placeholder-content">
            <BookOutlined className="placeholder-icon" />
            <Title level={3}>知识库功能</Title>
            <Paragraph>
              在这里管理您的电子书收藏，支持多种格式，提供舒适的阅读体验。
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LibraryPage;
