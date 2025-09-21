import React from 'react';
import { Row, Col, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import LeftSidePanel from './components/LeftSidePanel';
import ChatArea from './components/ChatArea';
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
        <Paragraph className="page-description">
          智能问答系统，快速获取您需要的知识答案
        </Paragraph>
      </div>

      <div className="page-content">
        <Row className="qna-layout" gutter={16}>
          <Col span={8} className="left-panel-col">
            <LeftSidePanel />
          </Col>
          <Col span={16} className="chat-area-col">
            <ChatArea />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ChatPage;
