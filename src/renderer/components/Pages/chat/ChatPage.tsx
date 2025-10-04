import React, { useEffect } from 'react';
import { Row, Col, Typography, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import './ChatPage.css';

const { Title, Paragraph } = Typography;

function ChatPage() {


  return (
    <div className="qna-page">
      <div className="page-header">
        <div className="page-title">
          <QuestionCircleOutlined className="page-icon" />
          <Title level={2} className="title-text">
            知识问答
          </Title>
        </div>
      </div>

      <div className="page-content">
        <Row className="qna-layout" gutter={16}>
        </Row>
      </div>
    </div>
  );
}

export default ChatPage;
