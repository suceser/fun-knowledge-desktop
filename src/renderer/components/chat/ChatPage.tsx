import React from 'react';
import { Row, Col, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ChatProvider } from './contexts/ChatContext';
import LeftPanel from './components/LeftPanel';
import ChatArea from './components/ChatArea';
import './ChatPage.css';

const { Title } = Typography;

function ChatPage() {
  return (
    <ChatProvider>
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
            <Col xs={24} md={8} lg={6} className="left-panel-col">
              <LeftPanel />
            </Col>
            <Col xs={24} md={16} lg={18} className="chat-area-col">
              <ChatArea />
            </Col>
          </Row>
        </div>
      </div>
    </ChatProvider>
  );
}

export default ChatPage;
