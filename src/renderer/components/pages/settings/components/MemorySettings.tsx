import React, { useState } from 'react';
import { Typography, Button, Switch, Select, Input } from 'antd';
import {
  BulbOutlined,
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './MemorySettings.css';

const { Title, Text } = Typography;
const { Option } = Select;

function MemorySettings(): React.ReactElement {
  const [userManagementEnabled, setUserManagementEnabled] = useState(true);
  const [selectedUser, setSelectedUser] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟用户数据
  const users = [{ id: 'default', name: '默认用户', memoryCount: 0 }];

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleAddMemory = () => {
    // TODO: 实现添加记忆功能
  };

  const handleMoreActions = () => {
    // TODO: 实现更多操作功能
  };

  const currentUser = users.find((u) => u.id === selectedUser);

  return (
    <div className="settings-content-section">
      <div className="memory-settings-layout">
        {/* 用户管理区域 */}
        <div className="user-management-section">
          <div className="user-management-header">
            <Title level={5} className="user-management-title">
              用户管理
            </Title>
            <Switch
              checked={userManagementEnabled}
              onChange={setUserManagementEnabled}
              className="user-management-switch"
            />
          </div>

          {userManagementEnabled && (
            <div className="user-info-section">
              {/* 用户ID */}
              <div className="user-info-row">
                <Text className="user-info-label">用户 ID</Text>
                <div className="user-info-content">
                  <div className="user-id-display">0 条记忆</div>
                  <Button
                    size="small"
                    icon={<UserOutlined />}
                    className="user-action-btn"
                  />
                </div>
              </div>

              {/* 用户选择 */}
              <div className="user-info-row">
                <Text className="user-info-label">用户</Text>
                <div className="user-info-content">
                  <Select
                    value={selectedUser}
                    onChange={handleUserChange}
                    className="user-select"
                    suffixIcon={
                      <UserOutlined style={{ color: 'var(--color-primary)' }} />
                    }
                  >
                    {users.map((user) => (
                      <Option key={user.id} value={user.id}>
                        {user.name}
                      </Option>
                    ))}
                  </Select>
                  {currentUser && currentUser.memoryCount > 0 && (
                    <div className="user-stats-badge">
                      {currentUser.memoryCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 全局记忆区域 */}
        <div className="global-memory-section">
          <div className="global-memory-header">
            <Title level={5} className="global-memory-title">
              全局记忆
            </Title>

            <div className="global-memory-actions">
              <Input
                placeholder="搜索记忆..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="memory-search-input"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddMemory}
                className="add-memory-btn"
              >
                添加记忆
              </Button>
              <Button
                icon={<MoreOutlined />}
                onClick={handleMoreActions}
                className="more-btn"
              />
            </div>
          </div>

          {/* 记忆内容区域 */}
          <div className="memory-content">
            {/* 空状态 */}
            <div className="memory-empty-state">
              <BulbOutlined className="memory-empty-icon" />
              <Title level={4} className="memory-empty-title">
                暂无记忆
              </Title>
              <Text className="memory-empty-description">
                开始添加你的第一条记忆吧
              </Text>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddMemory}
                className="memory-empty-action"
              >
                添加你的第一条记忆
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemorySettings;
