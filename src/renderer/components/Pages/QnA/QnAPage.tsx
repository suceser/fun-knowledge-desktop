import React from 'react';
import { Card, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './QnAPage.css';

const { Title, Paragraph } = Typography;

const QnAPage: React.FC = () => {
  return (
    <div className="qna-page">
      <div className="page-header">
        <div className="page-title">
          <QuestionCircleOutlined className="page-icon" />
          <Title level={2} className="title-text">知识问答</Title>
        </div>
        <Paragraph className="page-description">
          智能问答系统，快速获取您需要的知识答案
        </Paragraph>
      </div>

      <div className="page-content">
        <Card className="placeholder-card glass-card">
          <div className="placeholder-content">
            <QuestionCircleOutlined className="placeholder-icon" />
            <Title level={3}>知识问答功能</Title>
            <Paragraph>
              在这里您可以提出问题，获取智能化的知识解答。
              支持自然语言查询，让知识获取更加便捷。
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QnAPage;
