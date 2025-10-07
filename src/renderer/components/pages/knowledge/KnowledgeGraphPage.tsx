import React from 'react';
import { Card, Typography } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import './KnowledgeGraphPage.css';

const { Title, Paragraph } = Typography;

function KnowledgeGraphPage() {
  return (
    <div className="knowledge-graph-page">
      <div className="page-header">
        <div className="page-title">
          <ShareAltOutlined className="page-icon" />
          <Title level={2} className="title-text">
            知识图谱
          </Title>
        </div>
        <Paragraph className="page-description">
          可视化知识关系，构建您的专属知识网络
        </Paragraph>
      </div>

      <div className="page-content">
        <Card className="placeholder-card glass-card">
          <div className="placeholder-content">
            <ShareAltOutlined className="placeholder-icon" />
            <Title level={3}>知识图谱功能</Title>
            <Paragraph>
              通过图谱方式展示知识间的关联关系，
              帮助您更好地理解和管理知识结构。
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default KnowledgeGraphPage;
