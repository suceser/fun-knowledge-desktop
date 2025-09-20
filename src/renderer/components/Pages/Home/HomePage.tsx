import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import './HomePage.css';

const { Title, Paragraph } = Typography;

function HomePage() {
  return (
    <div className="home-page">
      <div className="page-header">
        <div className="page-title">
          <HomeOutlined className="page-icon" />
          <Title level={2} className="title-text">
            我的首页
          </Title>
        </div>
        <Paragraph className="page-description">
          欢迎回到趣知，开始您的知识探索之旅
        </Paragraph>
      </div>

      <div className="page-content">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card className="feature-card glass-card">
              <div className="card-content">
                <Title level={4}>快速开始</Title>
                <Paragraph>
                  快速访问您最常用的功能和工具，让知识管理更高效。
                </Paragraph>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card className="feature-card glass-card">
              <div className="card-content">
                <Title level={4}>最近活动</Title>
                <Paragraph>
                  查看您最近的学习记录和知识收藏，保持学习连续性。
                </Paragraph>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card className="feature-card glass-card">
              <div className="card-content">
                <Title level={4}>推荐内容</Title>
                <Paragraph>
                  基于您的兴趣为您推荐相关的知识内容和学习资源。
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HomePage;
