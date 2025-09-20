import React from 'react';
import { Tabs, Card } from 'antd';
import {
  RobotOutlined,
  MessageOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AssistantTab from './AssistantTab';
import TopicsTab from './TopicsTab';
import SettingsTab from './SettingsTab';
import './LeftSidePanel.css';

const { TabPane } = Tabs;

function LeftSidePanel() {
  return (
    <Card className="left-side-panel glass-card">
      <Tabs
        defaultActiveKey="assistant"
        size="small"
        className="qna-tabs"
        tabPosition="top"
      >
        <TabPane
          tab={
            <span className="tab-label">
              <RobotOutlined />
              助手
            </span>
          }
          key="assistant"
        >
          <AssistantTab />
        </TabPane>
        <TabPane
          tab={
            <span className="tab-label">
              <MessageOutlined />
              话题
            </span>
          }
          key="topics"
        >
          <TopicsTab />
        </TabPane>
        <TabPane
          tab={
            <span className="tab-label">
              <SettingOutlined />
              设置
            </span>
          }
          key="settings"
        >
          <SettingsTab />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default LeftSidePanel;
