import React from 'react';
import { Card, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import './AnalyticsPage.css';

const { Title, Paragraph } = Typography;

function AnalyticsPage() {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="page-title">
          <BarChartOutlined className="page-icon" />
          <Title level={2} className="title-text">
            学习数据
          </Title>
        </div>
        <Paragraph className="page-description">
          深入分析您的学习数据，优化知识管理策略
        </Paragraph>
      </div>

      <div className="page-content">
        <Card className="placeholder-card glass-card">
          <div className="placeholder-content">
            <BarChartOutlined className="placeholder-icon" />
            <Title level={3}>学习数据功能</Title>
            <Paragraph>
              通过数据可视化展示您的学习进展，
              帮助您发现学习模式，提升学习效率。
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsPage;
