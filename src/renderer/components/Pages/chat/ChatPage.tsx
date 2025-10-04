import React, { useEffect } from 'react';
import { Row, Col, Typography, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useChatState } from '../../../hooks/useChatState';
import LeftSidePanel from './components/LeftSidePanel';
import ChatArea from './components/ChatArea';
import './ChatPage.css';

const { Title, Paragraph } = Typography;

function ChatPage() {
  const { currentTopic, currentAssistant, error } = useChatState();

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 处理话题选择
  const handleTopicSelect = (topicId: string) => {
    // 话题选择逻辑已在useChatState中处理
  };

  // 处理助手选择
  const handleAssistantSelect = (assistantId: string) => {
    // 助手选择逻辑已在useChatState中处理
  };

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
          {currentAssistant ? (
            `与${currentAssistant.name}对话，获取专业的AI解答`
          ) : (
            '智能问答系统，快速获取您需要的知识答案'
          )}
          {currentTopic && (
            <span className="current-topic"> - 当前话题：{currentTopic.title}</span>
          )}
        </Paragraph>
      </div>

      <div className="page-content">
        <Row className="qna-layout" gutter={16}>
          <Col span={8} className="left-panel-col">
            <LeftSidePanel
              onTopicSelect={handleTopicSelect}
              onAssistantSelect={handleAssistantSelect}
            />
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
