import React, { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import './ContentArea.css';

// 懒加载各个页面组件
const HomePage = lazy(() => import('../Pages/Home/HomePage'));
const NotesPage = lazy(() => import('../Pages/Notes/NotesPage'));
const QnAPage = lazy(() => import('../Pages/QnA/QnAPage'));
const KnowledgeGraphPage = lazy(
  () => import('../Pages/KnowledgeGraph/KnowledgeGraphPage'),
);
const LibraryPage = lazy(() => import('../Pages/Library/LibraryPage'));
const AnalyticsPage = lazy(() => import('../Pages/Analytics/AnalyticsPage'));
const SettingsPage = lazy(() => import('../Pages/Settings/SettingsPage'));

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
        return <QnAPage />;
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
