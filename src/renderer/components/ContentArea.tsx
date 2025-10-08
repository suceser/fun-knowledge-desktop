import React, { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import './ContentArea.css';

// 懒加载各个页面组件
const HomePage = lazy(() => import('./home/HomePage'));
const NotesPage = lazy(() => import('./notes/NotesPage'));
const ChatPage = lazy(() => import('./chat/ChatPage'));
const KnowledgeGraphPage = lazy(
  () => import('./knowledge/KnowledgeGraphPage'),
);
const LibraryPage = lazy(() => import('./library/LibraryPage'));
const AnalyticsPage = lazy(() => import('./analytics/AnalyticsPage'));
const SettingsPage = lazy(() => import('./settings/SettingsPage'));

export interface ContentAreaProps {
  selectedTab: string;
}

function ContentArea({ selectedTab }: ContentAreaProps) {
  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <HomePage />;
      case 'notes':
        return <NotesPage />;
      case 'qna':
        return <ChatPage />;
      case 'knowledge-graph':
        return <KnowledgeGraphPage />;
      case 'library':
        return <LibraryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="content-area">
      <Suspense
        fallback={
          <div className="content-loading">
            <Spin size="large" />
            <div className="loading-text">加载中...</div>
          </div>
        }
      >
        <div className="content-wrapper">{renderContent()}</div>
      </Suspense>
    </div>
  );
}

export default ContentArea;
